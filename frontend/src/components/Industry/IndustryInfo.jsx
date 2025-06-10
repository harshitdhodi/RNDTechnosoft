import React from 'react';

const IndustryInfo = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 my-10 px-4">
      <h1 className="md:text-3xl max-w-5xl text-xl lg:text-4xl font-bold text-center text-gray-900 mb-6">
        EMPOWERING YOUR FINTECH VISION WITH Cutting-Edge Software Solutions
      </h1>
      <p className="text-lg md:text-xl text-center text-gray-600 mb-8 max-w-5xl">
        Transform your financial services with expert-led FinTech solutions tailored for impact. Whether it’s a simple payment app or a complex corporate lending platform, our fintech software development company delivers secure, intuitive, and scalable applications powered by AI, Cloud, and IoT. From idea to expansion, we support your innovation at every stage of the growth journey.
      </p>
      <button className="bg-[#f3ca0d]  font-semibold py-3 px-6 rounded-lg flex items-center space-x-2 hover:bg-[#f3ca0d] transition">
        <span className='text-gray-700'>GET FREE CONSULTATION</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
  );
};

export default IndustryInfo;