import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy } from "react-table";
import { FaTrashAlt, FaArrowUp, FaArrowDown } from "react-icons/fa";
import axios from "axios";
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewsletterTable = () => {
  const [emails, setEmails] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const notifyDelete = () => toast.success("Email deleted successfully!");

  // Fetch emails from the API
  const fetchEmails = async () => {
    setLoadingState(true);
    try {
      const response = await axios.get("/api/newsletter/getnewsletter", { withCredentials: true });
      setEmails(response.data);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setLoadingState(false);
    }
  };

  // Delete email by ID
  const deleteEmail = async (id) => {
    try {
      await axios.delete(`/api/newsletter/deletenewsletter?id=${id}`, { withCredentials: true });
      fetchEmails(); // Refresh list after deletion
      notifyDelete();
    } catch (error) {
      console.error("Error deleting email:", error);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  // Filter emails based on the search term
  const filteredEmails = useMemo(() => {
    return emails.filter((email) =>
      email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.name?.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by name as well
    );
  }, [emails, searchTerm]);

  // Define columns for react-table
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        id: "index",
        Cell: ({ row }) => row.index + 1, // Auto-increment index
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <button
            className="text-red-500 hover:text-red-700 transition"
            onClick={() => deleteEmail(row.original._id)}
          >
            <FaTrashAlt />
          </button>
        ),
        disableSortBy: true,
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data: filteredEmails },
    useSortBy
  );

  return (
    <div className="p-4 overflow-x-auto">
      <ToastContainer />
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-700 uppercase">Newsletter Subscribers</h1>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
        />
      </div>
      <h2 className="text-md font-semibold mb-4">Manage your subscribers</h2>
      {loadingState ? (
        <div className="flex justify-center">
          <UseAnimations animation={loading} size={56} />
        </div>
      ) : (
        <>
          {filteredEmails.length === 0 ? (
            <div className="flex justify-center items-center">
              <p>No subscribers found.</p>
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
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="hover:bg-gray-200">
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()} className="py-2 px-4 border-b border-gray-300">
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default NewsletterTable;
