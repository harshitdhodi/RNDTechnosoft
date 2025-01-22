import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { FaEdit, FaTrashAlt, FaArrowUp, FaArrowDown, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";


const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loadings, setLoading] = useState(true);
  const navigate = useNavigate()

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "autoIncrementId",
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: ({ row }) => (
          <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/GalleryCategory/editGalleryCategory/${row.original._id}`)}>
            {row.original.photo && <img src={`/api/logo/download/${row.original.photo}`} alt={row.original.alt} className="w-6 h-6" />}
            {row.original.category}
          </div>
        ),
      },
      {
        Header: "Options",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            <button className="text-blue-500 hover:text-blue-700 transition">
              <Link to={`/GalleryCategory/editGalleryCategory/${row.original._id}`}>
                <FaEdit />
              </Link>
            </button>
            <button
              className="text-red-500 hover:text-red-700 transition"
              onClick={() => deleteCategory({ id: row.original._id })}
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: categories,
    },
    useSortBy
  );

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/gallery/getCategory`, { withCredentials: true });
      const categoriesWithAutoIncrementId = response.data.map((category, index) => ({
        ...category,
        autoIncrementId: index + 1,
      }));
      setCategories(categoriesWithAutoIncrementId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async ({ id }) => {
    const url = `/api/gallery/deleteCategory?id=${id}`;
    try {
      await axios.delete(url, { withCredentials: true });
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold  text-gray-700 font-serif uppercase">Categories</h1>
        <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300">
          <Link to="/GalleryCategory/CreateGalleryCategory"><FaPlus size={15} /></Link>
        </button>
      </div>
      {loadings ? (
       <div className="flex justify-center"><UseAnimations animation={loading} size={56} /></div>

      ) : (
        <>{categories.length == 0 ? <div className="flex justify-center items-center"><iframe className="w-96 h-96" src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"></iframe></div>
          :<table className="w-full mt-4 border-collapse" {...getTableProps()}>
          <thead className="bg-slate-700 hover:bg-slate-800 text-white">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="py-2 px-4 border-b border-gray-300 cursor-pointer uppercase font-serif"
                  >
                    <div className="flex items-center gap-2 ">
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
                <tr {...row.getRowProps()} className="border-b border-gray-300 hover:bg-gray-100 transition duration-150 ">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="py-2 px-4 ">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>}</>
        
      )}
    </div>
  );
};

export default CategoryTable;
