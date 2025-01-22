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

const IndustriesTable = ({ categoryId, subcategoryId,subsubcategoryId }) => {
  const [Industriess, setIndustriess] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 5;
  const navigate = useNavigate();

  const filteredIndustriess = useMemo(() => {
    return Industriess.filter((Industries) =>
      Industries.heading.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [Industriess, searchTerm]);

  const columns = useMemo(
    () => [
      {
        Header: "Heading",
        accessor: "heading",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/industries/editSubsubIndustries/${row.original._id}`)}
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
            <img src={`/api/image/download/${firstImage}`} alt="Industries" className="w-32 h-20 object-cover" />
          ) : null;
        },
        disableSortBy: true,
      },
      {
        Header: "Status",
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
            <Link to={`/industries/editSubsubIndustries/${row.original._id}`} className="text-blue-500 hover:text-blue-700 transition">
              <FaEdit />
            </Link>
            <button className="text-red-500 hover:text-red-700 transition" onClick={() => deleteIndustries(row.original._id)}>
              <FaTrashAlt />
            </button>
          </div>
        ),
        disableSortBy: true,
      },
    ],
    [navigate]
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
      data: filteredIndustriess,
    },
    useSortBy
  );

  const handleView = (Industries) => {
    setSelectedIndustries(Industries);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIndustries(null);
  };

  const fetchData = async (pageIndex) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/industiesDetails/getSubSubIndustriesDetails?subsubcategoryId=${subsubcategoryId}&page=${pageIndex + 1}`, { withCredentials: true });
      const IndustriessWithIds = response.data.data.map((Industries, index) => ({
        ...Industries,
        id: pageIndex * pageSize + index + 1,
      }));
      setIndustriess(IndustriessWithIds);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch Industriess.");
    } finally {
      setLoading(false);
    }
  };

  const deleteIndustries = async (id) => {
    try {
      await axios.delete(`/api/industiesDetails/deleteIndustriesDetail?id=${id}`, { withCredentials: true });
      toast.success("Industries deleted successfully.");
      fetchData(0);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete Industries.");
    }
  };

  useEffect(() => {
    if (categoryId && subcategoryId) {
      fetchData(0);
    }
  }, [categoryId, subcategoryId]);

  return (
    <div className="p-4 overflow-x-auto">
      <ToastContainer />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold font-serif text-gray-700 uppercase">Industriess</h1>
        <Link to={`/industries/createIndustries/${categoryId}/${subcategoryId}/${subsubcategoryId}`} className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif">
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
        <UseAnimations animation={loading} />
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

      {/* Modal for viewing Industries details */}
      <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
        <h2 className="text-xl font-bold">{selectedIndustries?.heading}</h2>
        <div dangerouslySetInnerHTML={{ __html: selectedIndustries?.description }} />
        <h3 className="font-bold mt-4">Questions</h3>
        <ul>
          {selectedIndustries?.questions?.map((question) => (
            <li key={question._id}>
              <strong>{question.question}</strong>: {question.answer}
            </li>
          ))}
        </ul>
        <button onClick={closeModal} className="mt-4 p-2 bg-red-500 text-white rounded">
          Close
        </button>
      </Modal>
    </div>
  );
};

export default IndustriesTable;
