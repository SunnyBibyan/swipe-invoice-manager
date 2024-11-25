import { GoogleGenerativeAI } from "@google/generative-ai";

class AIExtractionService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
        this.visionModel = this.genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        this.textModel = this.genAI.getGenerativeModel({ model: "gemini-pro" });

        // Define required fields for validation
        this.requiredFields = {
            invoice: ['invoice_number', 'customer_name', 'date', 'total_amount', 'items'],
            customer: ['name','email','phone','address','total_purchases','last_purchase'],
            product: ['name', 'quantity', 'price_per_item', 'tax', 'price_with_tax', 'discount']
        };
    }

    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    }

    async processSingleFile(file) {
        try {
            const base64Data = await this.fileToBase64(file);
            const fileType = file.type;
            let extractedData;

            if (fileType.includes('pdf') || fileType.includes('image')) {
                extractedData = await this.extractWithVisionAPI(base64Data, fileType);
            } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
                const textContent = await this.excelToText(file);
                extractedData = await this.extractWithTextAPI(textContent);
            } else {
                throw new Error('Unsupported file type');
            }

            return this.validateAndStructureData(extractedData);
        } catch (error) {
            console.error('Error processing file:', error);
            throw new Error(`Failed to process file: ${error.message}`);
        }
    }

    async processAllFiles(files) {
        try {
            const results = await Promise.all(
                files.map(file => this.processSingleFile(file))
            );

            // Aggregate all extracted data
            const aggregatedData = {
                invoices: [],
                customers: [],
                products: [],
                missingInformation: []
            };

            results.forEach(result => {
                if (result.invoice) aggregatedData.invoices.push(result.invoice);
                if (result.customer) aggregatedData.customers.push(result.customer);
                if (result.products) aggregatedData.products.push(...result.products);
                if (result.missingFields) {
                    aggregatedData.missingInformation.push({
                        source: result.source,
                        missingFields: result.missingFields
                    });
                }
            });

            return aggregatedData;
        } catch (error) {
            console.error('Error processing files:', error);
            throw new Error('Failed to process files');
        }
    }

    async extractWithVisionAPI(base64Image, fileType) {
        try {
            // const prompt = `Please analyze this ${fileType} document and extract the following information in JSON format:
            //     1. Invoice details: invoice number, date, due date, total purchases amount, status
            //     2. Customer details: name, email, phone, address
            //     3. Product details: array of products with name, price, quantity, category
                
            //     Format the response as:
            //     {
            //         "invoice": { ... },
            //         "customer": { ... },
            //         "products": [ ... ]
            //     }
                
            //     If any information is missing, please indicate "missing" for that field.`;
                const prompt = `Please analyze the spreadsheet content and extract the following information in JSON format:

                1. Invoice details: Extract the invoice number, customer name, date, total amount, and a list of items (with item name, quantity, and total price for each item).  
                   Example format:
                   {
                      "invoice_number": "12345",
                      "customer_name": "John Doe",
                      "date": "2024-01-01",
                      "total_amount": "500",
                      "items": [
                         {
                            "item_name": "Product A",
                            "quantity": 2,
                            "total_price": "200"
                         },
                         {
                            "item_name": "Product B",
                            "quantity": 3,
                            "total_price": "300"
                         }
                      ]
                   }
                
                2. Product details: Provide an array of all products, with the following fields: name, quantity, price per item, tax, price with tax, and discount.  
                   Example format:
                   {
                      "products": [
                         {
                            "name": "Product A",
                            "quantity": 5,
                            "price_per_item": "50",
                            "tax": "5",
                            "price_with_tax": "55",
                            "discount": "10%"
                         },
                         ...
                      ]
                   }
                
                3. Customer details: Extract customer information including name, email, phone, address, total purchases, and last purchase date.  
                   Example format:
                   {
                      "customer": {
                         "name": "John Doe",
                         "email": "john.doe@example.com",
                         "phone": "123-456-7890",
                         "address": "123 Main St, City, Country",
                         "total_purchases": "1500",
                         "last_purchase": "2024-01-15"
                      }
                   }
                
                If any information is missing, indicate "missing" for that field. Format the entire response as:
                {
                   "invoice": { ... },
                   "products": [ ... ],
                   "customer": { ... }
                }`;

            const imageData = {
                inlineData: {
                    data: base64Image,
                    mimeType: fileType
                }
            };

            const result = await this.visionModel.generateContent([prompt, imageData]);
            const response = await result.response;
            const text = response.text();
            
            return JSON.parse(text);
        } catch (error) {
            console.error('Vision API error:', error);
            throw new Error('Failed to extract data from image/PDF');
        }
    }

    async extractWithTextAPI(textContent) {
        try {
            // const prompt = `Please analyze this spreadsheet content and extract the following information in JSON format:
            //     1. Invoice details: invoice number, date, due date, total amount, status
            //     2. Customer details: name, email, phone, address
            //     3. Product details: array of products with name, price, quantity, category
                
            //     Spreadsheet content:
            //     ${textContent}
                
            //     Format the response as:
            //     {
            //         "invoice": { ... },
            //         "customer": { ... },
            //         "products": [ ... ]
            //     }
                
            //     If any information is missing, please indicate "missing" for that field.`;
            
            const prompt = `Please analyze the spreadsheet content and extract the following information in JSON format:

            1. Invoice details: Extract the invoice number, customer name, date, total amount, and a list of items (with item name, quantity, and total price for each item).  
               Example format:
               {
                  "invoice_number": "12345",
                  "customer_name": "John Doe",
                  "date": "2024-01-01",
                  "total_amount": "500",
                  "items": [
                     {
                        "item_name": "Product A",
                        "quantity": 2,
                        "total_price": "200"
                     },
                     {
                        "item_name": "Product B",
                        "quantity": 3,
                        "total_price": "300"
                     }
                  ]
               }
            
            2. Product details: Provide an array of all products, with the following fields: name, quantity, price per item, tax, price with tax, and discount.  
               Example format:
               {
                  "products": [
                     {
                        "name": "Product A",
                        "quantity": 5,
                        "price_per_item": "50",
                        "tax": "5",
                        "price_with_tax": "55",
                        "discount": "10%"
                     },
                     ...
                  ]
               }
            
            3. Customer details: Extract customer information including name, email, phone, address, total purchases, and last purchase date.  
               Example format:
               {
                  "customer": {
                     "name": "John Doe",
                     "email": "john.doe@example.com",
                     "phone": "123-456-7890",
                     "address": "123 Main St, City, Country",
                     "total_purchases": "1500",
                     "last_purchase": "2024-01-15"
                  }
               }
            
            Spreadsheet content:
            ${textContent}
            
            If any information is missing, indicate "missing" for that field. Format the entire response as:
            {
               "invoice": { ... },
               "products": [ ... ],
               "customer": { ... }
            }`;
              
                

            const result = await this.textModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            return JSON.parse(text);
        } catch (error) {
            console.error('Text API error:', error);
            throw new Error('Failed to extract data from spreadsheet');
        }
    }

    async excelToText(file) {
        // This is a placeholder - you'll need to implement Excel parsing
        // You can use libraries like xlsx or exceljs
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Convert Excel to text representation
                resolve(e.target.result);
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    validateAndStructureData(data) {
        const missingFields = {
            invoice: [],
            customer: [],
            products: []
        };

        // Validate invoice fields
        for (const field of this.requiredFields.invoice) {
            if (!data.invoice || !data.invoice[field] || data.invoice[field] === 'missing') {
                missingFields.invoice.push(field);
            }
        }

        // Validate customer fields
        for (const field of this.requiredFields.customer) {
            if (!data.customer || !data.customer[field] || data.customer[field] === 'missing') {
                missingFields.customer.push(field);
            }
        }

        // Validate product fields
        if (data.products && Array.isArray(data.products)) {
            data.products.forEach((product, index) => {
                for (const field of this.requiredFields.product) {
                    if (!product[field] || product[field] === 'missing') {
                        missingFields.products.push(`Product ${index + 1}: ${field}`);
                    }
                }
            });
        }

        // Add status based on missing fields
        if (Object.values(missingFields).some(arr => arr.length > 0)) {
            data.status = 'incomplete';
            data.missingFields = missingFields;
        } else {
            data.status = 'complete';
        }

        return data;
    }
}

export default new AIExtractionService();
