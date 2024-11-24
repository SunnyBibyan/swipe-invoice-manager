import { DocumentArrowUpIcon, CloudArrowUpIcon, CpuChipIcon, ShieldCheckIcon, ArrowPathIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const features = [
  {
    name: 'Smart File Upload',
    description: 'Effortlessly upload Excel, PDF, and image files with our intuitive drag-and-drop interface. Supports batch uploads for increased productivity.',
    icon: DocumentArrowUpIcon,
    color: 'from-purple-500 to-indigo-600',
  },
  {
    name: 'AI-Powered Extraction',
    description: 'Advanced AI technology automatically extracts and processes invoice data with high accuracy, saving hours of manual data entry.',
    icon: CpuChipIcon,
    color: 'from-cyan-500 to-blue-600',
  },
  {
    name: 'Real-time Sync',
    description: 'Changes sync instantly across all tabs and connected devices, ensuring your team always works with the latest data.',
    icon: CloudArrowUpIcon,
    color: 'from-green-500 to-emerald-600',
  },
  {
    name: 'Validation & Security',
    description: 'Built-in validation ensures data accuracy while enterprise-grade security protects your sensitive information.',
    icon: ShieldCheckIcon,
    color: 'from-orange-500 to-red-600',
  },
  {
    name: 'Automated Processing',
    description: 'Set up custom rules and workflows to automatically process and categorize invoices based on your business logic.',
    icon: ArrowPathIcon,
    color: 'from-pink-500 to-rose-600',
  },
  {
    name: 'Analytics & Insights',
    description: 'Gain valuable insights into your invoice data with built-in analytics and customizable reporting tools.',
    icon: ChartBarIcon,
    color: 'from-yellow-500 to-orange-600',
  },
];

export default function Features() {
  return (
    <div id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2> */}
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage invoices
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Streamline your invoice processing with our comprehensive suite of features designed for modern businesses.
            </p>
          </motion.div>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-200" />
                <div className="relative p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-200">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}