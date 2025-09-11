import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { FaEdit, FaTrashAlt, FaCheck, FaEye, FaTimes, FaArrowUp, FaArrowDown, FaPlus, FaTimesCircle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";
import debounce from 'lodash.debounce';
import { validateHeading, validateSubheading } from '../../utiles/validations';

Modal.setAppElement('#root');

const PortfolioTable = () => {
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [portfolio, setPortfolio] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [metaFilter, setMetaFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);
  const [errors, setErrors] = useState({ heading: "", subheading: "" });
  const navigate = useNavigate();
  const pageSize = 5;

  const filteredPortfolio = useMemo(() => {
    return portfolio.filter((portfolioItem) => {
      if (metaFilter === "Meta Available") {
        return portfolioItem.metatitle && portfolioItem.metatitle.length > 0 || portfolioItem.metadescription && portfolioItem.metadescription.length > 0;
      }
      if (metaFilter === "Meta Unavailable") {
        return !portfolioItem.metatitle || portfolioItem.metatitle.length === 0 || !portfolioItem.metadescription || portfolioItem.metadescription.length === 0;
      }
      return true;
    });
  }, [portfolio, metaFilter]);

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
            onClick={() => navigate(`/portfolio/${row.original.slug || ''}`)}
          >
            {row.original.categoryName || 'N/A'}
          </span>
        ),
      },
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/portfolio/${row.original.slug || ''}`)}
          >
            {row.original.title || 'N/A'}
          </span>
        ),
      },
      {
        Header: "Photo",
        accessor: "photo",
        Cell: ({ value }) => {
          const firstImage = Array.isArray(value) && value.length > 0 ? value[0] : null;
          return firstImage ? (
            <img src={`/api/image/download/${firstImage}`} alt="Portfolio" className="w-32 h-20 object-cover" />
          ) : (
            <span>N/A</span>
          );
        },
        disableSortBy: true,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => value === "active" ? (
          <FaCheck className="text-green-500" />
        ) : (
          <FaTimes className="text-red-500" />
        ),
        disableSortBy: true,
      },
      {
        Header: "Options",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            <button
              className="text-blue-500 hover:text-blue-700 transition"
              onClick={() => handleView(row.original)}
            >
              <FaEye />
            </button>
            <button className="text-blue-500 hover:text-blue-700 transition">
              <Link to={`/portfolio/${row.original.slug || ''}`}>
                <FaEdit />
              </Link>
            </button>
            <button
              className="text-red-500 hover:text-red-700 transition"
              onClick={() => {
                setPortfolioToDelete(row.original.slug);
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
      data: filteredPortfolio,
    },
    useSortBy
  );

  const fetchData = async (pageIndex, search = "") => {
    setLoading(true);
    try {
      const endpoint = search
        ? `/api/portfolio/simpleSearchPortfolio?title=${encodeURIComponent(search)}&page=${pageIndex + 1}&limit=${pageSize}`
        : `/api/portfolio/getPortfolio?page=${pageIndex + 1}`;
      const response = await axios.get(endpoint, { withCredentials: true });

      const portfolios = search ? response.data.data.portfolios : response.data.data;
      const pagination = search ? response.data.data.pagination : {
        currentPage: pageIndex + 1,
        totalPages: Math.ceil(response.data.total / pageSize),
        totalItems: response.data.total,
        itemsPerPage: pageSize,
        hasNextPage: pageIndex + 1 < Math.ceil(response.data.total / pageSize),
        hasPrevPage: pageIndex > 0,
      };

      const portfolioWithIds = portfolios.map((portfolioItem, index) => ({
        ...portfolioItem,
        id: pageIndex * pageSize + index + 1,
        categoryName: portfolioItem.categoryName || 'N/A',
        title: portfolioItem.title || 'N/A',
        slug: portfolioItem.slug || '',
        status: portfolioItem.status || 'inactive',
        metatitle: portfolioItem.metatitle || '',
        metadescription: portfolioItem.metadescription || '',
        details: portfolioItem.details || '',
      }));

      setPortfolio(portfolioWithIds);
      setPageCount(pagination.totalPages || 1);
    } catch (error) {
      const errorMessage = error.response?.data?.message || (search ? "Failed to search portfolios" : "Failed to fetch portfolio data");
      toast.error(errorMessage);
      setPortfolio([]);
      setPageCount(1);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchData = useMemo(
    () => debounce((page, term) => fetchData(page, term), 500),
    []
  );

  useEffect(() => {
    debouncedFetchData(pageIndex, searchTerm);
    fetchHeadings();
    return () => debouncedFetchData.cancel();
  }, [pageIndex, searchTerm, debouncedFetchData]);

  const handleView = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPortfolio(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPortfolioToDelete(null);
  };

  const deletePortfolio = async (slugs) => {
    try {
      await axios.delete(`/api/portfolio/deletePortfolio?slugs=${slugs}`, { withCredentials: true });
      toast.success("Portfolio deleted successfully!");
      fetchData(pageIndex, searchTerm);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete portfolio";
      toast.error(errorMessage);
    }
    closeDeleteModal();
  };

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=portfolio', { withCredentials: true });
      const { heading, subheading } = response.data;
      setHeading(heading || '');
      setSubheading(subheading || '');
      setErrors({
        heading: validateHeading(heading || ''),
        subheading: validateSubheading(subheading || ''),
      });
    } catch (error) {
      toast.error("Failed to fetch headings");
    }
  };

  const validateForm = () => {
    const newErrors = {
      heading: validateHeading(heading),
      subheading: validateSubheading(subheading),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const saveHeadings = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    try {
      await axios.put('/api/pageHeading/updateHeading?pageType=portfolio', {
        pagetype: 'Portfolio',
        heading,
        subheading,
      }, { withCredentials: true });
      toast.success("Headings updated successfully!");
    } catch (error) {
      toast.error("Failed to update headings");
    }
  };

  const handleHeadingChange = (e) => {
    const value = e.target.value;
    setHeading(value);
    setErrors((prev) => ({ ...prev, heading: validateHeading(value) }));
  };

  const handleSubheadingChange = (e) => {
    const value = e.target.value;
    setSubheading(value);
    setErrors((prev) => ({ ...prev, subheading: validateSubheading(value) }));
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setPageIndex(0);
  };

  return (
    <div className="p-4 overflow-x-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mb-8 border border-gray-200 shadow-lg p-4 rounded">
        <div className="grid md:grid-cols-2 md:gap-2 grid-cols-1">
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
              Heading <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={heading}
              onChange={handleHeadingChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ${errors.heading ? 'border-red-500' : ''}`}
              required
            />
            <div className="text-sm text-gray-500 mt-1">
              {heading.length}/50 characters
            </div>
            {errors.heading && <p className="text-red-500 text-sm mt-1">{errors.heading}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
              Sub heading <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subheading}
              onChange={handleSubheadingChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ${errors.subheading ? 'border-red-500' : ''}`}
              required
            />
            <div className="text-sm text-gray-500 mt-1">
              {subheading.length}/100 characters
            </div>
            {errors.subheading && <p className="text-red-500 text-sm mt-1">{errors.subheading}</p>}
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
        <h1 className="text-xl font-bold text-gray-700 font-serif uppercase">Portfolio</h1>
        <div className="flex gap-2">
          <Link to="/portfolio/createPortfolio">
            <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif">
              <FaPlus size={15} />
            </button>
          </Link>
        </div>
      </div>

      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <FaTimesCircle size={20} />
          </button>
        )}
      </div>
      <h2 className="text-md font-semibold mb-4">Manage Portfolio</h2>
      {loadings ? (
        <div className="flex justify-center">
          <UseAnimations animation={loading} size={56} />
        </div>
      ) : (
        <>
          {filteredPortfolio.length === 0 ? (
            <div className="flex justify-center items-center text-gray-700 font-serif text-lg">
              No results found
            </div>
          ) : (
            <table className="w-full mt-4 border-collapse" {...getTableProps()}>
              <thead className="bg-slate-700 hover:bg-slate-800 text-white">
                {headerGroups.map((headerGroup) => (
                  <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        key={column.id}
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
                    <tr key={row.id} {...row.getRowProps()} className="border-b border-gray-300 hover:bg-gray-100 transition duration-150">
                      {row.cells.map((cell) => (
                        <td key={cell.id} {...cell.getCellProps()} className="py-2 px-4">
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
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setPageIndex(0)}
          disabled={pageIndex === 0}
          className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          {"<<"}
        </button>
        <button
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 0}
          className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          {"<"}
        </button>
        <button
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={pageIndex + 1 >= pageCount}
          className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          {">"}
        </button>
        <button
          onClick={() => setPageIndex(pageCount - 1)}
          disabled={pageIndex + 1 >= pageCount}
          className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          {">>"}
        </button>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageCount}
          </strong>
        </span>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Portfolio Details"
        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      >
        <div className="bg-white p-8 rounded shadow-lg w-96 relative">
          <button onClick={closeModal} className="absolute top-5 right-5 text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
          <h2 className="text-xl font-bold mb-4 font-serif">Portfolio</h2>
          {selectedPortfolio && (
            <div>
              <div className="flex mt-2">
                <p className="mr-2 font-semibold font-serif">Category :</p>
                <p>{selectedPortfolio.categoryName || 'N/A'}</p>
              </div>
              <div className="flex mt-2">
                <p className="mr-2 font-semibold font-serif">Title :</p>
                <p>{selectedPortfolio.title || 'N/A'}</p>
              </div>
              <div className="mt-2">
                <p className="mr-2 font-semibold font-serif">Description :</p>
                <ReactQuill
                  readOnly={true}
                  value={selectedPortfolio.details || ''}
                  modules={{ toolbar: false }}
                  theme="bubble"
                  className="quill"
                />
              </div>
            </div>
          )}
          <button
            onClick={closeModal}
            className="mt-4 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300"
          >
            Close
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Confirmation"
        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      >
        <div className="bg-white p-8 rounded shadow-lg w-96 relative">
          <button onClick={closeDeleteModal} className="absolute top-5 right-5 text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
          <h2 className="text-xl font-bold mb-4 font-serif">Confirm Deletion</h2>
          <p className="mb-4">Are you sure you want to delete this portfolio item?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={closeDeleteModal}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={() => deletePortfolio(portfolioToDelete)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PortfolioTable;