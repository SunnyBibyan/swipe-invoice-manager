import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const tabs = [
  {
    name: 'Invoices',
    content: [
      { id: 1, serial: 'INV001', customer: 'Acme Corp', product: 'Widget Pro', qty: 5, tax: '$50', total: '$550', date: '2024-01-20' },
      { id: 2, serial: 'INV002', customer: 'TechCo', product: 'Service Plus', qty: 1, tax: '$100', total: '$1100', date: '2024-01-21' },
    ]
  },
  {
    name: 'Products',
    content: [
      { id: 1, name: 'Widget Pro', qty: 50, unitPrice: '$100', tax: '10%', priceWithTax: '$110' },
      { id: 2, name: 'Service Plus', qty: 25, unitPrice: '$200', tax: '10%', priceWithTax: '$220' },
    ]
  },
  {
    name: 'Customers',
    content: [
      { id: 1, name: 'Acme Corp', phone: '+1 234 567 8900', totalPurchase: '$5,500' },
      { id: 2, name: 'TechCo', phone: '+1 234 567 8901', totalPurchase: '$11,000' },
    ]
  }
];

export default function Demo() {
  return (
    <div id="demo" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          {/* <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Demo</h2> */}
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            See it in action
          </p>
        </div>

        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-indigo-900/20 p-1">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-indigo-700 shadow'
                      : 'text-indigo-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            {tabs.map((tab, idx) => (
              <Tab.Panel
                key={idx}
                className={classNames(
                  'rounded-xl bg-white p-3',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                )}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="overflow-x-auto"
                >
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(tab.content[0]).map((key) => (
                          key !== 'id' && (
                            <th
                              key={key}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {key}
                            </th>
                          )
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tab.content.map((item) => (
                        <tr key={item.id}>
                          {Object.entries(item).map(([key, value]) => (
                            key !== 'id' && (
                              <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {value}
                              </td>
                            )
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}