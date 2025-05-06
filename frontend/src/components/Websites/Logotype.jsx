import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Logotype() {
  const [logotypes, setLogotypes] = useState([]);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogotypes = async () => {
    try {
      const response = await axios.get("/api/logotype/getLogotype", {
        withCredentials: true,
      });
      setLogotypes(response.data.data);
    } catch (error) {
      setError("Failed to load logotypes.");
    }
  };

  const fetchHeadings = async () => {
    try {
      const response = await axios.get("/api/pageHeading/heading?pageType=logotype", {
        withCredentials: true,
      });
      const { heading, subheading } = response.data;
      setHeading(heading || "");
      setSubheading(subheading || "");
    } catch (error) {
      setError("Failed to load headings.");
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchLogotypes(), fetchHeadings()]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // show 3 slides by default
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024, // tablets
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // mobile
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="px-4 mb-16">
     <div className="md:w-3/2 lg:w-[60%] mt-10 flex flex-col items-center justify-center mx-auto mb-8">
     <h2 className="text-3xl md:text-4xl  font-serif mb-4 text-center">{heading}</h2>
     <p className="text-lg md:text-xl mb-8 text-gray-700 text-center">{subheading}</p>
     </div>

      <Slider {...settings}>
        {logotypes.map((card) => {
          const imageUrl = card.photo?.[0] ? `/api/image/download/${card.photo[0]}` : null;
          return (
            <div key={card._id} className="px-2">
              <div className=" p-4 flex flex-col items-center justify-center h-full">
             
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={card.alt?.[0] || card.title}
                    title={card.title}
                    className="w-full max-h-40 object-contain "
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <p className="text-gray-700">No image available</p>
                )}
                <p className="text-sm text-center mt-2" dangerouslySetInnerHTML={{ __html: card.description }}></p>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
