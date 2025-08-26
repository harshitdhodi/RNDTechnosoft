import React, { useEffect, useState, lazy, Suspense } from 'react';
import Navbar from '../components/NavBar';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrolltoTop';

const Chatbot = lazy(() => import('./Chatbooth'));
const Whatsapp = lazy(() => import('./Whatsapp'));
const CateglogButton = lazy(() => import('./Categlog'));

export default function Mainpage() {
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false); // Close mobile menu on route change
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <div className="overflow-hidden flex-grow">
        <Outlet />
      </div>
      <Footer />
      <ScrollToTop />
      <Suspense fallback={<div>Loading...</div>}>
        {/* <Chatbot /> */}
        <Whatsapp />
        <CateglogButton isMobileMenuOpen={isMobileMenuOpen} />
      </Suspense>
    </div>
  );
}