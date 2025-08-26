import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
<<<<<<< HEAD
import { Trash2, Download, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";
import Modal from 'react-modal';
import { debounce } from 'lodash';
import DeleteConfirmationModal from "./DeleteConfirmationModal";

Modal.setAppElement('#root');
=======
import { Trash2,  //Trash2
  Download,  //Download
  Eye,  //Eye
  ArrowUp,  //ArrowUp
  ArrowDown  //ArrowDown
 } from 'lucide-react';
import axios from 'axios';
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";

>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

const CareerInquiryTable = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
<<<<<<< HEAD
  const [selectedCategory, setSelectedCategory] = useState("All");
=======
  const [selectedCategory, setSelectedCategory] = useState("All"); // Default value for category selection
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const [totalCount, setTotalCount] = useState(0);
  const [countWithFields, setCountWithFields] = useState(0);
  const [countWithoutFields, setCountWithoutFields] = useState(0);
  const [dataWithFields, setDataWithFields] = useState([]);
  const [dataWithoutFields, setDataWithoutFields] = useState([]);
<<<<<<< HEAD
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);

  // Debounced fetch data function
  const debouncedFetchInquiryData = useMemo(
    () => debounce(async (term) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/careerInquiries/getcareerInquiries?search=${encodeURIComponent(term)}`,
          { withCredentials: true, timeout: 10000 }
        );
        const { totalCount, countWithFields, countWithoutFields, dataWithFields, dataWithoutFields, inquiries } = response.data;

        setTotalCount(totalCount);
        setCountWithFields(countWithFields);
        setCountWithoutFields(countWithoutFields);
        setDataWithFields(dataWithFields.map((item, index) => ({
          ...item,
          id: index + 1,
          name: item.name || 'N/A',
          mobileNo: item.mobileNo || 'N/A',
          email: item.email || 'N/A',
          message: item.message || 'N/A',
        })));
        setDataWithoutFields(dataWithoutFields.map((item, index) => ({
          ...item,
          id: index + 1,
          name: item.name || 'N/A',
          mobileNo: item.mobileNo || 'N/A',
          email: item.email || 'N/A',
          message: item.message || 'N/A',
        })));
        setInquiries(inquiries.map((item, index) => ({
          ...item,
          id: index + 1,
          name: item.name || 'N/A',
          mobileNo: item.mobileNo || 'N/A',
          email: item.email || 'N/A',
          message: item.message || 'N/A',
        })));
      } catch (error) {
        console.error("Error fetching inquiries:", error);
        const statusCode = error.response?.status ? `(${error.response.status})` : '';
        toast.error(error.code === 'ERR_CANCELED' ? 'Request timed out' : `Failed to fetch inquiries ${statusCode}.`);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );
=======


  const fetchInquiryData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/careerInquiries/getcareerInquiries`, { withCredentials: true });
      const { totalCount, countWithFields, countWithoutFields, dataWithFields, dataWithoutFields, inquiries } = response.data;

      setTotalCount(totalCount);
      setCountWithFields(countWithFields);
      setCountWithoutFields(countWithoutFields);
      setDataWithFields(dataWithFields);
      setDataWithoutFields(dataWithoutFields);
      setInquiries(inquiries);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

<<<<<<< HEAD
  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value; // Allow spaces
    setSearchTerm(newSearchTerm);
    debouncedFetchInquiryData(newSearchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    debouncedFetchInquiryData("");
  };

  const filteredData = useMemo(() => {
    switch (selectedCategory) {
      case "GPM":
        return dataWithFields || [];
=======
  const filteredData = useMemo(() => {
    switch (selectedCategory) {
      case "GPM":
        return dataWithFields || []; 
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      case "SEO":
        return dataWithoutFields || [];
      default:
        return inquiries || [];
    }
  }, [selectedCategory, dataWithFields, dataWithoutFields, inquiries]);

<<<<<<< HEAD
=======



>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
<<<<<<< HEAD
        Cell: ({ value }) => <span>{value}</span>,
=======
        Cell: ({ row }) => {
          return <div>{row.index + 1}</div>; // This will display auto-incremented numbers starting from 1
      },
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      },
      {
        Header: "Name",
        accessor: "name",
<<<<<<< HEAD
        Cell: ({ value }) => <span className="break-words">{value}</span>,
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      },
      {
        Header: "Mobile No",
        accessor: "mobileNo",
<<<<<<< HEAD
        Cell: ({ value }) => <span className="break-words">{value}</span>,
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      },
      {
        Header: "Email",
        accessor: "email",
<<<<<<< HEAD
        Cell: ({ value }) => <span className="break-words">{value}</span>,
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      },
      {
        Header: "Resume",
        accessor: "resume",
        Cell: ({ value }) => (
<<<<<<< HEAD
          <div className="flex gap-2 sm:gap-4">
            <a className="text-green-500 hover:text-green-700 transition" href={`/api/careerInquiries/download/${value}`} aria-label="Download resume">
              <Download size={20} />
            </a>
            <button className="text-blue-500 hover:text-blue-700 transition" onClick={() => viewResume(value)} aria-label="View resume">
=======
          <div className="flex gap-4">
            <a className="text-green-500 hover:text-green-700 transition" href={`/api/careerInquiries/download/${value}`}>
              <Download size={20} />
            </a>
            <button className="text-blue-500 hover:text-blue-700 transition" onClick={() => viewResume(value)}>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
              <Eye size={20} />
            </button>
          </div>
        ),
        disableSortBy: true,
      },
      {
        Header: "Message",
        accessor: "message",
<<<<<<< HEAD
        Cell: ({ value }) => <span className="break-words">{value}</span>,
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      },
      {
        Header: "Options",
        Cell: ({ row }) => (
<<<<<<< HEAD
          <div className="flex gap-2 sm:gap-4">
            <button
              className="text-red-500 hover:text-red-700 transition"
              onClick={() => {
                setInquiryToDelete(row.original);
                setIsDeleteModalOpen(true);
              }}
              aria-label="Delete inquiry"
            >
              <Trash2 size={20} />
=======
          <div className="flex gap-4">
            <button className="text-red-500 hover:text-red-700 transition" onClick={() => deleteInquiry(row.original._id)}>
              <Trash2 />
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
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
      data: filteredData,
    },
    useSortBy
  );

<<<<<<< HEAD
  const deleteInquiry = async () => {
    if (!inquiryToDelete) return;
    try {
      await axios.delete(`/api/careerInquiries/deleteCareerInquiries?id=${inquiryToDelete._id}`, { withCredentials: true });
      toast.success(`Inquiry "${inquiryToDelete.name}" deleted successfully!`);
      debouncedFetchInquiryData(searchTerm);
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      const statusCode = error.response?.status ? `(${error.response.status})` : '';
      toast.error(`Failed to delete inquiry ${statusCode}.`);
    } finally {
      setIsDeleteModalOpen(false);
      setInquiryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setInquiryToDelete(null);
  };
=======

  const deleteInquiry = async (id) => {
    try {
      const response = await axios.delete(`/api/careerInquiries/deleteCareerInquiries?id=${id}`, { withCredentials: true });
      fetchInquiryData();
    } catch (error) {
      console.error(error);
    }
  };


>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

  const viewResume = (filename) => {
    window.open(`/api/careerInquiries/view/${filename}`);
  };

  useEffect(() => {
<<<<<<< HEAD
    debouncedFetchInquiryData(searchTerm);
    return () => {
      debouncedFetchInquiryData.cancel();
    };
  }, [debouncedFetchInquiryData, searchTerm]);

  return (
    <div className="p-2 sm:p-4">
      <ToastContainer />
      <h1 className="text-xl md:text-2xl font-bold text-gray-700 font-serif uppercase mb-4">Inquiries</h1>
      <div className="mb-4 relative">
=======

    fetchInquiryData();
  }, []);

  return (
    <div className="p-4 overflow-x-auto">
      <h1 className="text-xl font-bold  text-gray-700 font-serif uppercase mb-4">Inquiries</h1>
      <div className="mb-4">
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
<<<<<<< HEAD
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300 text-sm sm:text-base pr-10"
          aria-label="Search inquiries by name"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
        <div className="rounded bg-gradient-to-r from-red-400 to-red-600 p-4 flex justify-between items-center">
          <h3 className="font-semibold text-xl sm:text-2xl md:text-3xl text-white font-serif">All</h3>
          <span className="font-bold text-xl sm:text-2xl md:text-3xl text-black bg-white w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded shadow">{totalCount}</span>
        </div>
        <div className="rounded bg-gradient-to-r from-blue-400 to-blue-600 p-4 flex justify-between items-center">
          <h3 className="font-semibold text-xl sm:text-2xl md:text-3xl text-white font-serif">GPM</h3>
          <span className="font-bold text-xl sm:text-2xl md:text-3xl text-black bg-white w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded shadow">{countWithFields}</span>
        </div>
        <div className="rounded bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 flex justify-between items-center">
          <h3 className="font-semibold text-xl sm:text-2xl md:text-3xl text-white font-serif">SEO</h3>
          <span className="font-bold text-xl sm:text-2xl md:text-3xl text-black bg-white w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded shadow">{countWithoutFields}</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 mb-4">
        <h2 className="text-md sm:text-lg font-semibold font-serif">Manage Inquiries</h2>
        <div className="relative w-full sm:w-32 mt-2 sm:mt-0">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="block w-full appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 text-sm sm:text-base"
            aria-label="Filter inquiries by category"
          >
            <option value="All">All</option>
            <option value="GPM">GPM</option>
=======
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
        />
      </div>
      <div className="grid grid-cols-3 gap-12 mt-8">
        <div className="rounded bg-gradient-to-r from-red-400 to-red-600 p-4 flex justify-between items-center px-12 ">
          <h3 className="font-semibold text-[45px] text-white font-serif">All</h3>
          <button className="font-bold text-[40px] text-black bg-white w-16 h-16 flex items-center justify-center rounded shadow">{totalCount}</button>
        </div>
        <div className="rounded bg-gradient-to-r from-blue-400 to-blue-600 p-4 flex justify-between items-center px-12">
          <h3 className=" font-semibold text-[45px] text-white font-serif">PM</h3>
          <p className=" font-bold text-[40px] text-black bg-white w-16 h-16 flex items-center justify-center rounded shadow">{countWithFields}</p>
        </div>
        <div className="rounded bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 flex justify-between items-center px-12">
          <h3 className=" font-semibold text-[45px] text-white font-serif">SEO</h3>
          <p className="font-bold text-[40px] text-black bg-white w-16 h-16 flex items-center justify-center rounded shadow">{countWithoutFields}</p>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <h2 className="text-md font-semibold mb-4">Manage Inquiries</h2>
        <div className="relative w-[3cm]">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="block w-full appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
          >
            <option value="All">ALL</option>
            <option value="GPM">GPM</option> {/* Fixed the option label */}
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
            <option value="SEO">SEO</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 14.707a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L9 12.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4z" />
            </svg>
          </div>
        </div>
<<<<<<< HEAD
=======

>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      </div>
      {loadings ? (
        <div className="flex justify-center"><UseAnimations animation={loading} size={56} /></div>
      ) : (
<<<<<<< HEAD
        <>
          {filteredData.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64">
              <iframe className="w-64 h-64 sm:w-96 sm:h-96" src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"></iframe>
              <button
                onClick={handleClearSearch}
                className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-900 transition duration-300 font-serif text-sm sm:text-base"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="overflow-auto max-h-[60vh]">
              <table className="w-full mt-4 border-collapse min-w-[640px]" {...getTableProps()}>
                <thead className="bg-slate-700 hover:bg-slate-800 text-white sticky top-0 z-10">
                  {headerGroups.map((headerGroup) => (
                    <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          key={column.id}
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                          className="py-2 px-2 sm:px-4 border-b border-gray-300 cursor-pointer uppercase font-serif text-xs sm:text-sm md:text-base whitespace-nowrap"
                        >
                          <div className="flex items-center gap-2">
                            <span>{column.render("Header")}</span>
                            {column.canSort && (
                              <span className="ml-1">
                                {column.isSorted ? (
                                  column.isSortedDesc ? (
                                    <ArrowDown size={16} />
                                  ) : (
                                    <ArrowUp size={16} />
                                  )
                                ) : (
                                  <ArrowDown size={16} className="text-gray-400" />
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
                          <td key={cell.id} {...cell.getCellProps()} className="py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base break-words">
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={deleteInquiry}
        itemName={inquiryToDelete?.name || 'inquiry'}
        itemType="inquiry"
      />
=======
        <>{inquiries && inquiries.length == 0 ? <div className="flex justify-center items-center"><iframe className="w-96 h-96" src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"></iframe></div>
          :
          <table className="w-full mt-4 border-collapse" {...getTableProps()}>
            <thead className="bg-slate-700 hover:bg-slate-800 text-white">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="py-2 px-4 border-b border-gray-300 cursor-pointer"
                    >
                      <div className="flex items-center uppercase font-serif gap-2">
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
                  <tr {...row.getRowProps()} className="border-b border-gray-300 hover:bg-gray-100 transition duration-150 ">
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
        }
        </>

      )}

>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    </div>
  );
};

<<<<<<< HEAD
export default CareerInquiryTable;
=======
export default CareerInquiryTable;
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
