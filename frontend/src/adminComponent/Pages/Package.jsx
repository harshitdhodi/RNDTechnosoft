import React, { useMemo, useState, useEffect } from "react"
import { useTable, useSortBy } from "react-table"
import { FaEdit, FaTrashAlt, FaArrowUp, FaArrowDown, FaPlus } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import UseAnimations from "react-useanimations"
import loading from "react-useanimations/lib/loading"
import PackageDescription from "./PackageDescription"

const NewsTable = () => {
  const [heading, setHeading] = useState("")
  const [subheading, setSubheading] = useState("")
  const [packages, setPackages] = useState([])
  const [loadings, setLoading] = useState(true)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [metaFilter, setMetaFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [editingPrice, setEditingPrice] = useState(null)
  const [newPrice, setNewPrice] = useState("")
  const navigate = useNavigate()
  const pageSize = 20

  const filteredPackages = useMemo(() => {
    return packages
      .filter((packages) => {
        if (metaFilter === "Meta Available") {
          return (
            (packages.metatitle && packages.metatitle.length > 0) ||
            (packages.metadescription && packages.metadescription.length > 0)
          )
        }
        if (metaFilter === "Meta Unavailable") {
          return (
            !packages.metatitle ||
            packages.metatitle.length === 0 ||
            !packages.metadescription ||
            packages.metadescription.length === 0
          )
        }
        return true
      })
      .filter((packages) => packages.title.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [packages, searchTerm, metaFilter])

  const notify = (message) => {
    toast.success(message)
  }

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/package/editPackage/${row.original._id}`)}
          >
            {row.original.title}
          </span>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ row }) => (
          <button
            onClick={() => {
              setEditingPrice(row.original._id)
              setNewPrice(row.original.price)
            }}
            className="text-blue-500 hover:text-blue-700 transition"
          >
            {row.original.price}
          </button>
        ),
      },
      {
        Header: "Categories",
        accessor: "packageCategoryName",
        Cell: ({ row }) => <span>{row.original.packageCategoryName || "N/A"}</span>,
      },
      {
        Header: "Service Categories",
        accessor: "serviceCategoryName",
        Cell: ({ row }) => <span>{row.original.serviceCategoryName || "N/A"}</span>,
      },
      {
        Header: "Options",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            <Link to={`/package/editPackage/${row.original._id}`}>
              <FaEdit />
            </Link>
            <button
              className="text-red-500 hover:text-red-700 transition"
              onClick={() => deletePackage(row.original._id)}
            >
              <FaTrashAlt />
            </button>
          </div>
        ),
        disableSortBy: true,
      },
    ],
    [navigate],
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: filteredPackages,
    },
    useSortBy,
  )

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/packages?page=${pageIndex + 1}`, { withCredentials: true })
      const packagesWithIds = response.data.data.map((item, index) => ({
        ...item,
        id: pageIndex * pageSize + index + 1,
        categories: item.categories ? item.categories.join(", ") : "N/A",
        subcategories: item.subcategories ? item.subcategories.join(", ") : "N/A",
        subSubcategories: item.subSubcategories ? item.subSubcategories.join(", ") : "N/A",
        servicecategories: item.servicecategories ? item.servicecategories.join(", ") : "N/A",
        servicesubcategories: item.servicesubcategories ? item.servicesubcategories.join(", ") : "N/A",
        servicesubSubcategories: item.servicesubSubcategories ? item.servicesubSubcategories.join(", ") : "N/A",
      }))
      setPageCount(Math.ceil(response.data.total / pageSize))
      setPackages(packagesWithIds)
    } catch (error) {
      console.error("Error fetching packages:", error)
    } finally {
      setLoading(false)
    }
  }

  const deletePackage = async (id) => {
    try {
      await axios.delete(`/api/packages/delete?id=${id}`, { withCredentials: true })
      fetchData()
      notify("Package deleted successfully!")
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData(pageIndex)
  }, [pageIndex])

  const fetchHeadings = async () => {
    try {
      const response = await axios.get("/api/pageHeading/heading?pageType=package", { withCredentials: true })
      const { heading, subheading } = response.data
      setHeading(heading || "")
      setSubheading(subheading || "")
    } catch (error) {
      console.error(error)
    }
  }

  const saveHeadings = async () => {
    try {
      await axios.put(
        "/api/pageHeading/updateHeading?pageType=package",
        {
          pagetype: "news",
          heading,
          subheading,
        },
        { withCredentials: true },
      )
      notify("Headings updated successfully!")
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchHeadings()
  }, [])

  const handleHeadingChange = (e) => setHeading(e.target.value)
  const handleSubheadingChange = (e) => setSubheading(e.target.value)

  const updatePrice = async () => {
    try {
      await axios.put(
        `/api/packages/updatePackage/${editingPrice}`,
        {
          price: newPrice,
        },
        { withCredentials: true },
      )
      setEditingPrice(null)
      fetchData()
      notify("Price updated successfully!")
    } catch (error) {
      console.error("Error updating price:", error)
    }
  }

  return (
    <div className="p-4 overflow-x-auto">
      <ToastContainer />
      <div className="mb-8 border border-gray-200 shadow-lg p-4 rounded ">
        <div className="grid md:grid-cols-2 md:gap-2 grid-cols-1">
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Heading</label>
            <input
              type="text"
              value={heading}
              onChange={handleHeadingChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Sub heading</label>
            <input
              type="text"
              value={subheading}
              onChange={handleSubheadingChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
            />
          </div>
        </div>
        <button
          onClick={saveHeadings}
          className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif"
        >
          Save
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold  text-gray-700 font-serif uppercase"> Packages</h1>
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
      <h2 className="text-md font-semibold mb-4">Manage Package</h2>
      {loadings ? (
        <div className="flex justify-center">
          <UseAnimations animation={loading} size={56} />
        </div>
      ) : (
        <>
          {packages.length == 0 ? (
            <div className="flex justify-center items-center">
              <iframe
                className="w-96 h-96"
                src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"
              ></iframe>
            </div>
          ) : (
            <table className="w-full mt-4 border-collapse" {...getTableProps()}>
              <thead className="bg-slate-700 hover:bg-slate-800 text-white">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        className="py-2 px-4 border-b border-gray-300 cursor-pointer uppercase font-serif "
                      >
                        <div className="flex items-center gap-2">
                          <span className="">{column.render("Header")}</span>
                          {column.canSort && (
                            <span className="ml-1">
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <FaArrowDown />
                                ) : (
                                  <FaArrowUp />
                                )
                              ) : (
                                <FaArrowDown className="text-gray-400" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row)
                  return (
                    <tr
                      {...row.getRowProps()}
                      className="border-b border-gray-300 hover:bg-gray-100 transition duration-150"
                    >
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()} className="py-2 px-4 ">
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </>
      )}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setPageIndex(0)}
          disabled={pageIndex === 0}
          className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          {"<<"}
        </button>{" "}
        <button
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 0}
          className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          {"<"}
        </button>{" "}
        <button
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={pageIndex + 1 >= pageCount}
          className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          {">"}
        </button>{" "}
        <button
          onClick={() => setPageIndex(pageCount - 1)}
          disabled={pageIndex + 1 >= pageCount}
          className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageCount}
          </strong>{" "}
        </span>
      </div>
      <PackageDescription />

      {editingPrice &&
        (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Edit Price</h2>
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300 mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setEditingPrice(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-300 mr-2"
              >
                Cancel
              </button>
              <button
             
                onClick={updatePrice}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              >
                Update Price
              </button>
            </div>
          </div>
        </div>
        )}
    </div>
  )
}

export default NewsTable

