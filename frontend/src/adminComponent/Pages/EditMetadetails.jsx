import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


const EditMetaDetails = () => {
  const { id: metaId } = useParams();
  const { type } = useParams();
  const navigate = useNavigate();
  const [metatitle, setMetatitle] = useState("");
  const [metadescription, setMetadescription] = useState("");
  const [metakeywords, setMetakeywords] = useState("");
  const [metalanguage, setMetalanguage] = useState("")
  const [metacanonical, setMetacanonical] = useState("")
  const [metaschema, setMetaschema] = useState("")
  const [otherMeta, setOtherMeta] = useState("")
  const [url, setUrl] = useState()



  useEffect(() => {
    const fetchMetaDetailsData = async () => {
      try {
        let response;
        if (type === 'product-category') {
          response = await axios.get(`/api/product/fetchCategoryUrlmetaById?id=${metaId}`, { withCredentials: true });
        } else if (type === 'products') {
          response = await axios.get(`/api/product/fetchUrlmetaById?id=${metaId}`, { withCredentials: true });
        } else if (type === 'service-category') {
          response = await axios.get(`/api/services/fetchCategoryUrlmetaById?id=${metaId}`, { withCredentials: true });
        } else if (type === 'service') {
          response = await axios.get(`/api/services/fetchUrlmetaById?id=${metaId}`, { withCredentials: true });
        } else if (type === 'news-category') {
          response = await axios.get(`/api/news/fetchCategoryUrlmetaById?id=${metaId}`, { withCredentials: true });
        } else if (type === 'new') {
          response = await axios.get(`/api/news/fetchUrlmetaById?id=${metaId}`, { withCredentials: true });
        } else if (type === 'data') {
          response = await axios.get(`/api/sitemap/fetchSitemapById?id=${metaId}`);
        }

        const { url, metatitle, metadescription, metalanguage, metakeywords, metacanonical, metaschema, otherMeta } = response.data;
        setUrl(url)
        setMetatitle(metatitle)
        setMetadescription(metadescription)
        setMetakeywords(metakeywords)
        setMetalanguage(metalanguage)
        setMetakeywords(metakeywords)
        setMetacanonical(metacanonical)
        setMetaschema(metaschema)
        setOtherMeta(otherMeta)

      } catch (error) {
        console.error('Error fetching meta details data:', error);
      }
    };
    fetchMetaDetailsData();
  }, [metaId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const metaDetailsData = {
        url: url,
        metatitle: metatitle,
        metadescription: metadescription,
        metakeywords: metakeywords,
        metalanguage: metalanguage,
        metacanonical: metacanonical,
        metaschema: metaschema,
        otherMeta: otherMeta
      };

      let endpoint;

      if (type === 'productcategory') {
        endpoint = `/api/product/editCategoryUrlmeta?id=${metaId}`;
      } else if (type === 'product') {
        endpoint = `/api/product/editUrlmeta?id=${metaId}`;
      } else if (type === 'servicecategory') {
        endpoint = `/api/services/editCategoryUrlmeta?id=${metaId}`;
      } else if (type === 'services') {
        endpoint = `/api/services/editUrlmeta?id=${metaId}`;
      } else if (type === 'newscategory') {
        endpoint = `/api/news/editCategoryUrlmeta?id=${metaId}`;
      } else if (type === 'news') {
        endpoint = `/api/news/editUrlmeta?id=${metaId}`;
      } else if (type === 'data') {
        endpoint = `/api/sitemap/updateSitemapById?id=${metaId}`;
      }

      await axios.put(endpoint, metaDetailsData, { withCredentials: true });

      navigate('/metadetails');
    } catch (error) {
      console.error('Error updating meta details:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-4">
        <label htmlFor="url" className="block font-semibold mb-2">
          URL
        </label>
        <input
          disabled
          type="url"
          id="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value) }}
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
          onChange={(e) => setOtherMeta(e.target.value)}
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
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Update Meta
      </button>
    </form>
  );
};

export default EditMetaDetails;
