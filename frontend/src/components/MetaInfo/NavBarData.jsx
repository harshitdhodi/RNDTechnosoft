import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { FaEdit ,FaTrashAlt ,FaArrowUp ,FaArrowDown,FaPlus } from "react-icons/fa";


import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";

const NavbarDataTable = () => {
  const [menuListings, setMenuListings] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate()

  const filteredMenuListings = useMemo(() => {
    return menuListings.filter((item) =>
      item.pagename.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [menuListings, searchTerm]);

  const columns = useMemo(
    () => [
      {
        Header: "Priority",
        accessor: "priority",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/edit-navbar-data/${row.original._id}`)}
          >
            {row.original.priority}
          </span>
        ),
      },
      {
        Header: "Page Name",
        accessor: "pagename",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/edit-navbar-data/${row.original._id}`)}
          >
            {row.original.pagename}
          </span>
        ),
      },
      {
        Header: "Options",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            <button className="text-blue-500 hover:text-blue-700 transition">
              <Link to={`/edit-navbar-data/${row.original._id}`}><FaEdit /></Link>
            </button>
            <button className="text-red-500 hover:text-red-700 transition" onClick={() => deleteMenuListing(row.original._id)}>
              <FaTrashAlt />
            </button>
          </div>
        ),
        disableSortBy: true,
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: filteredMenuListings,
    },
    useSortBy
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`
/api/navbar/getMenulisting`, { withCredentials: true });
      const menuListingsWithIds = response.data.menuListings.map((item, index) => ({
        ...item,
      }));
      setMenuListings(menuListingsWithIds);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMenuListing = async (id) => {
    try {
      const response = await axios.delete(`
/api/navbar/deleteMenulisting?id=${id}`, { withCredentials: true });

      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold  text-gray-700 font-serif uppercase">Menu Listings</h1>
        <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif">
          <Link to="/add-navbar-data"><FaPlus size={15} /></Link>
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by page name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none transition duration-300"
        />
      </div>
      <h2 className="text-md font-semibold mb-4">Manage Menu Listings</h2>
      {loadings ? (
        <div className="flex justify-center"><UseAnimations animation={loading} size={56} /></div>
      ) : (
        <>{menuListings.length == 0 ? <div className="flex justify-center items-center"><iframe className="w-96 h-96" src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"></iframe></div>
          : <table className="w-full mt-4 border-collapse" {...getTableProps()}>
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
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="border-b border-gray-300 hover:bg-gray-100 transition duration-150">
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
        }
        </>

      )}
    </div>
  );
};

export default NavbarDataTable;
