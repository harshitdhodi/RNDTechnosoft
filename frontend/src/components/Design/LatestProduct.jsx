import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoMdClose } from "react-icons/io";

export default function LatestProject({serviceSlug}) {
  const [latestProject, setProjects] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const imageRefs = useRef({});
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        const response = await axios.get(
          `/api/Portfolio/getPortfolioByServiceSlug?slug=${serviceSlug}`,
          { withCredentials: true }
        );
        if (response.data?.data) {
          setProjects(response.data.data);
        } else {
          setError("No projects found");
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
        setError("Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    };
  
    if (serviceSlug) {
      fetchData();
    }
  }, [serviceSlug]);
  

  const handleImageClick = (image) => {
    setFullscreenImage(image);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (isLoading) {
    return (
      // <div className="flex items-center justify-center min-h-[400px]">
      //   <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      // </div>
      null
    );
  }

 

  if (latestProject.length === 0) {
    return null;
  }

  const ProjectCard = ({ project, onClick }) => (
    <div className="relative cursor-pointer group">
      <img
        src={`/api/image/download/${project.photo[0]}`}
        alt={project.alt || "Project Image"}
        className="w-full h-96 object-cover rounded-lg shadow-xl border"
        loading="lazy"
      />
      <div
        onClick={() => onClick(project.photo[1] || project.photo[0])}
        className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-40 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300 ease-in-out"
      >
        <div className="text-center">
          <h3 className="text-white text-2xl font-semibold p-2">
            {project.imgtitle[0]}
          </h3>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="px-4 py-2 bg-[#f5e042] text-white rounded-lg hover:bg-[#e6d43d] transition-colors">
                Visit Website
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-16">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif p-4 text-center">
        Latest <span className="text-[#f3ca0d]">Projects</span>
      </h2>
      <p className="text-lg md:text-2xl px-4 md:px-20 text-gray-600 text-center">
        Discover Our Latest Project Milestones
      </p>

      <div className="mx-auto w-[85%] px-2 pt-20">
        {latestProject.length > 8 ? (
          <Slider {...settings}>
            {latestProject.map((project) => (
              <div key={project._id} className="px-2">
                <ProjectCard project={project} onClick={handleImageClick} />
              </div>
            ))}
          </Slider>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {latestProject.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onClick={handleImageClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-auto">
          <img
            src={`/api/image/download/${fullscreenImage}`}
            alt="Fullscreen view"
            className="w-full h-auto object-cover"
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl md:text-4xl p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75"
            onClick={closeFullscreen}
          >
            <IoMdClose />
          </button>
        </div>
      )}
    </div>
  );
}
