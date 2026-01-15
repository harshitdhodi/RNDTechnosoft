import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { Edit,  //Edit
  Trash2,  //Trash2
  Check,  //Check
  Eye,  //Eye
  X,  //X
  ArrowUp,  //ArrowUp
  ArrowDown,  //ArrowDown
  Plus  //Plus
 } from 'lucide-react';
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

Modal.setAppElement('#root');

const CorevalueTable = () => {
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [corevalues, setCorevalues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCorevalue, setSelectedCorevalue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const navigate = useNavigate();

  const filteredCorevalues = useMemo(() => {
    return corevalues.filter(corevalue => {
      const matchesSearch = searchTerm 
        ? corevalue.title?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchesSearch;
    });
  }, [corevalues, searchTerm]);

  const paginatedCoreValues = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCorevalues.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCorevalues, currentPage, itemsPerPage]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/corevalue/getCorevalue`, { 
          withCredentials: true 
        });
        const corevaluesWithIds = response.data.data.map((cv, index) => ({
          ...cv,
          id: index + 1,
        }));
        setCorevalues(corevaluesWithIds);
      } catch (error) {
        console.error('Error fetching core values:', error);
        toast.error('Failed to load core values');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDeleteClick = async (item) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${item.title}"?`);
    if (confirmDelete) {
      try {
        await axios.delete(`/api/corevalue/deleteCorevalue?id=${item._id}`, { 
          withCredentials: true 
        });
        setCorevalues(prev => prev.filter(cv => cv._id !== item._id));
        toast.success("Core value deleted successfully");
      } catch (error) {
        console.error('Error deleting core value:', error);
        toast.error("Failed to delete core value");
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        width: 50,
      },
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span
              className="hover:text-blue-500 cursor-pointer"
              onClick={() => navigate(`/corevalue/editCorevalue/${row.original._id}`)}
            >
              {row.original.title}
            </span>
            {validationErrors[row.original._id]?.title && (
              <span className="text-red-500 text-xs">
                {validationErrors[row.original._id].title}
              </span>
            )}
          </div>
        ),
      },
      {
        Header: "Photo",
        accessor: "photo",
        Cell: ({ value }) => (
          <div className="w-32 h-20 bg-gray-100 flex items-center justify-center overflow-hidden">
            {value?.[0] ? (
              <img 
                src={`/api/image/download/${value[0]}`}
                alt="Core Value"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.png';
                }}
              />
            ) : (
              <span className="text-gray-400 text-sm">No image</span>
            )}
          </div>
        ),
        disableSortBy: true,
      },
      {
        Header: "Status",
        accessor: "status",
        width: 100,
        Cell: ({ value }) => (
          <div className="flex items-center">
            <span className={`mr-1 ${value === 'active' ? 'text-green-500' : 'text-red-500'}`}>
              {value === 'active' ? <Check size={16} /> : <X size={16} />}
            </span>
            <span className="capitalize text-sm">{value}</span>
          </div>
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        width: 120,
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleView(row.original)}
              className="text-blue-500 hover:text-blue-700"
              title="View"
            >
              <Eye size={18} />
            </button>
            <Link to={`/corevalue/editCorevalue/${row.original._id}`}>
              <button className="text-green-500 hover:text-green-700" title="Edit">
                <Edit size={18} />
              </button>
            </Link>
            <button
              onClick={() => handleDeleteClick(row.original)}
              className="text-red-500 hover:text-red-700"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
        disableSortBy: true,
      },
    ],
    [navigate, validationErrors]
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
      data: paginatedCoreValues,
      initialState: {
        sortBy: [{ id: 'title', desc: false }]
      },
      autoResetSortBy: false,
      disableMultiSort: true,
    },
    useSortBy
  );

  const handleView = (corevalue) => {
    setSelectedCorevalue(corevalue);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCorevalue(null);
  };

  const handleHeadingChange = (e) => setHeading(e.target.value);
  const handleSubheadingChange = (e) => setSubheading(e.target.value);

  const saveHeadings = async () => {
    try {
      await axios.put('/api/pageHeading/updateHeading', {
        pageType: 'corevalue',
        heading,
        subheading,
      }, { withCredentials: true });
      toast.success('Headings updated successfully');
    } catch (error) {
      console.error('Error updating headings:', error);
      toast.error('Failed to update headings');
    }
  };

  useEffect(() => {
    const loadHeadings = async () => {
      try {
        const response = await axios.get('/api/pageHeading/heading', {
          params: { pageType: 'corevalue' },
          withCredentials: true
        });
        setHeading(response.data.heading || '');
        setSubheading(response.data.subheading || '');
      } catch (error) {
        console.error('Error loading headings:', error);
      }
    };

    loadHeadings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <UseAnimations animation={loading} size={56} />
      </div>
    );
  }

  return (
    <div className="p-4 overflow-x-auto">
      <ToastContainer />
      <div className="mb-8 border border-gray-200 shadow-lg p-4 rounded ">
        <div className="grid md:grid-cols-2 md:gap-2 grid-cols-1">
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Heading</label>
            <input
              type="text"
              value={heading}
              onChange={handleHeadingChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Sub heading</label>
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
          className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif"
        >
          Save
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-700 font-serif uppercase">Core Values</h1>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showActiveOnly}
              onChange={(e) => {
                setShowActiveOnly(e.target.checked);
                setCurrentPage(1); // Reset to first page when filter changes
              }}
              className="rounded text-slate-700"
            />
            <span className="text-sm text-gray-700">Show active only</span>
          </label>
        </div>
        <Link to="/corevalue/createCorevalue">
          <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif flex items-center">
            <Plus size={15} className="mr-1" /> Add New
          </button>
        </Link>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
        />
      </div>
      <h2 className="text-md font-semibold mb-4">Manage Core Values</h2>
      {
        corevalues.length == 0 ? <div className="flex justify-center items-center"><iframe className="w-96 h-96" src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"></iframe></div>
          :
          <table className="w-full mt-4 border-collapse" {...getTableProps()}>
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
      {filteredCorevalues.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {currentPage * itemsPerPage - itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCorevalues.length)} of {filteredCorevalues.length} entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-slate-700 text-white hover:bg-slate-900'}`}
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, Math.ceil(filteredCorevalues.length / itemsPerPage)) }, (_, i) => {
              // Show page numbers with ellipsis for large numbers of pages
              let pageNum;
              if (Math.ceil(filteredCorevalues.length / itemsPerPage) <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= Math.ceil(filteredCorevalues.length / itemsPerPage) - 2) {
                pageNum = Math.ceil(filteredCorevalues.length / itemsPerPage) - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded ${currentPage === pageNum ? 'bg-slate-700 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            {Math.ceil(filteredCorevalues.length / itemsPerPage) > 5 && (
              <span className="px-2 py-1">...</span>
            )}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredCorevalues.length / itemsPerPage)))}
              disabled={currentPage === Math.ceil(filteredCorevalues.length / itemsPerPage)}
              className={`px-3 py-1 rounded ${currentPage === Math.ceil(filteredCorevalues.length / itemsPerPage) ? 'bg-gray-200 cursor-not-allowed' : 'bg-slate-700 text-white hover:bg-slate-900'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Banner Details"
        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      >
        <div className="bg-white p-8 rounded shadow-lg w-96 relative">
        <button onClick={closeModal} className="absolute top-5 right-5 text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold mb-4 uppercase font-serif">Core value </h2>
          {selectedCorevalue && (
            <div className="">
              <div className="flex mt-2">
                <p className="mr-2 font-semibold font-serif">Title :</p>
                <p>{selectedCorevalue.title}</p>
              </div>
              <div className=" mt-2">
                <p className="mr-2 font-semibold font-serif">Description :</p>
                <ReactQuill
                  readOnly={true}
                  value={selectedCorevalue.description}
                  modules={{ toolbar: false }}
                  theme="bubble"
                  className="quill"
                />
              </div>
            </div>
          )}
          <button
            onClick={closeModal}
            className=" mt-4 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300"
          >
            Close
          </button>
        </div>
      </Modal>
      <DeleteConfirmationModal
      isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteClick}
        itemName={selectedCorevalue?.title || 'Core Value'}
        itemType="Core Value"
      />
    </div>
  );
};

export default CorevalueTable;
