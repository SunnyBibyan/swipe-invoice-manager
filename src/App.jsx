import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase';
import Hero from './components/Hero';
import Features from './components/Features';
import Demo from './components/Demo';
import TechStack from './components/TechStack';
import Pricing from './components/Pricing';
import FAQs from './components/FAQs';
import Footer from './components/Footer';
import AuthModal from './components/auth/AuthModal';
import FileUpload from './components/upload/FileUpload';

function App() {
  const [user, loading] = useAuthState(auth);
  const [showAuth, setShowAuth] = useState(false);
  const [uploadedData, setUploadedData] = useState(null);

  const handleUploadComplete = (data) => {
    setUploadedData(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <Navbar/>
      <div className="bg-white">
      <Hero onTryClick={() => !user && setShowAuth(true)} />
      <Features />
      {user && <FileUpload onUploadComplete={handleUploadComplete} />}
      <Demo data={uploadedData} />
      <TechStack />
      <Pricing/>
      <FAQs />
      <Footer />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
    </div>


  );
}

export default App;