import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';
import { BiSolidDashboard, BiCategory } from "react-icons/bi";
import { FaServicestack, FaSitemap, FaHome, FaPhone, FaHandshake, FaCartPlus, FaShoppingCart, FaDatabase, FaGraduationCap, FaEnvelopeOpenText, FaCode, FaGoogle, FaListOl } from "react-icons/fa";
import { GiVerticalBanner, GiAchievement } from "react-icons/gi";
import { GrGallery, GrServices } from "react-icons/gr";
import { BsFillPersonLinesFill, BsFillBuildingsFill } from "react-icons/bs";
import { FaNewspaper, FaPager, FaPeopleGroup, FaBuildingUser, FaOpencart, FaBuildingCircleCheck, FaEarthAsia } from "react-icons/fa6";
import { RiQuestionAnswerFill, RiPagesFill, RiGalleryFill, RiWhatsappFill } from "react-icons/ri";
import { IoIosArrowDown, IoIosArrowForward, IoMdPricetags } from "react-icons/io";
import { TiMessages } from "react-icons/ti";
import { GoNumber, GoGoal } from "react-icons/go";
import { PiEyesFill, PiNewspaperClippingBold } from "react-icons/pi"
import { AiOutlineVerticalAlignBottom, AiOutlineVerticalAlignTop } from "react-icons/ai";
import { MdHighQuality } from "react-icons/md";
import { TbSeo } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";
import { FiPackage } from "react-icons/fi";
import { FaIndustry } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";

import axios from 'axios';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';


export default function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState({});
  const [logo, setLogo] = useState(""); // Default logo text
  const sidebarRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await axios.get('/api/logo/headercolor', { withCredentials: true });
        setLogo(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLogos();
  }, []);

  const sidebarData = [
    { title: "Dashboard", icon: <BiSolidDashboard size={20} />, path: "/dashboard" },
    {
      title: "Home", icon: <FaHome size={20} />, submenu: [
        { title: "Banner", icon: <GiVerticalBanner size={20} />, path: "/banner" },
        { title: "Hero Section", icon: <GiVerticalBanner size={20} />, path: "/homehero" },
        { title: "Animation", icon: <RiQuestionAnswerFill size={20} />, path: "/homeanimation" },

        { title: "Testimonials", icon: <FaPager size={20} />, path: "/testimonials" },
        { title: "Counter", icon: <GoNumber size={20} />, path: "/counter" },
        { title: "FAQ", icon: <RiQuestionAnswerFill size={20} />, path: "/faq" },
      ]
    },
    {
      title: "About us", icon: <BsFillPersonLinesFill size={20} />, submenu: [
        { title: "About Company", icon: <FaBuildingUser size={20} />, path: "/aboutcompany" },
        { title: "Mission & Vision", icon: <GoGoal size={20} />, path: "/missionandvision" },
        { title: "Core Value", icon: <IoMdPricetags size={20} />, path: "/corevalue" },
        { title: "Certificates", icon: <GiAchievement size={20} />, path: "/certificates" },
        { title: "Our Team", icon: <FaPeopleGroup size={20} />, path: "/ourTeam" },
      ]
    },
    {
      title: "Career", icon: <FaGraduationCap size={20} />, submenu: [
        { title: "Career Options", icon: <FaEnvelopeOpenText size={20} />, path: "/careeroption" },
        { title: "Career Inquiry", icon: <TiMessages size={20} />, path: "/careerinquiry" }
      ]
    },
    { title: "Hero Section Inquiry", icon: <TiMessages size={20} />, path: "/hero-inquiry" },
    { title: "Popup Inquiry", icon: <TiMessages size={20} />, path: "/popup-inquiry" },
    {
      title: "Services", icon: <FaServicestack size={20} />, submenu: [
        { title: "Categories", icon: <BiCategory size={20} />, path: "/ServiceCategory" },
        { title: "Services", icon: <GrServices size={20} />, path: "/services" },
        { title: "Logo Design Types", icon: <GrServices size={20} />, path: "/logotype" },
      ]
    },
    {
      title: "Industries", icon: <FaIndustry size={20} />, submenu: [
        { title: "Categories", icon: <BiCategory size={20} />, path: "/IndustriesCategory" },
        { title: "Industries", icon: <GrServices size={20} />, path: "/industries" },
        { title: "Card", icon: <GrServices size={20} />, path: "/Card" },
      ]
    },
    {
      title: "Packages", icon: <FiPackage size={20} />, submenu: [
        { title: "Categories", icon: <BiCategory size={20} />, path: "/PackageCategory" },
        { title: "Packages", icon: <GrServices size={20} />, path: "/package" },
      ]
    },

    {
      title: "Portfolio", icon: <FaImage size={20} />, submenu: [
        { title: "Categories", icon: <BiCategory size={20} />, path: "/PortfolioCategory" },
        { title: "Portfolio", icon: <GrServices size={20} />, path: "/portfolio" },
      ]
    },




    {
      title: "Contact Us", icon: <BiSolidDashboard size={20} />, submenu: [
        { title: "Contact Us", icon: <BiSolidDashboard size={20} />, path: "/contactinfo" },
        { title: "ContactUs Inquiries", icon: <BiSolidDashboard size={20} />, path: "/conatctinquiries" },
      ]
    },

    {
      title: "Products", icon: <FaShoppingCart size={20} />, submenu: [
        { title: "Categories", icon: <BiCategory size={20} />, path: "/ProductCategory" },
        { title: "Banefits", icon: <FaCartPlus size={20} />, path: "/benefits" },
        { title: "Products", icon: <FaOpencart size={20} />, path: "/product" },
      ]
    },
    { title: "Global Presence", icon: < FaEarthAsia size={20} />, path: "/globalpresence" },

    {
      title: "News/Blogs", icon: <FaNewspaper size={20} />, submenu: [
        { title: "Categories", icon: <BiCategory size={20} />, path: "/NewsCategory" },
        { title: "News/Blogs", icon: <PiNewspaperClippingBold size={20} />, path: "/news" },
      ]
    },

    { title: "Extra Pages", icon: <RiPagesFill size={20} />, path: "/extrapages" },
    { title: "News Letter", icon: <RiPagesFill size={20} />, path: "/newsletter" },
    {
      title: "SEO", icon: <TbSeo size={20} />, submenu: [
        { title: "Sitemap Generator", icon: <FaSitemap size={20} />, path: "/sitemap" },
        { title: "Meta Tags Settings", icon: <FaCode size={20} />, path: "/metadetails" },
        { title: "Google Tag Manager", icon: <FaGoogle size={20} />, path: "/googleSettings" },
        { title: "Inquiries", icon: <FaPhone size={20} />, path: "/Inquiry" },
      ]
    },
    {
      title: "Settings", icon: <IoSettings size={20} />, submenu: [
        { title: "Menu Listing", icon: <FaListOl size={20} />, path: "/menulisting" },
        { title: "Manage Section Visibility", icon: < FaEarthAsia size={20} />, path: "/managesectionvisibility" },
        { title: "Manage Theme", icon: <FaCode size={20} />, path: "/manageTheme" },
        { title: "Footer Settings", icon: <AiOutlineVerticalAlignBottom size={20} />, path: "/footer" },
        { title: "Header Settings", icon: <AiOutlineVerticalAlignTop size={20} />, path: "/header" },
        { title: "Manage Logo", icon: <FaPager size={20} />, path: "/manageLogo" },
        { title: "Whatsapp Settings", icon: <RiWhatsappFill size={20} />, path: "/whatsappSettings" },

        { title: "Database Management", icon: <FaDatabase size={20} />, path: "/DatabaseManagement" }
      ]
    }

  ];

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleSidebar = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSubMenu = (e, index) => {
    e.stopPropagation();
    setIsSubMenuOpen(prevState => {
      const newState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      return {
        ...newState,
        [index]: !prevState[index]
      };
    });
  };

  const toggleSubSubMenu = (e, index, subIndex) => {
    e.stopPropagation();
    setIsSubMenuOpen(prevState => ({
      ...prevState,
      [`${index}-${subIndex}`]: !prevState[`${index}-${subIndex}`]
    }));
  };

  return (
    <div className='flex w-full '>
      <div className=' bg-gray-700 h-screen'>
        <aside
          ref={sidebarRef}
          className={`bg-gray-700 fixed lg:relative z-10 h-full w-[14rem] md:w-[18rem] overflow-y-auto  ${isMenuOpen ? "translate-x-0 transform transition-transform duration-500" : "-translate-x-full lg:translate-x-0"
            }`}>
          <div className='font-bold text-white text-center pt-4 text-[20px] px-8'>

            <div>
              <img src={`/api/logo/download/${logo.photo}`} alt="Logo" className="w-full h-auto" />
            </div>

          </div>
          <div className='mt-4'>
            <ul>
              {sidebarData.map((item, i) => (
                <div key={i}>
                  <div>
                    <Link
                      to={item.path || "#"}
                      className={`text-white flex items-center gap-2 hover:bg-slate-800 py-2 pl-4 pr-8 hover:cursor-pointer ${location.pathname === item.path ? "bg-slate-800" : ""}`}
                      onClick={item.submenu && item.submenu.length > 0 ? (e) => toggleSubMenu(e, i) : undefined}
                    >
                      <p className='text-secondary'>{item.icon}</p>
                      <p className='text-secondary font-semibold'>{item.title}</p>
                      {item.submenu && item.submenu.length > 0 && (
                        <span className='ml-auto'>
                          {isSubMenuOpen[i] ? (
                            <IoIosArrowDown className='text-white' />
                          ) : (
                            <IoIosArrowForward className='text-white' />
                          )}
                        </span>
                      )}
                    </Link>
                    {item.submenu && item.submenu.length > 0 && isSubMenuOpen[i] &&
                      <ul>
                        {item.submenu.map((subItem, j) => (
                          <div key={j}>
                            <Link
                              to={subItem.path || "#"}
                              className={`text-white flex items-center gap-2 hover:bg-slate-800 py-2 pl-8 pr-4 hover:cursor-pointer ${location.pathname === subItem.path ? "bg-slate-800" : ""}`}
                              onClick={subItem.subsubmenu && subItem.subsubmenu.length > 0 ? (e) => toggleSubSubMenu(e, i, j) : undefined}
                            >
                              <p className='text-white'>{subItem.icon}</p>
                              <p className='text-gray-400 font-semibold'>{subItem.title}</p>
                              {subItem.subsubmenu && subItem.subsubmenu.length > 0 && (
                                <span className='ml-auto'>
                                  {isSubMenuOpen[`${i}-${j}`] ? (
                                    <IoIosArrowDown className='text-white' />
                                  ) : (
                                    <IoIosArrowForward className='text-white' />
                                  )}
                                </span>
                              )}
                            </Link>
                            {subItem.subsubmenu && subItem.subsubmenu.length > 0 && isSubMenuOpen[`${i}-${j}`] &&
                              <ul>
                                {subItem.subsubmenu.map((subSubItem, k) => (
                                  <Link
                                    key={k}
                                    to={subSubItem.path}
                                    className={`flex items-center gap-2 hover:bg-slate-800 py-2 pl-12 pr-16 hover:cursor-pointer ${location.pathname === subSubItem.path ? "bg-slate-800" : ""}`}
                                  >
                                    <p className='text-white'>{subSubItem.title}</p>
                                  </Link>
                                ))}
                              </ul>
                            }
                          </div>
                        ))}
                      </ul>
                    }
                  </div>
                </div>
              ))}
            </ul>
          </div>
        </aside>
      </div>
      <div className="flex flex-col h-screen w-full">
        <Navbar className="fixed w-full z-10 bg-white shadow" toggleSidebar={toggleSidebar} />
        <Breadcrumbs sidebarData={sidebarData} />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
