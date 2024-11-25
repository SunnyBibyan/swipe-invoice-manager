# Swipe Invoice Manager

An AI-powered invoice management system built with React, Vite, and Tailwind CSS.

## 🚀 Features

- 📄 Intelligent Invoice Processing
  - Upload PDF, Excel, or Image files
  - AI-powered data extraction with Google Gemini
  - Smart field recognition and validation
- 👥 Customer Management
  - Track customer details and history
  - Manage contact information
  - View purchase analytics
- 📦 Product Catalog
  - Manage product inventory
  - Track pricing and taxes
  - Monitor stock levels
- 📊 Real-time Dashboard
  - Visual data representation
  - Quick statistics overview
  - Excel export functionality
- 🎨 Modern UI/UX
  - Clean, intuitive interface
  - Responsive design
  - Beautiful animations with Framer Motion
- 🔒 Data Security
  - Secure file processing
  - Data validation
  - Error handling and recovery

## 🛠️ Tech Stack

- **Frontend:**
  - React 
  - Vite
  - Tailwind CSS
  - Redux Toolkit
  - React Router DOM
- **UI Components:**
  - Headless UI
  - Hero Icons
  - React Icons
  - Framer Motion
- **File Processing:**
  - React Dropzone
  - PDF-lib
  - XLSX
  - Sharp (Image processing)
- **AI Integration:**
  - Google Generative AI
  - Smart Data Extraction

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SunnyBibyan/swipe-invoice-manager.git
cd swipe-invoice-manager
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=.........
```

4. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📦 Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
swipe-invoice-manager/
├── public/
│   └── brand_logo.svg
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── dashboard/
│   │   └── upload/
│   ├── config/
│   ├── contexts/
│   ├── services/
│   ├── store/
│   │   ├── slices/
│   │   └── selectors/
│   └── utils/
├── .env
└── package.json
```

## 🔧 Configuration

The application requires the following environment variables:

```env
# Required for AI-powered data extraction
VITE_GEMINI_API_KEY=.....
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
