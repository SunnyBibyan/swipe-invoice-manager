/**
 * @fileoverview DataTabs component that displays and manages invoice, product, and customer data
 * in a tabbed interface with real-time updates and validation.
 * @module components/dashboard/DataTabs
 */

import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { DocumentTextIcon, CubeIcon, UserGroupIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DataTabs({ data }) {
  const [categories, setCategories] = useState({
    Invoices: [],
    Products: [],
    Customers: []
  });

  useEffect(() => {
    setCategories({
      Invoices: data.invoices || [],
      Products: data.products || [],
      Customers: data.customers || []
    });
  }, [data]);

  // Format currency in INR
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  // Download data as Excel
  const downloadExcel = (data, filename) => {
    let exportData = [];
    
    if (filename === 'Invoices') {
      // Flatten invoice data with items in separate rows
      data.forEach(invoice => {
        if (!invoice.items || invoice.items.length === 0) {
          exportData.push({
            'Invoice Number': invoice.invoiceNumber,
            'Customer': invoice.customer,
            'Date': formatDate(invoice.date),
            'Total Amount': invoice.totalAmount,
            'Item Name': '',
            'Item Quantity': '',
            'Item Price': ''
          });
        } else {
          invoice.items.forEach(item => {
            exportData.push({
              'Invoice Number': invoice.invoiceNumber,
              'Customer': invoice.customer,
              'Date': formatDate(invoice.date),
              'Total Amount': invoice.totalAmount,
              'Item Name': item.name,
              'Item Quantity': item.quantity,
              'Item Price': formatCurrency(item.priceWithTax)
            });
          });
        }
      });
    } else if (filename === 'Products') {
      exportData = data.map(product => ({
        'Name': product.name,
        'Quantity': product.quantity,
        'Price': product.price,
        'Tax': product.tax,
        'Price with Tax': product.priceWithTax,
        'Discount': product.discount
      }));
    } else if (filename === 'Customers') {
      exportData = data.map(customer => ({
        'Name': customer.name,
        'Email': customer.email,
        'Phone': customer.phone,
        'Address': customer.address,
        'Total Purchases': customer.totalPurchases,
        'Last Purchase': formatDate(customer.lastPurchase)
      }));
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, filename);
    
    // Auto-size columns
    const maxWidths = {};
    exportData.forEach(row => {
      Object.keys(row).forEach(key => {
        const value = String(row[key] || '');
        maxWidths[key] = Math.max(maxWidths[key] || 0, value.length, key.length);
      });
    });
    
    worksheet['!cols'] = Object.keys(maxWidths).map(key => ({ wch: maxWidths[key] + 2 }));

    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const DownloadButton = ({ data, filename }) => (
    <button
      onClick={() => downloadExcel(data, filename)}
      className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
    >
      <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
      Download Excel
    </button>
  );

  const TableHeader = ({ children, isLast = false }) => (
    <th scope="col" className={`sticky top-0 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100 border-b border-gray-200 ${!isLast ? 'border-r border-gray-200' : ''}`}>
      {children}
    </th>
  );

  const TableCell = ({ children, className = "", isLast = false }) => (
    <td className={`px-4 py-3 text-sm text-gray-800 border-b border-gray-100 ${!isLast ? 'border-r border-gray-200' : ''} ${className}`}>
      {children}
    </td>
  );

  const renderInvoicesTable = () => (
    <div className="overflow-x-auto overflow-y-auto max-h-[70vh] rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 bg-white table-fixed">
        <thead>
          <tr>
            <TableHeader>Invoice Number</TableHeader>
            <TableHeader>Customer</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Total Amount</TableHeader>
            <TableHeader>Item Name</TableHeader>
            <TableHeader>Quantity</TableHeader>
            <TableHeader isLast>Total Price</TableHeader>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {categories.Invoices.flatMap((invoice) => {
            // If no items, return a single row
            if (!invoice.items || invoice.items.length === 0) {
              return [{
                id: invoice.id,
                invoiceNumber: invoice.invoiceNumber,
                customer: invoice.customer,
                date: invoice.date,
                totalAmount: invoice.totalAmount,
                itemName: '-',
                quantity: '-',
                price: '-'
              }];
            }
            
            // Return a row for each item
            return invoice.items.map((item, itemIdx) => ({
              id: `${invoice.id}-${itemIdx}`,
              invoiceNumber: itemIdx === 0 ? invoice.invoiceNumber : '',
              customer: itemIdx === 0 ? invoice.customer : '',
              date: itemIdx === 0 ? invoice.date : '',
              totalAmount: itemIdx === 0 ? invoice.totalAmount : '',
              itemName: item.name,
              quantity: item.quantity,
              // Calculate total price without tax (Quantity * Unit Price)
              price: item.quantity * (item.unitPrice || (item.priceWithTax - item.tax) / item.quantity)
            }));
          }).map((row, idx) => (
            <tr key={row.id} className="hover:bg-blue-50 transition-colors duration-150">
              <TableCell className={`font-medium w-1/7 ${row.invoiceNumber ? '' : 'border-t-0'}`}>
                {row.invoiceNumber}
              </TableCell>
              <TableCell className={`w-1/7 ${row.customer ? '' : 'border-t-0'}`}>
                {row.customer}
              </TableCell>
              <TableCell className={`w-1/7 ${row.date ? '' : 'border-t-0'}`}>
                {row.date ? formatDate(row.date) : ''}
              </TableCell>
              <TableCell className={`font-medium w-1/7 ${row.totalAmount ? '' : 'border-t-0'}`}>
                {row.totalAmount ? formatCurrency(row.totalAmount) : ''}
              </TableCell>
              <TableCell className="w-1/7">
                {row.itemName}
              </TableCell>
              <TableCell className="w-1/7">
                {row.quantity}
              </TableCell>
              <TableCell isLast className="w-1/7">
                {row.price !== '-' ? formatCurrency(row.price) : '-'}
              </TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderProductsTable = () => (
    <div className="overflow-x-auto overflow-y-auto max-h-[70vh] rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 bg-white table-fixed">
        <thead>
          <tr>
            <TableHeader>Name</TableHeader>
            <TableHeader>Quantity</TableHeader>
            <TableHeader>Price/Item</TableHeader>
            <TableHeader>Tax</TableHeader>
            <TableHeader>Price with Tax</TableHeader>
            <TableHeader isLast>Discount</TableHeader>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {categories.Products.map((product) => (
            <tr key={product.id} className="hover:bg-blue-50 transition-colors duration-150">
              <TableCell className="font-medium w-1/6">{product.name}</TableCell>
              <TableCell className="w-1/6">{product.quantity}</TableCell>
              <TableCell className="w-1/6">{formatCurrency(product.price)}</TableCell>
              <TableCell className="w-1/6">{formatCurrency(product.tax)}</TableCell>
              <TableCell className="font-medium w-1/6">{formatCurrency(product.priceWithTax)}</TableCell>
              <TableCell isLast className="w-1/6">{formatCurrency(product.discount)}</TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCustomersTable = () => (
    <div className="overflow-x-auto overflow-y-auto max-h-[70vh] rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 bg-white table-fixed">
        <thead>
          <tr>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Phone</TableHeader>
            <TableHeader>Address</TableHeader>
            <TableHeader>Total Purchases</TableHeader>
            <TableHeader isLast>Last Purchase</TableHeader>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {categories.Customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-blue-50 transition-colors duration-150">
              <TableCell className="font-medium w-1/6">{customer.name}</TableCell>
              <TableCell className="w-1/6">{customer.email}</TableCell>
              <TableCell className="w-1/6">{customer.phone}</TableCell>
              <TableCell className="w-1/6">{customer.address}</TableCell>
              <TableCell className="font-medium w-1/6">{formatCurrency(customer.totalPurchases)}</TableCell>
              <TableCell isLast className="w-1/6">{formatDate(customer.lastPurchase)}</TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full px-2 py-4 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex p-1 space-x-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl mb-4">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm leading-5 font-medium rounded-lg transition-all duration-200',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                selected
                  ? 'bg-white text-blue-700 shadow-lg transform scale-100'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white scale-95'
              )
            }
          >
            <div className="flex items-center justify-center space-x-2">
              <DocumentTextIcon className="w-5 h-5" />
              <span>Invoices ({categories.Invoices.length})</span>
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm leading-5 font-medium rounded-lg transition-all duration-200',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                selected
                  ? 'bg-white text-blue-700 shadow-lg transform scale-100'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white scale-95'
              )
            }
          >
            <div className="flex items-center justify-center space-x-2">
              <CubeIcon className="w-5 h-5" />
              <span>Products ({categories.Products.length})</span>
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm leading-5 font-medium rounded-lg transition-all duration-200',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                selected
                  ? 'bg-white text-blue-700 shadow-lg transform scale-100'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white scale-95'
              )
            }
          >
            <div className="flex items-center justify-center space-x-2">
              <UserGroupIcon className="w-5 h-5" />
              <span>Customers ({categories.Customers.length})</span>
            </div>
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel className="focus:outline-none">
            <div className="mb-4 flex justify-end">
              <DownloadButton data={categories.Invoices} filename="Invoices" />
            </div>
            {renderInvoicesTable()}
          </Tab.Panel>
          <Tab.Panel className="focus:outline-none">
            <div className="mb-4 flex justify-end">
              <DownloadButton data={categories.Products} filename="Products" />
            </div>
            {renderProductsTable()}
          </Tab.Panel>
          <Tab.Panel className="focus:outline-none">
            <div className="mb-4 flex justify-end">
              <DownloadButton data={categories.Customers} filename="Customers" />
            </div>
            {renderCustomersTable()}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
