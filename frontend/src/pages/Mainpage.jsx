<<<<<<< HEAD
import React, { useEffect, useState, lazy, Suspense } from 'react';
=======
import React, { useEffect, lazy, Suspense } from 'react';
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
import Navbar from '../components/NavBar';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrolltoTop';

const Chatbot = lazy(() => import('./Chatbooth'));
const Whatsapp = lazy(() => import('./Whatsapp'));
<<<<<<< HEAD
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
=======

export default function Mainpage() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      <div className="overflow-hidden flex-grow">
        <Outlet />
      </div>
      <Footer />
      <ScrollToTop />
      <Suspense fallback={<div>Loading...</div>}>
        {/* <Chatbot /> */}
        <Whatsapp />
<<<<<<< HEAD
        <CateglogButton isMobileMenuOpen={isMobileMenuOpen} />
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      </Suspense>
    </div>
  );
}