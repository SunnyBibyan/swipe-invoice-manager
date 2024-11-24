import { motion } from 'framer-motion';
import { useState } from 'react';

const faqs = [
  {
    question: "How accurate is the AI extraction?",
    answer: "Our AI technology achieves over 98% accuracy in data extraction from invoices, and continuously improves through machine learning."
  },
  {
    question: "What file formats are supported?",
    answer: "We support all major file formats including PDF, Excel (xls, xlsx), images (jpg, png), and scanned documents."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we use bank-level encryption and follow strict security protocols. Your data is encrypted both in transit and at rest."
  },
  {
    question: "Can I integrate with my existing systems?",
    answer: "Yes, we offer API access and integrations with popular accounting software and ERPs on our Professional and Enterprise plans."
  },
  {
    question: "What kind of support do you offer?",
    answer: "We provide email support for all plans, with priority support for Professional and 24/7 dedicated support for Enterprise customers."
  }
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="py-24 bg-gradient-to-b from-white to-gray-50" id="faqs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="w-24 h-1 bg-indigo-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about Swipe
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="mb-6"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                <svg
                  className={`w-6 h-6 transform transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 bg-gray-50 rounded-b-lg"
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}