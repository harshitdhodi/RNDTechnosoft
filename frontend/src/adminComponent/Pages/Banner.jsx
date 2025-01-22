import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { FaEdit, FaTrashAlt, FaCheck, FaTimes, FaArrowUp, FaArrowDown, FaPlus, FaEye } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom"
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";
Modal.setAppElement('#root'); // Make sure to set the root element for accessibility

const BannersTable = () => {
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [banners, setBanners] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedBanner, setSelectedBanner] = useState(null); // State for the selected banner
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const pageSize = 5;
  const navigate = useNavigate()

  const notify = () => {
    toast.success("Updated Successfully!");
  };
  const filteredBanners = useMemo(() => {
    let filteredData = banners;
    if (selectedSection) {
      filteredData = filteredData.filter((banner) =>
        banner.section.toLowerCase().includes(selectedSection.toLowerCase())
      );
    }
    if (searchTerm) {
      filteredData = filteredData.filter((banner) =>
        banner.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filteredData;
  }, [banners, searchTerm, selectedSection]);

  const columns = useMemo(
    () => [
      {
        Header: "Priority",
        accessor: "priority",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/banner/editBanner/${row.original._id}`)}
          >
            {row.original.priority}
          </span>
        ),
      },
      {
        Header: "Section",
        accessor: "section",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/banner/editBanner/${row.original._id}`)}
          >
            {row.original.section}
          </span>
        ),
      },
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/banner/editBanner/${row.original._id}`)}
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
          return firstImage ? <img src={`/api/image/download/${firstImage}`} alt="Banner" className="w-32 h-20 object-cover" /> : null;
        },
        disableSortBy: true,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (value === "active" ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />),
        disableSortBy: true,
      },
      {
        Header: "Options",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            <button className="text-gray-700 hover:text-gray-900 transition" onClick={() => handleView(row.original)}>
              <FaEye />
            </button>
            <button className="text-blue-500 hover:text-blue-700 transition">
              <Link to={`/banner/editBanner/${row.original._id}`}>
                <FaEdit />
              </Link>
            </button>
            <button
              className="text-red-500 hover:text-red-700 transition"
              onClick={() => deleteBanner(row.original._id, row.original.section)}
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
      data: filteredBanners,
    },
    useSortBy
  );

  const fetchData = async (pageIndex) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/banner/getBanner?page=${pageIndex + 1}`, { withCredentials: true });
      const bannersWithIds = response.data.data.map((banner, index) => ({
        ...banner,
        id: pageIndex * pageSize + index + 1,
      }));
      setBanners(bannersWithIds);
      setPageCount(Math.ceil(response.data.total / pageSize)); // Assuming the API returns the total number of items
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (id, section) => {
    try {
      await axios.delete(`/api/banner/deleteBanner?id=${id}&section=${section}`, { withCredentials: true });
      fetchData(pageIndex);
    } catch (error) {
      console.error(error);
    }
  };

  const handleView = (banner) => {
    setSelectedBanner(banner);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBanner(null);
  };

  useEffect(() => {
    fetchData(pageIndex);
  }, [pageIndex]);

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=banner', { withCredentials: true });
      const { heading, subheading } = response.data;
      setHeading(heading || '');
      setSubheading(subheading || '');
    } catch (error) {
      console.error(error);
    }
  };

  const saveHeadings = async () => {
    try {
      await axios.put('/api/pageHeading/updateHeading?pageType=banner', {
        pagetype: 'banner',
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
      <div className="mb-8 border border-gray-200 shadow-lg p-4 rounded">
        <div className="grid md:grid-cols-2 md:gap-2 grid-cols-1 ">
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
          className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300"
        >
          Save
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold  text-gray-700 font-serif uppercase">Banners</h1>
        <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif">
          <Link to="/banner/createBanner">
            <FaPlus size={15} />
          </Link>
        </button>
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
      <div className="mb-4 flex">
        <label className=" text-gray-700 font-bold mb-2 uppercase font-serif mr-4 flex items-center">Select Section :</label>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className=" px-4 w-64  border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
        >
          <option value="">All</option>
          <option value="PrivacyPolicy">Privacy Policy</option>
          <option value="TermConditions">Terms & Conditions</option>
          <option value="CookiePolicy">Cookie Policy</option>
          <option value="Contact">Contact</option>
          <option value="Collaborationinquiries">Collaboration inquiries</option>
        </select>
      </div>
      {
        loadings ? (
          <div className="flex justify-center"><UseAnimations animation={loading} size={56} /></div>
        ) : (
         <>
         {banners.length==0?<div className="flex justify-center items-center"><iframe className="w-96 h-96" src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"></iframe></div>: <table table className="w-full mt-4 border-collapse" {...getTableProps()}>
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
            <tr {...row.getRowProps()} className="border-b border-gray-300 hover:bg-gray-100 transition duration-150 ">
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()} className="py-2 px-4 ">
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
      </table>}
         
    </>
        )
      }
      <div className="mt-4 flex justify-center">
        <button onClick={() => setPageIndex(0)} disabled={pageIndex === 0} className="mr-2 px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-900 transition">
          {"<<"}
        </button>{" "}
        <button onClick={() => setPageIndex(pageIndex - 1)} disabled={pageIndex === 0} className="mr-2 px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-900 transition">
          {"<"}
        </button>{" "}
        <button onClick={() => setPageIndex(pageIndex + 1)} disabled={pageIndex + 1 >= pageCount} className="mr-2 px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-900 transition">
          {">"}
        </button>{" "}
        <button onClick={() => setPageIndex(pageCount - 1)} disabled={pageIndex + 1 >= pageCount} className="mr-2 px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-900 transition">
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
        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 "
      >
        <div className="bg-white p-8 rounded shadow-lg min-w-54 m-4 relative">
        <button onClick={closeModal} className="absolute top-5 right-5 text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
          <h2 className="text-xl font-bold font-serif mb-4">Banner</h2>

          {selectedBanner && (
            <div className="">
              <div className="flex mt-2">
                <p className="mr-2 font-semibold font-serif">Priority :</p>
                <p>{selectedBanner.priority}</p>
              </div>
              <div className="flex mt-2">
                <p className="mr-2 font-semibold font-serif">Section :</p>
                <p>{selectedBanner.section}</p>
              </div>
              <div className="flex mt-2">
                <p className="mr-2 font-semibold font-serif">Title :</p>
                <p>{selectedBanner.title}</p>
              </div>
              <div className=" mt-2">
                <p className="mr-2 font-semibold font-serif">Description :</p>
                <ReactQuill
                  readOnly={true}
                  value={selectedBanner.details}
                  modules={{ toolbar: false }}
                  theme="bubble"
                  className="quill"
                />
              </div>
            </div>
          )}
          
        </div>
      </Modal>
    </div >
  );
};

export default BannersTable;
