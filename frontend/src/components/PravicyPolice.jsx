import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrivacyPolicysss = () => {
  const [policyData, setPolicyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('api/banner/front?section=PrivacyPolicy');
        setPolicyData(response.data.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch privacy policy data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return null;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-40">
      {policyData.map((item) => (
        <div key={item._id} className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{item.title}</h1>
          <div 
            className="text-lg text-gray-700"
            dangerouslySetInnerHTML={{ __html: item.details }}
          />
        </div>
      ))}
    </div>
  );
};

export default PrivacyPolicysss;