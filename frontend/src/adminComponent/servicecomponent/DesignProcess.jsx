import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { FaEdit, FaTrashAlt, FaEye, FaPlus, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";
import Modal from 'react-modal';

const DesignProcess = ({ categoryId }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Filter packages based on search term
  const filteredPackages = useMemo(() => {
    return packages.filter((item) =>
      item.title ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) : false
    );
  }, [packages, searchTerm]);

  // Notification handler
  const notify = (message) => {
    toast.success(message || "Updated Successfully!");
  };

  // Table columns configuration
  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",  // Corrected accessor
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/services/editService/${row.original._id}`)}
          >
            {row.original.title}  {/* Corrected field */}
          </span>
        ),
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }) => <span>{value}</span>,
      },
      {
        Header: "Images",
        accessor: "image",
        Cell: ({ value }) => (
          <img
            src={`/api/designProcess/download/${value}`}
            alt="Company"
            className="h-20 w-32 object-cover"
          />
        ),
        disableSortBy: true,
      },
    //   Commenting out status as it's not in the provided data
    //   {
    //     Header: "Status",
    //     accessor: "status",
    //     Cell: ({ value }) => value ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />,
    //     disableSortBy: true,
    //   },
      {
        Header: "Options",
        Cell: ({ row }) => (
          <div className="flex gap-4">
  
            <Link   to={`/services/editDesignProcess/${row.original._id}?categoryId=${row.original.category}`}
              className="text-blue-500 hover:text-blue-700 transition">
              <FaEdit />
            </Link>
            <button className="text-red-500 hover:text-red-700 transition" onClick={() => deletePackage(row.original._id)}>
              <FaTrashAlt />
            </button>
          </div>
        ),
        disableSortBy: true,
      },
    ],
    [navigate]
  );

  // Table instance
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: filteredPackages,
    },
    useSortBy
  );

  // Fetch packages from the server
  const fetchData = async () => {
    setLoading(true);
    try {


      const response = await axios.get(`/api/designProcess/category`, {
        params: {
          categoryId: categoryId

        },
        withCredentials: true
      });
      const packagesWithIds = response.data.data.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
      setPackages(packagesWithIds);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a package
  const deletePackage = async (id) => {
    try {
      await axios.delete(
        `/api/designProcess/deleteDesignProcess?id=${id}`,
        { withCredentials: true }
      );
      fetchData();
      notify("Package deleted successfully!");
    } catch (error) {
      console.error(error);
      notify("Failed to delete package.");
    }
  };

  // Fetch headings for the design process page
  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=designProcess', { withCredentials: true });
      const { heading, subheading } = response.data;
      setHeading(heading || '');
      setSubheading(subheading || '');
    } catch (error) {
      console.error(error);
      notify("Failed to fetch headings.");
    }
  };

  // Save updated headings
  const saveHeadings = async () => {
    try {
      await axios.put('/api/pageHeading/updateHeading?pageType=designProcess', {
        pagetype: 'package',
        heading,
        subheading,
      }, { withCredentials: true });
      notify("Headings updated successfully!");
    } catch (error) {
      console.log(error);
      notify("Failed to update headings.");
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  useEffect(() => {
    fetchHeadings();
  }, []);

  // Handle modal open/close for package details
  const handleView = (packageData) => {
    setSelectedPackage(packageData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };

  // File handling for uploads
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, { withCredentials: true });
      setMessage(response.data.message);
      notify(response.data.message);
      fetchData(); // Refresh data after upload
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Failed to upload file.');
      notify('Failed to upload file.');
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-700 font-serif uppercase">Design Process</h1>
        <Link to={`/services/designProcess/${categoryId}`} className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif">
          <FaPlus size={15} />
        </Link>
      </div>

      <div className="mb-8 border border-gray-200 shadow-lg p-4 rounded">
        <div className="grid md:grid-cols-2 md:gap-2 grid-cols-1">
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Heading</label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter page heading"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-sky-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Subheading</label>
            <input
              type="text"
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              placeholder="Enter page subheading"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
        <button onClick={saveHeadings} className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-900 transition duration-300 uppercase font-serif">
          Save Heading
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search design process by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-sky-500 w-64"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <UseAnimations animation={loading} size={50} />
        </div>
      ) : (
        <table {...getTableProps()} className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="py-3 px-6 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    <div className="flex items-center justify-between">
                      {column.render("Header")}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <FaArrowDown className="ml-2" />
                        ) : (
                          <FaArrowUp className="ml-2" />
                        )
                      ) : (
                        <FaArrowDown className="ml-2 opacity-0" />
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
                <tr {...row.getRowProps()} className="border-b">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="py-4 px-6 text-sm text-gray-700">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Modal for package details */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Package Details"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedPackage && (
          <div>
            <h2 className="text-xl font-semibold mb-4">{selectedPackage.title}</h2>
            <p>{selectedPackage.description}</p>
            {/* Additional details can be added here */}
            <button
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-900 transition duration-300"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DesignProcess;
