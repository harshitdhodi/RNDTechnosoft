import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { FaEdit, FaTrashAlt, FaCheck, FaTimes, FaEye, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-modal';
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";

Modal.setAppElement('#root');

const ServicesTable = ({ categoryId, subcategoryId, subsubcategoryId }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const pageSize = 5;
  const navigate = useNavigate();

  const filteredServices = useMemo(() => {
    return services.filter((service) =>
      service?.heading?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [services, searchTerm]);

  const columns = useMemo(
    () => [
      {
        Header: "Heading",
        accessor: "heading",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/services/editService/${row.original._id}`)}
          >
            {row.original.heading}
          </span>
        ),
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }) => <span dangerouslySetInnerHTML={{ __html: value }} />,
      },
      {
        Header: "Photo",
        accessor: "photo",
        Cell: ({ value }) => {
          const firstImage = Array.isArray(value) && value.length > 0 ? value[0] : null;
          return firstImage ? (
            <img src={`/api/image/download/${firstImage}`} alt="Service" className="w-32 h-20 object-cover" />
          ) : null;
        },
        disableSortBy: true,
      },
      {
        Header: "Active",
        accessor: "status",
        Cell: ({ value }) => value ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />,
        disableSortBy: true,
      },
      {
        Header: "Options",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            <button className="text-gray-600 hover:text-gray-800 transition" onClick={() => handleView(row.original)}>
              <FaEye />
            </button>
            <Link to={`/services/editService/${row.original._id}`} className="text-blue-500 hover:text-blue-700 transition">
              <FaEdit />
            </Link>
            <button
              className="text-red-500 hover:text-red-700 transition"
              onClick={() => {
                setServiceToDelete(row.original._id);
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
      data: filteredServices,
    },
    useSortBy
  );

  const handleView = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setServiceToDelete(null);
  };

  const fetchData = async (pageIndex) => {
    setLoading(true);
    try {
      console.log('Fetching data for categoryId:', categoryId, 'page:', pageIndex + 1);
      const response = await axios.get(`/api/serviceDetails/getServiceDetails?categoryId=${categoryId}&page=${pageIndex + 1}`, { withCredentials: true });
      console.log('API response:', response.data);
      
      // Validate response data
      const servicesWithIds = Array.isArray(response.data.data)
        ? response.data.data.map((service, index) => ({
            ...service,
            id: pageIndex * pageSize + index + 1,
          }))
        : [];
      
      setServices(servicesWithIds);
      console.log('Services state updated:', servicesWithIds);
      
      if (servicesWithIds.length === 0) {
        console.warn('No services returned from API');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error("Failed to fetch services.");
      setServices([]); // Reset to empty array to prevent undefined state
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    try {
      console.log('Deleting service with id:', id);
      await axios.delete(`/api/serviceDetails/deleteServiceDetail?id=${id}`, { withCredentials: true });
      toast.success("Service deleted successfully.", { autoClose: 3000 });
      closeDeleteModal(); // Close modal before fetching data
      await fetchData(0); // Refresh data
      console.log('Data refreshed after deletion');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error("Failed to delete service.");
      closeDeleteModal();
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchData(0);
    }
  }, [categoryId]);

  return (
    <div className="p-4 overflow-x-auto">
      <ToastContainer />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold font-serif text-gray-700 uppercase">Services</h1>
        <Link to={`/services/createService/${categoryId}`} className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif">
          <FaPlus size={15} />
        </Link>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      {loading ? (
        <div className="flex justify-center">
          <UseAnimations animation={loading} size={56} />
        </div>
      ) : (
        <>
          {services.length === 0 ? (
            <div className="flex justify-center items-center">
              <p className="text-gray-600">No services found.</p>
            </div>
          ) : (
            <table {...getTableProps()} className="min-w-full border-collapse border border-gray-300">
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-100">
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps()} className="border border-gray-300 p-2 text-left font-bold">
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="border border-gray-300 hover:bg-gray-50">
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()} className="border border-gray-300 p-2">
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

      {/* Modal for viewing service details */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="bg-white p-6 w-full max-w-6xl max-h-[90vh] rounded-lg shadow-lg overflow-y-auto mx-auto my-10 outline-none"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center"
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-800">{selectedService?.heading}</h2>
          <div
            className="text-gray-600"
            dangerouslySetInnerHTML={{ __html: selectedService?.description }}
          />
          {selectedService?.photo?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700">Images</h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {selectedService.photo.map((img, index) => (
                  <img
                    key={index}
                    src={`/api/image/download/${img}`}
                    alt={`Service ${index}`}
                    className="w-32 h-20 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}
          {selectedService?.questions?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700">Questions</h3>
              <ul className="list-disc pl-5 mt-2 text-gray-600">
                {selectedService.questions.map((question) => (
                  <li key={question._id} className="mb-2">
                    <strong>{question.question}</strong>: {question.answer}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            onClick={closeModal}
            className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300 self-end"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Modal for delete confirmation */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        className="bg-white p-6 w-full max-w-7xl max-h-[90vh] rounded-lg shadow-lg overflow-y-auto mx-auto my-10 outline-none"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center"
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-bold text-gray-800">
            Are you sure you want to delete this service?
          </h3>
          <p className="text-gray-600">
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={closeDeleteModal}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteService(serviceToDelete)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ServicesTable;