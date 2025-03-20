import React, { useLayoutEffect, useRef, useEffect, useState } from 'react';
import Slider from 'react-slick';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const OurWorkComponent = () => {
  const containerRef = useRef(null);
  const sliderRef = useRef(null);
  const projectsRef = useRef([]); // Use ref to store projects without re-rendering

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/homepage/ourwork');
        let projectsData = response.data.map((project) => ({
          name: project.name,
          photoId: project.photo,
          link: `/${project.slug}`,
          alt: project.alt,
          imgtitle: project.imgtitle,
        }));

        // **🚀 Parallel fetching using `Promise.allSettled`**
        const imagePromises = projectsData.map((project) =>
          axios
            .get(`/api/logo/download/${project.photoId}`, { responseType: 'blob' })
            .then((res) => ({
              ...project,
              imageUrl: URL.createObjectURL(res.data),
            }))
            .catch(() => ({
              ...project,
              imageError: true,
            }))
        );

        const resolvedProjects = await Promise.allSettled(imagePromises);

        // Extract only fulfilled results
        projectsRef.current = resolvedProjects
          .filter((p) => p.status === 'fulfilled')
          .map((p) => p.value);

        setProjects([...projectsRef.current]);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to load projects');
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current || projects.length === 0) return;

    const buttons = containerRef.current.querySelectorAll('.project-button');

    buttons.forEach((button) => {
      gsap.fromTo(
        button,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, scrollTrigger: button }
      );
    });

    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, [projects]);

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    dots: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 4, dots: true } },
      { breakpoint: 1280, settings: { slidesToShow: 4, dots: true } },
      { breakpoint: 1024, settings: { slidesToShow: 3, dots: true } },
      { breakpoint: 768, settings: { slidesToShow: 2, dots: true } },
      { breakpoint: 640, settings: { slidesToShow: 1, dots: true } },
    ],
  };

  if (isLoading || projects.length === 0) {
    return (
      <div className="w-full xl:px-28">
        <div className="flex justify-center gap-3">
          {Array(4)
            .fill()
            .map((_, i) => (
              <div key={i} className="w-64 h-64 bg-gray-200 animate-pulse" />
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-gray-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="relative z-20 py-16 w-[90%] mx-auto">
      <h2 className="text-4xl md:text-5xl text-center font-serif capitalize">
        See our <span className="text-yellow-500">work</span>
      </h2>
      <h3 className="text-xl md:text-2xl text-center text-gray-600 mt-4 mb-16">
        Visualizing Success Through Our Work
      </h3>

      <div className="w-full xl:px-28" ref={containerRef}>
        <Slider ref={sliderRef} {...settings}>
          {projects.map((project) => (
            <div key={project.name}>
              <Link to={project.link} className="relative flex justify-center items-end h-64 mx-3 overflow-hidden group">
                {project.imageUrl ? (
                  <img
                  loading='lazy'
                  fetchPriority='eager'
                    src={project.imageUrl}
                    alt={project.alt || project.name}
                    title={project.imgtitle}
                    className="w-full h-full transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 animate-pulse" />
                )}
                <span className="project-button bg-white text-gray-950 font-semibold text-sm rounded-full 
                  py-2 px-6 shadow-lg hover:bg-gray-200 transition-all duration-300 absolute bottom-0 mb-12 
                  opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0">
                  {project.name}
                </span>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default OurWorkComponent;
