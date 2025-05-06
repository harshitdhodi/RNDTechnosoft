import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';
import SubsectionsComponent from "../SubsectionEditor";

const EditExtraPage = () => {
  const { contentType } = useParams();
  const [photo, setPhoto] = useState([]);
  const [video, setVideo] = useState("");
  const [videoAlt, setVideoAlt] = useState("");
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([{ question: "", answer: "" }]);
  const [subsections, setSubsections] = useState([
    { photo: "", photoAlt: "", title: "", description: "" },
  ]);
  const [status, setStatus] = useState(false);

  const [contentId, setContentId] = useState("");

  const [videotitle, setVideotitle] = useState("")
  const [imgtitle, setImgtitle] = useState([])

  const [initialPhotos, setInitialPhotos] = useState([]);
 
  const [initialphotoAlts, setInitialPhotoAlts] = useState([]);
  const [initialVideoAlt, setInitialVideoAlt] = useState("");
  const [initialImgtitle, setInitialImgtitle] = useState([]);
  const [initialVideo, setInitialVideo] = useState("")
  const [initialVideotitle, setInitialVideotitle] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    fetchContentDetails();
  }, []);


  const fetchContentDetails = async () => {
    try {
      const response = await axios.get(`/api/content/types/weareexpertsin`, {
        withCredentials: true,
      });
      const content = response.data[0];
      setHeading(content.heading || "");
      setSubheading(content.subheading || "");
      setDescription(content.description || "");
      setInitialPhotos(content.photo);
      setStatus(content.status);

      setInitialPhotoAlts(content.photoAlt);
      setInitialVideo(content.video);

      setInitialVideoAlt(content.videoAlt);
      setInitialImgtitle(content.imgtitle)
      setInitialVideotitle(content.videotitle)
      setQuestions(
        content.questions.length > 0
          ? content.questions
          : [{ question: "", answer: "" }]
      );
      setSubsections(
        content.subsections.length > 0
          ? content.subsections
          : [{ photo: "", photoAlt: "", title: "", description: "" }]
      );
      setContentId(content._id || "");
    } catch (error) {
      console.error(error);
    }
  };

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



  return (
    <div>
     

      {/* Subsections Component */}
      <SubsectionsComponent
        subsections={subsections}
        setSubsections={setSubsections}
        contentId={contentId}
      />

   
    </div>

  );
};

export default EditExtraPage;
