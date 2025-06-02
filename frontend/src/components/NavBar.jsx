import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { fetchNavData } from "../data/navData";
import MobileNavbar from "./MobileMenuItems";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import react from "../images/technology/react.png";
import css from "../images/technology/css.png";
import flutter from "../images/technology/flutter.png";
import html from "../images/technology/html.png";
import js from "../images/technology/js.png";
import php from "../images/technology/php.png";
import next from "../images/technology/next.png";
import larawel from "../images/technology/larawel.png";
// NavItem Component (unchanged)
const NavItem = ({ item, depth = 0, closeMenu }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState(null);
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    setIsHovered(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsHovered(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    if (item.subItems && item.subItems.length > 0 && depth === 0) {
      return;
    }
  };

  const fontSize =
    depth === 0 ? "text-lg" : depth === 1 ? "text-base " : "text-sm";

  const useTwoColumns = item.subItems && item.subItems.length > 15 && item.id !== "technology";
  const firstColumnItems = useTwoColumns
    ? item.subItems.slice(0, Math.ceil(item.subItems.length / 2))
    : item.subItems;
  const secondColumnItems = useTwoColumns
    ? item.subItems.slice(Math.ceil(item.subItems.length / 2))
    : [];

  const techIcons = {
    "React JS": react,
    "Next JS": next,
    "CSS": css,
    "HTML":html,
    "JS": js,
    "Express JS": "https://via.placeholder.com/24?text=E",
    "PHP":php,
    "Laravel": larawel,
    "Flutter":flutter,
    "Android": "https://via.placeholder.com/24?text=A",
    "Java": "https://via.placeholder.com/24?text=J",
    "Shopify": "https://via.placeholder.com/24?text=S",
    "WooCommerce": "https://via.placeholder.com/24?text=W",
    "Magento": "https://via.placeholder.com/24?text=M",
    "Figma": "https://via.placeholder.com/24?text=FI",
    "Adobe XD": "https://via.placeholder.com/24?text=XD",
    "Sketch": "https://via.placeholder.com/24?text=SK",
  };

  return (
    <li
      className={`relative ${depth === 0 ? "group" : ""} list-none`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={menuRef}
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
      <div
  className={`absolute border
    ${item.id === "technology" ? "-left-32" : ""}
    ${depth === 0 ? "left-0 top-full mt-2" : "left-full top-0 mt-2"}
    ${isHovered ? "block border-red-500 bg-white" : "hidden bg-white"}
    shadow-lg transition-all duration-300 rounded-md ease-in-out
    ${depth === 0 ? "" : "-mt-1 ml-1"}
  `}
>
  {item.id === "technology" ? (
   <div className="grid grid-cols-2 gap-3 p-3  w-[700px]">
              {item.subItems.map((category) => (
                <div key={category.id} className="bg-gray-50 flex gap-5 rounded-lg px-4 py-2 border border-gray-200">
                  <div>
                    <img
                      src={react}
                      alt={category.name}
                      className="w-8 h-8 object-contain mb-2"   
                    />
                  </div>
                <div className="">
                    <h3 className="text-lg font-semibold text-gray-800 ">{category.name}</h3>
                  <p className="text-sm text-gray-600 pb-2 leading-relaxed">{category.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {category.technologies.map((tech) => (
                      <div key={tech} className="flex items-center space-x-2  transition-colors">
                        <img
                          src={techIcons[tech]}
                          alt={tech}
                          className="w-5 h-5 object-contain flex-shrink-0"
                        />
                        <span className="text-sm text-gray-700 font-medium">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex">
              <ul className="w-max">
                {firstColumnItems.map((subItem) => (
                  <NavItem
                    key={subItem.id}
                    item={subItem}
                    depth={depth + 1}
                    closeMenu={closeMenu}
                  />
                ))}
              </ul>
              {useTwoColumns && (
                <ul className="w-max border-l border-gray-100">
                  {secondColumnItems.map((subItem) => (
                    <NavItem
                      key={subItem.id}
                      item={subItem}
                      depth={depth + 1}
                      closeMenu={closeMenu}
                    />
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  );
};

// Navbar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navData, setNavData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [colorlogo, setColorLogo] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const technologyMenu = {
    id: "technology",
    name: "Technology",
    slug: "technology",
    subItems: [
      {
        id: "frontend",
        name: "Front-end Development",
        description: "Intuitive user experiences with cutting-edge front-end technologies",
        technologies: ["React JS", "Next JS", "CSS", "HTML"],
      },
      {
        id: "backend",
        name: "Back-end Development",
        description: "Our robust backend technologies are the engine driving your innovative & reliable platform",
        technologies: ["Node JS", "Express JS", "PHP", "Laravel"],
      },
      {
        id: "mobile",
        name: "Mobile App Development",
        description: "Our mobile app development technologies are the key to crafting user-friendly solutions",
        technologies: ["Flutter", "Android", "Java"],
      },
      {
        id: "ecommerce",
        name: "Ecommerce",
        description: "Experience seamless online shopping with our ecommerce technologies",
        technologies: ["Shopify", "WooCommerce", "Magento"],
      },
      {
        id: "uiux",
        name: "UI/UX",
        description: "Our UI/UX technologies are a true testament to how design is seamlessly blended functionality",
        technologies: ["Figma", "Adobe XD", "Sketch"],
      },
    ],
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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
          console.log("Navigation data fetched:", response.data);
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

  // Combine navData and technologyMenu, placing technologyMenu at index 2
  const combinedNavItems = [...navData];
  if (combinedNavItems.length >= 2) {
    combinedNavItems.splice(2, 0, technologyMenu); // Insert at index 2
  } else {
    // If navData has fewer than 2 items, append technologyMenu
    combinedNavItems.push(technologyMenu);
  }

  return (
    <div className="w-full fixed z-30">
      <nav className="bg-white border-b border-gray-200 xl:mx-12 rounded-b-lg shadow-lg lg:block hidden">
        <div className="bg-[#333] text-white text-center py-1 justify-center font-semibold text-xl text-md xl:flex hidden">
          Our website is currently under construction. Please check back later.
        </div>
        <div className="mx-20 flex justify-between items-center py-2">
          <div className="flex items-center space-x-8">
            <NavLink to="/">
              <img
                src={colorlogo.photo ? `/api/logo/download/${colorlogo.photo}` : ''}
                alt={colorlogo.alt || 'Logo'}
                title={colorlogo.imgTitle || 'Logo'}
                className="h-18 w-[27%]"
                loading="lazy"
                fetchPriority="high"
              />
            </NavLink>
          </div>

          <div className="hidden lg:flex items-center space-x-2 relative">
            {combinedNavItems.map((link) => (
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