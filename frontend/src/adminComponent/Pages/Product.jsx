import React, { useState, useMemo, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaDownload, FaCheck, FaEye, FaTimes, FaArrowUp, FaArrowDown, FaPlus, FaFileImport, FaFileExport } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";


Modal.setAppElement('#root');


const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [showFileInput, setShowFileInput] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [metaFilter, setMetaFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null); // State for the selected banner
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const navigate = useNavigate()

  const pageSize = 5;

  const notify = () => {
    toast.success("Updated Successfully!");
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (metaFilter === "Meta Available") {
        return product.metatitle && product.metatitle.length > 0 || product.metadescription && product.metadescription.length > 0;
      }
      if (metaFilter === "Meta Unavailable") {
        return !product.metatitle || product.metatitle.length === 0 && !product.metadescription || product.metadescription.length === 0;
      }
      return true;
    }).filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm, metaFilter]);



  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "autoIncrementId", // Display the auto-incremental ID
      },
      {
        Header: "Category",
        accessor: "categoryName",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/product/editProduct/${row.original.slug}`)}
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
            onClick={() => navigate(`/product/editProduct/${row.original.slug}`)}
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
          return firstImage ? <img src={`/api/image/download/${firstImage}`} alt="Banner" className=" w-fit h-20" /> : null;
        },
        disableSortBy: true,
      },
      {
        Header: "Catalogue",
        accessor: "catalogue",
        Cell: ({ value }) => (
          <div className="flex gap-4">
            <a className="text-green-500 hover:text-green-700 transition" href={`/api/product/download/${value}`}>
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
              <Link to={`/product/editProduct/${row.original.slug}`}>
                <FaEdit />
              </Link>
            </button>
            <button
              className="text-red-500 hover:text-red-700 transition"
              onClick={() => deleteProduct(row.original.slug)}
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
      data: filteredProducts,
    },
    useSortBy
  );

  const viewResume = (filename) => {
    window.open(`/api/product/view/${filename}`);
  };

  const fetchProducts = async (pageIndex) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/product/getAllProducts?page=${pageIndex + 1}`, { withCredentials: true });
      const productsWithAutoIncrementId = response.data.data.map((product, index) => ({
        ...product,
        autoIncrementId: pageIndex * pageSize + index + 1
      }));

      setProducts(productsWithAutoIncrementId);
      setPageCount(Math.ceil(response.data.total / pageSize));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (slugs) => {
    try {
      await axios.delete(`/api/product/deleteProduct?slugs=${slugs}`, { withCredentials: true });
      window.location.href="/product"
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts(pageIndex);
  }, [pageIndex]);

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=product', { withCredentials: true });
      const { heading, subheading } = response.data;
      setHeading(heading || '');
      setSubheading(subheading || '');
    } catch (error) {
      console.error(error);
    }
  };

  const saveHeadings = async () => {
    try {
      await axios.put('/api/pageHeading/updateHeading?pageType=product', {
        pagetype: 'product',
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

  const handleView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleHeadingChange = (e) => setHeading(e.target.value);
  const handleSubheadingChange = (e) => setSubheading(e.target.value);

  function exportProducts() {
    axios.get('/api/product/exportProduct', { responseType: 'blob', withCredentials: true })
      .then(response => {
        // Create a temporary link element
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'products.xlsx';
        document.body.appendChild(a);
        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(error => {
        console.error('Error exporting products:', error);
        alert('Failed to export products');
      });
  }



  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = async () => {

    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }


    const formData = new FormData();
    formData.append('file', file);


    try {
      const response = await axios.post('/api/product/importProduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Failed to upload file.');
    }
  }

  return (
    <div className="p-4 overflow-x-auto">
      <ToastContainer />
      <div className="mb-8 border border-gray-200 shadow-lg p-4 rounded ">
        <div className="grid md:grid-cols-2  md:gap-2 grid-cols-1">
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
      <div className="flex md:flex-row flex-col justify-between md:items-center mb-4">
        <h1 className="text-xl font-bold  text-gray-700 font-serif uppercase">Products</h1>
        <div className="flex gap-2 md:flex-row flex-col md:mt-0 mt-4">
          <div className="flex items-center gap-2">
            <select
              className="px-2 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
              value={metaFilter}
              onChange={(e) => setMetaFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Meta Available">Meta Available</option>
              <option value="Meta Unavailable">Meta Unavailable</option>
            </select>

            <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300" title="Add">
              <Link to="/product/createProduct"><FaPlus size={15} /></Link>
            </button>
            <button onClick={exportProducts} className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300" title="Export">
              <FaFileExport size={15} />
            </button>
            <button onClick={() => { onFileUpload(); setShowFileInput(true) }} className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300" title="Import" >
              <FaFileImport size={15} />
            </button>
          </div>
          <div>
            {showFileInput && (
              <div className=" mt-2 p-2 bg-white border border-gray-200 rounded shadow-md">
                <input type="file" onChange={handleFileChange} className="mb-2" />
                <button onClick={onFileUpload} className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300">
                  Upload
                </button>
                {message && <p>{message}</p>}
              </div>
            )}
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
      <h2 className="text-md font-semibold mb-4">Manage your Products</h2>
      {loadings ? (
        <div className="flex justify-center"><UseAnimations animation={loading} size={56} /></div>
      ) : (
        <>{products.length == 0 ? <div className="flex justify-center items-center"><iframe className="w-96 h-96" src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"></iframe></div>
          : <table className="w-full mt-4 border-collapse" {...getTableProps()}>
          <thead className=" bg-slate-700 hover:bg-slate-800 text-white">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="py-2 px-4 border-b border-gray-300 cursor-pointer uppercase font-serif"
                  >
                    <div className="flex items-center gap-2">
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
                <tr
                  {...row.getRowProps()}
                  className="border-b border-gray-300 hover:bg-gray-100 transition duration-150"
                >
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="py-2 px-4">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>}</>
       
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
          <h2 className="text-xl font-bold mb-4 font-serif">Product</h2>
          {selectedProduct && (
            <div>
              <div className="flex mt-2">
                <p className="mr-2 font-semibold font-serif">Category :</p>
                <p>{selectedProduct.categoryName}</p>
              </div>
              <div className="flex mt-2">
                <p className="mr-2 font-semibold font-serif">Title :</p>
                <p>{selectedProduct.title}</p>
              </div>
              <div className="mt-2">
                <p className="mr-2 font-semibold font-serif">Description :</p>
                <ReactQuill
                  readOnly={true}
                  value={selectedProduct.details}
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

export default ProductsTable;