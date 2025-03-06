// components/Pagination.jsx
import React from 'react';

const Pagination = ({ pageIndex, setPageIndex, pageCount }) => {
  return (
    <div className="mt-4 flex justify-center">
      <button 
        onClick={() => setPageIndex(0)} 
        disabled={pageIndex === 0} 
        className="mr-2 px-3 py-1 bg-slate-700 rounded hover:bg-slate-900 transition text-white disabled:opacity-50"
      >
        {"<<"}
      </button>
      <button 
        onClick={() => setPageIndex(pageIndex - 1)} 
        disabled={pageIndex === 0} 
        className="mr-2 px-3 py-1 bg-slate-700 rounded hover:bg-slate-900 transition text-white disabled:opacity-50"
      >
        {"<"}
      </button>
      <button 
        onClick={() => setPageIndex(pageIndex + 1)} 
        disabled={pageIndex + 1 >= pageCount} 
        className="mr-2 px-3 py-1 bg-slate-700 rounded hover:bg-slate-900 transition text-white disabled:opacity-50"
      >
        {">"}
      </button>
      <button 
        onClick={() => setPageIndex(pageCount - 1)} 
        disabled={pageIndex + 1 >= pageCount} 
        className="mr-2 px-3 py-1 bg-slate-700 rounded hover:bg-slate-900 transition text-white disabled:opacity-50"
      >
        {">>"}
      </button>
      <span>
        Page{" "}
        <strong>
          {pageIndex + 1} of {pageCount}
        </strong>{" "}
      </span>
    </div>
  );
};

export default Pagination;