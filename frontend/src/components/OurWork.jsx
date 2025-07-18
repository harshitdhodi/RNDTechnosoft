import React, { useLayoutEffect, useRef, useEffect, useState } from 'react';
import Slider from 'react-slick';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const OurWorkComponent = ({ ourWorkData }) => {
  console.log('Our Work Data:', ourWorkData);

  const containerRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (ourWorkData && ourWorkData.length > 0) {
      const projectsData = ourWorkData.map(project => ({
        name: project.name,
        photo: project.photo, // Direct image URL
        link: `/${project.slug}`,
        alt: project.alt,
        imgtitle: project.imgtitle,
      }));

      setProjects(projectsData);
      setIsLoading(false);
    } else {
      setError('No projects found');
      setIsLoading(false);
    }
  }, [ourWorkData]);

  useLayoutEffect(() => {
    if (!containerRef.current || projects.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              entry.target,
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 1 }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const buttons = containerRef.current.querySelectorAll('.project-button');
    buttons.forEach((button) => observer.observe(button));

    return () => observer.disconnect();
  }, [projects]);

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
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

const ProjectCard = ({ project }) => {
  return (
    <Link
      to={project.link}
      className="relative flex justify-center items-end h-64 mx-3 overflow-hidden rounded-none"
    >
      <img
        src={`/api/logo/download/${project.photo}`}
        alt={project.alt || project.name}
        title={project.imgtitle}
        loading="preload"
        className="w-full h-full object-cover transition-transform duration-300 rounded-none"
      />
      <span className="project-button bg-white text-gray-950 font-semibold text-sm rounded-full py-2 px-6 shadow-lg hover:bg-gray-200 transition-all duration-300 absolute bottom-0 mb-12 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0">
        {project.name}
      </span>
    </Link>
  );
};

  if (isLoading) {
    return (
      <div className="w-full xl:px-28">
        <div className="flex justify-center gap-3">
          {Array(4).fill().map((_, i) => (
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
    <div className="relative z-20 py-16 w-[98%] mx-auto">
      <h2 className="text-4xl md:text-5xl text-center font-serif capitalize">
        See our <span className="text-yellow-500">work</span>
      </h2>
      <h3 className="text-xl md:text-2xl text-center text-gray-600 mt-4 mb-16">
        Visualizing Success Through Our Work
      </h3>

      <div className="w-full xl:px-28" ref={containerRef}>
        <Slider ref={sliderRef} {...settings}>
          {projects.map((project, index) => (
            <div key={project.name || index}>
              <ProjectCard project={project} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default OurWorkComponent;
