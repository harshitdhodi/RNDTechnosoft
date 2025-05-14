import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <Helmet>
        <title>404 Page - Not Found</title>
      </Helmet>
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-black">404</h1>
        <div className="w-full h-1 bg-gray-300 my-6"></div>
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-[#f1cd2a] text-black font-medium rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;