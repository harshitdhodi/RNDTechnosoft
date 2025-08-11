import React, { useEffect, lazy, Suspense } from 'react';
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />
      <div className="overflow-hidden flex-grow">
        <Outlet />
      </div>
      <Footer />
      <ScrollToTop />
      <Suspense fallback={<div>Loading...</div>}>
        {/* <Chatbot /> */}
        <Whatsapp />
        <CateglogButton />  
      </Suspense>
    </div>
  );
}