import React, { useState, useEffect } from "react"
import { useTable, useSortBy } from "react-table"
import { FaEdit, FaTrashAlt, FaArrowUp, FaArrowDown } from "react-icons/fa"
import { Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import UseAnimations from "react-useanimations"
import loading from "react-useanimations/lib/loading"

const ManagePackageTable = () => {
  const [tables, setTables] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [tableName, setTableName] = useState("")
  
  const fetchTables = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("/api/packageTables", { withCredentials: true })
      setTables(response.data.data || [])
    } catch (error) {
      console.error("Error fetching package tables:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addTable = async () => {
    if (!tableName.trim()) {
      toast.error("Please enter a table name")
      return
    }
    
    try {
      await axios.post("/api/packageTables", { name: tableName }, { withCredentials: true })
      toast.success("Table added successfully!")
      setTableName("")
      fetchTables()
    } catch (error) {
      console.error("Error adding table:", error)
      toast.error("Failed to add table")
    }
  }

  const deleteTable = async (id) => {
    try {
      await axios.delete(`/api/packageTables/${id}`, { withCredentials: true })
      toast.success("Table deleted successfully!")
      fetchTables()
    } catch (error) {
      console.error("Error deleting table:", error)
      toast.error("Failed to delete table")
    }
  }

  useEffect(() => {
    fetchTables()
  }, [])

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Table Name",
        accessor: "name",
      },
      {
        Header: "Created At",
        accessor: "createdAt",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: "Options",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            <Link to={`/package/editTable/${row.original._id}`}>
              <FaEdit className="text-blue-500 hover:text-blue-700 transition" />
            </Link>
            <button
              className="text-red-500 hover:text-red-700 transition"
              onClick={() => deleteTable(row.original._id)}
            >
              <FaTrashAlt />
            </button>
          </div>
        ),
        disableSortBy: true,
      },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: tables,
    },
    useSortBy
  )

  return (
    <div className="mt-8 border border-gray-200 shadow-lg p-4 rounded">
      <h2 className="text-lg font-bold mb-4 text-gray-700 font-serif uppercase">
        Manage Package Tables
      </h2>
      
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="Enter table name"
          className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
        />
        <button
          onClick={addTable}
          className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif"
        >
          Add Table
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <UseAnimations animation={loading} size={56} />
        </div>
      ) : (
        <>
          {tables.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No package tables found. Add one to get started.
            </div>
          ) : (
            <table className="w-full mt-4 border-collapse" {...getTableProps()}>
              <thead className="bg-slate-700 hover:bg-slate-800 text-white">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        className="py-2 px-4 border-b border-gray-300 cursor-pointer uppercase font-serif"
                      >
                        <div className="flex items-center gap-2">
                          <span>{column.render("Header")}</span>
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
                        <td {...cell.getCellProps()} className="py-2 px-4">
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
    </div>
  )
}

export default ManagePackageTable