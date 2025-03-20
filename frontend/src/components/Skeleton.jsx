import React from 'react';

const Skeleton = () => {
  return (
    <div className="bg-[#F7F4EE] animate-pulse">
      <div className="flex flex-col xl:flex-row justify-center text-center lg:py-5 relative">
        {/* Left Side Animated Photos */}
        <div className="xl:flex flex-col flex-1 hidden">
          <div className="bg-gray-300 h-64 w-full mb-4"></div>
          <div className="bg-gray-300 h-64 w-full mb-4"></div>
        </div>

        {/* Middle Text Section */}
        <div className="flex-2 flex flex-col items-center justify-center max-w-2xl pb-5 pt-10 xl:pt-32 mx-auto px-4 md:px-0">
          <div className="bg-gray-300 h-12 w-3/4 mb-4"></div>
          <div className="bg-gray-300 h-8 w-1/2 mb-4"></div>
          <div className="bg-gray-300 h-8 w-1/2 mb-4"></div>
          <div className="bg-gray-300 h-8 w-1/2 mb-4"></div>
          <div className="bg-gray-300 h-12 w-1/3 mt-6"></div>
        </div>

        {/* Right Side Animated Photos */}
        <div className="xl:flex flex-col flex-1 hidden">
          <div className="bg-gray-300 h-64 w-full mb-4"></div>
          <div className="bg-gray-300 h-64 w-full mb-4"></div>
        </div>

        {/* Wave Image - visible only on smaller screens */}
        <div className="bg-gray-300 h-16 w-full absolute bottom-0"></div>
      </div>
    </div>
  );
};

export default Skeleton;