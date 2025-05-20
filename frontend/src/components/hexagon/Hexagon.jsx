import { useState } from 'react';

// Simple Hexagon component with styling
const Hexagon = ({ number, color }) => {
  return (
    <div className="relative">
      <div 
        className={`hexagon flex items-center justify-center text-white font-bold text-lg ${color}`}
        style={{
          width: '100px',
          height: '110px',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          margin: '0 auto'
        }}
      >
        {number}
      </div>
    </div>
  );
};

// Main component
export default function HexagonGrid() {
  const [count, setCount] = useState(39); // Default to show 39 hexagons
  
  // Generate array of hexagons
  const generateHexagons = (count) => {
    return Array.from({ length: count }, (_, i) => i + 1);
  };
  
  // Color mapping for hexagons
  const getHexagonColor = (index) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-pink-500'
    ];
    return colors[index % colors.length];
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    setCount(parseInt(e.target.value));
  };
  
  // Get hexagons based on current count
  const hexagons = generateHexagons(count);
  
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Responsive Hexagon Grid</h1>
      
      {/* Filter Controls */}
      <div className="mb-8 flex flex-wrap justify-center gap-4">
        <label className="font-semibold text-lg">Show hexagons:</label>
        <select 
          value={count} 
          onChange={handleFilterChange}
          className="border border-gray-300 rounded px-4 py-2 bg-white"
        >
          <option value="1">1 Hexagon</option>
          <option value="8">8 Hexagons</option>
          <option value="15">15 Hexagons</option>
          <option value="39">39 Hexagons (Default)</option>
        </select>
      </div>
      
      {/* Hexagon Grid Container with true honeycomb pattern */}
      <div className="flex flex-col items-center">
        {/* Create hexagon rows with proper offsets */}
        {[...Array(Math.ceil(hexagons.length / 7))].map((_, rowIndex) => {
          // Determine if this is an odd or even row for offset
          const isEvenRow = rowIndex % 2 === 0;
          // Calculate starting index for this row
          const startIdx = rowIndex * (isEvenRow ? 4 : 3);
          // Get hexagons for this row
          const rowHexagons = hexagons.slice(startIdx, startIdx + (isEvenRow ? 4 : 3));

          return (
            <div 
              key={rowIndex} 
              className="flex justify-center mb-2 relative" // Reduced mb-4 to mb-2
              style={{ 
                marginLeft: isEvenRow ? '0' : '0',
                marginTop: rowIndex === 0 ? '1rem' : '-1.9rem' // Increased overlap for less gap
              }}
            >
              {rowHexagons.map((num) => (
                <div key={num} className="mx-1"> {/* Reduced mx-2 to mx-1 */}
                  <Hexagon number={num} color={getHexagonColor(num)} />
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {/* Responsive layout explanation */}
      <div className="mt-12 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Responsive Design:</h2>
        <ul className="list-disc pl-5">
          <li className="mb-1">Large devices: 4 hexagons in the first row, 3 in the second row</li>
          <li className="mb-1">Medium devices: Maintains staggered pattern with adjusted spacing</li>
          <li className="mb-1">Small devices: Scales down proportionally</li>
        </ul>
      </div>
      
      {/* Add custom CSS for more advanced styling */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .hexagon {
            width: 70px !important;
            height: 77px !important;
          }
        }
        
        @media (max-width: 480px) {
          .hexagon {
            width: 50px !important;
            height: 55px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
}