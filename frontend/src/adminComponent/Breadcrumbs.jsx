import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumbs = ({ sidebarData }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const isEditPage = location.pathname.includes('edit-') || location.pathname.includes('Edit');

  // Check for ServiceCategory edit pattern with optional subcategories
  const serviceEditMatch = location.pathname.match(/^\/ServiceCategory\/editServiceCategory\/(.+)$/);
  
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

  // Find ServiceCategory title from sidebar
  const getServiceCategoryTitle = () => {
    const serviceCategoryItem = findTitle('ServiceCategory');
    return serviceCategoryItem !== 'ServiceCategory' ? serviceCategoryItem : 'Service Category';
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

  const formatCategoryName = (categoryName) => {
    // Handle hyphenated category names like "graphic-designing"
    return categoryName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-');
  };

  // Handle ServiceCategory edit URLs with nested categories
  if (serviceEditMatch) {
    const remainingPath = serviceEditMatch[1];
    const categorySegments = remainingPath.split('/');
    const serviceCategoryTitle = getServiceCategoryTitle();
    
    return (
      <nav className="bg-gray-100 py-3 px-5">
        <ol className="flex">
          <li>
            <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <Link to="/ServiceCategory" className="text-blue-600 hover:underline">
              {serviceCategoryTitle}
            </Link>
          </li>
          {categorySegments.map((segment, index) => {
            // Skip if it's an ID (assuming IDs are 24-character hex strings or similar)
            if (isId(segment)) return null;
            
            const formattedName = formatCategoryName(segment);
            const isLast = index === categorySegments.length - 1;
            
            // Build the path up to this segment (excluding editServiceCategory)
            const segmentPath = `/ServiceCategory/${categorySegments.slice(0, index + 1).join('/')}`;
            
            return (
              <li key={`category-${index}`} className="flex items-center">
                <span className="mx-2">/</span>
                {isLast ? (
                  <span className="text-gray-700">{formattedName}</span>
                ) : (
                  <Link to={segmentPath} className="text-blue-600 hover:underline">
                    {formattedName}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  // Skip the last segment if it's an edit page
  const displayPathnames = isEditPage ? pathnames.slice(0, -1) : pathnames;

  return (
    <nav className="bg-gray-100 py-3 px-5">
      <ol className="flex">
        <li>
          <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
        </li>
        {displayPathnames.map((value, index) => {
          if (isId(value)) return null;

          const to = buildPath(index);
          const title = findTitle(value);
          
          // Skip Dashboard and certain paths
          if (title === "Dashboard") return null;
          if (index === displayPathnames.length - 1 &&
            ['data', 'products', 'service', 'new', 'product-category', 'news-category', 'service-category', 'edit'].includes(value.toLowerCase())) {
            return null;
          }
          
          const formattedTitle = addSpacesBeforeCaps(title || value);
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