# Swipe Invoice Manager

A modern, AI-powered invoice management system built with the MERN stack.

![Dashboard Screenshot](docs/screenshots/dashboard.png)

## Features

- 🤖 AI-Powered Data Extraction
- 📊 Real-time Data Visualization
- 📱 Responsive Design
- 🔄 Cross-tab Data Synchronization
- ✨ Modern UI/UX

## Tech Stack

- **Frontend**: React, Redux Toolkit, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI/ML**: TensorFlow.js for OCR, Custom NLP models

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/swipe-invoice-manager.git
   cd swipe-invoice-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## AI Data Extraction

The system uses advanced AI to extract data from invoices:

1. **OCR Processing**:
   - TensorFlow.js for text recognition
   - Custom image preprocessing
   - Multi-format support (PDF, images)

2. **Data Parsing**:
   - NLP-based entity recognition
   - Pattern matching for dates, amounts
   - Contextual field extraction

3. **Accuracy Improvement**:
   - Machine learning for field classification
   - Historical data training
   - User feedback integration

## Component Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── dashboard/       # Dashboard-specific components
│   └── auth/           # Authentication components
├── store/
│   ├── slices/         # Redux slices
│   └── store.js        # Redux store configuration
├── utils/
│   └── validation.js   # Validation utilities
└── contexts/
    └── ToastContext.js # Toast notification context
```

## Test Cases

### 1. Invoice Upload and Processing
![Invoice Upload](docs/screenshots/invoice-upload.gif)
- ✅ PDF upload
- ✅ Image upload
- ✅ Multi-file upload
- ✅ Progress indication
- ✅ Error handling

### 2. Data Extraction Accuracy
![Data Extraction](docs/screenshots/data-extraction.gif)
- ✅ Field recognition
- ✅ Amount calculation
- ✅ Date parsing
- ✅ Customer/Product matching

### 3. Cross-tab Updates
![Real-time Updates](docs/screenshots/real-time-updates.gif)
- ✅ Product updates reflect in invoices
- ✅ Customer updates sync across tabs
- ✅ Real-time calculations

### 4. Validation and Error Handling
![Validation](docs/screenshots/validation.gif)
- ✅ Field validation
- ✅ File type validation
- ✅ Size limits
- ✅ Error notifications

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE.md
