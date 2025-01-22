import React, { useLayoutEffect, useRef, useEffect, useState } from 'react';
import Slider from 'react-slick';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const OurWorkComponent = () => {
  const containerRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/homepage/ourwork', {
          signal: controller.signal
        });
        
        const projectsData = response.data.map(project => ({
          name: project.name,
          photoId: project.photo, // Store photo ID instead of fetching immediately
          link: `/${project.slug}`,
          alt: project.alt,
          imgtitle: project.imgtitle,
        }));
        
        setProjects(projectsData);
        setError(null);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching projects:', error);
          setError('Failed to load projects');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();

    return () => {
      controller.abort();
    };
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current || projects.length === 0) return;

    const ctx = gsap.context(() => {
      const buttons = containerRef.current.querySelectorAll('.project-button');

      buttons.forEach((button) => {
        gsap.fromTo(
          button, 
          { opacity: 0, y: 50 }, 
          { 
            opacity: 1, 
            y: 0,
            scrollTrigger: {
              trigger: button,
              start: "top 80%",
              end: "bottom 60%",
              scrub: 1,
              markers: false,
              once: true, // Animation plays only once
            }
          }
        );
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [projects]);

  // Cleanup ScrollTrigger on unmount
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
    dots:true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1536, // 2xl
        settings: {
          slidesToShow: 4,
          dots:true,
        },
      },
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: 4,
          dots:true,
        },
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: 3,
          dots:true,
        },
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: 2,
          dots:true,
        },
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 1,
          dots:true,
        },
      },
    ],
  };

  const ProjectCard = ({ project }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
      let isMounted = true;

      const loadImage = async () => {
        try {
          const response = await axios.get(`/api/logo/download/${project.photoId}`, {
            responseType: 'blob'
          });
          if (isMounted) {
            setImageUrl(URL.createObjectURL(response.data));
          }
        } catch (error) {
          if (isMounted) {
            console.error('Error loading image:', error);
            setImageError(true);
          }
        }
      };

      loadImage();

      return () => {
        isMounted = false;
        // Cleanup blob URL
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }
      };
    }, [project.photoId]);

    if (imageError) {
      return (
      null
      );
    }

    return (
      <Link 
        to={project.link}
        className="relative flex justify-center items-end h-64 mx-3 overflow-hidden group"
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={project.alt || project.name} 
            title={project.imgtitle} 
            className="w-full h-full transition-transform duration-300" 
            loading="lazy"
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
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent" />
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