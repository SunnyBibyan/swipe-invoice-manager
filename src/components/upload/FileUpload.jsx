import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { processFile } from '../../utils/fileProcessor';
import { setInitialData } from '../../store/slices/dashboardSlice';
import { selectDashboardState } from '../../store/selectors';

export default function FileUpload() {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [uploadSummary, setUploadSummary] = useState(null);

  // Get current state to check for duplicates
  const currentState = useSelector(selectDashboardState);

  const transformDataForStore = (data) => {
    if (!data) return { invoices: [], products: [], customers: [] };

    // Transform single invoice into invoices array
    const invoices = [{
      id: data.invoice.invoiceNumber,
      invoiceNumber: data.invoice.invoiceNumber,
      customer: data.invoice.customerName,
      date: data.invoice.date,
      totalAmount: data.invoice.totalAmount,
      items: data.products.map(product => ({
        name: product.name,
        quantity: product.quantity,
        tax: product.tax,
        priceWithTax: product.priceWithTax
      }))
    }];

    // Products array is already in correct format, just add id
    const products = data.products.map((product, index) => ({
      id: `${data.invoice.invoiceNumber}-${index}`,
      name: product.name,
      quantity: product.quantity,
      price: product.unitPrice,
      tax: product.tax,
      priceWithTax: product.priceWithTax,
      discount: product.discount
    }));

    // Transform single customer into customers array
    const customers = [{
      id: data.customer.name,
      name: data.customer.name,
      phone: data.customer.phone,
      email: data.customer.email,
      address: data.customer.address,
      totalPurchases: data.customer.totalPurchases,
      lastPurchase: data.invoice.date
    }];

    return {
      invoices,
      products,
      customers
    };
  };

  const checkDuplicates = (newData) => {
    const existingInvoiceNumbers = new Set(currentState.invoices.map(inv => inv.invoiceNumber));
    const existingProductNames = new Set(currentState.products.map(prod => prod.name));
    const existingCustomerIds = new Set(currentState.customers.map(cust => cust.email || cust.name));

    const duplicates = {
      invoices: newData.invoices.filter(inv => existingInvoiceNumbers.has(inv.invoiceNumber)),
      products: newData.products.filter(prod => existingProductNames.has(prod.name)),
      customers: newData.customers.filter(cust => existingCustomerIds.has(cust.email || cust.name))
    };

    const newItems = {
      invoices: newData.invoices.filter(inv => !existingInvoiceNumbers.has(inv.invoiceNumber)),
      products: newData.products.filter(prod => !existingProductNames.has(prod.name)),
      customers: newData.customers.filter(cust => !existingCustomerIds.has(cust.email || cust.name))
    };

    return { duplicates, newItems };
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      setError('No files were selected');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setUploadSummary(null);

    try {
      const summaries = [];

      for (const file of acceptedFiles) {
        console.log('Processing file:', file.name, 'Type:', file.type);
        const data = await processFile(file);
        console.log('Processed data:', data);

        if (!data) {
          throw new Error(`No data could be extracted from ${file.name}`);
        }

        // Transform data and check for duplicates
        const transformedData = transformDataForStore(data);
        const { duplicates, newItems } = checkDuplicates(transformedData);

        // Only dispatch if there are new items
        if (Object.values(newItems).some(arr => arr.length > 0)) {
          dispatch(setInitialData(newItems));
        }

        // Add to summary
        summaries.push({
          fileName: file.name,
          new: {
            invoices: newItems.invoices.length,
            products: newItems.products.length,
            customers: newItems.customers.length
          },
          existing: {
            invoices: duplicates.invoices.length,
            products: duplicates.products.length,
            customers: duplicates.customers.length
          }
        });
      }

      // Set upload summary
      setUploadSummary(summaries);

    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to process files. Please check the file format and try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [dispatch, currentState]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: true
  });

  return (
    <div className="p-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        <ArrowUpTrayIcon className="h-12 w-12 mx-auto text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? "Drop the files here..."
            : "Drag 'n' drop files, or click to select"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports Excel (.xlsx), PDF, and Image files
        </p>
      </div>

      {isProcessing && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Processing files...
        </div>
      )}

      {error && (
        <div className="mt-4 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {uploadSummary && (
        <div className="mt-4 space-y-4">
          {uploadSummary.map((summary, index) => (
            <div key={index} className="text-sm bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900">{summary.fileName}</p>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-green-600 font-medium">New Items Added:</p>
                  <ul className="text-gray-600 mt-1">
                    <li>Invoices: {summary.new.invoices}</li>
                    <li>Products: {summary.new.products}</li>
                    <li>Customers: {summary.new.customers}</li>
                  </ul>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Already Existing:</p>
                  <ul className="text-gray-500 mt-1">
                    <li>Invoices: {summary.existing.invoices}</li>
                    <li>Products: {summary.existing.products}</li>
                    <li>Customers: {summary.existing.customers}</li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {fileRejections.length > 0 && (
        <div className="mt-4 text-center text-sm text-red-600">
          Some files were rejected. Please ensure they are in the correct format.
        </div>
      )}
    </div>
  );
}