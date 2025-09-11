import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { fetchNavData } from '../data/navData';
import { HiMenu, HiX } from 'react-icons/hi';
import { IoIosArrowDroprightCircle, IoIosArrowDropdownCircle } from "react-icons/io";
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

// TechnologyCategory component
const TechnologyCategory = ({ category, setIsOpen }) => {
  const [isOpen, setIsOpenLocal] = useState(false);

  return (
    <li className="list-none border-b border-gray-200">
      <div className="flex justify-between items-center px-4 py-3 bg-[#333]">
        <span className="text-white font-medium">{category.name}</span>
        <button onClick={() => setIsOpenLocal(!isOpen)}>
          {isOpen ? (
            <IoIosArrowDropdownCircle className="text-white w-6 h-6" />
          ) : (
            <IoIosArrowDroprightCircle className="text-white w-6 h-6" />
          )}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#333] overflow-hidden"
          >
            {category.technologies.map((tech) => (
              <li key={tech.name} className="border-b border-gray-600 last:border-b-0">
                <Link
                  to={`/technology/${tech.slug}`}
                  className="block px-6 py-3 text-white hover:bg-gray-600"
                  onClick={() => setIsOpen(false)}
                >
                  {tech.name}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

// MobileNavItem component
const MobileNavItem = ({ item, depth = 0, setIsOpen }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  return (
    <li className={`list-none ${depth === 0 ? 'border-b border-gray-200' : ''}`}>
      <div className="flex justify-between items-center px-4 py-3 bg-[#333]">
        <Link 
          to={item.subItems && item.subItems.length > 0 && depth === 0 ? '#' : `/${item.slug}`} 
          className="text-white"
          onClick={() => {
            if (!item.subItems || item.subItems.length === 0 || depth !== 0) {
              setIsOpen(false);
            }
          }}
        >
          {item.name}
        </Link>
        {item.subItems && item.subItems.length > 0 && (
          <button onClick={toggleSubMenu}>
            {isSubMenuOpen ? (
              <IoIosArrowDropdownCircle className="text-white w-6 h-6" />
            ) : (
              <IoIosArrowDroprightCircle className="text-white w-6 h-6" />
            )}
          </button>
        )}
      </div>
      <AnimatePresence>
        {item.subItems && item.subItems.length > 0 && isSubMenuOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#333] overflow-hidden"
          >
            {item.id === "technology" ? (
              item.subItems.map((category) => (
                <TechnologyCategory key={category.id} category={category} setIsOpen={setIsOpen} />
              ))
            ) : (
              item.subItems.map((subItem) => (
                <MobileNavItem key={subItem.id} item={subItem} depth={depth + 1} setIsOpen={setIsOpen} />
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

// MobileNavbar component
const MobileNavbar = ({ isOpen, setIsOpen }) => {
  const [navData, setNavData] = useState([]);
  const [technologyMenu, setTechnologyMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [colorlogo, setColorLogo] = useState([]);

  useEffect(() => {
    const fetchHeaderColorLogo = async () => {
      try {
        const response = await axios.get('/api/logo');
        const headerColorLogo = response.data.find(logo => logo.type === 'headerColor');
        if (headerColorLogo) {
          setColorLogo(headerColorLogo);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchHeaderColorLogo();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchNavData();
        if (Array.isArray(response.data)) {
          setNavData(response.data);
        } else {
          console.error('Navigation data is not an array:', response);
        }
      } catch (error) {
        console.error('Error fetching navigation data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchTechnologyData = async () => {
      try {
        setIsLoading(true);
        const categoryResponse = await axios.get('/api/techCategory');
        const categories = categoryResponse.data.data;

        const technologyResponse = await axios.get('/api/technology');
        const technologies = technologyResponse.data.data;

        const formattedTechnologyMenu = {
          id: "technology",
          name: "Technology",
          slug: "technology",
          subItems: categories.map((category) => ({
            id: category._id,
            name: category.heading,
            description: category.subheading,
            icon: category.photo ? `/api/logo/download/${category.photo}` : "https://via.placeholder.com/24",
            technologies: technologies
              .filter((tech) => tech.category && tech.category._id === category._id)
              .map((tech) => ({
                name: tech.imgTitle,
                icon: tech.photo ? `/api/logo/download/${tech.photo}` : "https://via.placeholder.com/24",
                slug: tech.slug
              })),
          })),
        };

        setTechnologyMenu(formattedTechnologyMenu);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching technology data:", error);
        setIsLoading(false);
      }
    };
    fetchTechnologyData();
  }, []);

  const combinedNavItems = [...navData];
  if (technologyMenu) {
    if (combinedNavItems.length >= 2) {
      combinedNavItems.splice(2, 0, technologyMenu);
    } else {
      combinedNavItems.push(technologyMenu);
    }
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="lg:hidden relative">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center z-50">
        <NavLink to="/">
          <img 
            src={colorlogo.photo ? `/api/logo/download/${colorlogo.photo}` : ''} 
            alt={colorlogo.alt || 'Logo'} 
            title={colorlogo.imgTitle || 'Logo'} 
            className="h-8" 
          />
        </NavLink>
        <button onClick={toggleMenu}>
          {isOpen ? <HiX className="text-gray-800 w-6 h-6" /> : <HiMenu className="text-gray-800 w-6 h-6" />}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay to dim background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-60"
              onClick={() => setIsOpen(false)}
            />
            {/* Mobile menu */}
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border-b border-gray-200 overflow-y-auto max-h-[70vh] absolute top-full left-0 right-0 z-70"
            >
              {isLoading ? (
                <li className="px-4 py-3 text-center">Loading...</li>
              ) : (
                combinedNavItems.map((link) => (
                  <MobileNavItem key={link.id} item={link} setIsOpen={setIsOpen} />
                ))
              )}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNavbar;