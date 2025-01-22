import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSlugToComponentMap } from '../utiles/RouteUtiles';
import * as PageComponents from './PageComponent';

const DynamicPage = () => {
  const { slug } = useParams();
  const [componentName, setComponentName] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the slug-to-component map on component mount
  useEffect(() => {
    const fetchComponentMap = async () => {
      try {
        const slugToComponentMap = await getSlugToComponentMap(); // Wait for the map to be fetched
        setComponentName(slugToComponentMap[slug]); // Set the component name based on slug
      } catch (error) {
        console.error('Error fetching component map:', error);
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };

    fetchComponentMap();
  }, [slug]);

  // Show a loading state while fetching the component map
  if (loading) {
    return null;
  }

  // Handle case when the slug does not match any component
  if (!componentName) {
    return null;
  }

  // Dynamically load the component based on the fetched component name
  const Component = PageComponents[componentName];

  // Handle case when the component is not found in PageComponents
  if (!Component) {
    return null;
  }

  // Render the component if everything is valid
  return <Component />;
};

export default DynamicPage;
