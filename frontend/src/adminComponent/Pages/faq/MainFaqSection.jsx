import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-modal';
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";

import HeadingSection from "./HeadingSection";
import TableHeader from "./TableHeader";
import SearchBar from "./FaqSearchbar";
import { FaqTableComponent } from "./FaqTableComponent";
import Pagination from "./FaqPegination";
import FaqModal from "./FaqModel";

Modal.setAppElement('#root');

const MainFaqSection = () => {
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const pageSize = 20;

  const notify = () => {
    toast.success("Updated Successfully!");
  };

  const handleView = (faq) => {
    setSelectedFAQ(faq);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFAQ(null);
  };

  const fetchData = async (pageIndex) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/faq/getFAQ?page=${pageIndex + 1}`, { withCredentials: true });
      const faqsWithIds = response.data.data.map((faqItem, index) => ({
        ...faqItem,
        id: pageIndex * pageSize + index + 1,
      }));
      setFaqs(faqsWithIds);
      setPageCount(Math.ceil(response.data.total / pageSize));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFaq = async (id) => {
    try {
      await axios.delete(`/api/faq/deleteFaq?id=${id}`, { withCredentials: true });
      fetchData(pageIndex);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=faq', { withCredentials: true });
      const { heading, subheading } = response.data;
      setHeading(heading || '');
      setSubheading(subheading || '');
    } catch (error) {
      console.error(error);
    }
  };

  const saveHeadings = async () => {
    try {
      await axios.put('/api/pageHeading/updateHeading?pageType=faq', {
        pagetype: 'faq',
        heading,
        subheading,
      }, { withCredentials: true });
      notify();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(pageIndex);
  }, [pageIndex]);

  useEffect(() => {
    fetchHeadings();
  }, []);

  return (
    <div className="p-4 overflow-x-auto">
      <ToastContainer />
      
      <HeadingSection 
        heading={heading}
        subheading={subheading}
        setHeading={setHeading}
        setSubheading={setSubheading}
        saveHeadings={saveHeadings}
      />
      
      <TableHeader navigate={navigate} />
      
      <SearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <h2 className="text-md font-semibold mb-4">Manage FAQs</h2>
      
      {loadings ? (
        <div className="flex justify-center">
          <UseAnimations animation={loading} size={56} />
        </div>
      ) : (
        <>
          {faqs.length === 0 ? (
            <div className="flex justify-center items-center">
              <iframe 
                className="w-96 h-96" 
                src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"
              ></iframe>
            </div>
          ) : (
            <FaqTableComponent 
              faqs={faqs}
              searchTerm={searchTerm}
              navigate={navigate}
              handleView={handleView}
              deleteFaq={deleteFaq}
            />
          )}
        </>
      )}
      
      
      <FaqModal 
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        selectedFAQ={selectedFAQ}
      />
    </div>
  );
};

export default MainFaqSection;