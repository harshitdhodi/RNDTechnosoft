import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Headphones, Handshake,  //Handshake
 ShoppingCart,  //ShoppingCart
 Flag,  //Flag
 Newspaper,  //Newspaper
 Users2,  //Users2
 MessageSquare,  //MessageSquare

} from 'lucide-react';

// Custom Bar Chart Component
const CustomBarChart = ({ data, categories, title }) => {
  const maxValue = Math.max(...data) * 1.2; // Add 20% padding at the top
  const chartWidth = 500;
  const chartHeight = 350;
  const padding = 40;
  const barWidth = (chartWidth - padding * 2) / data.length;
  
  const colors = ['#4299E1', '#48BB78', '#ECC94B'];
  
  return (
    <div className="custom-chart">
      <h3 className="text-center mb-2 font-semibold">{title}</h3>
      <svg width={chartWidth} height={chartHeight}>
        {/* Y-axis */}
        <line 
          x1={padding} 
          y1={padding} 
          x2={padding} 
          y2={chartHeight - padding} 
          stroke="#CBD5E0" 
          strokeWidth="1" 
        />
        
        {/* X-axis */}
        <line 
          x1={padding} 
          y1={chartHeight - padding} 
          x2={chartWidth - padding} 
          y2={chartHeight - padding} 
          stroke="#CBD5E0" 
          strokeWidth="1" 
        />
        
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
          const y = padding + (chartHeight - padding * 2) * (1 - tick);
          return (
            <React.Fragment key={i}>
              <line 
                x1={padding} 
                y1={y} 
                x2={chartWidth - padding} 
                y2={y} 
                stroke="#E2E8F0" 
                strokeWidth="1" 
                strokeDasharray="5,5" 
              />
              <text x={padding - 5} y={y + 5} textAnchor="end" fontSize="12" fill="#718096">
                {Math.round(maxValue * tick)}
              </text>
            </React.Fragment>
          );
        })}
        
        {/* Bars */}
        {data.map((value, i) => {
          const barHeight = (value / maxValue) * (chartHeight - padding * 2);
          const x = padding + i * barWidth + barWidth * 0.1;
          const y = chartHeight - padding - barHeight;
          
          return (
            <g key={i}>
              <rect 
                x={x} 
                y={y} 
                width={barWidth * 0.8} 
                height={barHeight} 
                fill={colors[i % colors.length]} 
                rx="3" 
                ry="3" 
              />
              <text 
                x={x + barWidth * 0.4} 
                y={y - 10} 
                textAnchor="middle" 
                fontSize="12" 
                fill="#4A5568"
              >
                {value}
              </text>
              <text 
                x={x + barWidth * 0.4} 
                y={chartHeight - padding + 20} 
                textAnchor="middle" 
                fontSize="12" 
                fill="#4A5568"
              >
                {categories[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Custom Pie Chart Component
const CustomPieChart = ({ data, labels, title }) => {
  const total = data.reduce((sum, val) => sum + val, 0);
  const chartSize = 350;
  const radius = 120;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;
  
  let startAngle = 0;
  const colors = ['#4299E1', '#48BB78', '#ECC94B', '#F56565', '#9F7AEA'];
  
  // Function to convert polar coordinates to cartesian
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };
  
  // Function to create SVG arc path
  const createArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "L", x, y,
      "Z"
    ].join(" ");
  };
  
  // Generate slices
  const slices = data.map((value, i) => {
    if (value === 0) return null;
    
    const percentage = (value / total) * 100;
    const angle = (value / total) * 360;
    const endAngle = startAngle + angle;
    
    // Calculate position for the label
    const labelAngle = startAngle + angle / 2;
    const labelRadius = radius * 0.7;
    const labelPos = polarToCartesian(centerX, centerY, labelRadius, labelAngle);
    
    // Calculate position for percentage and legend marker
    const legendX = chartSize - 120;
    const legendY = 50 + i * 30;
    
    const arc = createArc(centerX, centerY, radius, startAngle, endAngle);
    
    // Store the current end angle as the next start angle
    const currentStartAngle = startAngle;
    startAngle = endAngle;
    
    return (
      <g key={i}>
        {/* Pie slice */}
        <path d={arc} fill={colors[i % colors.length]} />
        
        {/* Percentage on slice */}
        {percentage > 5 && (
          <text 
            x={labelPos.x} 
            y={labelPos.y} 
            textAnchor="middle" 
            fontSize="14" 
            fontWeight="bold" 
            fill="white"
          >
            {Math.round(percentage)}%
          </text>
        )}
        
        {/* Legend */}
        <rect 
          x={legendX} 
          y={legendY - 10} 
          width="15" 
          height="15" 
          fill={colors[i % colors.length]} 
        />
        <text 
          x={legendX + 25} 
          y={legendY} 
          fontSize="12" 
          fill="#4A5568"
        >
          {labels[i]} ({value})
        </text>
      </g>
    );
  });
  
  return (
    <div className="custom-chart">
      <h3 className="text-center mb-2 font-semibold">{title}</h3>
      <svg width={chartSize} height={chartSize}>
        <g transform={`translate(${centerX}, ${centerY})`}>
          {/* Center circle for better aesthetics */}
          <circle cx="0" cy="0" r="5" fill="#CBD5E0" />
        </g>
        {slices}
      </svg>
    </div>
  );
};

const AdminDashboard = () => {
    const [countServices, setCountServices] = useState(0);
    const [countProducts, setCountProducts] = useState(0);
    const [countTestimonials, setTestimonials] = useState(0);
    const [countNews, setCountNews] = useState(0);
    const [countFaqs, setCountFaqs] = useState(0);
    const [countBanners, setCountBanners] = useState(0);
    const [countStaff, setCountStaff] = useState(0);
    const [countPartners, setCountPartners] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [countWithFields, setCountWithFields] = useState(0);
    const [countWithoutFields, setCountWithoutFields] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/services/countService', { withCredentials: true }).then(response => {
            setCountServices(response.data.total);
        }).catch(error => {
            console.log("Error fetching data", error);
        });

        axios.get('/api/product/countProduct', { withCredentials: true }).then(response => {
            setCountProducts(response.data.total);
        }).catch(error => {
            console.log("Error fetching data", error);
        });

        axios.get('/api/testimonial/countTestimonial', { withCredentials: true }).then(response => {
            setTestimonials(response.data.total);
        }).catch(error => {
            console.log("Error fetching data", error);
        });

        axios.get('/api/news/countNews', { withCredentials: true }).then(response => {
            setCountNews(response.data.total);
        }).catch(error => {
            console.log("Error fetching data", error);
        });

        axios.get('/api/faq/countFaq', { withCredentials: true }).then(response => {
            setCountFaqs(response.data.total);
        }).catch(error => {
            console.log("Error fetching data", error);
        });

        axios.get('/api/banner/countBanner', { withCredentials: true }).then(response => {
            setCountBanners(response.data.total);
        }).catch(error => {
            console.log("Error fetching data", error);
        });

        axios.get('/api/staff/countStaff', { withCredentials: true }).then(response => {
            setCountStaff(response.data.total);
        }).catch(error => {
            console.log("Error fetching data", error);
        });

    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/inquiries/getInquiries`, { withCredentials: true });
            const { totalCount, countWithFields, countWithoutFields } = response.data;

            setTotalCount(totalCount);
            setCountWithFields(countWithFields);
            setCountWithoutFields(countWithoutFields);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const chartData = [totalCount, countWithFields, countWithoutFields];
    const chartCategories = ['All', 'GPM', 'SEO'];

    return (
        <div className="flex flex-col flex-1 overflow-x-auto">
            <div className="p-4">
                <p className='font-bold uppercase'>Welcome to the Admin Panel Dashboard!</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {/* Box 1 */}
                    <div className="bg-blue-500 border border-gray-300 rounded p-4 text-white flex justify-around cursor-pointer" onClick={() => navigate("/services")}>
                        <div>
                            <h3 className="text-4xl font-bold mb-2">{countServices}</h3>
                            <p className='font-semibold'>Services</p>
                        </div>
                        <Headphones size={60} />
                    </div>

                    {/* Box 2 */}
                    <div className="bg-red-500 border border-gray-300 rounded p-4 text-white flex justify-around cursor-pointer" onClick={() => navigate("/product")}>
                        <div>
                            <h3 className="text-4xl font-bold mb-2">{countProducts}</h3>
                            <p className='font-semibold'>Products</p>
                        </div>
                        <ShoppingCart size={60} />
                    </div>

                    {/* Box 3 */}
                    <div className="bg-yellow-500 border border-gray-300 rounded p-4 text-white flex justify-around cursor-pointer" onClick={() => navigate("/testimonials")}>
                        <div>
                            <h3 className="text-4xl font-bold mb-2">{countTestimonials}</h3>
                            <p className='font-semibold'>Testimonials</p>
                        </div>
                        <MessageSquare size={60} />
                    </div>

                    {/* Box 4 */}
                    <div className="bg-green-500 border border-gray-300 rounded p-4 text-white flex justify-around cursor-pointer" onClick={() => navigate("/news")}>
                        <div>
                            <h3 className="text-4xl font-bold mb-2">{countNews}</h3>
                            <p className='font-semibold'>News</p>
                        </div>
                        <Newspaper size={60} />
                    </div>

                    {/* Box 5 */}
                    <div className="bg-indigo-500 border border-gray-300 rounded p-4 text-white flex justify-around cursor-pointer" onClick={() => navigate("/faq")}>
                        <div>
                            <h3 className="text-4xl font-bold mb-2">{countFaqs}</h3>
                            <p className='font-semibold'>FAQs</p>
                        </div>
                        <MessageSquare size={60} />
                    </div>

                    {/* Box 6 */}
                    <div className="bg-orange-500 border border-gray-300 rounded p-4 text-white flex justify-around cursor-pointer" onClick={() => navigate("/banner")}>
                        <div>
                            <h3 className="text-4xl font-bold mb-2">{countBanners}</h3>
                            <p className='font-semibold'>Banners</p>
                        </div>
                        <Flag size={60} />
                    </div>

                    {/* Box 7 */}
                    <div className="bg-pink-500 border border-gray-300 rounded p-4 text-white flex justify-around cursor-pointer" onClick={() => navigate("/ourTeam")}>
                        <div>
                            <h3 className="text-4xl font-bold mb-2">{countStaff}</h3>
                            <p className='font-semibold'>Our Team</p>
                        </div>
                        <Users2 size={60} />
                    </div>
                    
                   
                </div>
            </div>
            
            <h2 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Inquiries Overview</h2>
            
            {loading ? (
                <div className="flex justify-center items-center p-8">
                    <p>Loading charts...</p>
                </div>
            ) : (
                <div className='flex flex-col md:flex-row justify-center items-center'>
                    <div className="mt-8 m-2">
                        <CustomBarChart 
                            data={chartData} 
                            categories={chartCategories}
                            title="Inquiries by Type (Bar Chart)" 
                        />
                    </div>
                    <div className="mt-12">
                        <CustomPieChart 
                            data={chartData} 
                            labels={chartCategories}
                            title="Inquiries by Type (Pie Chart)" 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;