import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { Edit, Trash2, ArrowUp, ArrowDown, Plus, X } from 'lucide-react';
import { BsArrowReturnRight } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate();

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (itemToDelete) {
      await deleteCategory(itemToDelete);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const deleteCategory = async ({ id, categoryId, subCategoryId, subSubCategoryId }) => {
    let url = '';
    let itemType = 'Category';
    
    if (categoryId && subCategoryId && subSubCategoryId) {
      url = `/api/services/deletesubsubcategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}&subSubCategoryId=${subSubCategoryId}`;
      itemType = 'Sub-subcategory';
    } else if (categoryId && subCategoryId) {
      url = `/api/services/deletesubcategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}`;
      itemType = 'Subcategory';
    } else {
      url = `/api/services/deletecategory?id=${id}`;
      itemType = 'Category';
    }

    try {
      await axios.delete(url, { withCredentials: true });
      await fetchCategories();
      toast.success(`${itemType} deleted successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error(error);
      toast.error(`Failed to delete ${itemType.toLowerCase()}. Please try again.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

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
            onClick={() => navigate(`/ServiceCategory/editServiceCategory/${row.original.slug}`)}>
            {row.original.photo && <img src={`/api/logo/download/${row.original.photo}`} alt={row.original.alt} className="w-6 h-6" />}
            {row.original.category}
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.original.status === "active"}
            onChange={() => handleStatusChange(row.original.slug, row.original.status)}
          />
        ),
      },
      {
        Header: "Options",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            <button className="text-blue-500 hover:text-blue-700 transition">
              <Link to={`/ServiceCategory/editServiceCategory/${row.original.slug}`}>
                <Edit />
              </Link>
            </button>
            <button
              className="text-red-500 hover:text-red-700 transition"
              onClick={() => confirmDelete({ id: row.original.slug })}
            >
              <Trash2 />
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
      const response = await axios.get(`/api/services/getall`, { withCredentials: true });
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

  const handleStatusChange = async (slug, currentStatus, categoryId, subCategoryId) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    let url = '';

    if (categoryId && subCategoryId) {
      url = `/api/services/updatesubsubcategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}&subSubCategoryId=${slug}`;
    } else if (categoryId) {
      url = `/api/services/updateSubCategory?categoryId=${categoryId}&subCategoryId=${slug}`;
    } else {
      url = `/api/services/updateCategory?categoryId=${slug}`;
    }

    try {
      await axios.put(url, { status: newStatus }, { withCredentials: true });
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
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-700 font-serif uppercase">Categories</h1>
        <Link to="/ServiceCategory/CreateServiceCategory"><button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300">
         <Plus size={15} /></button></Link>
      </div>
      {loadings ? (
        <div className="flex justify-center"><UseAnimations animation={loading} size={56} /></div>
      ) : (
        <>{categories.length === 0 ? <div className="flex justify-center items-center"><iframe className="w-96 h-96" src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"></iframe></div>
          : <table className="w-full mt-4 border-collapse" {...getTableProps()}>
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
                                <ArrowDown />
                              ) : (
                                <ArrowUp />
                              )
                            ) : (
                              <ArrowDown className="text-gray-400" />
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
                  <React.Fragment key={row.id}>
                    <tr {...row.getRowProps()} className="border-b border-gray-300 hover:bg-gray-100 transition duration-150">
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()} className="py-2 px-4">
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                    {row.original.subCategories && row.original.subCategories.map((subcategory, subIndex) => (
                      <React.Fragment key={subIndex}>
                        <tr className="border-b border-gray-300 hover:bg-gray-100 transition duration-150">
                          <td></td>
                          <td className="py-2 px-8 flex gap-2 hover:text-blue-500 cursor-pointer" onClick={() => navigate(`/ServiceCategory/editServiceCategory/${row.original.slug}/${subcategory.slug}`)}><BsArrowReturnRight />{subcategory.photo && <img src={`/api/logo/download/${subcategory.photo}`} alt={subcategory.alt} className="w-6 h-6" />}<span>{subcategory.category}</span></td>
                          <td className="py-2 px-4">
                            <div className="relative group">
                              <input
                                type="checkbox"
                                checked={subcategory.status === "active"}
                                onChange={() => handleStatusChange(subcategory.slug, subcategory.status, row.original.slug)}
                                disabled={row.original.status !== "active"}
                                className={`${row.original.status !== "active" ? 'opacity-50 cursor-not-allowed' : ''}`}
                              />
                              {row.original.status !== "active" && (
                                <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -left-4 -top-8 whitespace-nowrap">
                                  Parent category is inactive
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-2 px-4">
                            <div className="flex gap-4">
                              <button className="text-blue-500 hover:text-blue-700 transition">
                                <Link to={`/ServiceCategory/editServiceCategory/${row.original.slug}/${subcategory.slug}`}>
                                  <Edit />
                                </Link>
                              </button>
                              <button
                                className="text-red-500 hover:text-red-700 transition"
                                onClick={() => confirmDelete({
                                  categoryId: row.original.slug,
                                  subCategoryId: subcategory.slug
                                })}
                              >
                                <Trash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {subcategory.subSubCategory && subcategory.subSubCategory.map((subSubcategory, subSubIndex) => (
                          <tr key={subSubIndex} className="border-b border-gray-300 hover:bg-gray-100 transition duration-150">
                            <td></td>
                            <td className="py-2 px-12 flex gap-2 hover:text-blue-500 cursor-pointer" onClick={() => navigate(`/ServiceCategory/editServiceCategory/${row.original.slug}/${subcategory.slug}/${subSubcategory.slug}`)}><BsArrowReturnRight />{subSubcategory.photo && <img alt={subSubcategory.alt} src={`/api/logo/download/${subSubcategory.photo}`} className="w-6 h-6" />}<span>{subSubcategory.category}</span></td>
                            <td className="py-2 px-4">
                              <div className="relative group">
                                <input
                                  type="checkbox"
                                  checked={subSubcategory.status === "active"}
                                  onChange={() => handleStatusChange(subSubcategory.slug, subSubcategory.status, row.original.slug, subcategory.slug)}
                                  disabled={row.original.status !== "active" || subcategory.status !== "active"}
                                  className={`${row.original.status !== "active" || subcategory.status !== "active" ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                                {(row.original.status !== "active" || subcategory.status !== "active") && (
                                  <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -left-4 -top-8 whitespace-nowrap">
                                    {row.original.status !== "active" ? 'Parent category is inactive' : 'Subcategory is inactive'}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-2 px-4">
                              <div className="flex gap-4">
                                <button className="text-blue-500 hover:text-blue-700 transition">
                                  <Link to={`/ServiceCategory/editServiceCategory/${row.original.slug}/${subcategory.slug}/${subSubcategory.slug}`}>
                                    <Edit />
                                  </Link>
                                </button>
                                <button
                                  className="text-red-500 hover:text-red-700 transition"
                                  onClick={() => confirmDelete({
                                    categoryId: row.original.slug,
                                    subCategoryId: subcategory.slug,
                                    subSubCategoryId: subSubcategory.slug
                                  })}
                                >
                                  <Trash2 />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        }
        </>

      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryTable;