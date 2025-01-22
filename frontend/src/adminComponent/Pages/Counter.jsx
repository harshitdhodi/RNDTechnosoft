import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { FaEdit, FaTrashAlt, FaCheck, FaTimes, FaArrowUp, FaArrowDown, FaPlus, FaFileImport, FaFileExport } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import axios from 'axios';
import * as FaIcons from "react-icons/fa";
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";


const CountersTable = () => {
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [counters, setCounters] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate()

  const filteredCounters = useMemo(() => {
    return counters.filter((counter) =>
      counter.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [counters, searchTerm]);


  const notify = () => {
    toast.success("Updated Successfully!");
  };



  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      // {
      //   Header: "Icon",
      //   accessor: "icon",
      //   Cell: ({ value }) => <DynamicFaIcon name={value} />,
      //   disableSortBy: true,
      // },
      {
        Header: "Photo",
        accessor: "photo",
        Cell: ({ value }) => {
          return <img src={`/api/logo/download/${value}`} alt="counter" className=" w-fit h-20" />;

        },
        disableSortBy: true,
      },
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/counter/editCounter/${row.original._id}`)}
          >
            {row.original.title}
          </span>
        ),
      },
      {
        Header: "No",
        accessor: "no",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/counter/editCounter/${row.original._id}`)}
          >
            {row.original.no}
          </span>
        ),
      },
      {
        Header: "Sign",
        accessor: "sign",
        disableSortBy: true,
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/counter/editCounter/${row.original._id}`)}
          >
            {row.original.sign}
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
          <div className="flex gap-4">
            <button className="text-blue-500 hover:text-blue-700 transition">
              <Link to={`/counter/editCounter/${row.original._id}`}>  <FaEdit /></Link>
            </button>
            <button className="text-red-500 hover:text-red-700 transition" onClick={() => deleteCounter(row.original._id)}>
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
      data: filteredCounters,
    },
    useSortBy
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/counter/getCounter`, { withCredentials: true });
      const countersWithIds = response.data.map((counter, index) => ({
        ...counter,
        icon: counter.icon,
        id: index + 1,
      }));
      setCounters(countersWithIds);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCounter = async (id) => {
    try {
      const response = await axios.delete(`/api/counter/deleteCounter?id=${id}`, { withCredentials: true });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const DynamicFaIcon = ({ name }) => {
    const IconComponent = FaIcons[name];
    if (!IconComponent) {
      return <FaIcons.FaQuestionCircle />; // Return a default icon if the specified icon doesn't exist
    }
    return <IconComponent size={25} />;
  };


  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=counter', { withCredentials: true });
      const { heading, subheading } = response.data;
      setHeading(heading || '');
      setSubheading(subheading || '');
    } catch (error) {
      console.error(error);
    }
  };

  const saveHeadings = async () => {
    try {
      await axios.put('/api/pageHeading/updateHeading?pageType=counter', {
        pagetype: 'testimonial',
        heading,
        subheading,
      }, { withCredentials: true });
      notify();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHeadings();
  }, []);


  const handleHeadingChange = (e) => setHeading(e.target.value);
  const handleSubheadingChange = (e) => setSubheading(e.target.value);



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
            <label className="block text-gray-700 font-bold mb-2 font-serif uppercase">Sub heading</label>
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
      <div className="flex md:flex-row flex-col justify-between md:items-center mb-4">
        <h1 className="text-xl font-bold  text-gray-700 font-serif uppercase">Counters</h1>
        <div className="flex gap-2 md:flex-row flex-col md:mt-0 mt-4">
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300">
              <Link to="/counter/createCounter"><FaPlus size={15} /></Link>
            </button>
          </div>
        </div>
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
      <h2 className="text-md font-semibold mb-4">Manage your counters</h2>
      {loadings ? (
      <div className="flex justify-center"><UseAnimations animation={loading} size={56} /></div>
      ) : (
        <>
        {counters.length == 0 ?<div className="flex justify-center items-center"><iframe className="w-96 h-96" src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"></iframe></div>
          :
          <table className="w-full mt-4 border-collapse" {...getTableProps()}>
          <thead className="bg-slate-700 hover:bg-slate-800 text-white">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="py-2 px-4 border-b border-gray-300 cursor-pointer uppercase font-serif"
                  >
                    <div className="flex items-center gap-2 ">
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
                <tr {...row.getRowProps()} className="hover:bg-gray-200">
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="py-2 px-4 border-b border-gray-300"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>}
        </>
        
      )}
    </div>
  );
};

export default CountersTable;
