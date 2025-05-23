import React from 'react';

// Utility to extract inner HTML of <h2> tag and preserve styling
const parseHeadingHtml = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  const h2 = div.querySelector("h2");
  if (h2) {
    // Return the inner HTML of the <h2> tag (includes <span>, <strong>, etc.)
    return h2.innerHTML;
  }
  // Fallback: return plain text if no <h2> tag is found
  return div.textContent || div.innerText || "";
};

const GlobalSolution = ({ globalData }) => {
  if (!globalData || globalData.length === 0) return null;

  const globalSolution = globalData[0]; // Assuming there's only one global solution entry

  // Extract inner HTML of the heading (e.g., <span> and <strong> tags)
  const headingContent = parseHeadingHtml(globalSolution.heading);

  return (
    <section className="relative bg-[#333] overflow-hidden pb-16 mt-5">
      {/* Shape Divider */}
      <div className="absolute inset-x-0 top-0 py-0">
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

      {/* Content Section */}
      <div className="relative sm:pt-32 pt-24">
        <div className="container mx-auto  sm:px-4 px-2 w-full sm:w-[67%]">
          <div className="text-center xl:mt-8">
            <h2
              className="sm:text-5xl text-3xl font-semibold mb-4 font-serif text-white ql-align-center"
              dangerouslySetInnerHTML={{ __html: headingContent }}
            />
            <p className="sm:text-lg text-base mb-8 text-white font-inter  pt-7">
              <span dangerouslySetInnerHTML={{ __html: globalSolution.description }} />
            </p>
          </div>

          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:mt-16 mt-24">
            {globalSolution.subsections?.map((language, index) => (
              <div key={index} className="text-center space-y-6">
                {language.photo ? (
                  <img
                    loading="lazy"
                    fetchPriority="high"
                    decoding="async"
                    src={language.photo}
                    alt={language.photoAlt}
                    title={language.imgtitle}
                    className="md:w-28 md:h-28 w-24 h-24 mx-auto mb-2"
                  />
                ) : (
                  <div className="md:w-28 md:h-28 w-24 h-24 mx-auto mb-2 bg-gray-200" />
                )}
                <h3 className="md:text-xl text-md text-base font-semibold font-inter text-white">
                  {language.title}
                </h3>
              </div>
            ))}
          </section>
        </div>
      </div>
    </section>
  );
};

export default GlobalSolution;