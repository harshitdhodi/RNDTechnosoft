import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import {
 ArrowUp,  //ArrowUp
 ArrowDown,  //ArrowDown
 Plus  //Plus
} from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";
import { Button, Collapse, Pagination, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
const { Title } = Typography;

const NewsTable = () => {
  const [packages, setPackages] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [categoryPageIndex, setCategoryPageIndex] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const pageSize = 5;
  const categoriesPerPage = 5;

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => pkg.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [packages, searchTerm]);

  const notify = () => toast.success("Updated Successfully!");

  const columns = useMemo(() => [
    { Header: "ID", accessor: "id" },
    {
      Header: "Title",
      accessor: "title",
      Cell: ({ row }) => (
        <span className="hover:text-blue-500 cursor-pointer" onClick={() => navigate(`/package/editPackage/${row.original._id}`)}>
          {row.original.title}
        </span>
      ),
    },
    { Header: "Status", accessor: "status" },
    {
      Header: "Categories",
      accessor: "packageCategoryName",
      Cell: ({ row }) => <span>{row.original.packageCategoryName || "N/A"}</span>,
    },
    {
      Header: "Options",
      Cell: ({ row }) => (
        <div className="flex gap-4">
          <Link to={`/package/editPackageDescription/${row.original._id}`}>
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              size="small"
              className="bg-green-500 hover:bg-green-600"
            />
          </Link>
          <Button danger
            shape="circle"
            icon={<DeleteOutlined />}
            size="small" onClick={() => deletePackage(row.original._id)}>
    
          </Button>
        </div >
      ),
      disableSortBy: true,
    },
  ], [navigate]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: filteredPackages }, useSortBy);

  const fetchData = async () => {
    setLoadingState(true);
    try {
      const response = await axios.get(`/api/packagedescription?page=${pageIndex + 1}`, { withCredentials: true });
      const packagesWithIds = response.data.data.map((item, index) => ({
        ...item,
        id: pageIndex * pageSize + index + 1,
      }));
      setPageCount(Math.ceil(response.data.total / pageSize));
      setPackages(packagesWithIds);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoadingState(false);
    }
  };

  const deletePackage = async (id) => {
    try {
      await axios.delete(`/api/packagedescription/delete?id=${id}`, { withCredentials: true });
      fetchData();
      notify("Package deleted successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(pageIndex);
  }, [pageIndex]);

  // Group packages by categories
  const categorizedPackages = useMemo(() => {
    return packages.reduce((acc, pkg) => {
      const category = pkg.packageCategoryName || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(pkg);
      return acc;
    }, {});
  }, [packages]);

  // Get paginated categories
  const categoryKeys = Object.keys(categorizedPackages);
  const paginatedCategories = useMemo(() => {
    return categoryKeys.slice((categoryPageIndex - 1) * categoriesPerPage, categoryPageIndex * categoriesPerPage);
  }, [categoryKeys, categoryPageIndex]);

  return (
    <div className="p-4 overflow-x-auto">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-700 uppercase">Package Description</h1>
        <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition">
          <Link to="/package/createPackageDescription"><Plus size={15} /></Link>
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      <h2 className="text-md font-semibold mb-4">Manage Package</h2>
      {loadingState ? (
        <div className="flex justify-center">
          <UseAnimations animation={loading} size={56} />
        </div>
      ) : packages.length === 0 ? (
        <div className="flex justify-center items-center">
          <iframe className="w-96 h-96" src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"></iframe>
        </div>
      ) : (
        <>
          <Collapse>
            {paginatedCategories.map((category) => (
              <Panel
                header={
                  <div className="flex justify-between items-center w-full">
                    <Title level={5} className="m-0">
                      {category}
                    </Title>
                    <span className="text-secondary">{categorizedPackages[category].length} packages</span>
                  </div>
                }
                key={category}
              >
                <table className="w-full mt-4 border-collapse" {...getTableProps()}>
                  <thead className="bg-slate-700 text-white">
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps(column.getSortByToggleProps())} className="py-2 px-4 border-b cursor-pointer uppercase">
                            <div className="flex items-center gap-2">
                              {column.render("Header")}
                              {column.canSort && (column.isSorted ? (column.isSortedDesc ? <ArrowDown /> : <ArrowUp />) : <ArrowDown className="text-gray-400" />)}
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {categorizedPackages[category].map((pkg) => {
                      const row = rows.find((r) => r.original._id === pkg._id);
                      if (row) {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()} className="border-b hover:bg-gray-100">
                            {row.cells.map((cell) => <td {...cell.getCellProps()} className="py-2 px-4">{cell.render("Cell")}</td>)}
                          </tr>
                        );
                      }
                      return null;
                    })}
                  </tbody>
                </table>
              </Panel>
            ))}
          </Collapse>
          {/* Pagination Controls */}
          <div className="flex justify-end mt-4">
            <Pagination
              current={categoryPageIndex}
              total={categoryKeys.length}
              pageSize={categoriesPerPage}
              onChange={(page) => setCategoryPageIndex(page)}
              className="mt-4 text-center"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default NewsTable;