import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  validateTitle,
  validateDetails,
  validatePhotos,
  validatePhotoAlt,
  validatePhotoTitle,
  validateSlug,
  validateMetaTitle,
  validateMetaDescription,
  validateMetaKeywords,
  validateMetaLanguage,
  validateMetaCanonical,
  validateMetaSchema,
  validateOtherMeta,
  validateUrl,
  validateChangeFreq,
  validatePriority,
  validatePostedBy,
  validateDate,
  validateCategoryId,
} from "../../utiles/validations";

const EditNews = () => {
  const navigate = useNavigate();
  const { slugs } = useParams();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [imgTitles, setImgTitles] = useState([]);
  const [initialPhotos, setInitialPhotos] = useState([]);
  const [initialPhotoAlts, setInitialPhotoAlts] = useState([]);
  const [initialImgTitles, setInitialImgTitles] = useState([]);
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("active");
=======
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';


const EditNews = () => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [photo, setPhoto] = useState([]);
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const [slug, setSlug] = useState("");
  const [metatitle, setMetatitle] = useState("");
  const [metadescription, setMetadescription] = useState("");
  const [metakeywords, setMetakeywords] = useState("");
<<<<<<< HEAD
  const [metalanguage, setMetalanguage] = useState("");
  const [metacanonical, setMetacanonical] = useState("");
  const [metaschema, setMetaschema] = useState("");
  const [otherMeta, setOtherMeta] = useState("");
  const [url, setUrl] = useState("");
  const [priority, setPriority] = useState("");
  const [changeFreq, setChangeFreq] = useState("");
  const [postedBy, setPostedBy] = useState("");
=======
  const [metalanguage, setMetalanguage] = useState("")
  const [metacanonical, setMetacanonical] = useState("")
  const [metaschema, setMetaschema] = useState("")
  const [otherMeta, setOthermeta] = useState("")
  const [url, setUrl] = useState()
  const [changeFreq, setChangeFreq] = useState()
  const [priority, setPriority] = useState()
  const [postedBy, setPostedBy] = useState("")
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("active");
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const [categories, setCategories] = useState([]);
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subSubCategoryId, setSubSubCategoryId] = useState("");
<<<<<<< HEAD
  const [errors, setErrors] = useState({});

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
    clipboard: { matchVisual: false },
  };

  useEffect(() => {
    fetchCategories();
    fetchNews();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/news/getall", { withCredentials: true });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      const statusCode = error.response?.status ? `(${error.response.status})` : '';
      const message = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to fetch categories: ${message} ${statusCode}`);
    }
  };

=======
  // State for categories, parent, sub, and sub-sub categories with updated naming convention
  const [servicecategories, setServiceCategories] = useState([]);
  const [serviceparentCategoryId, setServiceParentCategoryId] = useState("");
  const [servicesubCategoryId, setServiceSubCategoryId] = useState("");
  const [servicesubSubCategoryId, setServiceSubSubCategoryId] = useState("");
  const { slugs } = useParams();
  const [initialPhotos, setInitialPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [imgtitle, setImgtitle] = useState([]);

  const [initialphotoAlts, setInitialPhotoAlts] = useState([])
  const [initialimgtitle, setInitialImgtitle] = useState([])


  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ 'font': [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };


  
  const fetchServiceCategories = async () => {
    try {
      const response = await axios.get('/api/services/getAll', { withCredentials: true });
      setServiceCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/news/getAll', { withCredentials: true });
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchCategories();
    fetchServiceCategories()
  }, []);

>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const fetchNews = async () => {
    try {
      const response = await axios.get(`/api/news/getNewsById?slugs=${slugs}`, { withCredentials: true });
      const news = response.data.data;
<<<<<<< HEAD
      setTitle(news.title || "");
      setDetails(news.details || "");
      setInitialPhotos(news.photo || []);
      setInitialPhotoAlts(news.alt || []);
      setInitialImgTitles(news.imgtitle || []);
      setDate(news.date || "");
      setStatus(news.status || "active");
      setPostedBy(news.postedBy || "");
      setSlug(news.slug || "");
      setMetatitle(news.metatitle || "");
      setMetadescription(news.metadescription || "");
      setMetakeywords(news.metakeywords || "");
      setMetalanguage(news.metalanguage || "");
      setMetacanonical(news.metacanonical || "");
      setMetaschema(news.metaschema || "");
      setOtherMeta(news.otherMeta || "");
      setUrl(news.url || `https://rndtechnosoft.com/${news.slug}`);
      setPriority(news.priority || "");
      setChangeFreq(news.changeFreq || "");

      try {
        const categoryResponse = await axios.get(`/api/news/getSpecificCategory?categoryId=${news.categories}`, { withCredentials: true });
        setParentCategoryId(categoryResponse.data.slug || "");
      } catch (error) {
        console.error("Error fetching parent category:", error);
      }

      if (news.subcategories) {
        try {
          const subCategoryResponse = await axios.get(`/api/news/getSpecificSubcategory?categoryId=${news.categories}&subCategoryId=${news.subcategories}`, { withCredentials: true });
          setSubCategoryId(subCategoryResponse.data.slug || "");
        } catch (error) {
          console.error("Error fetching subcategory:", error);
        }
      }

      if (news.subSubcategories) {
        try {
          const subSubCategoryResponse = await axios.get(`/api/news/getSpecificSubSubcategory?categoryId=${news.categories}&subCategoryId=${news.subcategories}&subSubCategoryId=${news.subSubcategories}`, { withCredentials: true });
          setSubSubCategoryId(subSubCategoryResponse.data.slug || "");
        } catch (error) {
          console.error("Error fetching sub-subcategory:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      const statusCode = error.response?.status ? `(${error.response.status})` : '';
      const message = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to fetch news: ${message} ${statusCode}`);
    }
  };

  useEffect(() => {
    const generatedSlug = title
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
    setSlug(generatedSlug);
    setErrors(prev => ({ ...prev, slug: validateSlug(generatedSlug) }));
  }, [title]);

  useEffect(() => {
    setUrl(slug ? `https://rndtechnosoft.com/${slug}` : "");
    setErrors(prev => ({ ...prev, url: validateUrl(slug ? `https://rndtechnosoft.com/${slug}` : "") }));
  }, [slug]);

  const handlePhotoChange = (e) => {
  const newPhotos = Array.from(e.target.files || []);
  if (newPhotos.length === 0) return; // No files selected, do nothing

  const validImageTypes = ['image/jpeg', 'image/png'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  // Filter invalid files
  const invalidFiles = newPhotos.filter(
    file => !validImageTypes.includes(file.type) || file.size > maxSize
  );

  if (invalidFiles.length > 0) {
    toast.error("Invalid images: Only JPEG/PNG up to 5MB allowed");
    return;
  }

  // Check max total images
  if (initialPhotos.length + photos.length + newPhotos.length > 5) {
    toast.error("Maximum 5 images allowed");
    return;
  }

  // Merge new photos with existing
  const updatedPhotos = [...photos, ...newPhotos];
  const updatedAlts = [...photoAlts, ...Array(newPhotos.length).fill("")];
  const updatedTitles = [...imgTitles, ...Array(newPhotos.length).fill("")];

  setPhotos(updatedPhotos);
  setPhotoAlts(updatedAlts);
  setImgTitles(updatedTitles);

  // Update errors, but skip "required" check if optional
  setErrors(prev => ({
    ...prev,
    photos: validatePhotos([...initialPhotos, ...updatedPhotos], { optional: true }),
    photoAlts: [...initialPhotos, ...updatedPhotos].map((_, i) =>
      validatePhotoAlt((i < initialPhotos.length ? initialPhotoAlts[i] : updatedAlts[i - initialPhotos.length]) || "")
    ),
    imgTitles: [...initialPhotos, ...updatedPhotos].map((_, i) =>
      validatePhotoTitle((i < initialPhotos.length ? initialImgTitles[i] : updatedTitles[i - initialPhotos.length]) || "")
    ),
  }));
};

=======
      setTitle(news.title);
      setDetails(news.details);
      setInitialPhotos(news.photo);
      setDate(news.date);
      setStatus(news.status);
      setInitialPhotoAlts(news.alt);
      setInitialImgtitle(news.imgtitle);

      setPostedBy(news.postedBy);
      setSlug(news.slug);
      setMetatitle(news.metatitle);
      setMetadescription(news.metadescription)
      setMetakeywords(news.metakeywords);
      setMetalanguage(news.metalanguage);
      setMetacanonical(news.metacanonical);
      setMetaschema(news.metaschema);
      setOthermeta(news.otherMeta);
      news.url ? setUrl(news.url) : setUrl(`https://rndtechnosoft.com/${news.slug}`)
      setChangeFreq(news.changeFreq)
      setPriority(news.priority)

      // Fetch categories
      try {
        const categoryResponse = await axios.get(`/api/news/getSpecificCategory?categoryId=${news.categories}`, { withCredentials: true });
        const category = categoryResponse.data;
        setParentCategoryId(category.slug);
      } catch (error) {
        console.error('Error fetching parent category:', error);
      }

      try {
        const subCategoryResponse = await axios.get(`/api/news/getSpecificSubcategory?categoryId=${news.categories}&subCategoryId=${news.subcategories}`, { withCredentials: true });
        const subCategory = subCategoryResponse.data;
        setSubCategoryId(subCategory.slug);
      } catch (error) {
        console.error('Error fetching subcategory:', error);
      }

      try {
        const subSubCategoryResponse = await axios.get(`/api/news/getSpecificSubSubcategory?categoryId=${news.categories}&subCategoryId=${news.subcategories}&subSubCategoryId=${news.subSubcategories}`, { withCredentials: true });
        const subSubCategory = subSubCategoryResponse.data;
        setSubSubCategoryId(subSubCategory.slug);
      } catch (error) {
        console.error('Error fetching sub-subcategory:', error);
      }

      // Fetch services
      try {
        const serviceCategoryResponse = await axios.get(`/api/services/getSpecificCategory?categoryId=${news.servicecategories}`, { withCredentials: true });
        const serviceCategory = serviceCategoryResponse.data;
        setServiceParentCategoryId(serviceCategory.slug);
      } catch (error) {
        console.error('Error fetching service parent category:', error);
      }

      try {
        const serviceSubCategoryResponse = await axios.get(`/api/services/getSpecificSubcategory?categoryId=${news.servicecategories}&subCategoryId=${news.servicesubcategories}`, { withCredentials: true });
        const serviceSubCategory = serviceSubCategoryResponse.data;
        setServiceSubCategoryId(serviceSubCategory.slug);
      } catch (error) {
        console.error('Error fetching service subcategory:', error);
      }

      try {
        const serviceSubSubCategoryResponse = await axios.get(`/api/services/getSpecificSubSubcategory?categoryId=${news.servicecategories}&subCategoryId=${news.servicesubcategories}&subSubCategoryId=${news.servicesubSubcategories}`, { withCredentials: true });
        const serviceSubSubCategory = serviceSubSubCategoryResponse.data;
        setServiceSubSubCategoryId(serviceSubSubCategory.slug);
      } catch (error) {
        console.error('Error fetching service sub-subcategory:', error);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('details', details);
      formData.append('date', date);
      formData.append('slug', slug);
      formData.append('metatitle', metatitle);
      formData.append('metakeywords', metakeywords);
      formData.append('metadescription', metadescription);
      formData.append('metalanguage', metalanguage);
      formData.append('metacanonical', metacanonical);
      formData.append('metaschema', metaschema);
      formData.append('otherMeta', otherMeta);
      formData.append('url', url);
      formData.append('changeFreq', changeFreq);
      formData.append('priority', priority);
      formData.append('postedBy', postedBy);
      formData.append('status', status);
      formData.append('categories', parentCategoryId);
      formData.append('subcategories', subCategoryId);
      formData.append('subSubcategories', subSubCategoryId);
      formData.append('servicecategories', serviceparentCategoryId);
      formData.append('servicesubcategories', servicesubCategoryId);
      formData.append('servicesubSubcategories', servicesubSubCategoryId);
      // Combine initial and new photo alts into a single array
      const combinedAlts = [...initialphotoAlts, ...photoAlts];
      const combinedImgtitle = [...initialimgtitle, ...imgtitle];

      // Append photos and their respective alts to FormData
      photo.forEach((p) => {
        formData.append(`photo`, p);
      });

      combinedAlts.forEach((a) => {
        formData.append(`alt`, a);
      })
      combinedImgtitle.forEach((m) => {
        formData.append(`imgtitle`, m);
      })
      const response = await axios.put(`/api/news/updateNews?slugs=${slugs}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });


      navigate('/news');
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    const newPhotos = Array.from(e.target.files);
    setPhoto([...photo, ...newPhotos]);
  };

  const handleInitialAltTextChange = (e, index) => {
    const newPhotoAlts = [...initialphotoAlts];
    newPhotoAlts[index] = e.target.value;

    setInitialPhotoAlts(newPhotoAlts);
  };


  const handleInitialImgtitleChange = (e, index) => {
    const newImgtitle = [...initialimgtitle];
    newImgtitle[index] = e.target.value;

    setInitialImgtitle(newImgtitle);
  };
  const handleNewAltTextChange = (e, index) => {
    const newPhotoAlts = [...photoAlts];
    newPhotoAlts[index] = e.target.value;

    setPhotoAlts(newPhotoAlts);
  };
  const handleNewImgtitleChange = (e, index) => {
    const newImgtitle = [...imgtitle];
    newImgtitle[index] = e.target.value;

    setImgtitle(newImgtitle);
  };

  useEffect(() => {
    if (slug) {
      setUrl(`https://rndtechnosoft.com/${slug}`);
    }
  }, [slug]);

  useEffect(() => {
    setSlug(title.replace(/\s+/g, '-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
    );
  }, [title])

  useEffect(() => {
    setSlug(slug.toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
    );
  }, [slug])
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

  const handleDeleteInitialPhoto = (e, photoFilename, index) => {
    e.preventDefault();
    axios.delete(`/api/news/${slugs}/image/${photoFilename}/${index}`, { withCredentials: true })
<<<<<<< HEAD
      .then(() => {
        const updatedPhotos = initialPhotos.filter((_, i) => i !== index);
        const updatedAlts = initialPhotoAlts.filter((_, i) => i !== index);
        const updatedTitles = initialImgTitles.filter((_, i) => i !== index);
        setInitialPhotos(updatedPhotos);
        setInitialPhotoAlts(updatedAlts);
        setInitialImgTitles(updatedTitles);
        setErrors(prev => ({
          ...prev,
          photos: validatePhotos([...updatedPhotos, ...photos]),
          photoAlts: [...updatedPhotos, ...photos].map((_, i) => validatePhotoAlt((i < updatedPhotos.length ? updatedAlts[i] : photoAlts[i - updatedPhotos.length]) || "")),
          imgTitles: [...updatedPhotos, ...photos].map((_, i) => validatePhotoTitle((i < updatedPhotos.length ? updatedTitles[i] : imgTitles[i - updatedPhotos.length]) || "")),
        }));
      })
      .catch(error => {
        console.error("Error deleting photo:", error);
        const statusCode = error.response?.status ? `(${error.response.status})` : '';
        const message = error.response?.data?.message || error.message || 'Unknown error';
        toast.error(`Failed to delete photo: ${message} ${statusCode}`);
=======
      .then(response => {
        const updatedPhotos = initialPhotos.filter(photo => photo !== photoFilename);
        setInitialPhotos(updatedPhotos);
        const updatedPhotoAlts = [...initialphotoAlts];
        updatedPhotoAlts.splice(index, 1);
        setInitialPhotoAlts(updatedPhotoAlts);

        const updatedImgtitle = [...initialimgtitle];
        updatedImgtitle.splice(index, 1);
        setInitialImgtitle(updatedImgtitle);
      })
      .catch(error => {
        console.error(error);
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      });
  };

  const handleDeleteNewPhoto = (e, index) => {
    e.preventDefault();
<<<<<<< HEAD
    const updatedPhotos = photos.filter((_, i) => i !== index);
    const updatedAlts = photoAlts.filter((_, i) => i !== index);
    const updatedTitles = imgTitles.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    setPhotoAlts(updatedAlts);
    setImgTitles(updatedTitles);
    setErrors(prev => ({
      ...prev,
      photos: validatePhotos([...initialPhotos, ...updatedPhotos]),
      photoAlts: [...initialPhotos, ...updatedPhotos].map((_, i) => validatePhotoAlt((i < initialPhotos.length ? initialPhotoAlts[i] : updatedAlts[i - initialPhotos.length]) || "")),
      imgTitles: [...initialPhotos, ...updatedPhotos].map((_, i) => validatePhotoTitle((i < initialPhotos.length ? initialImgTitles[i] : updatedTitles[i - initialPhotos.length]) || "")),
    }));
  };

  const handleInitialAltTextChange = (e, index) => {
    const newPhotoAlts = [...initialPhotoAlts];
    newPhotoAlts[index] = e.target.value;
    setInitialPhotoAlts(newPhotoAlts);
    setErrors(prev => ({
      ...prev,
      photoAlts: [...initialPhotos, ...photos].map((_, i) => validatePhotoAlt((i < initialPhotos.length ? newPhotoAlts[i] : photoAlts[i - initialPhotos.length]) || "")),
    }));
  };

  const handleInitialImgTitleChange = (e, index) => {
    const newImgTitles = [...initialImgTitles];
    newImgTitles[index] = e.target.value;
    setInitialImgTitles(newImgTitles);
    setErrors(prev => ({
      ...prev,
      imgTitles: [...initialPhotos, ...photos].map((_, i) => validatePhotoTitle((i < initialPhotos.length ? newImgTitles[i] : imgTitles[i - initialPhotos.length]) || "")),
    }));
  };

  const handleNewAltTextChange = (e, index) => {
    const newPhotoAlts = [...photoAlts];
    newPhotoAlts[index] = e.target.value;
    setPhotoAlts(newPhotoAlts);
    setErrors(prev => ({
      ...prev,
      photoAlts: [...initialPhotos, ...photos].map((_, i) => validatePhotoAlt((i < initialPhotos.length ? initialPhotoAlts[i] : newPhotoAlts[i - initialPhotos.length]) || "")),
    }));
  };

  const handleNewImgTitleChange = (e, index) => {
    const newImgTitles = [...imgTitles];
    newImgTitles[index] = e.target.value;
    setImgTitles(newImgTitles);
    setErrors(prev => ({
      ...prev,
      imgTitles: [...initialPhotos, ...photos].map((_, i) => validatePhotoTitle((i < initialPhotos.length ? initialImgTitles[i] : newImgTitles[i - initialPhotos.length]) || "")),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      title: validateTitle(title.trim()),
      details: validateDetails(details.trim()),
      photos: validatePhotos([...initialPhotos, ...photos]),
      photoAlts: [...initialPhotos, ...photos].map((_, i) => validatePhotoAlt((i < initialPhotos.length ? initialPhotoAlts[i] : photoAlts[i - initialPhotos.length]) || "")),
      imgTitles: [...initialPhotos, ...photos].map((_, i) => validatePhotoTitle((i < initialPhotos.length ? initialImgTitles[i] : imgTitles[i - initialPhotos.length]) || "")),
      postedBy: validatePostedBy(postedBy.trim()),
      date: validateDate(date),
      parentCategoryId: validateCategoryId(parentCategoryId),
      subCategoryId: validateCategoryId(subCategoryId),
      subSubCategoryId: validateCategoryId(subSubCategoryId),
      slug: validateSlug(slug.trim()),
      metatitle: validateMetaTitle(metatitle.trim()),
      metadescription: validateMetaDescription(metadescription.trim()),
      metakeywords: validateMetaKeywords(metakeywords.trim()),
      metalanguage: validateMetaLanguage(metalanguage.trim()),
      metacanonical: validateMetaCanonical(metacanonical.trim()),
      metaschema: validateMetaSchema(metaschema.trim()),
      otherMeta: validateOtherMeta(otherMeta.trim()),
      url: validateUrl(url),
      changeFreq: validateChangeFreq(changeFreq),
      priority: validatePriority(priority),
    };

    setErrors(newErrors);

    if (
      newErrors.title ||
      newErrors.details ||
      newErrors.postedBy ||
      newErrors.date ||
      newErrors.parentCategoryId ||
      newErrors.photoAlts.some(e => e) ||
      newErrors.imgTitles.some(e => e)
    ) {
      toast.error("Please correct the errors in the form");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("details", details.trim());
    photos.forEach((photo) => formData.append("photo", photo));
    [...initialPhotoAlts, ...photoAlts].forEach((alt) => formData.append("alt", alt.trim()));
    [...initialImgTitles, ...imgTitles].forEach((title) => formData.append("imgtitle", title.trim()));
    formData.append("postedBy", postedBy.trim());
    formData.append("date", date);
    formData.append("status", status);
    formData.append("categories", parentCategoryId);
    formData.append("subcategories", subCategoryId || "");
    formData.append("subSubcategories", subSubCategoryId || "");
    formData.append("slug", slug.trim());
    formData.append("metatitle", metatitle.trim());
    formData.append("metadescription", metadescription.trim());
    formData.append("metakeywords", metakeywords.trim());
    formData.append("metalanguage", metalanguage.trim());
    formData.append("metacanonical", metacanonical.trim());
    formData.append("metaschema", metaschema.trim());
    formData.append("otherMeta", otherMeta.trim());
    formData.append("url", url);
    formData.append("priority", priority);
    formData.append("changeFreq", changeFreq);

    try {
      await axios.put(`/api/news/updateNews?slugs=${slugs}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("News updated successfully!");
      navigate("/news");
    } catch (error) {
      console.error("Error updating news:", error);
      const statusCode = error.response?.status ? `(${error.response.status})` : '';
      const message = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to update news: ${message} ${statusCode}`);
    }
  };

  const getSubCategories = (categoryId) => {
    const category = categories.find((cat) => cat.slug === categoryId);
=======
    const updatedPhotos = [...photo];
    updatedPhotos.splice(index, 1);
    setPhoto(updatedPhotos);
    const updatedPhotoAlts = [...initialphotoAlts];
    updatedPhotoAlts.splice(index, 1);
    setInitialPhotoAlts(updatedPhotoAlts);

    const updatedImgtitle = [...initialimgtitle];
    updatedImgtitle.splice(index, 1);
    setInitialImgtitle(updatedImgtitle);
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

  // For Services
  const renderServiceCategoryOptions = (category) => {
    return (
      <option key={category._id} value={category.slug}>
        {category.category}
      </option>
    );
  };

  const renderServiceSubCategoryOptions = (subCategory) => {
    return (
      <option key={subCategory._id} value={subCategory.slug}>
        {subCategory.category}
      </option>
    );
  };

  const renderServiceSubSubCategoryOptions = (subSubCategory) => {
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

  const handleServiceParentCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setServiceParentCategoryId(selectedCategoryId);
    setServiceSubCategoryId(""); // Reset subcategory selection
    setServiceSubSubCategoryId(""); // Reset sub-subcategory selection
  };

  const handleServiceSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setServiceSubCategoryId(selectedSubCategoryId);
    setServiceSubSubCategoryId(""); // Reset sub-subcategory selection
  };

  const handleServiceSubSubCategoryChange = (e) => {
    const selectedSubSubCategoryId = e.target.value;
    setServiceSubSubCategoryId(selectedSubSubCategoryId);
  };

  // Render categories safely
  const getSubCategories = (categoryId) => {
    const category = categories.find(category => category.slug === categoryId);
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    return category?.subCategories || [];
  };

  const getSubSubCategories = (categoryId, subCategoryId) => {
<<<<<<< HEAD
    const category = categories.find((cat) => cat.slug === categoryId);
    const subCategory = category?.subCategories.find((sub) => sub.slug === subCategoryId);
    return subCategory?.subSubCategories || [];
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <ToastContainer />
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center mb-6">Edit News</h1>

      <div className="mb-4">
        <label htmlFor="parentCategory" className="block font-semibold mb-2">
          Parent Category <span className="text-red-500">*</span>
=======
    const category = categories.find(category => category.slug === categoryId);
    const subCategory = category?.subCategories.find(sub => sub.slug === subCategoryId);
    return subCategory?.subSubCategories || [];
  };

  // Render services safely
  const getServiceSubCategories = (categoryId) => {
    const category = servicecategories.find(category => category.slug === categoryId);
    return category?.subCategories || [];
  };

  const getServiceSubSubCategories = (categoryId, subCategoryId) => {
    const category = servicecategories.find(category => category.slug === categoryId);
    const subCategory = category?.subCategories.find(sub => sub.slug === subCategoryId);
    return subCategory?.subSubCategories || [];
  };



  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Edit News</h1>
      <div className="mb-4">
        <label htmlFor="parentCategory" className="block font-semibold mb-2">
          Parent Category
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        </label>
        <select
          id="parentCategory"
          value={parentCategoryId}
<<<<<<< HEAD
          onChange={(e) => {
            const value = e.target.value;
            setParentCategoryId(value);
            setSubCategoryId("");
            setSubSubCategoryId("");
            setErrors(prev => ({ ...prev, parentCategoryId: validateCategoryId(value), subCategoryId: "", subSubCategoryId: "" }));
          }}
          className={`w-full p-2 border rounded focus:outline-none ${errors.parentCategoryId ? "border-red-500" : ""}`}
          required
        >
          <option value="">Select Parent Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.slug}>
              {cat.category}
            </option>
          ))}
        </select>
        {errors.parentCategoryId && <p className="text-red-500 text-sm mt-1">{errors.parentCategoryId}</p>}
=======
          onChange={handleParentCategoryChange}
          className="w-full p-2 border rounded focus:outline-none"
          required
        >
          <option value="">Select Parent Category</option>
          {categories.map(renderCategoryOptions)}
        </select>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      </div>

      {getSubCategories(parentCategoryId).length > 0 && (
        <div className="mb-4">
<<<<<<< HEAD
          <label htmlFor="subCategory" className="block font-semibold mb-2">Subcategory (optional)</label>
          <select
            id="subCategory"
            value={subCategoryId}
            onChange={(e) => {
              const value = e.target.value;
              setSubCategoryId(value);
              setSubSubCategoryId("");
              setErrors(prev => ({ ...prev, subCategoryId: validateCategoryId(value), subSubCategoryId: "" }));
            }}
            className={`w-full p-2 border rounded focus:outline-none ${errors.subCategoryId ? "border-red-500" : ""}`}
          >
            <option value="">Select Subcategory</option>
            {getSubCategories(parentCategoryId).map((sub) => (
              <option key={sub._id} value={sub.slug}>
                {sub.category}
              </option>
            ))}
          </select>
          {errors.subCategoryId && <p className="text-red-500 text-sm mt-1">{errors.subCategoryId}</p>}
=======
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
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        </div>
      )}

      {getSubSubCategories(parentCategoryId, subCategoryId).length > 0 && (
        <div className="mb-4">
<<<<<<< HEAD
          <label htmlFor="subSubCategory" className="block font-semibold mb-2">Sub-Subcategory (optional)</label>
          <select
            id="subSubCategory"
            value={subSubCategoryId}
            onChange={(e) => {
              const value = e.target.value;
              setSubSubCategoryId(value);
              setErrors(prev => ({ ...prev, subSubCategoryId: validateCategoryId(value) }));
            }}
            className={`w-full p-2 border rounded focus:outline-none ${errors.subSubCategoryId ? "border-red-500" : ""}`}
          >
            <option value="">Select Sub-Subcategory</option>
            {getSubSubCategories(parentCategoryId, subCategoryId).map((subSub) => (
              <option key={subSub._id} value={subSub.slug}>
                {subSub.category}
              </option>
            ))}
          </select>
          {errors.subSubCategoryId && <p className="text-red-500 text-sm mt-1">{errors.subSubCategoryId}</p>}
=======
          <label htmlFor="subSubCategory" className="block font-semibold mb-2">
            Sub-Subcategory
          </label>
          <select
            id="subSubCategory"
            value={subSubCategoryId}
            onChange={(e) => setSubSubCategoryId(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Sub-Subcategory</option>
            {getSubSubCategories(parentCategoryId, subCategoryId).map(renderSubSubCategoryOptions)}
          </select>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="serviceParentCategory" className="block font-semibold mb-2">
          Service Parent Category
        </label>
        <select
          id="serviceParentCategory"
          value={serviceparentCategoryId}
          onChange={handleServiceParentCategoryChange}
          className="w-full p-2 border rounded focus:outline-none"
          required
        >
          <option value="">Select Service Parent Category</option>
          {servicecategories.map(renderServiceCategoryOptions)}
        </select>
      </div>

      {getServiceSubCategories(serviceparentCategoryId).length > 0 && (
        <div className="mb-4">
          <label htmlFor="serviceSubCategory" className="block font-semibold mb-2">
            Service Subcategory
          </label>
          <select
            id="serviceSubCategory"
            value={servicesubCategoryId}
            onChange={handleServiceSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Service Subcategory</option>
            {getServiceSubCategories(serviceparentCategoryId).map(renderServiceSubCategoryOptions)}
          </select>
        </div>
      )}

      {getServiceSubSubCategories(serviceparentCategoryId, servicesubCategoryId).length > 0 && (
        <div className="mb-4">
          <label htmlFor="serviceSubSubCategory" className="block font-semibold mb-2">
            Service Sub-Subcategory
          </label>
          <select
            id="serviceSubSubCategory"
            value={servicesubSubCategoryId}
            onChange={handleServiceSubSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Service Sub-Subcategory</option>
            {getServiceSubSubCategories(serviceparentCategoryId, servicesubCategoryId).map(renderServiceSubSubCategoryOptions)}
          </select>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="block font-semibold mb-2">
<<<<<<< HEAD
          Title <span className="text-red-500">*</span>
=======
          Title
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        </label>
        <input
          type="text"
          id="title"
          value={title}
<<<<<<< HEAD
          onChange={(e) => {
            const value = e.target.value;
            setTitle(value);
            setErrors(prev => ({ ...prev, title: validateTitle(value.trim()) }));
          }}
          className={`w-full p-2 border rounded focus:outline-none ${errors.title ? "border-red-500" : ""}`}
          placeholder="Enter news title (10-100 characters)"
          required
          maxLength={100}
        />
        <p className="text-sm text-gray-500 mt-1">{title.length}/100 characters</p>
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div className="mb-8">
        <label htmlFor="details" className="block font-semibold mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <ReactQuill
          value={details}
          onChange={(value) => {
            setDetails(value);
            setErrors(prev => ({ ...prev, details: validateDetails(value.trim()) }));
          }}
          modules={modules}
          className="quill"
          style={{ height: '400px', marginBottom: '50px' }}
          placeholder="Enter news description (50-1000 characters)"
        />
        <p className="text-sm text-gray-500 mt-1">{details.replace(/<[^>]+>/g, '').length}/1000 characters</p>
        {errors.details && <p className="text-red-500 text-sm mt-1">{errors.details}</p>}
      </div>
=======
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>
      <div className="mb-8">
  <label htmlFor="details" className="block font-semibold mb-2">
    Description
  </label>
  <div className="h-[500px]  border border-gray-300 rounded">
    <ReactQuill
      value={details}
      onChange={setDetails}
      modules={modules} // Include modules for image handling
      className="quill h-full overflow-y-hidden"
    />
  </div>
</div>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

      <div className="mb-4">
        <label className="block font-semibold mb-2">Current Photos</label>
        <div className="flex flex-wrap gap-4">
          {initialPhotos.map((photo, index) => (
            <div key={index} className="relative w-56">
              <img
                src={`/api/image/download/${photo}`}
<<<<<<< HEAD
                alt={initialPhotoAlts[index] || ""}
                className="h-32 w-56 object-cover rounded"
              />
              <label htmlFor={`alt-initial-${index}`} className="block mt-2">
                Alternative Text:
                <input
                  type="text"
                  id={`alt-initial-${index}`}
                  value={initialPhotoAlts[index] || ""}
                  onChange={(e) => handleInitialAltTextChange(e, index)}
                  className={`w-full p-2 border rounded focus:outline-none ${errors.photoAlts?.[index] ? "border-red-500" : ""}`}
                  placeholder="Describe the image"
                  maxLength={100}
                />
                {errors.photoAlts?.[index] && <p className="text-red-500 text-sm mt-1">{errors.photoAlts[index]}</p>}
              </label>
              <label htmlFor={`imgtitle-initial-${index}`} className="block mt-2">
                Image Title Text:
                <input
                  type="text"
                  id={`imgtitle-initial-${index}`}
                  value={initialImgTitles[index] || ""}
                  onChange={(e) => handleInitialImgTitleChange(e, index)}
                  className={`w-full p-2 border rounded focus:outline-none ${errors.imgTitles?.[index] ? "border-red-500" : ""}`}
                  placeholder="Enter image title"
                  maxLength={100}
                />
                {errors.imgTitles?.[index] && <p className="text-red-500 text-sm mt-1">{errors.imgTitles[index]}</p>}
              </label>
              <button
                onClick={(e) => handleDeleteInitialPhoto(e, photo, index)}
                className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex items-center justify-center hover:bg-red-600"
=======
                alt={`Photo ${index + 1}`}
                className="w-56 h-32 object-cover"
              />
              <label htmlFor={`alt-${index}`} className="block mt-2">
                Alternative Text:
                <input
                  type="text"
                  id={`alt-${index}`}
                  value={initialphotoAlts[index]}
                  onChange={(e) => handleInitialAltTextChange(e, index)}
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </label>
              <label htmlFor={`imgtitle-${index}`} className="block mt-2">
                Image Title Text:
                <input
                  type="text"
                  id={`imgtitle-${index}`}
                  value={initialimgtitle[index]}
                  onChange={(e) => handleInitialImgtitleChange(e, index)}
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </label>
              <button
                onClick={(e) => handleDeleteInitialPhoto(e, photo, index)}
                className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex justify-center items-center"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
              >
                <span className="text-xs">X</span>
              </button>
            </div>
          ))}
        </div>
      </div>
<<<<<<< HEAD

      <div className="mb-4">
        <label className="block font-semibold mb-2">Add New Photos (Max 5, JPEG/PNG, 5MB each)</label>
        <input
          type="file"
          id="photos"
          multiple
          onChange={handlePhotoChange}
          accept="image/jpeg,image/png"
          className={`p-2 border rounded focus:outline-none ${errors.photos ? "border-red-500" : ""}`}
        />
        {errors.photos && <p className="text-red-500 text-sm mt-1">{errors.photos}</p>}
        <div className="flex flex-wrap gap-4 mt-4">
          {photos.map((file, index) => (
            <div key={index} className="relative w-56">
              <img
                src={URL.createObjectURL(file)}
                alt={photoAlts[index] || ""}
                className="h-32 w-56 object-cover rounded"
              />
=======
      <div className="mb-4">
        <label className="block font-semibold mb-2">Add New Photos</label>
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="p-2 border rounded"
        />
        <div className="flex flex-wrap gap-4 mt-4">
          {photo.map((file, index) => (
            <div key={index} className="relative w-56">
              <img
                src={URL.createObjectURL(file)}
                alt={`New Photo ${index + 1}`}
                className="w-56 h-32 object-cover"
              />

>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
              <label htmlFor={`alt-new-${index}`} className="block mt-2">
                Alternative Text:
                <input
                  type="text"
                  id={`alt-new-${index}`}
                  value={photoAlts[index] || ""}
                  onChange={(e) => handleNewAltTextChange(e, index)}
<<<<<<< HEAD
                  className={`w-full p-2 border rounded focus:outline-none ${errors.photoAlts?.[initialPhotos.length + index] ? "border-red-500" : ""}`}
                  placeholder="Describe the image"
                  maxLength={100}
                />
                {errors.photoAlts?.[initialPhotos.length + index] && <p className="text-red-500 text-sm mt-1">{errors.photoAlts[initialPhotos.length + index]}</p>}
              </label>
=======
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </label>

>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
              <label htmlFor={`imgtitle-new-${index}`} className="block mt-2">
                Image Title Text:
                <input
                  type="text"
<<<<<<< HEAD
                  id={`imgtitle-new-${index}`}
                  value={imgTitles[index] || ""}
                  onChange={(e) => handleNewImgTitleChange(e, index)}
                  className={`w-full p-2 border rounded focus:outline-none ${errors.imgTitles?.[initialPhotos.length + index] ? "border-red-500" : ""}`}
                  placeholder="Enter image title"
                  maxLength={100}
                />
                {errors.imgTitles?.[initialPhotos.length + index] && <p className="text-red-500 text-sm mt-1">{errors.imgTitles[initialPhotos.length + index]}</p>}
              </label>
              <button
                onClick={(e) => handleDeleteNewPhoto(e, index)}
                className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex items-center justify-center hover:bg-red-600"
=======
                  id={`alt-new-${index}`}
                  value={imgtitle[index] || ""}
                  onChange={(e) => handleNewImgtitleChange(e, index)}
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </label>
              <button
                onClick={(e) => handleDeleteNewPhoto(e, index)}
                className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex
                justify-center items-center"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
              >
                <span className="text-xs">X</span>
              </button>
            </div>
          ))}
        </div>
      </div>
<<<<<<< HEAD

      <div className="mb-4">
        <label htmlFor="postedBy" className="block font-semibold mb-2">
          Posted By <span className="text-red-500">*</span>
=======
      <div className="mb-4">
        <label htmlFor="postedBy" className="block font-semibold mb-2">
          Posted By
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        </label>
        <input
          type="text"
          id="postedBy"
          value={postedBy}
<<<<<<< HEAD
          onChange={(e) => {
            const value = e.target.value;
            setPostedBy(value);
            setErrors(prev => ({ ...prev, postedBy: validatePostedBy(value.trim()) }));
          }}
          className={`w-full p-2 border rounded focus:outline-none ${errors.postedBy ? "border-red-500" : ""}`}
          placeholder="Enter author's name"
          required
          maxLength={50}
        />
        {errors.postedBy && <p className="text-red-500 text-sm mt-1">{errors.postedBy}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="date" className="block font-semibold mb-2">
          Date <span className="text-red-500">*</span>
=======
          onChange={(e) => setPostedBy(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="date" className="block font-semibold mb-2">
          Date
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        </label>
        <input
          type="date"
          id="date"
          value={date}
<<<<<<< HEAD
          onChange={(e) => {
            const value = e.target.value;
            setDate(value);
            setErrors(prev => ({ ...prev, date: validateDate(value) }));
          }}
          className={`w-full p-2 border rounded focus:outline-none ${errors.date ? "border-red-500" : ""}`}
          max={new Date().toISOString().split('T')[0]}
          required
        />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="slug" className="block font-semibold mb-2">
          Slug <span className="text-red-500">*</span>
=======
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>
      <div className="mb-4 mt-4">
        <label htmlFor="slug" className="block font-semibold mb-2">
          Slug
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        </label>
        <input
          type="text"
          id="slug"
          value={slug}
<<<<<<< HEAD
          onChange={(e) => {
            const value = e.target.value;
            setSlug(value);
            setErrors(prev => ({ ...prev, slug: validateSlug(value.trim()) }));
          }}
          className={`w-full p-2 border rounded focus:outline-none ${errors.slug ? "border-red-500" : ""}`}
          placeholder="Enter URL-friendly slug"
          maxLength={100}
          required
        />
        {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="url" className="block font-semibold mb-2">URL</label>
        <input
          type="text"
          id="url"
          value={url}
          disabled
          className={`w-full p-2 border rounded focus:outline-none bg-gray-100 ${errors.url ? "border-red-500" : ""}`}
          placeholder="Generated URL"
        />
        {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="metatitle" className="block font-semibold mb-2">Meta Title</label>
        <textarea
          id="metatitle"
          value={metatitle}
          onChange={(e) => {
            const value = e.target.value;
            setMetatitle(value);
            setErrors(prev => ({ ...prev, metatitle: validateMetaTitle(value.trim()) }));
          }}
          className={`w-full p-2 border rounded focus:outline-none ${errors.metatitle ? "border-red-500" : ""}`}
          rows="3"
          placeholder="Enter meta title for SEO (max 70 characters)"
          maxLength={70}
        ></textarea>
        {errors.metatitle && <p className="text-red-500 text-sm mt-1">{errors.metatitle}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="metadescription" className="block font-semibold mb-2">Meta Description</label>
        <textarea
          id="metadescription"
          value={metadescription}
          onChange={(e) => {
            const value = e.target.value;
            setMetadescription(value);
            setErrors(prev => ({ ...prev, metadescription: validateMetaDescription(value.trim()) }));
          }}
          className={`w-full p-2 border rounded focus:outline-none ${errors.metadescription ? "border-red-500" : ""}`}
          rows="3"
          placeholder="Enter meta description for SEO (max 160 characters)"
          maxLength={160}
        ></textarea>
        {errors.metadescription && <p className="text-red-500 text-sm mt-1">{errors.metadescription}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="metakeywords" className="block font-semibold mb-2">Meta Keywords</label>
        <textarea
          id="metakeywords"
          value={metakeywords}
          onChange={(e) => {
            const value = e.target.value;
            setMetakeywords(value);
            setErrors(prev => ({ ...prev, metakeywords: validateMetaKeywords(value.trim()) }));
          }}
          className={`w-full p-2 border rounded focus:outline-none ${errors.metakeywords ? "border-red-500" : ""}`}
          rows="3"
          placeholder="Enter comma-separated keywords (max 200 characters)"
          maxLength={200}
        ></textarea>
        {errors.metakeywords && <p className="text-red-500 text-sm mt-1">{errors.metakeywords}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="metalanguage" className="block font-semibold mb-2">Meta Language</label>
        <textarea
          id="metalanguage"
          value={metalanguage}
          onChange={(e) => {
            const value = e.target.value;
            setMetalanguage(value);
            setErrors(prev => ({ ...prev, metalanguage: validateMetaLanguage(value.trim()) }));
          }}
          className={`w-full p-2 border rounded focus:outline-none ${errors.metalanguage ? "border-red-500" : ""}`}
          rows="3"
          placeholder="Enter language code (e.g., en-US, max 5 characters)"
          maxLength={5}
        ></textarea>
        {errors.metalanguage && <p className="text-red-500 text-sm mt-1">{errors.metalanguage}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="metacanonical" className="block font-semibold mb-2">Meta Canonical</label>
        <textarea
          id="metacanonical"
          value={metacanonical}
          onChange={(e) => {
            const value = e.target.value;
            setMetacanonical(value);
            setErrors(prev => ({ ...prev, metacanonical: validateMetaCanonical(value.trim()) }));
          }}
          className={`w-full p-2 border rounded focus:outline-none ${errors.metacanonical ? "border-red-500" : ""}`}
          rows="3"
          placeholder="Enter canonical URL"
        ></textarea>
        {errors.metacanonical && <p className="text-red-500 text-sm mt-1">{errors.metacanonical}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="metaschema" className="block font-semibold mb-2">Schema</label>
        <textarea
          id="metaschema"
          value={metaschema}
          onChange={(e) => {
            const value = e.target.value;
            setMetaschema(value);
            setErrors(prev => ({ ...prev, metaschema: validateMetaSchema(value.trim()) }));
          }}
          className={`w-full p-2 border rounded focus:outline-none ${errors.metaschema ? "border-red-500" : ""}`}
          rows="3"
          placeholder="Enter schema markup (JSON-LD, max 2000 characters)"
          maxLength={2000}
        ></textarea>
        {errors.metaschema && <p className="text-red-500 text-sm mt-1">{errors.metaschema}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="otherMeta" className="block font-semibold mb-2">Other Meta</label>
        <textarea
          id="otherMeta"
          value={otherMeta}
          onChange={(e) => {
            const value = e.target.value;
            setOtherMeta(value);
            setErrors(prev => ({ ...prev, otherMeta: validateOtherMeta(value.trim()) }));
          }}
          className={`w-full p-2 border rounded focus:outline-none ${errors.otherMeta ? "border-red-500" : ""}`}
          rows="3"
          placeholder="Enter additional meta tags (max 2000 characters)"
          maxLength={2000}
        ></textarea>
        {errors.otherMeta && <p className="text-red-500 text-sm mt-1">{errors.otherMeta}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="priority" className="block font-semibold mb-2">Priority</label>
=======
          onChange={(e) => setSlug(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="url" className="block font-semibold mb-2">
          URL
        </label>
        <input
          disabled
          type="url"
          id="url"
          value={`https://rndtechnosoft.com/${slug}`}
          className="w-full p-2 border rounded focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="meta" className="block font-semibold mb-2">
          Meta Title
        </label>
        <textarea
          id="meta"
          value={metatitle}
          onChange={(e) => setMetatitle(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          rows="3"
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="meta" className="block font-semibold mb-2">
          Meta Description
        </label>
        <textarea
          id="meta"
          value={metadescription}
          onChange={(e) => setMetadescription(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          rows="3"
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="meta" className="block font-semibold mb-2">
          Meta Keywords
        </label>
        <textarea
          id="meta"
          value={metakeywords}
          onChange={(e) => setMetakeywords(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          rows="3"
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="meta" className="block font-semibold mb-2">
          Meta Canonical
        </label>
        <textarea
          id="meta"
          value={metacanonical}
          onChange={(e) => setMetacanonical(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          rows="3"
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="meta" className="block font-semibold mb-2">
          Meta Language
        </label>
        <textarea
          id="meta"
          value={metalanguage}
          onChange={(e) => setMetalanguage(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          rows="3"
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="meta" className="block font-semibold mb-2">
          Other Meta
        </label>
        <textarea
          id="meta"
          value={otherMeta}
          onChange={(e) => setOthermeta(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          rows="3"
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="meta" className="block font-semibold mb-2">
          Schema
        </label>
        <textarea
          id="meta"
          value={metaschema}
          onChange={(e) => setMetaschema(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          rows="3"
        ></textarea>
      </div>

      <div className="mb-4">
        <label htmlFor="priority" className="block font-semibold mb-2">
          Priority
        </label>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        <input
          type="number"
          id="priority"
          min={0}
          max={1}
          step={0.01}
          value={priority}
<<<<<<< HEAD
          onChange={(e) => {
            const value = e.target.value;
            setPriority(value);
            setErrors(prev => ({ ...prev, priority: validatePriority(value) }));
          }}
          className={`w-full p-2 border rounded focus:outline-none ${errors.priority ? "border-red-500" : ""}`}
          placeholder="Enter priority (0.0 to 1.0)"
        />
        {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="changeFreq" className="block font-semibold mb-2">Change Frequency</label>
        <select
          id="changeFreq"
          value={changeFreq}
          onChange={(e) => {
            const value = e.target.value;
            setChangeFreq(value);
            setErrors(prev => ({ ...prev, changeFreq: validateChangeFreq(value) }));
          }}
          className={`w-full p-2 border rounded focus:outline-none ${errors.changeFreq ? "border-red-500" : ""}`}
=======
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="changeFreq" className="block font-semibold mb-2">
          Change Frequency
        </label>
        <select
          id="changeFreq"
          value={changeFreq}
          onChange={(e) => setChangeFreq(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        >
          <option value="">Select Change Frequency</option>
          <option value="always">Always</option>
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
<<<<<<< HEAD
        {errors.changeFreq && <p className="text-red-500 text-sm mt-1">{errors.changeFreq}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="status" className="block font-semibold mb-2">Status</label>
=======
      </div>

      <div className="mb-4">
        <label htmlFor="status" className="block font-semibold mb-2">
          Status
        </label>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
<<<<<<< HEAD
          className={`w-full p-2 border rounded focus:outline-none ${errors.status ? "border-red-500" : ""}`}
=======
          className="w-full p-2 border rounded focus:outline-none"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
<<<<<<< HEAD

=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      <div className="mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

<<<<<<< HEAD
export default EditNews;
=======
export default EditNews;
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
