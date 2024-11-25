import * as XLSX from 'xlsx';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Check if API key is available
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Missing VITE_GEMINI_API_KEY in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function processFile(file) {
  try {
    console.log('Starting file processing:', file.name, 'Type:', file.type);
    const fileType = file.type;
    let extractedData;

    if (!file) {
      throw new Error('No file provided');
    }

    if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      console.log('Processing Excel file');
      extractedData = await processExcel(file);
    } else if (fileType === 'application/pdf') {
      console.log('Processing PDF file');
      extractedData = await processPDF(file);
    } else if (fileType.includes('image')) {
      console.log('Processing Image file');
      extractedData = await processImage(file);
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }

    if (!extractedData) {
      throw new Error('No data could be extracted from the file');
    }

    const formattedData = formatData(extractedData);
    console.log('Extracted and formatted data:', formattedData);
    return formattedData;
  } catch (error) {
    console.error('File processing error:', error);
    throw new Error(`Failed to process file: ${error.message}`);
  }
}

async function processExcel(file) {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Filter out summary rows and empty rows
    const invoiceData = jsonData.filter(row => {
      return row['Serial Number'] || row['Invoice Number'] || row['Bill Number'];
    });

    if (invoiceData.length === 0) {
      throw new Error('No valid invoice data found in Excel file');
    }

    // Get the first invoice for basic details
    const firstInvoice = invoiceData[0];

    // Process products with tax calculations
    const products = invoiceData.map(row => {
      const basePrice = parseFloat(row['Net Amount'] || row['Amount'] || row['Price'] || '0');
      const taxRate = parseFloat(row['Tax Rate'] || row['GST Rate'] || '18') / 100;
      const taxAmount = basePrice * taxRate;
      const priceWithTax = basePrice + taxAmount;
      
      return {
        name: row['Item Name'] || row['Description'] || row['Product Name'] || row['Particulars'] || '',
        quantity: parseFloat(row['Quantity'] || row['Qty'] || '1'),
        unitPrice: basePrice,
        tax: taxAmount,
        priceWithTax: priceWithTax,
        discount: parseFloat(row['Discount'] || '0')
      };
    }).filter(product => product.name && product.name !== '');

    // Calculate total purchase amount including tax
    // const totalPurchaseAmount = products.reduce((sum, product) => 
    //   sum + (product.priceWithTax * product.quantity ), 0);
    const totalPurchaseAmount = firstInvoice['Total Amount'] || firstInvoice['Net Total'] || firstInvoice['Invoice Total'] || firstInvoice['Grand Total'] || 0;

    const formattedData = {
      invoice: {
        invoiceNumber: firstInvoice['Serial Number'] || firstInvoice['Invoice Number'] || firstInvoice['Bill Number'],
        customerName: firstInvoice['Party Name'] || firstInvoice['Customer Name'] || firstInvoice['Customer'],
        date: firstInvoice['Invoice Date'] || firstInvoice['Date'] || new Date().toISOString().split('T')[0],
        totalAmount: totalPurchaseAmount,
        status: firstInvoice['Status'] || 'pending'
      },
      customer: {
        name: firstInvoice['Party Name'] || firstInvoice['Customer Name'] || firstInvoice['Customer'],
        phone: firstInvoice['Phone'] || firstInvoice['Mobile'] || firstInvoice['Contact'] || '',
        email: firstInvoice['Email'] || firstInvoice['Customer Email'] || '',
        address: firstInvoice['Party Company Name'] || firstInvoice['Company Name'] || firstInvoice['Address'] || '',
        totalPurchases: totalPurchaseAmount
      },
      products: products
    };

    console.log('Formatted data:', formattedData);
    return formattedData;
  } catch (error) {
    console.error('Excel processing error:', error);
    throw new Error(`Excel processing error: ${error.message}`);
  }
}

async function processPDF(file) {
  try {
    console.log('Converting PDF to base64');
    const base64Data = await fileToBase64(file);
    
    console.log('Sending PDF to Gemini AI');
    const extractedData = await extractDataFromPDF(base64Data);
    console.log('PDF data extracted:', extractedData);

    // Ensure consistent data structure
    const products = (extractedData.products || []).map(product => ({
      name: product.name || product.description || '',
      quantity: parseFloat(product.quantity || product.qty || '1'),
      unitPrice: parseFloat(product.price || product.unitPrice || '0'),
      tax: parseFloat(product.tax || (product.price * 0.18) || '0'),
      priceWithTax: parseFloat(product.priceWithTax || (product.price * 1.18) || '0'),
      discount: parseFloat(product.discount || '0')
    })).filter(product => product.name && product.name !== '');

    // const totalAmount = products.reduce((sum, product) => 
    //   sum + (product.priceWithTax * product.quantity ), 0);
    
    // Use the AI extracted total amount directly
     const totalAmount = extractedData.invoice?.totalAmount || 0;
   
   
    const formattedData = {
      invoice: {
        invoiceNumber: extractedData.invoice?.invoiceNumber || 'INV-' + new Date().getTime(),
        customerName: extractedData.customer?.name || '',
        date: extractedData.invoice?.date || new Date().toISOString().split('T')[0],
        totalAmount: totalAmount,
        status: extractedData.invoice?.status || 'pending'
      },
      customer: {
        name: extractedData.customer?.name || '',
        phone: extractedData.customer?.phone || '',
        email: extractedData.customer?.email || '',
        address: extractedData.customer?.address || '',
        totalPurchases: totalAmount
      },
      products: products
    };

    return formattedData;
  } catch (error) {
    console.error('PDF processing error:', error);
    throw new Error(`PDF processing error: ${error.message}`);
  }
}

async function processImage(file) {
  try {
    console.log('Converting image to base64');
    const base64Data = await fileToBase64(file);
    
    console.log('Sending image to Gemini AI');
    const extractedData = await extractDataFromImage(base64Data);
    console.log('Image data extracted:', extractedData);

    // Ensure consistent data structure
    const products = (extractedData.products || []).map(product => ({
      name: product.name || product.description || '',
      quantity: parseFloat(product.quantity || product.qty || '1'),
      unitPrice: parseFloat(product.price || product.unitPrice || '0'),
      tax: parseFloat(product.tax || (product.price * 0.18) || '0'),
      priceWithTax: parseFloat(product.priceWithTax || (product.price * 1.18) || '0'),
      discount: parseFloat(product.discount || '0')
    })).filter(product => product.name && product.name !== '');

    // const totalAmount = products.reduce((sum, product) => 
    //   sum + (product.priceWithTax ), 0);
    
       
    // Use the AI extracted total amount directly
    const totalAmount = extractedData.invoice?.totalAmount || 0;

    const formattedData = {
      invoice: {
        invoiceNumber: extractedData.invoice?.invoiceNumber || 'INV-' + new Date().getTime(),
        customerName: extractedData.customer?.name || '',
        date: extractedData.invoice?.date || new Date().toISOString().split('T')[0],
        totalAmount: totalAmount,
        status: extractedData.invoice?.status || 'pending'
      },
      customer: {
        name: extractedData.customer?.name || '',
        phone: extractedData.customer?.phone || '',
        email: extractedData.customer?.email || '',
        address: extractedData.customer?.address || '',
        totalPurchases: totalAmount
      },
      products: products
    };

    return formattedData;
  } catch (error) {
    console.error('Image processing error:', error);
    throw new Error(`Image processing error: ${error.message}`);
  }
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      try {
        const base64Data = reader.result.split(',')[1];
        if (!base64Data) {
          throw new Error('Failed to convert file to base64');
        }
        resolve(base64Data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = error => reject(new Error(`File read error: ${error.message}`));
  });
}

// AI Data Extraction Functions
async function extractDataFromPDF(base64Data) {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
  const prompt = `Analyze this invoice PDF and extract information in JSON format with this exact structure:
  {
    "invoice": {
      "invoiceNumber": "string",
      "date": "string (YYYY-MM-DD)",
      "totalAmount": "number",
      "status": "string"
    },
    "customer": {
      "name": "string",
      "email": "string",
      "phone": "string",
      "address": "string"
    },
    "products": [{
      "name": "string",
      "quantity": "number",
      "unitPrice": "number",
      "tax": "number",
      "priceWithTax": "number",
      "discount": "number"
    }]
  }
  Important: 
  - All number fields should be numeric values without currency symbols
  - Date should be in YYYY-MM-DD format
  - Product prices should not include tax in unitPrice
  - Calculate tax as 18% of unitPrice if not specified`;

  const result = await model.generateContent({
    contents: [{
      parts: [
        { text: prompt },
        { inline_data: { mime_type: 'application/pdf', data: base64Data } }
      ]
    }]
  });

  const response = await result.response;
  const text = response.text();
  
  try {
    // Extract JSON from the response if it's wrapped in markdown code blocks
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : text;
    
    // Clean the string and parse it
    const cleanJsonStr = jsonStr.trim();
    const parsedData = JSON.parse(cleanJsonStr);
    
    // Ensure numbers are actually numbers
    if (parsedData.products) {
      parsedData.products = parsedData.products.map(product => ({
        ...product,
        quantity: parseFloat(product.quantity) || 1,
        unitPrice: parseFloat(product.unitPrice) || 0,
        tax: parseFloat(product.tax) || 0,
        priceWithTax: parseFloat(product.priceWithTax) || 0,
        discount: parseFloat(product.discount) || 0
      }));
    }
    
    return parsedData;
  } catch (error) {
    console.error('Failed to parse response:', error);
    console.error('Raw response:', text);
    throw new Error('Failed to parse AI response for PDF');
  }
}

async function extractDataFromImage(base64Data) {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
  const prompt = `Analyze this invoice image and extract information in JSON format with this exact structure:
  {
    "invoice": {
      "invoiceNumber": "string",
      "date": "string (YYYY-MM-DD)",
      "totalAmount": "number",
      "status": "string"
    },
    "customer": {
      "name": "string",
      "email": "string",
      "phone": "string",
      "address": "string"
    },
    "products": [{
      "name": "string",
      "quantity": "number",
      "unitPrice": "number",
      "tax": "number",
      "priceWithTax": "number",
      "discount": "number"
    }]
  }
  Important: 
  - All number fields should be numeric values without currency symbols
  - Date should be in YYYY-MM-DD format
  - Product prices should not include tax in unitPrice
  - Calculate tax as 18% of unitPrice if not specified`;

  const result = await model.generateContent({
    contents: [{
      parts: [
        { text: prompt },
        { inline_data: { mime_type: 'image/jpeg', data: base64Data } }
      ]
    }]
  });

  const response = await result.response;
  const text = response.text();
  
  try {
    // Extract JSON from the response if it's wrapped in markdown code blocks
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : text;
    
    // Clean the string and parse it
    const cleanJsonStr = jsonStr.trim();
    const parsedData = JSON.parse(cleanJsonStr);
    
    // Ensure numbers are actually numbers
    if (parsedData.products) {
      parsedData.products = parsedData.products.map(product => ({
        ...product,
        quantity: parseFloat(product.quantity) || 1,
        unitPrice: parseFloat(product.unitPrice) || 0,
        tax: parseFloat(product.tax) || 0,
        priceWithTax: parseFloat(product.priceWithTax) || 0,
        discount: parseFloat(product.discount) || 0
      }));
    }
    
    return parsedData;
  } catch (error) {
    console.error('Failed to parse response:', error);
    console.error('Raw response:', text);
    throw new Error('Failed to parse AI response for image');
  }
}

function formatData(data) {
  if (!data) {
    throw new Error('No data to format');
  }

  // Ensure products have the correct structure
  const products = (data.products || []).map(product => {
    const unitPrice = parseFloat(product.unitPrice || product.price || '0');
    const quantity = parseFloat(product.quantity || '1');
    const taxRate = 0.18; // 18% tax rate
    const tax = product.tax || (unitPrice * taxRate);
    const priceWithTax = product.priceWithTax || (unitPrice + tax);
    const discount = parseFloat(product.discount || '0');

    return {
      name: product.name || '',
      quantity: quantity,
      unitPrice: unitPrice,
      tax: tax,
      priceWithTax: priceWithTax,
      discount: discount
    };
  }).filter(product => product.name && product.name.trim() !== '');

  // Calculate total amount if not provided
  const totalAmount = data.invoice?.totalAmount || 
    products.reduce((sum, product) => sum + (product.priceWithTax * product.quantity), 0);

  return {
    invoice: {
      invoiceNumber: data.invoice?.invoiceNumber || '',
      customerName: data.customer?.name || '',
      date: data.invoice?.date || new Date().toISOString().split('T')[0],
      totalAmount: totalAmount,
      status: data.invoice?.status || 'pending'
    },
    customer: {
      name: data.customer?.name || '',
      phone: data.customer?.phone || '',
      email: data.customer?.email || '',
      address: data.customer?.address || '',
      totalPurchases: totalAmount
    },
    products: products
  };
}