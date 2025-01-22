import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTable, useSortBy } from "react-table";
import { FaEdit } from "react-icons/fa";

const CategorySelection = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/industries/getall", { withCredentials: true });
      setCategories(flattenCategories(response.data));
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch categories");
    }
  };

  // Flatten the categories to include hierarchy and indentation
  const flattenCategories = (categories) => {
    const flattened = [];
    categories.forEach((category) => {
      flattened.push({ ...category, indent: 0 });
      if (category.subCategories) {
        category.subCategories.forEach((subcategory) => {
          flattened.push({ ...subcategory, indent: 1, parentCategoryId: category._id });
          if (subcategory.subSubCategory) {
            subcategory.subSubCategory.forEach((subsubcategory) => {
              flattened.push({
                ...subsubcategory,
                indent: 2,
                parentCategoryId: category._id,
                parentSubcategoryId: subcategory._id,
              });
            });
          }
        });
      }
    });
    return flattened;
  };

  const handleEditCategory = (category) => {
    if (category.indent === 0) {
      // If it's a top-level category
      navigate(`/industries/edit-industries/${category._id}`);
    } else if (category.indent === 1) {
      // If it's a subcategory
      navigate(`/industries/edit-subcategory/${category.parentCategoryId}/${category._id}`);
    } else if (category.indent === 2) {
      // If it's a subsubcategory
      navigate(`/industries/edit-subsubcategory/${category.parentCategoryId}/${category.parentSubcategoryId}/${category._id}`);
    }
  };

  // Set up table columns
  const columns = useMemo(
    () => [
      {
        Header: "Category",
        accessor: "category",
        Cell: ({ row }) => (
          <div style={{ marginLeft: `${row.original.indent * 20}px` }}>
            {row.original.category}
          </div>
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <button
            onClick={() => handleEditCategory(row.original)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            <FaEdit />
          </button>
        ),
      },
    ],
    []
  );

  const data = useMemo(() => categories, [categories]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data },
    useSortBy
  );

  return (
    <div className="p-4">
      <ToastContainer />
      <h2 className="text-lg font-semibold mb-4">Select Industries Category</h2>
      <table {...getTableProps()} className="min-w-full bg-white">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-4 py-2 text-left bg-gray-100"
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
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
              <tr {...row.getRowProps()} className="border-t">
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="px-4 py-2">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CategorySelection;
