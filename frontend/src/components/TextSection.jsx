import React, { forwardRef } from "react";

const TextSection = forwardRef(({ title, description, icon, className }, ref) => (
  <div ref={ref} className={className}>
    <h2 className="text-xl pb-6 text-orange-600">{title}</h2>
    <p className="mt-4 text-gray-700 text-xl text-justify">{description}</p>
    <div className="flex items-center gap-2">
      <div className="border border-red-300 shadow-md shadow-red-300 w-fit p-2 rounded-full">
        <div className="text-block-6 text-2xl">{icon}</div>
      </div>
    </div>
  </div>
));

export default TextSection;
