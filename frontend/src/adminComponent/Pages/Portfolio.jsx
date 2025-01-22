import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { FaEdit, FaTrashAlt, FaCheck, FaEye, FaTimes, FaArrowUp, FaArrowDown, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";


Modal.setAppElement('#root');

const PortfolioTable = () => {
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [Portfolio, setPortfolio] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [metaFilter, setMetaFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPortfolio, setSelectedPortfolio] = useState(null); // State for the selected banner
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const navigate = useNavigate()
  const pageSize = 5;


  const filteredPortfolio = useMemo(() => {
    return Portfolio.filter((Portfolio) => {
      if (metaFilter === "Meta Available") {
        return Portfolio.metatitle && Portfolio.metatitle.length > 0 || Portfolio.metadescription && Portfolio.metadescription.length > 0;
      }
      if (metaFilter === "Meta Unavailable") {
        return !Portfolio.metatitle || Portfolio.metatitle.length === 0 || !Portfolio.metadescription || Portfolio.metadescription.length === 0;
      }
      return true;
    }).filter((Portfolio) =>
      Portfolio.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [Portfolio, searchTerm, metaFilter]);


  const notify = () => {
    toast.success("Updated Successfully!");
  };

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
            onClick={() => navigate(`/portfolio/editPortfolio/${row.original.slug}`)}
          >
            {row.original.categoryName}
          </span>
        ),
      },
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/portfolio/editPortfolio/${row.original.slug}`)}
          >
            {row.original.title}
          </span>
        ),
      },
      {
        Header: "Photo",
        accessor: "photo",
        Cell: ({ value }) => {
          const firstImage = Array.isArray(value) && value.length > 0 ? value[0] : null;
          return firstImage ? <img src={`/api/image/download/${firstImage}`} alt="Portfolio" className="w-32 h-20 object-cover" /> : null;
        },
        disableSortBy: true,
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
            <button className="text-blue-500 hover:text-blue-700 transition" onClick={() => handleView(row.original)}>
              <FaEye />
            </button>
            <button className="text-blue-500 hover:text-blue-700 transition">
              <Link to={`/portfolio/editPortfolio/${row.original.slug}`}><FaEdit /></Link>
            </button>
            <button className="text-red-500 hover:text-red-700 transition" onClick={() => deletePortfolio(row.original.slug)}>
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

  const fetchData = async (pageIndex) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/portfolio/getPortfolio?page=${pageIndex + 1}`, { withCredentials: true });
      const PortfolioWithIds = response.data.data.map((PortfolioItem, index) => ({
        ...PortfolioItem,
        id: pageIndex * pageSize + index + 1
      }));
      setPortfolio(PortfolioWithIds);
      setPageCount(Math.ceil(response.data.total / pageSize));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (Portfolio) => {
    setSelectedPortfolio(Portfolio);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPortfolio(null);
  };

  const deletePortfolio = async (slugs) => {
    try {
      const response = await axios.delete(`/api/portfolio/deletePortfolio?slugs=${slugs}`, { withCredentials: true });

      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(pageIndex);
  }, [pageIndex]);

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=portfolio', { withCredentials: true });
      const { heading, subheading } = response.data;
      setHeading(heading || '');
      setSubheading(subheading || '');
    } catch (error) {
      console.error(error);
    }
  };

  const saveHeadings = async () => {
    try {
      await axios.put('/api/pageHeading/updateHeading?pageType=portfolio', {
        pagetype: 'Portfolio',
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
        <h1 className="text-xl font-bold  text-gray-700 font-serif uppercase">News</h1>
        <div className="flex gap-2">
 
          <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif">
            <Link to="/portfolio/createPortfolio"><FaPlus size={15} /></Link>
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold  text-gray-700 font-serif uppercase">Portfolio</h1>
   
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
      <h2 className="text-md font-semibold mb-4">Manage Portfolio</h2>
      {loadings ? (
        <div className="flex justify-center"><UseAnimations animation={loading} size={56} /></div>

      ) : (
        <>{Portfolio.length == 0 ? <div className="flex justify-center items-center"><iframe className="w-96 h-96" src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"></iframe></div>
          : <table className="w-full mt-4 border-collapse" {...getTableProps()}>
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
        </>

      )}
      <div className="mt-4 flex justify-center">
        <button onClick={() => setPageIndex(0)} disabled={pageIndex === 0} className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition">
          {"<<"}
        </button>{" "}
        <button onClick={() => setPageIndex(pageIndex - 1)} disabled={pageIndex === 0} className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition">
          {"<"}
        </button>{" "}
        <button onClick={() => setPageIndex(pageIndex + 1)} disabled={pageIndex + 1 >= pageCount} className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition">
          {">"}
        </button>{" "}
        <button onClick={() => setPageIndex(pageCount - 1)} disabled={pageIndex + 1 >= pageCount} className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition">
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageCount}
          </strong>{" "}
        </span>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Banner Details"
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
                <p>{selectedPortfolio.categoryName}</p>
              </div>
              <div className="flex mt-2">
                <p className="mr-2 font-semibold font-serif">title:</p>
                <p>{selectedPortfolio.title}</p>
              </div>

              <div className="mt-2">
                <p className="mr-2 font-semibold font-serif">Description :</p>
                <ReactQuill
                  readOnly={true}
                  value={selectedPortfolio.details}
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
    </div>
  );
};

export default PortfolioTable;
