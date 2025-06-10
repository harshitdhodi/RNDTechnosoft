import React from 'react';
import image from "../../images/Rectangle.png";
import react from "../../images/technology/react.png";
const DedicatedTeam = () => {
  const cards = [
    { title: "FULL CONTROL OVER RESOURCES", description: "You have a committed team acts as an extension of your internal team, allowing you to fully control the team structure, workflows, and project direction." },
    { title: "FLEXIBLE SCALING", description: "Easily scale your development team up or down based on project demands without long-term commitments." },
    { title: "COST EFFICIENCY", description: "Reduce overhead costs with dedicated teams that offer excellent value without compromising on quality." },
    { title: "TIME-ZONE ADVANTAGE", description: "Work with teams that align with your business hours, ensuring real-time communication and faster turnaround." },
    { title: "ACCESS TO GLOBAL TALENT", description: "Tap into a pool of skilled developers with experience across a wide range of technologies and industries." },
    { title: "FOCUS ON CORE BUSINESS", description: "Let your in-house team focus on strategic goals while we handle the development heavy lifting." },
  ];

  return (
    <div className="relative py-16 min-h-screen">
      {/* Background image with overlay */}
     <div className="absolute inset-0  h-full">
                    <img
                        src={image}
                        alt="Background"
                        className="w-full h-full  object-fill"
                    />
                </div>

      {/* Foreground Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 text-black">
        {/* Header Section */}
        <div className="text-center max-w-5xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">
            WHY CHOOSE TO HIRE DEDICATED SOFTWARE DEVELOPMENT TEAM?
          </h1>
          <p className="text-lg max-w-3xl mx-auto text-black text-opacity-80">
            A dedicated software development team gives you the expertise, flexibility, and control—without the overhead.
            Scale faster, build better, and stay in control.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-6 max-w-8xl mx-auto">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-lg shadow-md border-t-4 border-yellow-400 text-black text-center"
            >
               <div className='flex flex-col justify-start items-start space-y-3'>
                 <img src={react} alt="" className='object-contain w-5 h-5'  />
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p className="text-gray-700 text-left">{card.description}</p>
               </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="text-center mt-12">
          <button className="bg-yellow-400 text-black font-medium py-3 px-16 rounded-md hover:bg-yellow-500 transition">
            Hire Us Now!
          </button>
        </div>
      </div>
    </div>
  );
};

export default DedicatedTeam;
