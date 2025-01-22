import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { FaEdit, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from 'axios';
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";

const flattenData = (data, type) => {
  const flattened = [];
  data.forEach((item) => {
    flattened.push({
      _id: item._id,
      url: item.url,
      metatitle: item.metatitle,
      metadescription: item.metadescription,
      metakeywords: item.metakeywords,
      metacanonical: item.metacanonical,
      metalanguage: item.metalanguage,
      metaschema: item.metaschema,
      otherMeta: item.otherMeta,
      type: type,
    });

    if (Array.isArray(item.subCategories)) {
      item.subCategories.forEach((sub) => {
        flattened.push({
          _id: sub._id,
          url: sub.url,
          metatitle: sub.metatitle,
          metadescription: sub.metadescription,
          metakeywords: sub.metakeywords,
          metacanonical: sub.metacanonical,
          metalanguage: sub.metalanguage,
          metaschema: sub.metaschema,
          otherMeta: sub.otherMeta,
          type: type,
        });

        if (Array.isArray(sub.subSubCategory)) {
          sub.subSubCategory.forEach((subSub) => {
            flattened.push({
              _id: subSub._id,
              url: subSub.url,
              metatitle: subSub.metatitle,
              metadescription: subSub.metadescription,
              metakeywords: subSub.metakeywords,
              metacanonical: subSub.metacanonical,
              metalanguage: subSub.metalanguage,
              metaschema: subSub.metaschema,
              otherMeta: subSub.otherMeta,
              type: type,
            });
          });
        }
      });
    }
  });
  return flattened;
};

const MetaDetailsTable = () => {
  const [metaDetails, setMetaDetails] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [filterNoMetaTitle, setFilterNoMetaTitle] = useState(false);
  const [filterNoMetaDescription, setFilterNoMetaDescription] = useState(false);

  const filteredMetaDetails = useMemo(() => {
    return metaDetails.filter((metaDetail) => {
      const matchesSearch = metaDetail.url.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMetaTitleFilter = filterNoMetaTitle ? !metaDetail.metatitle : true;
      const matchesMetaDescriptionFilter = filterNoMetaDescription ? !metaDetail.metadescription : true;
      return matchesSearch && matchesMetaTitleFilter && matchesMetaDescriptionFilter;
    });
  }, [metaDetails, searchTerm, filterNoMetaTitle, filterNoMetaDescription]);




  const columns = useMemo(
    () => [
      {
        Header: "URL",
        accessor: "url",
      },
      {
        Header: "Meta Title",
        accessor: "metatitle",
      },
      {
        Header: "Meta Description",
        accessor: "metadescription",
      },
      {
        Header: "Options",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            <button className="text-blue-500 hover:text-blue-700 transition">
              <Link to={`/metadetails/editMetaDetails/${row.original._id}/${row.original.type}`}><FaEdit /></Link>
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
      data: filteredMetaDetails,
    },
    useSortBy
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        dataResponse,
        // productResponse,
        // productCategoryResponse,
        // serviceResponse,
        // serviceCategoryResponse,
        // newsResponse,
        // newsCategoryResponse,
      ] = await Promise.all([
        axios.get(`/api/sitemap/fetchSitemaps`, { withCredentials: true }),
        // axios.get(`/api/product/fetchUrlmeta`, { withCredentials: true }),
        // axios.get(`/api/product/fetchCategoryUrlmeta`, { withCredentials: true }),
        // axios.get(`/api/services/fetchUrlmeta`, { withCredentials: true }),
        // axios.get(`/api/services/fetchCategoryUrlmeta`, { withCredentials: true }),
        // axios.get(`/api/news/fetchUrlmeta`, { withCredentials: true }),
        // axios.get(`/api/news/fetchCategoryUrlmeta`, { withCredentials: true }),
      ]);

      const combinedMetaDetails = [
        ...flattenData(dataResponse.data, "data"),
        // ...flattenData(productResponse.data, "products"),
        // ...flattenData(productCategoryResponse.data, "product-category"),
        // ...flattenData(serviceResponse.data, "service"),
        // ...flattenData(serviceCategoryResponse.data, "service-category"),
        // ...flattenData(newsResponse.data, "new"),
        // ...flattenData(newsCategoryResponse.data, "news-category"),
      ];

      setMetaDetails(combinedMetaDetails);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold  text-gray-700 font-serif uppercase">Meta Details</h1>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
        />
      </div>
      <div className="mb-4 ">
        <label className="mr-2">
          <input
            type="checkbox"
            checked={filterNoMetaTitle}
            onChange={(e) => setFilterNoMetaTitle(e.target.checked)}
            className="mr-2 w-4 h-4"
          />
          Show entries without Meta Title
        </label>
        <label className="ml-4">
          <input
            type="checkbox"
            checked={filterNoMetaDescription}
            onChange={(e) => setFilterNoMetaDescription(e.target.checked)}
            className="mr-2 w-4 h-4"
          />
          Show entries without Meta Description
        </label>
      </div>
      <h2 className="text-md font-semibold mb-4">Manage Meta Details</h2>
      {loadings ? (
        <div className="flex justify-center"><UseAnimations animation={loading} size={56} /></div>

      ) : (
        <>
          {metaDetails.length == 0 ? <div className="flex justify-center items-center"><iframe className="w-96 h-96" src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"></iframe></div>
            : <table className="w-full mt-4 border-collapse" {...getTableProps()}>
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
                {rows.map((row) => {
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
                })}
              </tbody>
            </table>
          }
        </>

      )}
    </div>
  );
};

export default MetaDetailsTable;
