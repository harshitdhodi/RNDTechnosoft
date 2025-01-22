import axios from 'axios';

// Fetch nav data from API
export const fetchNavData = async () => {
  try {
    const response = await axios.get('/api/navbar/categories');
    console.log(response.data.data.data); // Log the fetched data for verification
    return response.data.data; // Return only the data array
  } catch (error) {
    console.error('Error fetching navigation data:', error);
    throw new Error('Failed to fetch navigation data.');
  }
};

// Flatten the nav data structure
export const flattenNavData = (items) => {
  if (!Array.isArray(items)) {
    console.error('Expected an array but received:', items);
    return {}; // Return an empty object if items is not an array
  }

  const flattened = {};

  const flatten = (item) => {
    if (!item.component) {
      console.warn(`Component not found for slug: ${item.slug}`);
      return;
    }
    flattened[item.slug] = item.component;
    if (item.subItems && Array.isArray(item.subItems)) {
      item.subItems.forEach(flatten); // Recursively flatten subItems if they exist
    }
  };

  items.forEach(flatten); // Flatten the top-level items
  return flattened;
};

// Function to get slug-to-component map
export const getSlugToComponentMap = async () => {
  try {
    const navData = await fetchNavData(); // Await the data from the API
    console.log('Nav Data:', navData.data); // Check if navData is the expected structure
    const slugToComponentMap = flattenNavData(navData.data); // Pass the data array directly to flattenNavData
    return slugToComponentMap;
  } catch (error) {
    console.error('Error processing slug-to-component map:', error);
    return {}; // Return an empty object in case of error
  }
};

// Example usage in an async context
getSlugToComponentMap().then((slugToComponentMap) => {
  console.log('Slug to Component Map:', slugToComponentMap);
});
