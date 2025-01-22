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

const NewPackageForm = () => {
  const { categoryId } = useParams(); // Get category ID from URL
  const [title, setTitle] = useState("");
  const [packageType, setPackageType] = useState("normal");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [status, setStatus] = useState("active");
  const [price, setPrice] = useState(0);
  const [whatIsTheir, setWhatIsTheir] = useState([]);
  const [whatIsNotTheir, setWhatIsNotTheir] = useState([]);
  const [categories, setCategories] = useState([]);
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subSubCategoryId, setSubSubCategoryId] = useState("");
  // State for categories, parent, sub, and sub-sub categories with updated naming convention
  const [servicecategories, setServiceCategories] = useState([]);
  const [serviceparentCategoryId, setServiceParentCategoryId] = useState("");
  const [servicesubCategoryId, setServiceSubCategoryId] = useState("");
  const [servicesubSubCategoryId, setServiceSubSubCategoryId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

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
      formData.append("packagetype", packageType);
      formData.append("status", status);
      formData.append("price", price);
      formData.append("categories", parentCategoryId);
      formData.append("subcategories", subCategoryId);
      formData.append("subSubcategories", subSubCategoryId);
      formData.append("servicecategories", serviceparentCategoryId);
      formData.append("servicesubcategories", servicesubCategoryId);
      formData.append("servicesubSubcategories", servicesubSubCategoryId);
      formData.append("whatIsTheir", JSON.stringify(whatIsTheir));
      formData.append("whatIsNotTheir", JSON.stringify(whatIsNotTheir));

      const response = await axios.post(
        "/api/packages/insertPackage",
        formData,
        {
          headers: {
            "Content-Type": "application/json", // Specify JSON content type
          },
          withCredentials: true,
        }
      );

      toast.success("Package added successfully!");
      resetForm();
      navigate("/package"); // Navigate to packages list or desired route
    } catch (error) {
      console.error(error);
      toast.error("Failed to add package. Please try again.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setPackageType("");
    setDescription("");
    setStatus("active");
    setPrice(0);
    setWhatIsTheir([]);
    setWhatIsNotTheir([]);
    setParentCategoryId("");
    setSubCategoryId("");
    setSubSubCategoryId("");
    setPhotos([]);
  };

  const renderCategoryOptions = (category) => (
    <option key={category._id} value={category.slug}>
      {category.category}
    </option>
  );

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

  const handleSubSubCategoryChange = (e) => {
    const selectedSubSubCategoryId = e.target.value;
    setSubSubCategoryId(selectedSubSubCategoryId);
  };

  const findCategoryById = (categories, id) => {
    for (const category of categories) {
      if (category.slug === id) return category;
      if (category.subCategories) {
        const subCategory = findCategoryById(category.subCategories, id);
        if (subCategory) return subCategory;
      }
    }
    return null;
  };

  const findSubCategories = (categories, parentCategoryId) => {
    const parentCategory = findCategoryById(categories, parentCategoryId);
    return parentCategory ? parentCategory.subCategories || [] : [];
  };

  const findSubSubCategories = (
    categories,
    parentCategoryId,
    subCategoryId
  ) => {
    const parentCategory = findCategoryById(categories, parentCategoryId);
    if (parentCategory && parentCategory.subCategories) {
      const subCategory = findCategoryById(
        parentCategory.subCategories,
        subCategoryId
      );
      return subCategory ? subCategory.subSubCategory || [] : [];
    }
    return [];
  };

  const subCategories = parentCategoryId
    ? findSubCategories(categories, parentCategoryId)
    : [];
  const subSubCategories =
    parentCategoryId && subCategoryId
      ? findSubSubCategories(categories, parentCategoryId, subCategoryId)
      : [];

  const addItem = (setter, item) => {
    setter((prev) => [...prev, item]);
  };

  const handleFileChange = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  useEffect(() => {
    fetchServiceCategories();
  }, []);

  // Fetch all service categories
  const fetchServiceCategories = async () => {
    try {
      const response = await axios.get("/api/services/getall", {
        withCredentials: true,
      });
      setServiceCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Render options for the parent, sub, and sub-sub categories
  const renderServiceCategoryOptions = (category) => (
    <option key={category._id} value={category.slug}>
      {category.category}
    </option>
  );

  // Handle changes for parent category
  const handleServiceParentCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setServiceParentCategoryId(selectedCategoryId);
    setServiceSubCategoryId(""); // Reset subcategory selection
    setServiceSubSubCategoryId(""); // Reset sub-subcategory selection
  };

  // Handle changes for subcategory
  const handleServiceSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setServiceSubCategoryId(selectedSubCategoryId);
    setServiceSubSubCategoryId(""); // Reset sub-subcategory selection
  };

  // Handle changes for sub-subcategory
  const handleServiceSubSubCategoryChange = (e) => {
    const selectedSubSubCategoryId = e.target.value;
    setServiceSubSubCategoryId(selectedSubSubCategoryId);
  };

  // Find category by ID recursively
  const findServiceCategoryById = (categories, id) => {
    for (const category of categories) {
      if (category.slug === id) return category;
      if (category.subCategories) {
        const subCategory = findServiceCategoryById(category.subCategories, id);
        if (subCategory) return subCategory;
      }
    }
    return null;
  };

  // Find subcategories based on selected parent category
  const findServiceSubCategories = (categories, serviceparentCategoryId) => {
    const parentCategory = findServiceCategoryById(
      categories,
      serviceparentCategoryId
    );
    return parentCategory ? parentCategory.subCategories || [] : [];
  };

  // Find sub-subcategories based on selected subcategory
  const findServiceSubSubCategories = (
    categories,
    serviceparentCategoryId,
    servicesubCategoryId
  ) => {
    const parentCategory = findServiceCategoryById(
      categories,
      serviceparentCategoryId
    );
    if (parentCategory && parentCategory.subCategories) {
      const subCategory = findServiceCategoryById(
        parentCategory.subCategories,
        servicesubCategoryId
      );
      return subCategory ? subCategory.subSubCategory || [] : [];
    }
    return [];
  };

  // Get subcategories and sub-subcategories based on the selected parent and subcategory
  const subServiceCategories = serviceparentCategoryId
    ? findServiceSubCategories(servicecategories, serviceparentCategoryId)
    : [];
  const subSubServiceCategories =
    serviceparentCategoryId && servicesubCategoryId
      ? findServiceSubSubCategories(
          servicecategories,
          serviceparentCategoryId,
          servicesubCategoryId
        )
      : [];

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <ToastContainer />
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">
        Add Package
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
      {subCategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="subCategory" className="block font-semibold mb-2">
            Subcategory (optional)
          </label>
          <select
            id="subCategory"
            value={subCategoryId}
            onChange={handleSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Subcategory</option>
            {subCategories.map((subCategory) => (
              <option key={subCategory._id} value={subCategory.slug}>
                {subCategory.category}
              </option>
            ))}
          </select>
        </div>
      )}
      {subSubCategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="subSubCategory" className="block font-semibold mb-2">
            Sub-Subcategory (optional)
          </label>
          <select
            id="subSubCategory"
            value={subSubCategoryId}
            onChange={handleSubSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option>Select Sub-Subcategory</option>
            {subSubCategories.map((subSubCategory) => (
              <option key={subSubCategory._id} value={subSubCategory.slug}>
                {subSubCategory.category}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="parentCategory" className="block font-semibold mb-2">
          Parent Service Category
        </label>
        <select
          id="parentCategory"
          value={serviceparentCategoryId}
          onChange={handleServiceParentCategoryChange}
          className="w-full p-2 border rounded focus:outline-none"
        >
          <option value="">Select Parent Category</option>
          {servicecategories.map(renderServiceCategoryOptions)}
        </select>
      </div>

      {/* Subcategory */}
      {subServiceCategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="subCategory" className="block font-semibold mb-2">
            Sub-Service Category (optional)
          </label>
          <select
            id="subCategory"
            value={servicesubCategoryId}
            onChange={handleServiceSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Subcategory</option>
            {subServiceCategories.map(renderServiceCategoryOptions)}
          </select>
        </div>
      )}

      {/* Sub-Subcategory */}
      {subSubServiceCategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="subSubCategory" className="block font-semibold mb-2">
            Sub-Sub-Service Category (optional)
          </label>
          <select
            id="subSubCategory"
            value={servicesubSubCategoryId}
            onChange={handleServiceSubSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Sub-Subcategory</option>
            {subSubServiceCategories.map(renderServiceCategoryOptions)}
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
        <label htmlFor="price" className="block font-semibold mb-2">
          Price
        </label>
        <input
          type="number"
          id="price"
          min={0}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        />
      </div>

      {/* <div className="mb-4">
        <label className="block font-semibold mb-2">What You Get</label>
        {whatYouGet.map((item, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const newWhatYouGet = [...whatYouGet];
                newWhatYouGet[index] = e.target.value;
                setWhatYouGet(newWhatYouGet);
              }}
              className="w-full p-2 border rounded focus:outline-none"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => addItem(setWhatYouGet, "")}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Add What You Get
        </button>
      </div> */}

      <div className="mb-4">
        <label className="block font-semibold mb-2">What Is Included</label>
        {whatIsTheir.map((item, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const newWhatIsTheir = [...whatIsTheir];
                newWhatIsTheir[index] = e.target.value;
                setWhatIsTheir(newWhatIsTheir);
              }}
              className="w-full p-2 border rounded focus:outline-none"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => addItem(setWhatIsTheir, "")}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Add What Is Included
        </button>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">What Is Not Included</label>
        {whatIsNotTheir.map((item, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const newWhatIsNotTheir = [...whatIsNotTheir];
                newWhatIsNotTheir[index] = e.target.value;
                setWhatIsNotTheir(newWhatIsNotTheir);
              }}
              className="w-full p-2 border rounded focus:outline-none"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => addItem(setWhatIsNotTheir, "")}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Add What Is Not Included
        </button>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-2">Package Type</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="normal"
              checked={packageType === "normal"}
              onChange={(e) => setPackageType(e.target.value)}
              className="mr-2"
            />
            <span>Normal</span>
          </label>

          <label className="inline-flex items-center">
            <input
              type="radio"
              value="hourly"
              checked={packageType === "hourly"}
              onChange={(e) => setPackageType(e.target.value)}
              className="mr-2"
            />
            <span>Hourly</span>
          </label>
        </div>
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

      {/* <div className="mb-4">
        <label htmlFor="popular" className="inline-flex items-center">
          <input
            type="checkbox"
            id="popular"
            checked={popular}
            onChange={(e) => setPopular(e.target.checked)}
            className="mr-2"
          />
          Popular
        </label>
      </div> */}

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Add Package
      </button>
    </form>
  );
};

export default NewPackageForm;
