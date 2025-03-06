import React, { useMemo, useState } from 'react';
import { useTable, useSortBy } from "react-table";
import { FaEdit, FaTrashAlt, FaCheck, FaEye, FaTimes, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { Collapse, Typography, Pagination } from "antd";

const { Panel } = Collapse;
const { Title } = Typography;

export const FaqTableComponent = ({ faqs, searchTerm, navigate, handleView, deleteFaq }) => {
  const [categoryPage, setCategoryPage] = useState(1);
  const [dataPage, setDataPage] = useState(1);
  const categoriesPerPage = 5;
  const dataPerPage = 20;

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [faqs, searchTerm]);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Question",
        accessor: "question",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/faq/editFAQ/${row.original._id}`)}
          >
            {row.original.question}
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
            <button className="text-gray-600 hover:text-gray-800 transition" onClick={() => handleView(row.original)}>
              <FaEye />
            </button>
            <button className="text-blue-500 hover:text-blue-700 transition">
              <Link to={`/faq/editFAQ/${row.original._id}`}><FaEdit /></Link>
            </button>
            <button className="text-red-500 hover:text-red-700 transition" onClick={() => deleteFaq(row.original._id)}>
              <FaTrashAlt />
            </button>
          </div>
        ),
        disableSortBy: true,
      },
    ],
    [navigate, handleView, deleteFaq]
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
      data: filteredFaqs,
    },
    useSortBy
  );

  // Group FAQs by categories
  const categorizedFaqs = useMemo(() => {
    return filteredFaqs.reduce((acc, faq) => {
      const category = faq.serviceparentCategoryId || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(faq);
      return acc;
    }, {});
  }, [filteredFaqs]);

  // Get paginated categories
  const categoryKeys = Object.keys(categorizedFaqs);
  const paginatedCategories = useMemo(() => {
    return categoryKeys.slice((categoryPage - 1) * categoriesPerPage, categoryPage * categoriesPerPage);
  }, [categoryKeys, categoryPage]);

  return (
    <>
      <Collapse>
        {paginatedCategories.map((category) => (
          <Panel
            header={
              <div className="flex justify-between items-center w-full">
                <Title level={5} className="m-0">
                  {category}
                </Title>
                <span className="text-secondary">{categorizedFaqs[category].length} FAQs</span>
              </div>
            }
            key={category}
          >
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
                {categorizedFaqs[category].slice((dataPage - 1) * dataPerPage, dataPage * dataPerPage).map((faq) => {
                  const row = rows.find((r) => r.original._id === faq._id);
                  if (row) {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} className="border-b border-gray-300 hover:bg-gray-100 transition duration-150">
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()} className="py-2 px-4">
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <Pagination
                current={dataPage}
                pageSize={dataPerPage}
                total={categorizedFaqs[category].length}
                onChange={(page) => setDataPage(page)}
                showSizeChanger={false}
              />
            </div>
          </Panel>
        ))}
      </Collapse>
      <div className="flex justify-end mt-4">
        <Pagination
          current={categoryPage}
          pageSize={categoriesPerPage}
          total={categoryKeys.length}
          onChange={(page) => setCategoryPage(page)}
          showSizeChanger={false}
        />
      </div>
    </>
  );
};