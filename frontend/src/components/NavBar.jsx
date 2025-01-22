import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { fetchNavData } from "../data/navData";
import flames from "../images/flames.png";
// import rndlogo from "../images/rndlogo.png";
import MobileNavbar from "./MobileMenuItems";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// NavItem Component to handle different depths of the menu
const NavItem = ({ item, depth = 0, closeMenu }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState(null);

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsHovered(false);
    }, 200);
    setCloseTimeout(timeout);
  };

  const handleClick = () => {
    closeMenu();
    setIsHovered(false);
  };

  // Set different font sizes based on depth
  const fontSize =
    depth === 0 ? "text-lg" : depth === 1 ? "text-base " : "text-sm";

  return (
    <li
      className={`relative ${depth === 0 ? "group" : ""} list-none`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={
          item.subItems && item.subItems.length > 0 && depth === 0
            ? "#"
            : `/${item.slug}`
        }
        className={`flex justify-between items-center w-full ${fontSize} px-4 py-1 text-gray-800 
        ${
          depth === 0
            ? "bg-white hover:bg-[#333] hover:text-white"
            : "bg-white hover:bg-[#333] hover:text-white"
        }
        whitespace-nowrap text-ellipsis
        transition-colors duration-300 ease-in-out`}
        onClick={handleClick}
      >
        {item.name}
        {item.subItems && item.subItems.length > 0 && (
          <span className="ml-2">
            {depth === 0 ? "" : <FaChevronRight size={12} />}
          </span>
        )}
      </Link>

      {item.subItems && item.subItems.length > 0 && (
        <ul
          className={`absolute ${
            depth === 0
              ? "left-0 top-full w-max mt-2 "
              : "left-full top-0 h-max w-max mt-2"
          } 
          ${
            isHovered ? "block" : "hidden"
          } bg-white shadow-lg transition-all duration-300 ease-in-out
          ${depth === 0 ? "" : "-mt-1 ml-1"}`}
        >
          {item.subItems.map((subItem) => (
            <NavItem
              key={subItem.id}
              item={subItem}
              depth={depth + 1}
              closeMenu={closeMenu}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

// Navbar Component to render the navigation bar
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navData, setNavData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [colorlogo, setColorLogo] = useState([]);
  const navigate = useNavigate();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const fetchHeaderColorLogo = async () => {
      try {
        const response = await axios.get("/api/logo/headercolor");
        setColorLogo(response.data);
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
          console.error("Navigation data is not an array:", response);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching navigation data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full fixed z-30">
      <nav className="bg-white border-b border-gray-200 xl:mx-12 rounded-b-lg shadow-lg lg:block hidden">
        <div className="bg-[#333] text-white text-center py-1  justify-center font-semibold text-xl text-md xl:flex hidden">
          Our website is currently under construction. Please check back later.
        </div>

        <div className=" mx-20 flex justify-between items-center py-2">
          <div className="flex items-center space-x-8">
            <NavLink to="/">
              {/* <img src={rndlogo} alt="Logo" className="h-12" /> */}
              <img
                src={`/api/logo/download/${colorlogo.photo}`}
                alt={colorlogo.alt}
                title={colorlogo.imgTitle}
                className="h-18 w-[27%]"
              />
            </NavLink>
          </div>

          <div className="hidden lg:flex items-center space-x-2 relative ">
            {navData.map((link) => (
              <NavItem key={link.id} item={link} closeMenu={closeMenu} />
            ))}
          </div>

          <div className="lg:flex items-center space-x-4">
            <button onClick={() => navigate(`/contact`)}>
              <div className="flex justify-center font-semibold bg-[#f3ca0d] px-4 py-1 mb-2 lg:mb-0 text-black rounded hover:text-white items-center">
                <pre className="font-sans">Get Quote</pre>
              </div>
            </button>
          </div>
        </div>
      </nav>
      <MobileNavbar isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </div>
  );
};

export default Navbar;
