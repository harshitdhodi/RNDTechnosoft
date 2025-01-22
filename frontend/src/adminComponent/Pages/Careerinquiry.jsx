import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { FaTrashAlt, FaDownload, FaEye, FaArrowUp, FaArrowDown } from "react-icons/fa";
import axios from 'axios';
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";


const CareerInquiryTable = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All"); // Default value for category selection
  const [totalCount, setTotalCount] = useState(0);
  const [countWithFields, setCountWithFields] = useState(0);
  const [countWithoutFields, setCountWithoutFields] = useState(0);
  const [dataWithFields, setDataWithFields] = useState([]);
  const [dataWithoutFields, setDataWithoutFields] = useState([]);


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

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredData = useMemo(() => {
    switch (selectedCategory) {
      case "GPM":
        return dataWithFields || []; 
      case "SEO":
        return dataWithoutFields || [];
      default:
        return inquiries || [];
    }
  }, [selectedCategory, dataWithFields, dataWithoutFields, inquiries]);




  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({ row }) => {
          return <div>{row.index + 1}</div>; // This will display auto-incremented numbers starting from 1
      },
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Mobile No",
        accessor: "mobileNo",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Resume",
        accessor: "resume",
        Cell: ({ value }) => (
          <div className="flex gap-4">
            <a className="text-green-500 hover:text-green-700 transition" href={`/api/careerInquiries/download/${value}`}>
              <FaDownload size={20} />
            </a>
            <button className="text-blue-500 hover:text-blue-700 transition" onClick={() => viewResume(value)}>
              <FaEye size={20} />
            </button>
          </div>
        ),
        disableSortBy: true,
      },
      {
        Header: "Message",
        accessor: "message",
      },
      {
        Header: "Options",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            <button className="text-red-500 hover:text-red-700 transition" onClick={() => deleteInquiry(row.original._id)}>
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
      data: filteredData,
    },
    useSortBy
  );


  const deleteInquiry = async (id) => {
    try {
      const response = await axios.delete(`/api/careerInquiries/deleteCareerInquiries?id=${id}`, { withCredentials: true });
      fetchInquiryData();
    } catch (error) {
      console.error(error);
    }
  };



  const viewResume = (filename) => {
    window.open(`/api/careerInquiries/view/${filename}`);
  };

  useEffect(() => {

    fetchInquiryData();
  }, []);

  return (
    <div className="p-4 overflow-x-auto">
      <h1 className="text-xl font-bold  text-gray-700 font-serif uppercase mb-4">Inquiries</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
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
            <option value="SEO">SEO</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 14.707a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L9 12.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4z" />
            </svg>
          </div>
        </div>

      </div>
      {loadings ? (
        <div className="flex justify-center"><UseAnimations animation={loading} size={56} /></div>
      ) : (
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

    </div>
  );
};

export default CareerInquiryTable;
