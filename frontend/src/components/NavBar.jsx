import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { fetchNavData } from "../data/navData";
import MobileNavbar from "./MobileMenuItems";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavItem from "./NavItem"; // Assuming NavItem is in a separate file

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navData, setNavData] = useState([]);
  const [technologyMenu, setTechnologyMenu] = useState(null); // State for technology data
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

  // Fetch logo data
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

  // Fetch navigation data
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
      } catch (error) {
        console.error("Error fetching navigation data:", error);
      }
    };
    fetchData();
  }, []);

  // Fetch technology data
  useEffect(() => {
    const fetchTechnologyData = async () => {
      try {
        const response = await axios.get('/api/technology');
        // Assuming the API returns data in the same structure as technologyMenu
        const technologyData = {
          id: "technology",
          name: "Technology",
          slug: "technology",
          subItems: response.data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            technologies: item.technologies || [], // Ensure technologies is an array
          })),
        };
        setTechnologyMenu(technologyData);
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
  if (technologyMenu && combinedNavItems.length >= 2) {
    combinedNavItems.splice(2, 0, technologyMenu); // Insert at index 2
  } else if (technologyMenu) {
    combinedNavItems.push(technologyMenu); // Append if fewer than 2 items
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
            {isLoading ? (
              <div>Loading...</div>
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