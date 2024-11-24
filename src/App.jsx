import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, createRoutesFromElements } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ToastProvider } from './contexts/ToastContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Demo from './components/Demo';
import TechStack from './components/TechStack';
import Pricing from './components/Pricing';
import FAQs from './components/FAQs';
import Footer from './components/Footer';
import Dashboard from './components/dashboard/Dashboard';

// Landing page component
function LandingPage({ onGetStarted }) {
  return (
    <div className="bg-white">
      <Hero onTryClick={onGetStarted} />
      <Features />
      <Demo />
      <TechStack />
      <Pricing/>
      <FAQs />
      <Footer />
    </div>
  );
}

// Main App component
function App() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <div className="bg-gray-50">
      <Navbar onGetStarted={handleGetStarted} />
      <Routes future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Route path="/" element={<LandingPage onGetStarted={handleGetStarted} />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

// Wrapper component to provide routing
function AppWrapper() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </Router>
      </ToastProvider>
    </Provider>
  );
}

export default AppWrapper;