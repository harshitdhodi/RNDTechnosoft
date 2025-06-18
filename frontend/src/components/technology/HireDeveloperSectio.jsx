import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { useParams } from "react-router-dom";

const HireDevelopersSection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/technologySecData/get/${slug}?type=hire developer`);

        const result = await response.json();
        console.log("Fetched data for slug:", result);
        setData(result[0]); // Assuming the API returns an array with one object
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Map API card data to the benefits structure
  const benefits = data?.card?.map((item) => ({
    title: item.heading, // Raw HTML string for dangerouslySetInnerHTML
    description: item.subHeading, // Raw HTML string for dangerouslySetInnerHTML
  })) || [];

  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-8xl 2xl:px-28 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <ReactQuill
              value={data?.heading || "Hire Dedicated <span class='text-yellow-500'>React JS Developers</span>"}
              readOnly={true}
              theme="bubble" // or "snow" for toolbar, "bubble" for display only
              modules={{ toolbar: false }}
              className="text-4xl md:text-xl  mb-6"
            />



            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Hire React JS Developer
            </button>
          </div>

          {/* Right Content - Benefits List */}
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                {/* Bullet Point */}
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>

                {/* Content */}
                <div>
                  <h3
                    className=" text-gray-800 mb-1"
                    dangerouslySetInnerHTML={{ __html: benefit.title }}
                  />
                  <p
                    className="text-gray-600 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: benefit.description }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HireDevelopersSection;