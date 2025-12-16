import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import HomeServices from './components/HomeServices';
import ShopSection from './components/ShopSection';
import ContactForm from './components/ContactForm';
import AdminPanel from './components/AdminPanel';
import AIAssistant from './components/AIAssistant';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';

// A decorative frame that makes the page look "wrapped" in vines
const GlobalVineFrame = () => (
  <div className="fixed inset-0 pointer-events-none z-[40] overflow-hidden">
    {/* Top Left Corner Vine */}
    <svg className="absolute top-0 left-0 w-32 h-32 md:w-64 md:h-64 text-jungle-800 opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M0,0 C30,10 50,30 60,60 C50,50 40,40 0,30 Z" fill="currentColor" />
      <path d="M0,0 C10,40 20,60 10,100 L0,100 Z" fill="currentColor" />
      {/* Leaf Details */}
      <path d="M20,20 Q35,25 40,40 Q25,35 20,20" fill="#4F8A55" className="opacity-80" />
      <path d="M10,50 Q25,55 30,70 Q15,65 10,50" fill="#69A96E" className="opacity-80" />
    </svg>

    {/* Bottom Right Corner - BIG MONSTERA LEAF */}
    <svg className="absolute bottom-0 right-0 w-64 h-64 md:w-[500px] md:h-[500px] text-jungle-800 opacity-10" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
        {/* Main Leaf Shape - Artistic Monstera */}
        <path d="M250,500 C350,450 450,400 480,300 C500,200 450,100 350,50 C250,0 150,50 100,150 C50,250 100,400 250,500 Z" fill="currentColor" />
        
        {/* Holes/Fenestrations (simulated by cutting out background color or overlaying lighter shapes, here overlaying darker to simulate cuts in a silhouette) */}
        {/* Right side cuts */}
        <ellipse cx="400" cy="200" rx="30" ry="10" transform="rotate(-30 400 200)" fill="white" fillOpacity="0.5" />
        <ellipse cx="440" cy="280" rx="20" ry="8" transform="rotate(-15 440 280)" fill="white" fillOpacity="0.5" />
        
        {/* Left side cuts */}
        <ellipse cx="150" cy="200" rx="25" ry="10" transform="rotate(30 150 200)" fill="white" fillOpacity="0.5" />
        <ellipse cx="120" cy="300" rx="20" ry="10" transform="rotate(45 120 300)" fill="white" fillOpacity="0.5" />
        
        {/* Vein */}
        <path d="M250,500 Q300,300 350,50" fill="none" stroke="#2F5233" strokeWidth="5" opacity="0.5" />
    </svg>
    
    {/* Left Border Climber */}
    <div className="absolute left-0 top-1/3 bottom-1/3 w-8 bg-repeat-y opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='40' viewBox='0 0 20 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10,0 Q20,10 10,20 T10,40' stroke='%232F5233' fill='none' stroke-width='2'/%3E%3Cpath d='M10,10 Q0,15 5,25' fill='%234F8A55'/%3E%3C/svg%3E")`
    }}></div>

     {/* Right Border Climber */}
    <div className="absolute right-0 top-1/4 bottom-1/4 w-8 bg-repeat-y opacity-10 transform scale-x-[-1]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='40' viewBox='0 0 20 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10,0 Q20,10 10,20 T10,40' stroke='%232F5233' fill='none' stroke-width='2'/%3E%3Cpath d='M10,10 Q0,15 5,25' fill='%234F8A55'/%3E%3C/svg%3E")`
    }}></div>
  </div>
);

const HomePage = () => (
  <>
    <Hero />
    <HomeServices />
    <ContactForm />
  </>
);

const AppContent = () => {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case '/':
        return <HomePage />;
      case '/services':
        return <ServicesSection />;
      case '/shop':
        return <ShopSection />;
      case '/contact':
        return <ContactForm />;
      case '/admin':
        return <AdminPanel />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-transparent relative">
      <GlobalVineFrame />
      <Navbar />
      <CartDrawer />
      <AuthModal />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
};

const App = () => {
  return (
    <AppProvider children={<AppContent />} />
  );
};

export default App;