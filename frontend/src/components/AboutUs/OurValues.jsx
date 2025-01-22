import React, { useState, useEffect } from "react";
import axios from "axios";

const OurValues = () => {
  const [values, setValues] = useState([]);
  const [heroSection, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/corevalue/getCorevalue`, {
          withCredentials: true,
        });
        setValues(response.data.data); // Set the array of values
      } catch (error) {
        console.error("Error fetching core values:", error);
      }
    };

    const fetchHeadings = async () => {
      try {
        const response = await axios.get('/api/pageHeading/heading?pageType=corevalue', { withCredentials: true });
        const { heading, subheading } = response.data;
        setHeading(heading || '');
        setSubHeading(subheading || '');
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    fetchHeadings();
  }, []);

  return (
    <section className="relative bg-[#333] overflow-hidden">
      {/* Shape Divider */}
      <div className="absolute inset-x-0 top-0">
        <svg
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
        >
          <path
            className="fill-current text-white"
            d="M421.9,6.5c22.6-2.5,51.5,0.4,75.5,5.3c23.6,4.9,70.9,23.5,100.5,35.7c75.8,32.2,133.7,44.5,192.6,49.7c23.6,2.1,48.7,3.5,103.4-2.5c54.7-6,106.2-25.6,106.2-25.6V0H0v30.3c0,0,72,32.6,158.4,30.5c39.2-0.7,92.8-6.7,134-22.4c21.2-8.1,52.2-18.2,79.7-24.2C399.3,7.9,411.6,7.5,421.9,6.5z"
          />
        </svg>
      </div>

      <div className="bg-dark-green py-8 mt-8  md:mt-32 mx-4 sm:mx-8 lg:mx-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8">
            {heroSection}
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-xl font-bold text-white">
            {subHeading}
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row justify-around mb-20 md:mb-48 mx-4 sm:mx-8 lg:mx-20">
        <div className="flex flex-col gap-6 md:gap-8 w-full md:w-1/2">
          {values.map((value, index) => (
            <div key={value._id} className="bg-light-beige p-4 sm:p-6 rounded-lg bg-white">
              <div className="flex items-center gap-2 mb-4">
                <p className="py-2 px-4 bg-[#333] rounded-full text-white font-bold text-lg sm:text-xl">
                  {index + 1}
                </p>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#333]">
                  {value.title}
                </h3>
              </div>
              <p className="text-base text-justify text-dark-green">
                <div
                  dangerouslySetInnerHTML={{ __html: value.description }}
                />
              </p>
            </div>
          ))}
        </div>

        <div className=" md:flex justify-center items-center w-[20%]  mt-8 md:mt-0 hidden ">
          {values[0]?.photo.length > 0 ? (
            <img
              src={`/api/image/download/${values[0].photo[0]}`}
              alt={values[0]?.alt[0] || "Core Value Image"}
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src="default-image.png"
              alt="Default"
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </div>

      {/* Shape Divider Bottom */}
      <div className="absolute inset-x-0 bottom-0">
        <svg
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
        >
          <path
            className="fill-current text-white"
            d="M421.9,93.5c22.6,2.5,51.5-0.4,75.5-5.3c23.6-4.9,70.9-23.5,100.5-35.7c75.8-32.2,133.7-44.5,192.6-49.7c23.6-2.1,48.7-3.5,103.4,2.5c54.7,6,106.2,25.6,106.2,25.6V100H0V69.7c0,0,72-32.6,158.4-30.5c39.2,0.7,92.8,6.7,134,22.4c21.2,8.1,52.2,18.2,79.7,24.2C399.3,92.1,411.6,92.5,421.9,93.5z"
          />
        </svg>
      </div>
    </section>
  );
};

export default OurValues;
