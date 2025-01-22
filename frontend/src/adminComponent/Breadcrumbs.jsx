import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumbs = ({ sidebarData }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const findTitle = (path) => {
    for (const item of sidebarData) {
      if (item.path && item.path.slice(1) === path) return item.title;
      if (item.submenu) {
        for (const subItem of item.submenu) {
          if (subItem.path && subItem.path.slice(1) === path) return subItem.title;
          if (subItem.submenu) {
            for (const subSubItem of subItem.submenu) {
              if (subSubItem.path && subSubItem.path.slice(1) === path) return subSubItem.title;
            }
          }
        }
      }
    }
    return path;
  };

  const isId = (segment) => {
    return /^[a-f\d]{24}$/i.test(segment); // Assuming IDs are 24-character hex strings
  };

  const buildPath = (index) => {
    let path = `/${pathnames.slice(0, index + 1).join('/')}`;
    if (index < pathnames.length - 1 && isId(pathnames[index + 1])) {
      path += `/${pathnames[index + 1]}`;
    }
    return path;
  };

  const addSpacesBeforeCaps = (str) => {
    if (!str) return '';
    // Add space before each capital letter
    const spacedStr = str.replace(/([A-Z])/g, ' $1').trim();
    return spacedStr.charAt(0).toUpperCase() + spacedStr.slice(1);
  };

  return (
    <nav className="bg-gray-100 py-3 px-5">
      <ol className="flex">
        <li>
          <Link to="/" className="text-blue-600 hover:underline">Dashboard</Link>
        </li>
        {pathnames.map((value, index) => {
          if (isId(value)) return null;

          const to = buildPath(index);
          const title = findTitle(value);
          if(title==="Dashboard") return null;
          if (index === pathnames.length - 1 &&
            ['data','products', 'service', 'new', 'product-category', 'news-category', 'service-category'].includes(value.toLowerCase())) {
          return null; 
        }
          const formattedTitle = addSpacesBeforeCaps(title ? title : value);
          return (
            <li key={to} className="flex items-center">
              <span className="mx-2">/</span>
              <Link to={to} className="text-blue-600 hover:underline">
                {formattedTitle}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
