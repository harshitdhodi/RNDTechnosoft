import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,  //LayoutDashboard
  LayoutGrid,  //Categories
  Map,
  Home,
  Phone,  //Phone
  ShoppingCart,  //ShoppingCart
  Database,  //Database
  GraduationCap,  //GraduationCap
  MailOpen,  //MailOpen
  Code,  //Code
  Globe,  //Globe
  ListOrdered,  //ListOrdered
  Flag,  //Flag
  Award,  //Award
  Wrench,  //Wrench
  Users,  //Users
  Newspaper,  //Newspaper
  Users2,  //Users2
  Building2,  //Building2
  Globe2,  //Globe2
  Image,
  MessageSquare,
  FileText,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Tags,
  MessagesSquare,
  Hash,
  Target,
  Newspaper as NewspaperClip,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Settings,
  Package,
  Headset,
  ChartColumn
} from 'lucide-react';

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
    { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    {
      title: "Home", icon: <Home size={20} />, submenu: [
        { title: "Banner", icon: <Flag size={20} />, path: "/banner" },
        { title: "Hero Section", icon: <Flag size={20} />, path: "/homehero" },
        { title: "Animation", icon: <MessageSquare size={20} />, path: "/homeanimation" },

        { title: "Testimonials", icon: <MessageSquare size={20} />, path: "/testimonials" },
        { title: "Counter", icon: <Hash size={20} />, path: "/counter" },
        { title: "FAQ", icon: <MessageSquare size={20} />, path: "/faq" },
      ]
    },
    {
      title: "About us", icon: <Users size={20} />, submenu: [
        { title: "About Company", icon: <Building2 size={20} />, path: "/aboutcompany" },
        { title: "Mission & Vision", icon: <Target size={20} />, path: "/missionandvision" },
        { title: "Core Value", icon: <Tags size={20} />, path: "/corevalue" },
        { title: "Certificates", icon: <Award size={20} />, path: "/certificates" },
        { title: "Our Team", icon: <Users2 size={20} />, path: "/ourTeam" },
      ]
    },
    {
      title: "Technology", icon: <GraduationCap size={20} />, submenu: [
        { title: "Technology Category Table", icon: <MessagesSquare size={20} />, path: "/tech-category" },
        { title: "Technology Category Form", icon: <MailOpen size={20} />, path: "/add-technology" },
        { title: "Edit Technology Category ", icon: <MailOpen size={20} />, path: "/edit-tech-category" },
        { title: "Technologies", icon: <MailOpen size={20} />, path: "/technology" },
        { title: "Add Technology data", icon: <MailOpen size={20} />, path: "/manage-tech-sec" },
        { title: "Technology Section data", icon: <MailOpen size={20} />, path: "/tech-sec-data" }

      ]
    },
    {
      title: "Career", icon: <GraduationCap size={20} />, submenu: [
        { title: "Career Options", icon: <MailOpen size={20} />, path: "/careeroption" },
        { title: "Career Inquiry", icon: <MessagesSquare size={20} />, path: "/careerinquiry" }
      ]
    },
    { title: "Hero Section Inquiry", icon: <MessagesSquare size={20} />, path: "/hero-inquiry" },
    { title: "Popup Inquiry", icon: <MessagesSquare size={20} />, path: "/popup-inquiry" },
    {
      title: "Services", icon: <Headset size={20} />, submenu: [
        { title: "Meta Info", icon: <LayoutGrid size={20} />, path: "/ServiceCategory" },
        { title: "Services", icon: <Wrench size={20} />, path: "/services" },
        { title: "Logo Design Types", icon: <Wrench size={20} />, path: "/logotype" },
        { title: "We Are Experts", icon: <Wrench size={20} />, path: "/we-are-expert" },
        { title: "Why Partner With Us", icon: <Wrench size={20} />, path: "/why-partner-us" },
        { title: "Testimonials", icon: <MessageSquare size={20} />, path: "/testimonials" },
        { title: "Get In Touch", icon: <Wrench size={20} />, path: "/edit-card" },
        { title: "FAQ", icon: <MessageSquare size={20} />, path: "/faq" },
      ]
    },
    {
      title: "Industries", icon: <Building2 size={20} />, submenu: [
        { title: "Categories", icon: <LayoutGrid size={20} />, path: "/IndustriesCategory" },
        { title: "Industries", icon: <Wrench size={20} />, path: "/industries" },
        { title: "Card", icon: <Wrench size={20} />, path: "/Card" },
      ]
    },
    {
      title: "Packages", icon: <Package size={20} />, submenu: [
        { title: "Categories", icon: <LayoutGrid size={20} />, path: "/PackageCategory" },
        { title: "Packages", icon: <Wrench size={20} />, path: "/package" },
        { title: "Testimonials", icon: <MessageSquare size={20} />, path: "/testimonials" },
        { title: "companies", icon: <Wrench size={20} />, path: "/company-category" },
        { title: "Get In Touch", icon: <Wrench size={20} />, path: "/edit-card" },
        { title: "Template Card", icon: <Wrench size={20} />, path: "/edit-template-card" },

        { title: "FAQ", icon: <MessageSquare size={20} />, path: "/faq" },
      ]
    },

    {
      title: "Portfolio", icon: <Image size={20} />, submenu: [
        { title: "Categories", icon: <LayoutGrid size={20} />, path: "/PortfolioCategory" },
        { title: "Portfolio", icon: <Wrench size={20} />, path: "/portfolio" },
      ]
    },




    {
      title: "Contact Us", icon: <LayoutDashboard size={20} />, submenu: [
        { title: "Contact Us", icon: <LayoutDashboard size={20} />, path: "/contactinfo" },
        { title: "ContactUs Inquiries", icon: <LayoutDashboard size={20} />, path: "/conatctinquiries" },
      ]
    },

    {
      title: "Products", icon: <ShoppingCart size={20} />, submenu: [
        { title: "Categories", icon: <LayoutGrid size={20} />, path: "/ProductCategory" },
        { title: "Banefits", icon: <ShoppingCart size={20} />, path: "/benefits" },
        { title: "Products", icon: <ChartColumn size={20} />, path: "/product" },
      ]
    },
    // { title: "Global Presence", icon: < Globe2 size={20} />, path: "/globalpresence" },

    {
      title: "News/Blogs", icon: <Newspaper size={20} />, submenu: [
        { title: "Categories", icon: <LayoutGrid size={20} />, path: "/NewsCategory" },
        { title: "News/Blogs", icon: <NewspaperClip size={20} />, path: "/news" },
      ]
    },

    { title: "Extra Pages", icon: <FileText size={20} />, path: "/extrapages" },
    { title: "News Letter", icon: <FileText size={20} />, path: "/newsletter" },
    {
      title: "SEO", icon: <BarChart3 size={20} />, submenu: [
        { title: "Sitemap Generator", icon: <Map size={20} />, path: "/sitemap" },
        // { title: "Meta Tags Settings", icon: <Code size={20} />, path: "/metadetails" },
        { title: "Static Page Meta", icon: <Code size={20} />, path: "/meta-table" },
        { title: "Google Tag Manager", icon: <Globe size={20} />, path: "/googleSettings" },
        { title: "Menu List", icon: <Code size={20} />, path: "/navbar-data" },

        { title: "Inquiries", icon: <Phone size={20} />, path: "/Inquiry" },
      ]
    },
    {
      title: "Job Applications", icon: <Newspaper size={20} />, submenu: [
        { title: "Application Request", icon: <LayoutGrid size={20} />, path: "/application-req" },
        // { title: "News/Blogs", icon: <NewspaperClip size={20} />, path: "/news" },
      ]
    },
    {
      title: "Settings", icon: <Settings size={20} />, submenu: [
        { title: "Menu Listing", icon: <ListOrdered size={20} />, path: "/menulisting" },
        { title: "Manage Section Visibility", icon: < Globe2 size={20} />, path: "/managesectionvisibility" },
        { title: "Manage Theme", icon: <Code size={20} />, path: "/manageTheme" },
        { title: "Footer Settings", icon: <ArrowDown size={20} />, path: "/footer" },
        { title: "Header Settings", icon: <ArrowUp size={20} />, path: "/header" },
        { title: "Manage Logo", icon: <MessageSquare size={20} />, path: "/manageLogo" },
        { title: "Whatsapp Settings", icon: <MessageCircle size={20} />, path: "/whatsappSettings" },

        { title: "Database Management", icon: <Database size={20} />, path: "/DatabaseManagement" }
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
                            <ChevronDown className='text-white' />
                          ) : (
                            <ChevronRight className='text-white' />
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
                                    <ChevronDown className='text-white' />
                                  ) : (
                                    <ChevronRight className='text-white' />
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
