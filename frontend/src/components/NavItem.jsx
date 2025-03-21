import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

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

  const fontSize = depth === 0 ? "text-lg" : depth === 1 ? "text-base" : "text-sm";

  return (
    <li
      className={`relative ${depth === 0 ? "group" : ""} list-none`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={item.subItems && item.subItems.length > 0 && depth === 0 ? "#" : `/${item.slug}`}
        className={`flex justify-between items-center w-full ${fontSize} px-4 py-1 text-gray-800 
          ${depth === 0 ? "bg-white hover:bg-[#333] hover:text-white" : "bg-white hover:bg-[#333] hover:text-white"}
          whitespace-nowrap text-ellipsis transition-colors duration-300 ease-in-out`}
        onClick={handleClick}
      >
        {item.name}
        {item.subItems && item.subItems.length > 0 && (
          <span className="ml-2">{depth === 0 ? "" : <FaChevronRight size={12} />}</span>
        )}
      </Link>

      {item.subItems && item.subItems.length > 0 && (
        <ul
          className={`absolute ${
            depth === 0 ? "left-0 top-full w-max mt-2" : "left-full top-0 h-max w-max mt-2"
          } ${isHovered ? "block" : "hidden"} bg-white shadow-lg transition-all duration-300 ease-in-out
          ${depth === 0 ? "" : "-mt-1 ml-1"}`}
        >
          {item.subItems.map((subItem) => (
            <NavItem key={subItem.id} item={subItem} depth={depth + 1} closeMenu={closeMenu} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default NavItem;
