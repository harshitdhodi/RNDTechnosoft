import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const modules = {
  toolbar: [
    [{ font: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image", "video"],
    [{ direction: "rtl" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const EditPackageForm = () => {
  const { packageId } = useParams(); // Extract packageId from the URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [categories, setCategories] = useState([]);
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subSubCategoryId, setSubSubCategoryId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackageDetails(); // Fetch package details using packageId
    fetchCategories(); // Fetch categories for the dropdown
  }, [packageId]); // Add packageId as a dependency

  const fetchPackageDetails = async () => {
    try {
      const response = await axios.get(
        `/api/packagedescription/single/${packageId}`,
        {
          withCredentials: true,
        }
      );
      const packageData = response.data;
      setTitle(packageData.title);
      setDescription(packageData.description);
      setStatus(packageData.status);

      // Fetch categories
      try {
        const categoryResponse = await axios.get(
          `/api/packages/getSpecificCategory?categoryId=${packageData.categories}`,
          { withCredentials: true }
        );
        const category = categoryResponse.data;
        setParentCategoryId(category.slug);
      } catch (error) {
        console.error("Error fetching parent category:", error);
      }

      try {
        const subCategoryResponse = await axios.get(
          `/api/packages/getSpecificSubcategory?categoryId=${packageData.categories}&subCategoryId=${packageData.subcategories}`,
          { withCredentials: true }
        );
        const subCategory = subCategoryResponse.data;
        setSubCategoryId(subCategory.slug);
      } catch (error) {
        console.error("Error fetching subcategory:", error);
      }

      try {
        const subSubCategoryResponse = await axios.get(
          `/api/packages/getSpecificSubSubcategory?categoryId=${packageData.categories}&subCategoryId=${packageData.subcategories}&subSubCategoryId=${packageData.subSubcategories}`,
          { withCredentials: true }
        );
        const subSubCategory = subSubCategoryResponse.data;
        setSubSubCategoryId(subSubCategory.slug);
      } catch (error) {
        console.error("Error fetching sub-subcategory:", error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch package details.");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/packages/getall", {
        withCredentials: true,
      });
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("status", status);
      formData.append("categories", parentCategoryId);
      formData.append("subcategories", subCategoryId);
      formData.append("subSubcategories", subSubCategoryId);

      await axios.put(`/api/packagedescription/updatePackage/${packageId}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      toast.success("Package updated successfully!");
      navigate("/package");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update package. Please try again.");
    }
  };

  const removeItem = (setter, index) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const addItem = (setter, item) => {
    setter((prev) => [...prev, item]);
  };

  const renderInputList = (items, setter) => {
    return items.map((item, index) => (
      <div key={index} className="flex items-center mb-2">
        <input
          type="text"
          value={item}
          onChange={(e) => {
            const newItems = [...items];
            newItems[index] = e.target.value;
            setter(newItems);
          }}
          className="w-full p-2 border rounded focus:outline-none"
        />
        <button
          type="button"
          onClick={() => removeItem(setter, index)}
          className="bg-red-500 text-white px-2 py-1 rounded ml-2 hover:bg-red-700 transition duration-300"
        >
          Remove
        </button>
      </div>
    ));
  };

  const renderCategoryOptions = (category) => {
    return (
      <option key={category._id} value={category.slug}>
        {category.category}
      </option>
    );
  };

  const renderSubCategoryOptions = (subCategory) => {
    return (
      <option key={subCategory._id} value={subCategory.slug}>
        {subCategory.category}
      </option>
    );
  };

  const renderSubSubCategoryOptions = (subSubCategory) => {
    return (
      <option key={subSubCategory._id} value={subSubCategory.slug}>
        {subSubCategory.category}
      </option>
    );
  };

  const handleParentCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setParentCategoryId(selectedCategoryId);
    setSubCategoryId("");
    setSubSubCategoryId("");
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setSubCategoryId(selectedSubCategoryId);
    setSubSubCategoryId("");
  };

  // Handler for regular sub-subcategory
  const handleSubSubCategoryChange = (e) => {
    const selectedSubSubCategoryId = e.target.value;
    setSubSubCategoryId(selectedSubSubCategoryId);
  };

  // Render categories safely
  const getSubCategories = (categoryId) => {
    const category = categories.find(
      (category) => category.slug === categoryId
    );
    return category?.subCategories || [];
  };
  const getSubSubCategories = (categoryId, subCategoryId) => {
    const category = categories.find(
      (category) => category.slug === categoryId
    );
    if (!category) {
      return [];
    }

    const subCategory = category.subCategories.find(
      (sub) => sub.slug === subCategoryId
    );
    if (!subCategory) {
      return [];
    }

    return subCategory.subSubCategory || [];
  };


  
  return (
    <form onSubmit={handleSubmit} className="p-4">
      <ToastContainer />
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">
        Edit Package
      </h1>

      <div className="mb-4">
        <label htmlFor="parentCategory" className="block font-semibold mb-2">
          Parent Category
        </label>
        <select
          id="parentCategory"
          value={parentCategoryId}
          onChange={handleParentCategoryChange}
          className="w-full p-2 border rounded focus:outline-none"
        >
          <option value="">Select Parent Category</option>
          {categories.map(renderCategoryOptions)}
        </select>
      </div>

      {getSubCategories(parentCategoryId).length > 0 && (
        <div className="mb-4">
          <label htmlFor="subCategory" className="block font-semibold mb-2">
            Subcategory
          </label>
          <select
            id="subCategory"
            value={subCategoryId}
            onChange={handleSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Subcategory</option>
            {getSubCategories(parentCategoryId).map(renderSubCategoryOptions)}
          </select>
        </div>
      )}

      {getSubSubCategories(parentCategoryId, subCategoryId).length > 0 && (
        <div className="mb-4">
          <label htmlFor="subSubCategory" className="block font-semibold mb-2">
            Sub-Subcategory
          </label>
          <select
            id="subSubCategory"
            value={subSubCategoryId}
            onChange={handleSubSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Sub-Subcategory</option>
            {getSubSubCategories(parentCategoryId, subCategoryId).map(
              renderSubSubCategoryOptions
            )}
          </select>
        </div>
      )}
    
      <div className="mb-4">
        <label htmlFor="title" className="block font-semibold mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block font-semibold mb-2">
          Description
        </label>
        <ReactQuill
          value={description}
          onChange={setDescription}
          modules={modules}
          className="quill"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="status" className="block font-semibold mb-2">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
      >
        Update Package
      </button>
    </form>
  );
};

export default EditPackageForm;
