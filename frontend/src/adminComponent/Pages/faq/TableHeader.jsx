// components/TableHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from "react-icons/fa";

const TableHeader = ({ navigate }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-xl font-bold text-gray-700 font-serif uppercase">FAQs</h1>
      <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif">
        <Link to="/faq/createFAQ"><FaPlus size={15} /></Link>
      </button>
    </div>
  );
};

export default TableHeader;