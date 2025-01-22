import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { FaEdit, FaTrashAlt, FaArrowUp, FaArrowDown, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";

const Packages = ({ categoryId }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [photoType, setPhotoType] = useState("package");
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const filteredPackages = useMemo(() => {
    return packages.filter((item) =>
      item.title ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) : false
    );
  }, [packages, searchTerm]);

  const notify = (message) => {
    toast.success(message || "Updated Successfully!");
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/packages/edit/${row.original._id}`)}
          >
            {row.original.title}
          </span>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Options",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            <Link
              to={`/services/packages/${row.original._id}`}
            >
              <FaEdit />
            </Link>

            <button
              className="text-red-500 hover:text-red-700 transition"
              onClick={() => deletePackage(row.original._id)}
            >
              <FaTrashAlt />
            </button>
          </div>
        ),
        disableSortBy: true,
      },
    ],
    [navigate]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: filteredPackages,
    },
    useSortBy
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/packages/category?categoryId=${categoryId}`,
        { withCredentials: true }
      );
      const packagesWithIds = response.data.map((item, index) => ({
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

  const deletePackage = async (id) => {
    try {
      await axios.delete(
        `/api/packages/delete?id=${id}`,
        { withCredentials: true }
      );
      fetchData();
      notify("Package deleted successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=package', { withCredentials: true });
      const { heading, subheading } = response.data;
      setHeading(heading || '');
      setSubheading(subheading || '');
    } catch (error) {
      console.error(error);
    }
  };

  const saveHeadings = async () => {
    try {
      await axios.put('/api/pageHeading/updateHeading?pageType=package', {
        pagetype: 'package',
        heading,
        subheading,
      }, { withCredentials: true });
      notify("Headings updated successfully!");
    } catch (error) {
      console.error(error);
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

  const handleView = (packageData) => {
    setSelectedPackage(packageData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };

  const handleHeadingChange = (e) => setHeading(e.target.value);
  const handleSubheadingChange = (e) => setSubheading(e.target.value);

  const exportPackages = () => {
    axios.get('/api/packages/exportPackage', { responseType: 'blob', withCredentials: true })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'packages.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(error => {
        console.error('Error exporting packages:', error);
        alert('Failed to export packages');
      });
  };

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
      const response = await axios.post('/api/packages/importPackage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      setMessage(response.data.message);
      notify(response.data.message);
      fetchData(); // Refresh data after upload
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Failed to upload file.');
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
      <ToastContainer />
     
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-700 font-serif uppercase">
          Packages
        </h1>
        
        <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif">
          <Link to={`/services/createPackage/${categoryId}`}>
            <FaPlus size={15} />
          </Link>
        </button>
      </div>
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
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Subheading</label>
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
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md w-full focus:outline-none focus:border-blue-500 transition duration-300"
        />
      </div>

      {/* <div className="mb-4 flex justify-between">
        <button
          className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300"
          onClick={exportPackages}
        >
          Export Packages
        </button>
        <div className="flex items-center">
          <input type="file" onChange={handleFileChange} className="mr-2" />
          <button
            className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300"
            onClick={onFileUpload}
          >
            Import Packages
          </button>
        </div>
      </div> */}

      {loading ? (
        <div className="flex items-center justify-center">
          <UseAnimations animation={loading} size={56} />
        </div>
      ) : (
        <table {...getTableProps()} className="min-w-full bg-white border rounded shadow-md">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="text-left p-4 font-semibold uppercase font-serif"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <FaArrowDown className="inline ml-2" />
                        ) : (
                          <FaArrowUp className="inline ml-2" />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="hover:bg-gray-100">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="p-4 border-b">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Packages;
