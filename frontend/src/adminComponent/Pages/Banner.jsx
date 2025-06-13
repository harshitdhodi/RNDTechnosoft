import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import {
  Edit,
  Trash2,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  Plus,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";

Modal.setAppElement("#root"); // Set the root element for accessibility

const BannersTable = () => {
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [banners, setBanners] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const pageSize = 12;
  const navigate = useNavigate();

  // Toast notification for successful updates
  const notify = () => {
    toast.success("Updated Successfully!");
  };

  // Table columns configuration
  const columns = useMemo(
    () => [
      {
        Header: "Page Type",
        accessor: "pageType",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/banner/editBanner/${row.original._id}`)}
          >
            {row.original.pageType || "N/A"}
          </span>
        ),
      },
      {
        Header: "Heading",
        accessor: "heading",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/banner/editBanner/${row.original._id}`)}
          >
            {row.original.heading || "N/A"}
          </span>
        ),
      },
      {
        Header: "Photo",
        accessor: "photo",
        Cell: ({ value }) => {
          const firstImage = Array.isArray(value) && value.length > 0 ? value[0] : value;
          return firstImage ? (
            <img
              src={`/api/logo/download/${firstImage}`}
              alt="Banner"
              className="w-20 h-20 object-cover rounded"
            />
          ) : (
            <span>No Image</span>
          );
        },
        disableSortBy: true,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) =>
          value === "active" ? (
            <Check className="text-green-500" />
          ) : (
            <X className="text-red-500" />
          ),
        disableSortBy: true,
      },
      {
        Header: "Options",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            <button
              className="text-gray-700 hover:text-gray-900 transition"
              onClick={() => handleView(row.original)}
            >
              <Eye />
            </button>
            <button className="text-blue-500 hover:text-blue-700 transition">
              <Link to={`/banner/editBanner/${row.original._id}`}>
                <Edit />
              </Link>
            </button>
            <button
              className="text-red-500 hover:text-red-700 transition"
              onClick={() => handleDeleteClick(row.original._id, row.original.section)}
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

  // Filter banners based on search term and selected section
  const filteredBanners = useMemo(() => {
    let filteredData = banners;
    if (selectedSection) {
      filteredData = filteredData.filter((banner) =>
        banner.section?.toLowerCase().includes(selectedSection.toLowerCase())
      );
    }
    if (searchTerm) {
      filteredData = filteredData.filter((banner) =>
        banner.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setPageCount(Math.ceil(filteredData.length / pageSize));
    return filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  }, [banners, searchTerm, selectedSection, pageIndex, pageSize]);

  // Initialize table with sorting
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: filteredBanners,
    },
    useSortBy
  );

  // Fetch banners from API
  const fetchData = async (pageIndex) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/pageHeading/getAllPageHeadings?page=${pageIndex + 1}&limit=${pageSize}`,
        { withCredentials: true }
      );
      const bannersWithIds = response.data.data.map((banner, index) => ({
        ...banner,
        id: pageIndex * pageSize + index + 1,
      }));
      setBanners(bannersWithIds);
      setPageCount(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  // Delete a banner
  const deleteBanner = async (id, section) => {
    try {
      await axios.delete(`/api/pageHeading/delete?id=${id}`, {
        withCredentials: true,
      });
      toast.success("Banner deleted successfully");
      fetchData(pageIndex);
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner");
    }
  };

  // Handle delete button click
  const handleDeleteClick = (id, section) => {
    setBannerToDelete({ id, section });
    setIsConfirmModalOpen(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (bannerToDelete) {
      deleteBanner(bannerToDelete.id, bannerToDelete.section);
      setIsConfirmModalOpen(false);
      setBannerToDelete(null);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setIsConfirmModalOpen(false);
    setBannerToDelete(null);
  };

  // Open modal with banner details
  const handleView = (banner) => {
    setSelectedBanner(banner);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBanner(null);
  };

  // Fetch page headings
  const fetchHeadings = async () => {
    try {
      const response = await axios.get("/api/pageHeading/heading?pageType=banner", {
        withCredentials: true,
      });
      const { heading, subheading } = response.data;
      setHeading(heading || "");
      setSubheading(subheading || "");
    } catch (error) {
      console.error("Error fetching headings:", error);
      toast.error("Failed to fetch headings");
    }
  };

  // Save page headings
  const saveHeadings = async () => {
    try {
      await axios.put(
        "/api/pageHeading/updateHeading?pageType=banner",
        {
          pagetype: "banner",
          heading,
          subheading,
        },
        { withCredentials: true }
      );
      notify();
    } catch (error) {
      console.error("Error saving headings:", error);
      toast.error("Failed to save headings");
    }
  };

  // Fetch data on page index change
  useEffect(() => {
    fetchData(pageIndex);
  }, [pageIndex]);

  // Fetch headings on component mount
  useEffect(() => {
    fetchHeadings();
  }, []);

  // Reset page index on filter change
  useEffect(() => {
    setPageIndex(0);
  }, [searchTerm, selectedSection]);

  const handleHeadingChange = (e) => setHeading(e.target.value);
  const handleSubheadingChange = (e) => setSubheading(e.target.value);

  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex + 1 < pageCount;


  // Modal styles
  const customModalStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    content: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      padding: "2rem",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      maxWidth: "600px",
      width: "90%",
      maxHeight: "80vh",
      overflowY: "auto",
      zIndex: 1001,
    },
  };

  // Confirmation modal styles
  const confirmModalStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    content: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
   
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      maxWidth: "400px",
      width: "90%",
      zIndex: 1001,
        height: '200px', // or any preferred height
    maxHeight: '300px',
  
    },
  };

  return (
    <div className="p-4 overflow-x-auto">
      <ToastContainer />
      {/* Heading and Subheading Inputs */}
      <div className="mb-8 border border-gray-200 shadow-lg p-4 rounded">
        <div className="grid md:grid-cols-2 md:gap-2 grid-cols-1">
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
              Heading
            </label>
            <input
              type="text"
              value={heading}
              onChange={handleHeadingChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
              Subheading
            </label>
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
          className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300"
        >
          Save
        </button>
      </div>

      {/* Table Header and Create Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-700 font-serif uppercase">Banners</h1>
        <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif">
          <Link to="/banner/createBanner">
            <Plus size={15} />
          </Link>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
        />
      </div>
      <div className="mb-4 flex">
        <label className="text-gray-700 font-bold mb-2 uppercase font-serif mr-4 flex items-center">
          Select Section:
        </label>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="px-4 w-64 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
        >
          <option value="">All</option>
          <option value="PrivacyPolicy">Privacy Policy</option>
          <option value="TermConditions">Terms & Conditions</option>
          <option value="CookiePolicy">Cookie Policy</option>
          <option value="Contact">Contact</option>
          <option value="Collaborationinquiries">Collaboration Inquiries</option>
        </select>
      </div>

      {/* Table or Loading/No Data */}
      {loadings ? (
        <div className="flex justify-center items-center h-64">
          <UseAnimations animation={loading} size={56} />
        </div>
      ) : (
        <>
          {filteredBanners.length === 0 ? (
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
                  );
                })}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-center items-center gap-2">
        <button
          onClick={() => setPageIndex(0)}
          disabled={!canPreviousPage}
          className="px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-900 transition disabled:opacity-50"
        >
          {"<<"}
        </button>
        <button
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={!canPreviousPage}
          className="px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-900 transition disabled:opacity-50"
        >
          {"<"}
        </button>
        <button
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={!canNextPage}
          className="px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-900 transition disabled:opacity-50"
        >
          {">"}
        </button>
        <button
          onClick={() => setPageIndex(pageCount - 1)}
          disabled={!canNextPage}
          className="px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-900 transition disabled:opacity-50"
        >
          {">>"}
        </button>
        <span>
          Page <strong>{pageIndex + 1} of {pageCount}</strong>
        </span>
      </div>

      {/* Modal for Banner Details */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="Banner Details"
      >
        <div className="relative">
          <button
            onClick={closeModal}
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold font-serif mb-4">Banner Details</h2>
          {selectedBanner && (
            <div className="space-y-4">
              <div className="flex">
                <p className="mr-2 font-semibold font-serif">Page Type:</p>
                <p>{selectedBanner.pageType || "N/A"}</p>
              </div>
              <div className="flex">
                <p className="mr-2 font-semibold font-serif">Section:</p>
                <p>{selectedBanner.section || "N/A"}</p>
              </div>
              <div className="flex">
                <p className="mr-2 font-semibold font-serif">Title:</p>
                <p>{selectedBanner.title || "N/A"}</p>
              </div>
              <div className="flex">
                <p className="mr-2 font-semibold font-serif">Heading:</p>
                <p>{selectedBanner.heading || "N/A"}</p>
              </div>
              <div className="flex">
                <p className="mr-2 font-semibold font-serif">Status:</p>
                <p>{selectedBanner.status === "active" ? "Active" : "Inactive"}</p>
              </div>
              <div className="flex flex-col">
                <p className="mr-2 font-semibold font-serif">Photo:</p>
                {selectedBanner.photo ? (
                  <img
                    src={`/api/logo/download/${Array.isArray(selectedBanner.photo) && selectedBanner.photo.length > 0
                        ? selectedBanner.photo[0]
                        : selectedBanner.photo
                      }`}
                    alt="Banner"
                    className="w-32 h-32 object-cover rounded mt-2"
                  />
                ) : (
                  <p>No Image</p>
                )}
              </div>
              <div className="flex flex-col">
                <p className="mr-2 font-semibold font-serif">Description:</p>
                <ReactQuill
                  readOnly={true}
                  value={selectedBanner.details || ""}
                  modules={{ toolbar: false }}
                  theme="bubble"
                  className="quill"
                />
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Confirmation Modal for Deletion */}
      <Modal
  isOpen={isConfirmModalOpen}
  onRequestClose={cancelDelete}
  style={confirmModalStyles}
  contentLabel="Confirm Delete"
>
  <div className="relative max-h-[250px] p-4 overflow-auto">
    <h2 className="text-lg font-bold font-serif mb-2">Confirm Deletion</h2>
    <p className="mb-3 text-sm">Are you sure you want to delete this banner? This action cannot be undone.</p>
    <div className="flex justify-end gap-2">
      <button
        onClick={cancelDelete}
        className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-300 text-sm"
      >
        Cancel
      </button>
      <button
        onClick={confirmDelete}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 text-sm"
      >
        Delete
      </button>
    </div>
  </div>
</Modal>


    </div>
  );
};

export default BannersTable;
