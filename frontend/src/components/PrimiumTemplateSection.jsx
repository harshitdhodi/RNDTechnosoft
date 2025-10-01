import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Utility to strip HTML tags
const stripHtml = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const PremiumTemplatesSection = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(
          `/api/content/types/premiumtemplates`,
          { withCredentials: true }
        );
        const contentData = response.data;

        if (contentData.length > 0) {
          setContent(contentData[0]);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent();
  }, []);

  if (!content) {
    return null; // or a loader/spinner component
  }

  // Strip HTML from heading
  const cleanHeading = stripHtml(content.heading);

  return (
    <section className="relative bg-[#f9f7f1] text-black mx-5 md:mx-4 xl:mx-32 p-5 my-16 sm:h-auto rounded-lg shadow-lg">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl mx-auto">
        <div className="w-full lg:w-[60%] p-4 sm:ml-10 sm:space-y-7">
          <div className="flex flex-col">
            <h2 className="lg:text-3xl xl:text-4xl md:text-3xl text-2xl font-bold mb-4 font-inter">
              {cleanHeading}
            </h2>
            <p
              className="text-base mb-8 font-inter"
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
            <div className="flex">
              <a
                target="_blank"
                href="https://codecanyon.net/user/rndtechnosoft/portfolio?sso=1&_gl=1*1x7xliu*_gcl_aw*R0NMLjE3Mjg5ODAzMDYuQ2owS0NRandnck80QmhDMkFSSXNBS1E3elVrdlNjNXJ1YVpfRTEyNkstNFoyZDd3RFRvNWVjSVdJMWRVbXltOTNCQlBnQ3otZXlYbldpd2FBalNnRUFMd193Y0I.*_gcl_au*MTkxMTIzNTE3MS4xNzI4OTExMjg1*_ga*NjI3NDIwNDc1LjE3Mjg5MTEyODU.*_ga_ZKBVC1X78F*MTczMDE3MjI0Ny4zLjEuMTczMDE3MjQxNy4xNi4wLjA.&_ga=2.201880597.585621995.1730172247-627420475.1728911285&_gac=1.186169947.1729055186.Cj0KCQjwgrO4BhC2ARIsAKQ7zUkvSc5ruaZ_E126K-4Z2d7wDTo5ecIWI1dUmym93BBPgCz-eyXnWiwaAjSgEALw_wcB"
              >
                <button className="inline-block px-6 py-3 bg-[#f3ca0d] text-white font-medium text-md rounded-md hover:text-black transition duration-300">
                  Buy Now
                </button>
              </a>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/4 hidden lg:flex items-end lg:justify-end">
          <img
            className="rounded-lg"
            src={`/api/image/download/${content.photo[0]}`}
            alt={content.photoAlt}
            title={content.imgtitle}
            loading="lazy"
            fetchpriority="low"
          />
        </div>
      </div>
    </section>
  );
};

export default PremiumTemplatesSection;