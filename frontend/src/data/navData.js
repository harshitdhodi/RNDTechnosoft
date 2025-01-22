import axios from 'axios';

export const fetchNavData = async () => {
  try {
    const response = await axios.get('/api/navbar/categories');
    console.log(response.data.data); 
    return  response.data.data
    
  } catch (error) {
    console.error('Error fetching navigation data:', error);
    throw new Error('Failed to fetch navigation data.');
  }
};