import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSlugToComponentMap } from '../utiles/RouteUtiles';
import * as PageComponents from './PageComponent';
import NotFoundPage from './404'; // Import the NotFoundPage component

const DynamicPage = () => {
  const { slug } = useParams();
  const [componentName, setComponentName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // List of slugs to exclude (e.g., sitemap pages)
  const excludedSlugs = [
    'sitemap.xml',
    'sitemap1.xml',
    'blog-sitemap.xml',
    'industrial-category-sitemap.xml',
    'industrial-subcategory-sitemap.xml',
    'package-category-sitemap.xml',
    'package-subcategory-sitemap.xml',
    'package-subsubcategory-sitemap.xml',
    'portfolio-category-sitemap.xml',
    'service-subcategories-sitemap.xml',
    'service-subsubcategories-sitemap.xml',
  ];

  // Fetch the slug-to-component map on component mount
  useEffect(() => {
    const fetchComponentMap = async () => {
      try {
        const slugToComponentMap = await getSlugToComponentMap(); // Wait for the map to be fetched
        setComponentName(slugToComponentMap[slug]); // Set the component name based on slug
      } catch (error) {
        console.error('Error fetching component map:', error);
        setError(true);
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };
    fetchComponentMap();
  }, [slug]);

  // Exclude specific slugs from rendering anything
  if (excludedSlugs.includes(slug)) {
    return null; // Render nothing for excluded slugs
  }

  // Show a loading state while fetching the component map
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Handle error case or when the slug does not match any component
  if (error || !componentName) {
    return <NotFoundPage />;
  }

  // Dynamically load the component based on the fetched component name
  const Component = PageComponents[componentName];

  // Handle case when the component is not found in PageComponents
  if (!Component) {
    return <NotFoundPage />;
  }

  // Render the component if everything is valid
  return <Component />;
};

export default DynamicPage;