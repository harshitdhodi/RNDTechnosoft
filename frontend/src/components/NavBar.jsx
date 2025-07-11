
import { Link, NavLink, useLocation } from "react-router-dom";
import { fetchNavData } from "../data/navData";
import MobileNavbar from "./MobileMenuItems";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// NavItem Component (unchanged)
import { useState, useEffect, useRef } from 'react';


const NavItem = ({ item, depth = 0, closeMenu }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleTechnologyClick = (slug) => {
    navigate(`/technology/${slug}`);
    closeMenu();
    setIsHovered(false);
  };

  const fontSize =
    depth === 0 ? "text-lg" : depth === 1 ? "text-base" : "text-sm";

  const useTwoColumns = item.subItems && item.subItems.length > 15 && item.id !== "technology";
  const firstColumnItems = useTwoColumns
    ? item.subItems.slice(0, Math.ceil(item.subItems.length / 2))
    : item.subItems;
  const secondColumnItems = useTwoColumns
    ? item.subItems.slice(Math.ceil(item.subItems.length / 2))
    : [];

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
          ${depth === 0
            ? "bg-white hover:bg-[#333] hover:text-white focus:border-2 focus:border-white focus:bg-[#ffff] focus:text-black"
            : "bg-white hover:bg-[#333] hover:text-white focus:border-2 focus:border-white focus:bg-[#ffff] focus:text-white"
          }
          whitespace-nowrap text-ellipsis
          transition-colors duration-300 ease-in-out rounded-sm`}
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
          className={`absolute border   border-gray-200
            ${item.id === "technology" ? "-left-52" : ""}
            ${depth === 0 ? "left-0 top-full mt-2" : "left-full top-0 mt-2"}
            ${isHovered ? "block bg-white " : "hidden bg-white"}
            shadow-lg transition-all duration-300 rounded-md ease-in-out
            ${depth === 0 ? "" : "-mt-1 ml-1"}
          `}
        >
          {item.id === "technology" ? (
            <div className="grid grid-cols-2 gap-3  p-3 w-[700px]">
              {item.subItems.map((category) => (
                <div key={category.id} className="bg-gray-50 flex gap-5 rounded-lg pl-5 py-3 border border-gray-200">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img
                      src={category.icon || "https://via.placeholder.com/24"}
                      alt={category.name}
                      className={`${category.size === 'large' ? 'w-10 h-10' : 'w-6 h-6'} object-contain mb-2`}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{category.name}</h3>
                    <p className="text-sm text-gray-600 pb-2 leading-relaxed">{category.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      {category.technologies.map((tech) => (
                        <div
                          key={tech.name}
                          className="flex items-center space-x-2 transition-colors cursor-pointer hover:bg-gray-100 p-1 rounded"
                          onClick={() => handleTechnologyClick(tech.slug)}
                        >
                          <img
                            src={tech.icon || "https://via.placeholder.com/24"}
                            alt={tech.name}
                            className="w-5 h-5 object-contain flex-shrink-0"
                          />
                          <span className="text-sm text-gray-700 font-medium">{tech.name}</span>
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
                <ul className="w-max border-l border-gray-200">
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
  const [technologyMenu, setTechnologyMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [colorlogo, setColorLogo] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Fetch logo
  useEffect(() => {
    const fetchHeaderColorLogo = async () => {
      try {
        const response = await axios.get('/api/logo');
        const headerColorLogo = response.data.find(logo => logo.type === 'headerColor');
        if (headerColorLogo) {
          setColorLogo(headerColorLogo);
        }
      } catch (err) {
        console.log("Error fetching logo:", err);
      }
    };
    fetchHeaderColorLogo();
  }, []);

  // Fetch navigation data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchNavData();
        if (Array.isArray(response.data)) {

          setNavData(response.data);
        } else {
          console.error("Navigation data is not an array:", response);
        }
      } catch (error) {
        console.error("Error fetching navigation data:", error);
      }
    };
    fetchData();
  }, []);

  // Fetch technology menu data
  useEffect(() => {
    const fetchTechnologyData = async () => {
      try {
        setIsLoading(true);
        // Fetch categories
        const categoryResponse = await axios.get('/api/techCategory');
        const categories = categoryResponse.data.data;

        // Fetch technologies
        const technologyResponse = await axios.get('/api/technology');
        const technologies = technologyResponse.data.data;
        console.log("Technologies:", technologies);

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

  // Combine navData and technologyMenu, placing technologyMenu at index 2
  const combinedNavItems = [...navData];
  if (technologyMenu) {
    if (combinedNavItems.length >= 2) {
      combinedNavItems.splice(2, 0, technologyMenu); // Insert at index 2
    } else {
      combinedNavItems.push(technologyMenu);
    }
  }

  return (
    <div className="w-full fixed z-30">
      <nav className="bg-white border-b border-gray-200 xl:mx-12 rounded-b-lg shadow-lg lg:block hidden">
        <div className="bg-[#333] text-white text-center py-1 justify-center font-semibold text-xl text-md xl:flex hidden">
          Our website is currently under construction. Please check back later.
        </div>
        <div className="mx-20 flex justify-between items-center py-2">
          <div className="flex items-center space-x-8">
            <Link to="/" className="outline-none">
              <img
                src={colorlogo.photo ? `/api/logo/download/${colorlogo.photo}` : ''}
                alt={colorlogo.alt || 'Logo'}
                title={colorlogo.imgTitle || 'Logo'}
                className="
        h-8 w-auto
        sm:h-10 
        md:h-12 
        lg:h-14 lg:w-[35%] 
        xl:h-20 xl:w-[60%]
        2xl:h-12
        max-w-full
        object-contain
        transition-all duration-200
      "
                loading="lazy"
                fetchPriority="high"
              />
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-2 relative">
            {isLoading ? (
              <span>Loading...</span>
            ) : (
              combinedNavItems.map((link) => (
                <NavItem key={link.id} item={link} closeMenu={closeMenu} />
              ))
            )}
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