import React, { useMemo, useState, useEffect } from "react";
import Aboutuspoints from "../Aboutuspoints";
import { useTable, useSortBy } from "react-table";
import { FaEdit, FaTrashAlt, FaCheck, FaTimes, FaArrowUp, FaArrowDown, FaPlus } from "react-icons/fa";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom"
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";

const PageContentTable = () => {
  const [pageContent, setPageContent] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredPageContent = useMemo(() => {
    return pageContent.filter((pageContent) =>
      pageContent.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pageContent, searchTerm]);

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
            onClick={() => navigate(`/extrapages/editextrapages/${row.original._id}`)}
          >
            {row.original.title}
          </span>
        ),
      },
      {
        Header: "Subtitle",
        accessor: "heading",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/extrapages/editextrapages/${row.original._id}`)}
          >
            {row.original.heading}
          </span>
        ),
      },
      {
        Header: "Photo",
        accessor: "photo",
        Cell: ({ value }) => {
          const firstImage = Array.isArray(value) && value.length > 0 ? value[0] : null;
          return firstImage ? <img src={`/api/image/download/${firstImage}`} alt="News" className="h-20 w-32 object-cover" /> : null;
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
            <button className="text-blue-500 hover:text-blue-700 transition">
              <Link to={`/extrapages/editextrapages/${row.original._id}`}><FaEdit /></Link>
            </button>
            <button className="text-red-500 hover:text-red-700 transition" onClick={() => deletePageContent(row.original._id)}>
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
      data: filteredPageContent,
    },
    useSortBy
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/pageContent/getPagecontent`, { withCredentials: true });

      const pageContentWithIds = response.data.map((contentItem, index) => ({
        ...contentItem,
        id: index + 1
      }));
      setPageContent(pageContentWithIds);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deletePageContent = async (id) => {
    try {
      const response = await axios.delete(`/api/pageContent/deletePagecontent?id=${id}`, { withCredentials: true });

      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // New function to handle button clicks
  const handleButtonClick = (pageContentType) => {
    navigate(`/extrapages/${pageContentType}`);
  };

  return (
    <div className="p-4 overflow-x-auto">
      {/* <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold  text-gray-700 font-serif uppercase">Extra Pages</h1>
        <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif">
          <Link to="/extrapages/createextrapages"><FaPlus size={15} /></Link>
        </button>
      </div> */}

      {/* Add Buttons Section */}
      <div className="mb-4">
        <h2 className="text-md font-semibold mb-2">Quick Edit Links</h2>
        <div className="flex flex-wrap gap-2">
  {[
    { type: 'webSolution', name: 'Web Solutions' },
    { type: 'homecard1', name: 'Home Card 1' },
    { type: 'bookcall', name: 'Book a Call' },
    { type: 'whyPartnerus', name: 'Why Partner Us?' },
    { type: 'globalsolution', name: 'Global Solutions' },
    { type: 'challengesface', name: 'Challenges We Face' },
    // { type: 'howecanhelp', name: 'How We Can Help' },
    { type: 'ourservices', name: 'Our Services' },
    { type: 'homecard2', name: 'Home Card 2' },
    { type: 'premiumtemplates', name: 'Premium Templates' },
    { type: 'weareexpertsin' , name:'We are experts in'},
    { type:'everyplan',name:'What you’ll get with every plan' }
  ].map(({ type, name }) => (
    <button
      key={type}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 transition duration-300"
      onClick={() => handleButtonClick(type)}
    >
      {name} {/* Use the display name here */}
    </button>
  ))}
</div>

      </div>

      {/* <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
        />
      </div> */}
      {/* <h2 className="text-md font-semibold mb-4">Manage all extra pages</h2>
      {loadings ? (
        <div className="flex justify-center"><UseAnimations animation={loading} size={56} /></div>
      ) : (
        <>
          {pageContent.length === 0 ? (
            <div className="flex justify-center items-center">
              <iframe className="w-96 h-96" src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"></iframe>
            </div>
          ) : (
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
          )}
        </>
      )} */}
      {/* <Aboutuspoints /> */}
    </div>
  );
};

export default PageContentTable;
