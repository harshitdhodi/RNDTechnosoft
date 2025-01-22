import React from "react";
import Wave2 from "../images/Wave2.svg";
import data from "../data/discover.json";

export default function DiscoverSolution() {
  return (
    <div>
      <div className="">
        <img
          src={Wave2}
          alt="background"
          className="w-full h-auto transform rotate-180"
        />
      </div>
      <div className="flex flex-col items-center justify-center text-center px-4 bg-[#F7F4EE]">
        <h2 className="text-5xl font-bold font-serif text-gray-800 mb-16 max-w-5xl">
          {data.title.split(data.highlightedText)[0]}
          <span className="text-orange-600">{data.highlightedText}</span>
          {data.title.split(data.highlightedText)[1]}
        </h2>
        <p className="text-xl text-justify text-gray-700 max-w-5xl">
          {data.description}
        </p>
      </div>
    </div>
  );
}
