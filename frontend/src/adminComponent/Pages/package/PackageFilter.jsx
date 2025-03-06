import React from "react"
import { Link } from "react-router-dom"
import { FaPlus } from "react-icons/fa"

const PackageFilters = ({ metaFilter, setMetaFilter, searchTerm, setSearchTerm }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-700 font-serif uppercase">Packages</h1>
        <div className="flex gap-2">
          <select
            className="px-2 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
            value={metaFilter}
            onChange={(e) => setMetaFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Meta Available">Meta Available</option>
            <option value="Meta Unavailable">Meta Unavailable</option>
          </select>
          <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif">
            <Link to="/package/createPackage">
              <FaPlus size={15} />
            </Link>
          </button>
        </div>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
        />
      </div>
    </>
  )
}

export default PackageFilters