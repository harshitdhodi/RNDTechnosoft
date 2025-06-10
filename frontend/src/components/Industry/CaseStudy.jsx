
import caseStudy from '../../images/case-study.png'; // Placeholder for the mobile screens image
const CaseStudy = () => {
  return (
    <>
      {/* Text Content */}
       <div className='max-w-6xl mx-auto text-center py-6  px-4'>
         <h2 className="text-4xl font-bold text-gray-900 mb-4">Case Studies</h2>
        <p className="text-lg text-gray-600 mb-6">
          Discover our case studies showcasing how we solve complex challenges across industries with innovative, tailored IT solutions
        </p>
       </div>
    <div className="flex mb-20  xl:px-28 max-w-8xl mx-auto  items-center justify-center  px-4 bg-white">
      {/* Placeholder for the mobile screens image */}
      

      <div className="w-full  md:pl-8 text-left">
        <div className="w-full gap-10 flex justify-center border-none items-center mb-8 md:mb-0">
      
         <img src={caseStudy} alt="" className='object-fill' />
       
       <div className='space-y-7'>
         <h3 className="text-2xl font-semibold w-[80%] text-gray-900 mb-4">
          Streamlining Kotak Bank’s Field Operations with a Secure and Dynamic Mobile App
        </h3>
        <p className="text-base text-gray-700 mb-2">
          <span className="font-bold">CLIENT DOMAIN:</span> Banking & Financial Services (BFSI) – Kotak Mahindra Bank
        </p>
        <p className="text-base text-gray-700 mb-2">
          <span className="font-bold">OPPORTUNITY:</span> Digitize and secure field operations for loan processing with a mobile-first approach.
        </p>
        <p className="text-base text-gray-700 mb-2">
          <span className="font-bold">SOLUTION:</span> Developed a secure, offline-capable mobile app with live sync, encrypted local storage, dynamic document handling, and watermarking features.
        </p>
        <p className="text-base text-gray-700">
          <span className="font-bold">RESULT:</span> Enhanced operational efficiency, data security, and agent productivity in field operations for loan onboarding across dynamic roles and locations.
        </p>
       </div>
      </div>
      </div>
    </div>
    </>
  );
};

export default CaseStudy;