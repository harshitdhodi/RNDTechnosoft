import React from "react";
import { Helmet } from "react-helmet";

const PlaceholderSection = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <Helmet>
        <title>Coming Soon - Updates</title>
      </Helmet>
      <div className="text-center max-w-lg">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          🚀 Coming Soon
        </h1>
        <div className="w-32 h-1 bg-[#f1cd2a] mx-auto my-6 rounded-full"></div>
        <p className="text-lg text-gray-700 leading-relaxed">
          We are constantly exploring new technologies. <br />
          <span className="font-semibold text-gray-900">
            Stay tuned for exciting updates!
          </span>
        </p>
      </div>
    </div>
  );
};

export default PlaceholderSection;
