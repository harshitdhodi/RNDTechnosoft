import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { FaEdit, FaTrashAlt, FaCheck, FaEye, FaTimes, FaArrowUp, FaArrowDown, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { z } from "zod";

Modal.setAppElement('#root');

// Define Zod schema for heading and subheading validation
const headingSchema = z.object({
  heading: z.string()
    .min(1, "Heading is required")
    .max(100, "Heading must be 100 characters or less")
    .trim(),
  subheading: z.string()
    .min(1, "Subheading is required")
    .max(200, "Subheading must be 200 characters or less")
    .trim(),
});

const NewsTable = () => {
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [news, setNews] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [metaFilter, setMetaFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNews, setSelectedNews] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const navigate = useNavigate();
  const pageSize = 5;

  const filteredNews = useMemo(() => {
    return news.filter((newsItem) => {
      if (metaFilter === "Meta Available") {
        return (newsItem.metatitle && newsItem.metatitle.length > 0) || (newsItem.metadescription && newsItem.metadescription.length > 0);
      }
      if (metaFilter === "Meta Unavailable") {
        return !newsItem.metatitle || newsItem.metatitle.length === 0 || !newsItem.metadescription || newsItem.metadescription.length === 0;
      }
      return true;
    }).filter((newsItem) =>
      newsItem.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [news, searchTerm, metaFilter]);

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
            className="hover:text-blue-500 cursor-pointer truncate"
            onClick={() => navigate(`/news/editNews/${row.original.slug}`)}
          >
            {row.original.categoryName}
          </span>
        ),
      },
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 text-wrap cursor-pointer truncate"
            onClick={() => navigate(`/news/editNews/${row.original.slug}`)}
          >
            {row.original.title}
          </span>
        ),
      },
      {
        Header: "Photo",
        accessor: "photo",
        Cell: ({ value }) => {
          const firstImage = Array.isArray(value) && value.length > 0 ? value[0] : null;
          return firstImage ? <img src={`/api/image/download/${firstImage}`} alt="News" className="w-20 h-12 sm:w-32 sm:h-20 object-cover rounded" /> : null;
        },
        disableSortBy: true,
      },
      {
        Header: "Posted By",
        accessor: "postedBy",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer truncate"
            onClick={() => navigate(`/news/editNews/${row.original.slug}`)}
          >
            {row.original.postedBy}
          </span>
        ),
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer truncate"
            onClick={() => navigate(`/news/editNews/${row.original.slug}`)}
          >
            {row.original.date}
          </span>
        ),
      },
      {
        Header: "Visits",
        accessor: "visits",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer truncate"
            onClick={() => navigate(`/news/editNews/${row.original.slug}`)}
          >
            {row.original.visits}
          </span>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => value === "active" ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />,
        disableSortBy: true,
      },
      {
        Header: "Options",
        Cell: ({ row }) => (
          <div className="flex gap-2 sm:gap-4">
            <button className="text-blue-500 hover:text-blue-700 transition" onClick={() => handleView(row.original)}>
              <FaEye />
            </button>
            <button className="text-blue-500 hover:text-blue-700 transition">
              <Link to={`/news/editNews/${row.original.slug}`}><FaEdit /></Link>
            </button>
            <button
              className="text-red-500 hover:text-red-700 transition"
              onClick={() => {
                setNewsToDelete(row.original);
                setIsDeleteModalOpen(true);
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
      data: filteredNews,
    },
    useSortBy
  );

  const fetchData = async (pageIndex) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/news/getNews?page=${pageIndex + 1}`, { withCredentials: true });
      const newsWithIds = response.data.data.map((newsItem, index) => ({
        ...newsItem,
        id: pageIndex * pageSize + index + 1
      }));
      setNews(newsWithIds);
      setPageCount(Math.ceil(response.data.total / pageSize));
    } catch (error) {
      console.error(error);
      const statusCode = error.response?.status ? `(${error.response.status})` : '';
      toast.error(`Failed to fetch news ${statusCode}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (news) => {
    setSelectedNews(news);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  const handleDeleteConfirm = async () => {
    if (!newsToDelete) return;
    try {
      await axios.delete(`/api/news/deleteNews?slugs=${newsToDelete.slug}`, { withCredentials: true });
      toast.success(`News item "${newsToDelete.title}" deleted successfully!`);
      fetchData(pageIndex);
    } catch (error) {
      console.error(error);
      const statusCode = error.response?.status ? `(${error.response.status})` : '';
      toast.error(`Failed to delete news item ${statusCode}.`);
    } finally {
      setIsDeleteModalOpen(false);
      setNewsToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setNewsToDelete(null);
  };

  useEffect(() => {
    fetchData(pageIndex);
  }, [pageIndex]);

  // Reset pagination to first page when search term or filter changes
  useEffect(() => {
    setPageIndex(0);
  }, [searchTerm, metaFilter]);

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=blogs', { withCredentials: true });
      const { heading, subheading } = response.data;
      setHeading(heading || '');
      setSubheading(subheading || '');
    } catch (error) {
      console.error(error);
      const statusCode = error.response?.status ? `(${error.response.status})` : '';
      toast.error(`Failed to fetch headings ${statusCode}.`);
    }
  };

  const saveHeadings = async () => {
    try {
      // Validate inputs using Zod
      const validationResult = headingSchema.safeParse({ heading, subheading });
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => err.message).join(", ");
        toast.error(`Validation failed: ${errors}`);
        return;
      }

      await axios.put('/api/pageHeading/updateHeading?pageType=blogs', {
        pagetype: 'news',
        heading: validationResult.data.heading,
        subheading: validationResult.data.subheading,
      }, { withCredentials: true });
      notify();
    } catch (error) {
      console.error(error);
      const statusCode = error.response?.status ? `(${error.response.status})` : '';
      toast.error(`Failed to update headings ${statusCode}.`);
    }
  };

  useEffect(() => {
    fetchHeadings();
  }, []);

  const handleHeadingChange = (e) => setHeading(e.target.value);
  const handleSubheadingChange = (e) => setSubheading(e.target.value);

  return (
    <div className="p-4 sm:p-6 md:p-8 overflow-x-auto">
      <ToastContainer />
      <div className="mb-6 sm:mb-8 border border-gray-200 shadow-lg p-4 sm:p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif text-sm sm:text-base">Heading</label>
            <input
              type="text"
              value={heading}
              onChange={handleHeadingChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif text-sm sm:text-base">Sub heading</label>
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
          className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-900 transition duration-300 font-serif text-sm sm:text-base"
        >
          Save
        </button>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-700 font-serif uppercase">News</h1>
        <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
          <select
            className="px-2 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300 text-sm sm:text-base"
            value={metaFilter}
            onChange={(e) => setMetaFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Meta Available">Meta Available</option>
            <option value="Meta Unavailable">Meta Unavailable</option>
          </select> 
          <Link to="/news/createNews">
            <button className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-900 transition duration-300 font-serif flex items-center gap-2 text-sm sm:text-base"> 
              <FaPlus size={15} />
            </button>
          </Link>
        </div>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300 text-sm sm:text-base"
        />
      </div>
      <h2 className="text-md sm:text-lg font-semibold mb-4 font-serif">Manage News</h2>
      {loadings ? (
        <div className="flex justify-center"><UseAnimations animation={loading} size={56} /></div>
      ) : (
        <>
          {news.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <iframe className="w-64 h-64 sm:w-96 sm:h-96" src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"></iframe>
            </div>
          ) : (
            <table className="w-full mt-4 border-collapse" {...getTableProps()}>
              <thead className="bg-slate-700 hover:bg-slate-800 text-white">
                {headerGroups.map((headerGroup) => (
                  <tr key={headerGroup._id} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        key={column._id}
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
                    <tr key={row.id} {...row.getRowProps()} className="border-b border-gray-300 hover:bg-gray-100 transition duration-150">
                      {row.cells.map((cell) => (
                        <td key={cell.id} {...cell.getCellProps()} className="py-2 px-2 sm:px-4 text-sm sm:text-base">
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
      <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setPageIndex(0)}
            disabled={pageIndex === 0}
            className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400 transition disabled:opacity-50 text-sm sm:text-base"
          >
            {"<<"}
          </button>
          <button
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={pageIndex === 0}
            className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400 transition disabled:opacity-50 text-sm sm:text-base"
          >
            {"<"}
          </button>
          <button
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={pageIndex + 1 >= pageCount}
            className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400 transition disabled:opacity-50 text-sm sm:text-base"
          >
            {">"}
          </button>
          <button
            onClick={() => setPageIndex(pageCount - 1)}
            disabled={pageIndex + 1 >= pageCount}
            className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400 transition disabled:opacity-50 text-sm sm:text-base"
          >
            {">>"}
          </button>
        </div>
        <span className="text-sm sm:text-base">
          Page <strong>{pageIndex + 1} of {pageCount}</strong>
        </span>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="News Details"
        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4"
      >
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-lg md:max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-serif text-gray-800">News Details</h2>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <FaTimes size={20} />
            </button>
          </div>
          {selectedNews && (
            <div className="space-y-4 text-sm sm:text-base">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <p className="font-semibold font-serif mr-2">Category:</p>
                <p>{selectedNews.categoryName || 'N/A'}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <p className="font-semibold font-serif mr-2">Title:</p>
                <p>{selectedNews.title || 'N/A'}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold font-serif">Description:</p>
                <ReactQuill
                  readOnly={true}
                  value={selectedNews.details || ''}
                  modules={{ toolbar: false }}
                  theme="bubble"
                  className="quill"
                />
              </div>
              <div className="flex flex-col">
                <p className="font-semibold font-serif">Photos:</p>
                {selectedNews.photo && Array.isArray(selectedNews.photo) && selectedNews.photo.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {selectedNews.photo.map((image, index) => (
                      <img
                        key={index}
                        src={`/api/image/download/${image}`}
                        alt={selectedNews.alt?.[index] || `News Image ${index + 1}`}
                        className="w-full h-32 sm:h-40 object-cover rounded-md"
                      />
                    ))}
                  </div>
                ) : (
                  <p>No photos available</p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <p className="font-semibold font-serif mr-2">Posted By:</p>
                <p>{selectedNews.postedBy || 'N/A'}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <p className="font-semibold font-serif mr-2">Date:</p>
                <p>{selectedNews.date || 'N/A'}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <p className="font-semibold font-serif mr-2">Visits:</p>
                <p>{selectedNews.visits || '0'}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <p className="font-semibold font-serif mr-2">Status:</p>
                <p>{selectedNews.status === 'active' ? 'Active' : 'Inactive'}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <p className="font-semibold font-serif mr-2">Meta Title:</p>
                <p>{selectedNews.metatitle || 'N/A'}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold font-serif mr-2">Meta Description:</p>
                <p>{selectedNews.metadescription || 'N/A'}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <p className="font-semibold font-serif mr-2">Created At:</p>
                <p>{selectedNews.createdAt ? new Date(selectedNews.createdAt).toLocaleString() : 'N/A'}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <p className="font-semibold font-serif mr-2">Updated At:</p>
                <p>{selectedNews.updatedAt ? new Date(selectedNews.updatedAt).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          )}
          <button
            onClick={closeModal}
            className="mt-6 px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-900 transition duration-300 font-serif text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </Modal>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleDeleteConfirm}
        itemName={newsToDelete?.title || 'news item'}
        itemType="news item"
      />
    </div>
  );
};

export default NewsTable;