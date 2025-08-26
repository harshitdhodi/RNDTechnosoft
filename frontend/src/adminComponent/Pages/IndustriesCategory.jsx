import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { Edit, Trash2, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { BsArrowReturnRight } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

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
            onClick={() => navigate(`/IndustriesCategory/editIndustriesCategory/${row.original._id}`)}>
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
              <Link to={`/IndustriesCategory/editIndustriesCategory/${row.original._id}`}>
                <Edit />
              </Link>
            </button>
            <button
              className="text-red-500 hover:text-red-700 transition"
              onClick={() => {
                setDeleteTarget({ id: row.original._id, type: 'category', name: row.original.category });
                setShowConfirm(true);
              }}
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
      const response = await axios.get(`/api/industries/getall`, { withCredentials: true });
      const categoriesWithAutoIncrementId = response.data.map((category, index) => ({
        ...category,
        autoIncrementId: index + 1,
        subCategories: category.subCategories?.map(sub => ({
          ...sub,
          _id: sub._id || sub.id,
          subSubCategory: sub.subSubCategory?.map(subSub => ({
            ...subSub,
            _id: subSub._id || subSub.id,
          })) || [],
        })) || [],
      }));
      
      console.log("Processed categories:", categoriesWithAutoIncrementId);
      setCategories(categoriesWithAutoIncrementId);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async ({ id, categoryId, subCategoryId, subSubCategoryId }) => {
    if (!id && !categoryId && !subCategoryId && !subSubCategoryId) {
      toast.error("Invalid category ID");
      return;
    }

    let url = '';
    let deleteType = '';
    if (categoryId && subCategoryId && subSubCategoryId) {
      url = `/api/industries/deletesubsubcategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}&subSubCategoryId=${subSubCategoryId}`;
      deleteType = 'sub-subcategory';
      console.log("Deleting sub-subcategory:", { categoryId, subCategoryId, subSubCategoryId });
    } else if (categoryId && subCategoryId) {
      url = `/api/industries/deletesubcategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}`;
      deleteType = 'subcategory';
      console.log("Deleting subcategory:", { categoryId, subCategoryId });
    } else {
      url = `/api/industries/deletecategory?id=${id}`;
      deleteType = 'category';
      console.log("Deleting category:", { id });
    }

    try {
      const response = await axios.delete(url, { withCredentials: true });
      console.log("Delete response:", response.data);
      toast.success(`${deleteType.charAt(0).toUpperCase() + deleteType.slice(1)} deleted successfully!`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting:", error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Failed to delete ${deleteType}: ${errorMessage}`);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteCategory(deleteTarget);
      setShowConfirm(false);
      setDeleteTarget(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowConfirm(false);
    setDeleteTarget(null);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-4 overflow-x-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold font-serif mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the {deleteTarget?.type} "{deleteTarget?.name}"?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-700 font-serif uppercase">Categories</h1>
        <Link to="/IndustriesCategory/CreateIndustriesCategory">
          <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300">
            <Plus size={15} />
          </button>
        </Link>
      </div>
      {loadings ? (
        <div className="flex justify-center"><UseAnimations animation={loading} size={56} /></div>
      ) : (
        <>
          {categories.length === 0 ? (
            <div className="flex justify-center items-center">
              <iframe className="w-96 h-96" src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"></iframe>
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
                        <React.Fragment key={`sub-${subcategory._id || subIndex}`}>
                          <tr className="border-b border-gray-300 hover:bg-gray-100 transition duration-150">
                            <td></td>
                            <td className="py-2 px-8 flex gap-2 hover:text-blue-500 cursor-pointer"
                                onClick={() => navigate(`/IndustriesCategory/editIndustriesCategory/${row.original._id}/${subcategory.slug}`)}>
                              <BsArrowReturnRight />
                              {subcategory.photo && <img src={`/api/logo/download/${subcategory.photo}`} alt={subcategory.alt} className="w-6 h-6" />}
                              <span>{subcategory.category}</span>
                            </td>
                            <td className="py-2 px-4">
                              <div className="flex gap-4">
                                <button className="text-blue-500 hover:text-blue-700 transition">
                                  <Link to={`/IndustriesCategory/editIndustriesCategory/${row.original._id}/${subcategory.slug}`}>
                                    <Edit />
                                  </Link>
                                </button>
                                <button
                                  className="text-red-500 hover:text-red-700 transition"
                                  onClick={() => {
                                    if (!subcategory._id) {
                                      console.error("Subcategory _id is undefined:", subcategory);
                                      toast.error("Cannot delete: Subcategory ID is missing");
                                      return;
                                    }
                                    setDeleteTarget({
                                      categoryId: row.original._id,
                                      subCategoryId: subcategory._id,
                                      type: 'subcategory',
                                      name: subcategory.category
                                    });
                                    setShowConfirm(true);
                                  }}
                                >
                                  <Trash2 />
                                </button>
                              </div>
                            </td>
                          </tr>
                          {subcategory.subSubCategory && subcategory.subSubCategory.map((subSubcategory, subSubIndex) => (
                            <tr key={`subsub-${subSubcategory._id || subSubIndex}`} className="border-b border-gray-300 hover:bg-gray-100 transition duration-150">
                              <td></td>
                              <td className="py-2 px-12 flex gap-2 hover:text-blue-500 cursor-pointer"
                                  onClick={() => navigate(`/IndustriesCategory/editIndustriesCategory/${row.original._id}/${subcategory.slug}/${subSubcategory._id}`)}>
                                <BsArrowReturnRight />
                                {subSubcategory.photo && <img alt={subSubcategory.alt} src={`/api/logo/download/${subSubcategory.photo}`} className="w-6 h-6" />}
                                <span>{subSubcategory.category}</span>
                              </td>
                              <td className="py-2 px-4">
                                <div className="flex gap-4">
                                  <button className="text-blue-500 hover:text-blue-700 transition">
                                    <Link to={`/IndustriesCategory/editIndustriesCategory/${row.original._id}/${subcategory.slug}/${subSubcategory._id}`}>
                                      <Edit />
                                    </Link>
                                  </button>
                                  <button
                                    className="text-red-500 hover:text-red-700 transition"
                                    onClick={() => {
                                      if (!subSubcategory._id) {
                                        console.error("SubSubcategory _id is undefined:", subSubcategory);
                                        toast.error("Cannot delete: SubSubcategory ID is missing");
                                        return;
                                      }
                                      setDeleteTarget({
                                        categoryId: row.original._id,
                                        subCategoryId: subcategory._id,
                                        subSubCategoryId: subSubcategory._id,
                                        type: 'sub-subcategory',
                                        name: subSubcategory.category
                                      });
                                      setShowConfirm(true);
                                    }}
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
          )}
        </>
      )}
    </div>
  );
};

export default CategoryTable;