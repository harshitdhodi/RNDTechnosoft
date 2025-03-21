import React, { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const PricingPackage = ({ packagesData }) => {
  const [packageData, setPackageData] = useState(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (packagesData?.standard?.packages?.length > 0) {
      setPackageData(packagesData.standard.packages[0]); // Set the first package
    }
  }, [packagesData]);

  if (!packageData) {
    return <div>Loading...</div>;
  }

  const { title, price, description, whatIsTheir } = packageData;
  const features = whatIsTheir ? JSON.parse(whatIsTheir) : [];

  return (
    <div className="w-full max-w-3xl mx-auto p-10 mb-16">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl text-center font-serif">
        Standard Package
      </h2>
      <h3 className="md:text-[23px] text-center pb-16 mt-4 text-gray-700">
        Unlock Your Business Potential with Our Standard Package for Lasting Success
      </h3>
      <div className="relative overflow-hidden border-2 border-yellow-600 rounded-lg shadow-xl bg-white">
        <div className="absolute top-2 right-8 px-3 py-1 bg-yellow-500 text-black transform rotate-45 translate-x-8 translate-y-6">
          Best Value
        </div>

        {/* Header Section */}
        <div className="text-center overflow-auto bg-gradient-to-tr from-yellow-300 to-yellow-700 text-white p-6">
          <h2 className="text-[29px] font-bold mb-2 max-w-[90%]">
            {title || "Ultimate Growth Package: A One-Time Investment for Lifelong Growth"}
          </h2>
          <p className="text-4xl font-bold mb-2">₹{price} Lakh</p>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="mb-4">
            <ReactQuill
              ref={quillRef}
              readOnly
              value={description}
              modules={{ toolbar: false }}
              theme="bubble"
              className="quill text-sm"
            />
          </div>

          <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 hover:bg-blue-50 p-2 rounded-lg transition-colors duration-200">
                <Check className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <Link to="/contact">
            <button className="w-full mt-8 bg-yellow-400 text-black py-3 px-6 rounded-lg font-semibold hover:bg-yellow-700 transition-colors duration-200 shadow-lg">
              Get Started Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PricingPackage;
