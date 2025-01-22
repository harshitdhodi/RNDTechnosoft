import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import {
  FaEdit,
  FaTrashAlt,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";

const Companies = ({ categoryId ,subcategoryId}) => {
  const [companies, setCompanies] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [photoType, setPhotoType] = useState("company"); // Changed to "company"
  const navigate = useNavigate();

  const filteredCompanies = useMemo(() => {
    return companies.filter((item) =>
      item.alt.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [companies, searchTerm]);

  const notify = () => {
    toast.success("Updated Successfully!");
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Category",
        accessor: "categoryName",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/companies/edit/${row.original._id}`)}
          >
            {row.original.categoryName}
          </span>
        ),
      },
      {
        Header: "Images",
        accessor: "images",
        Cell: ({ value }) => (
          <img
            src={`/api/industryImages/download/${value}`}
            alt="Company"
            className="h-20 w-32 object-cover"
          />
        ),
        disableSortBy: true,
      },
      {
        Header: "Options",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            <Link
              to={`/industries/editImages/${categoryId}?id=${row.original._id}&photoType=${photoType}`}
            >
              <FaEdit />
            </Link>

            <button
              className="text-red-500 hover:text-red-700 transition"
              onClick={() => deleteCompany(row.original._id)}
            >
              <FaTrashAlt />
            </button>
          </div>
        ),
        disableSortBy: true,
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: filteredCompanies,
      },
      useSortBy
    );

  const fetchData = async (categoryId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/industryImages/getSubGallery?subcategoryId=${subcategoryId}&photoType=${photoType}`,
        { withCredentials: true }
      );
      const companiesWithIds = response.data.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
      setCompanies(companiesWithIds);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = async (id) => {
    try {
      await axios.delete(
        `/api/industryImages/deleteGallery?id=${id}`,
        { withCredentials: true }
      );
      fetchData(categoryId); // Refresh data after deletion
      notify(); // Notify the user about the update
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchData(categoryId);
    }
  }, [categoryId, photoType]); // Include photoType in dependencies

  return (
    <div className="p-4 overflow-x-auto">
      <ToastContainer />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-700 font-serif uppercase">
          Companies
        </h1>
        <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif">
          <Link
            to={`/industries/createImage/${categoryId}/${subcategoryId}?photoType=${photoType}`}
          >
            <FaPlus size={15} />
          </Link>
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by alt..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
        />
      </div>
      <h2 className="text-md font-semibold mb-4">Manage Companies</h2>
      {loadings ? (
        <div className="flex justify-center">
          <UseAnimations animation={loading} size={56} />
        </div>
      ) : (
        <>
          {companies.length === 0 ? (
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
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
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

export default Companies;
