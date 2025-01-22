import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { fetchNavData } from '../data/navData';
import { HiMenu, HiX } from 'react-icons/hi';
// import rndlogo from "../images/rndlogo.png";
import { IoIosArrowDroprightCircle, IoIosArrowDropdownCircle } from "react-icons/io";
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios'


const MobileNavItem = ({ item, depth = 0 }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
 

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };


 

  return (
    <li className={`list-none ${depth === 0 ? 'border-b border-gray-200' : ''}`}>
      <div className="flex justify-between items-center px-4 py-3 bg-[#333]">
        <Link to={item.subItems && item.subItems.length > 0 && depth === 0 ? '#' : `/${item.slug}`} className="text-white">
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
            className="bg-gray-100 overflow-hidden"
          >
            {item.subItems.map((subItem) => (
              <MobileNavItem key={subItem.id} item={subItem} depth={depth + 1} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navData, setNavData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [colorlogo, setColorLogo] = useState([]);

  useEffect(() => {
    const fetchHeaderColorLogo = async () => {
        try {
            const response = await axios.get('/api/logo/headercolor');
            setColorLogo(response.data || []);
        } catch (err) {
           console.log(err)
        }
    };

    fetchHeaderColorLogo();
}, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchNavData();
        if (Array.isArray(response.data)) {
          setNavData(response.data); // Accessing the `data` field from the response
        } else {
          console.error('Navigation data is not an array:', response);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching navigation data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="lg:hidden">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <NavLink to="/">
        <img src={`/api/logo/download/${colorlogo.photo}`} alt={colorlogo.alt} title={colorlogo.imgTitle} className="h-8" />
        </NavLink>
        <button onClick={toggleMenu}>
          {isMenuOpen ? <HiX className="text-gray-800 w-6 h-6" /> : <HiMenu className="text-gray-800 w-6 h-6" />}
        </button>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-b border-gray-200 overflow-hidden"
          >
            {navData.map((link) => (
              <MobileNavItem key={link.id} item={link} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNavbar;