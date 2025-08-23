import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { FaEdit, FaTrashAlt, FaArrowUp, FaArrowDown, FaPlus, FaEye, FaTimes } from "react-icons/fa";
import { BsArrowReturnRight } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";
import DeleteConfirmationModal from './DeleteConfirmationModal';

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
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
          <div
            className="flex items-center gap-2 hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/NewsCategory/editNewsCategory/${row.original._id}`)}
          >
            {row.original.photo && <img src={`/api/logo/download/${row.original.photo}`} alt={row.original.alt} className="w-6 h-6 object-cover rounded" />}
            {row.original.category}
          </div>
        ),
      },
      {
        Header: "Options",
        Cell: ({ row }) => (
          <div className="flex gap-2 sm:gap-4">
            <button className="text-blue-500 hover:text-blue-700 transition" onClick={() => handleView(row.original, 'category')}>
              <FaEye />
            </button>
            <button className="text-blue-500 hover:text-blue-700 transition">
              <Link to={`/NewsCategory/editNewsCategory/${row.original._id}`}>
                <FaEdit />
              </Link>
            </button>
            <button
              className="text-red-500 hover:text-red-700 transition"
              onClick={() => {
                setItemToDelete({ id: row.original._id, name: row.original.category, type: 'category' });
                setShowModal(true);
              }}
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
      const response = await axios.get(`/api/news/getall`, { withCredentials: true });
      const categoriesWithAutoIncrementId = response.data.map((category, index) => ({
        ...category,
        autoIncrementId: index + 1,
      }));
      setCategories(categoriesWithAutoIncrementId);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async ({ id, categoryId, subCategoryId, subSubCategoryId }) => {
    let url = '';
    if (categoryId && subCategoryId && subSubCategoryId) {
      url = `/api/news/deletesubsubcategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}&subSubCategoryId=${subSubCategoryId}`;
    } else if (categoryId && subCategoryId) {
      url = `/api/news/deletesubcategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}`;
    } else {
      url = `/api/news/deletecategory?id=${id}`;
    }

    try {
      await axios.delete(url, { withCredentials: true });
      fetchCategories();
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category.");
    } finally {
      setShowModal(false);
      setItemToDelete(null);
    }
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteCategory(itemToDelete);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setItemToDelete(null);
  };

  const handleView = (item, type) => {
    setSelectedItem({ ...item, type });
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8 overflow-x-auto">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-700 font-serif uppercase">Categories</h1>
        <Link to="/NewsCategory/CreateNewsCategory">
          <button className="mt-2 sm:mt-0 px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-900 transition duration-300 flex items-center gap-2 text-sm sm:text-base">
            <FaPlus size={15} />
            <span className="hidden sm:inline">Add Category</span>
          </button>
        </Link>
      </div>
      {loadings ? (
        <div className="flex justify-center"><UseAnimations animation={loading} size={56} /></div>
      ) : (
        <>
          {categories.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <iframe className="w-64 h-64 sm:w-96 sm:h-96" src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"></iframe>
            </div>
          ) : (
            <table className="w-full mt-4 border-collapse" {...getTableProps()}>
              <thead className="bg-slate-700 hover:bg-slate-800 text-white">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        className="py-2 px-2 sm:px-4 border-b border-gray-300 cursor-pointer uppercase font-serif text-sm sm:text-base"
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
                    <React.Fragment key={row.id}>
                      <tr {...row.getRowProps()} className="border-b border-gray-300 hover:bg-gray-100 transition duration-150">
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()} className="py-2 px-2 sm:px-4 text-sm sm:text-base">
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                      {row.original.subCategories && row.original.subCategories.map((subcategory, subIndex) => (
                        <React.Fragment key={subIndex}>
                          <tr className="border-b border-gray-300 hover:bg-gray-100 transition duration-150">
                            <td></td>
                            <td className="py-2 px-4 sm:px-8 flex gap-2 hover:text-blue-500 cursor-pointer" onClick={() => navigate(`/NewsCategory/editNewsCategory/${row.original._id}/${subcategory._id}`)}>
                              <BsArrowReturnRight />
                              {subcategory.photo && <img src={`/api/logo/download/${subcategory.photo}`} alt={subcategory.alt} className="w-6 h-6 object-cover rounded" />}
                              <span>{subcategory.category}</span>
                            </td>
                            <td className="py-2 px-2 sm:px-4">
                              <div className="flex gap-2 sm:gap-4">
                                <button className="text-blue-500 hover:text-blue-700 transition" onClick={() => handleView(subcategory, 'subcategory')}>
                                  <FaEye />
                                </button>
                                <button className="text-blue-500 hover:text-blue-700 transition">
                                  <Link to={`/NewsCategory/editNewsCategory/${row.original._id}/${subcategory._id}`}>
                                    <FaEdit />
                                  </Link>
                                </button>
                                <button
                                  className="text-red-500 hover:text-red-700 transition"
                                  onClick={() => {
                                    setItemToDelete({
                                      categoryId: row.original._id,
                                      subCategoryId: subcategory._id,
                                      name: subcategory.category,
                                      type: 'subcategory'
                                    });
                                    setShowModal(true);
                                  }}
                                >
                                  <FaTrashAlt />
                                </button>
                              </div>
                            </td>
                          </tr>
                          {subcategory.subSubCategory && subcategory.subSubCategory.map((subSubcategory, subSubIndex) => (
                            <tr key={subSubIndex} className="border-b border-gray-300 hover:bg-gray-100 transition duration-150">
                              <td></td>
                              <td className="py-2 px-6 sm:px-12 flex gap-2 hover:text-blue-500 cursor-pointer" onClick={() => navigate(`/NewsCategory/editNewsCategory/${row.original._id}/${subcategory._id}/${subSubcategory._id}`)}>
                                <BsArrowReturnRight />
                                {subSubcategory.photo && <img alt={subSubcategory.alt} src={`/api/logo/download/${subSubcategory.photo}`} className="w-6 h-6 object-cover rounded" />}
                                <span>{subSubcategory.category}</span>
                              </td>
                              <td className="py-2 px-2 sm:px-4">
                                <div className="flex gap-2 sm:gap-4">
                                  <button className="text-blue-500 hover:text-blue-700 transition" onClick={() => handleView(subSubcategory, 'subSubcategory')}>
                                    <FaEye />
                                  </button>
                                  <button className="text-blue-500 hover:text-blue-700 transition">
                                    <Link to={`/NewsCategory/editNewsCategory/${row.original._id}/${subcategory._id}/${subSubcategory._id}`}>
                                      <FaEdit />
                                    </Link>
                                  </button>
                                  <button
                                    className="text-red-500 hover:text-red-700 transition"
                                    onClick={() => {
                                      setItemToDelete({
                                        categoryId: row.original._id,
                                        subCategoryId: subcategory._id,
                                        subSubCategoryId: subSubcategory._id,
                                        name: subSubcategory.category,
                                        type: 'sub-subcategory'
                                      });
                                      setShowModal(true);
                                    }}
                                  >
                                    <FaTrashAlt />
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
      <DeleteConfirmationModal
        isOpen={showModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name || 'item'}
        itemType={itemToDelete?.type || 'item'}
      />
      {/* View Details Modal */}
      {viewModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full sm:max-w-lg md:max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 font-serif">
                {selectedItem.type === 'category' ? 'Category' : selectedItem.type === 'subcategory' ? 'Subcategory' : 'Sub-subcategory'} Details
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeViewModal}
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="space-y-4 text-sm sm:text-base">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <p className="font-semibold font-serif mr-2">Name:</p>
                <p>{selectedItem.category || 'N/A'}</p>
              </div>
              {selectedItem.photo && (
                <div className="flex flex-col">
                  <p className="font-semibold font-serif mr-2">Photo:</p>
                  <img
                    src={`/api/logo/download/${selectedItem.photo}`}
                    alt={selectedItem.alt || 'Category Image'}
                    className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-md mt-2"
                  />
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center">
                <p className="font-semibold font-serif mr-2">Alt Text:</p>
                <p>{selectedItem.alt || 'N/A'}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <p className="font-semibold font-serif mr-2">Slug:</p>
                <p>{selectedItem.slug || 'N/A'}</p>
              </div>
              {selectedItem.type === 'category' && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="font-semibold font-serif mr-2">Status:</p>
                    <p>{selectedItem.status || 'N/A'}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold font-serif mr-2">Subcategories:</p>
                    <p>{selectedItem.subCategories?.length > 0 ? selectedItem.subCategories.map(sc => sc.category).join(', ') : 'None'}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="font-semibold font-serif mr-2">Created At:</p>
                    <p>{selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString() : 'N/A'}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="font-semibold font-serif mr-2">Updated At:</p>
                    <p>{selectedItem.updatedAt ? new Date(selectedItem.updatedAt).toLocaleString() : 'N/A'}</p>
                  </div>
                </>
              )}
              {selectedItem.type === 'subcategory' && (
                <div className="flex flex-col">
                  <p className="font-semibold font-serif mr-2">Sub-subcategories:</p>
                  <p>{selectedItem.subSubCategory?.length > 0 ? selectedItem.subSubCategory.map(ssc => ssc.category).join(', ') : 'None'}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-900 transition duration-300 text-sm sm:text-base"
                onClick={closeViewModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryTable;