/**
 * @fileoverview DataTabs component that displays and manages invoice, product, and customer data
 * in a tabbed interface with real-time updates and validation.
 * @module components/dashboard/DataTabs
 */

import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { DocumentTextIcon, CubeIcon, UserGroupIcon } from '@heroicons/react/24/outline';

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

  const renderInvoicesTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Number</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.Invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.invoiceNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.customer}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(invoice.date)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(invoice.totalAmount)}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <ul className="list-disc pl-5">
                  {invoice.items?.map((item, idx) => (
                    <li key={idx}>
                      {item.name} (Qty: {item.quantity}) - {formatCurrency(item.priceWithTax)}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderProductsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price with Tax</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.Products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.price)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.tax)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.priceWithTax)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.discount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCustomersTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Purchases</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Purchase</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.Customers.map((customer) => (
            <tr key={customer.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{customer.address}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(customer.totalPurchases)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(customer.lastPurchase)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full px-2 py-4 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                selected
                  ? 'bg-white shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
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
                'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                selected
                  ? 'bg-white shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
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
                'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                selected
                  ? 'bg-white shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            <div className="flex items-center justify-center space-x-2">
              <UserGroupIcon className="w-5 h-5" />
              <span>Customers ({categories.Customers.length})</span>
            </div>
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel
            className={classNames(
              'bg-white rounded-xl p-3',
              'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
            )}
          >
            {renderInvoicesTable()}
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              'bg-white rounded-xl p-3',
              'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
            )}
          >
            {renderProductsTable()}
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              'bg-white rounded-xl p-3',
              'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
            )}
          >
            {renderCustomersTable()}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
