import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

const QuestionEditor = ({ questions: initialQuestions, setQuestions, contentId }) => {
  const [localQuestions, setLocalQuestions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [newQuestion, setNewQuestion] = useState({ question: '', answer: '' });

  useEffect(() => {
    if (Array.isArray(initialQuestions)) {
      setLocalQuestions(initialQuestions);
    } else {
      setLocalQuestions([]);
    }
  }, [initialQuestions]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = localQuestions.map((question, i) =>
      i === index ? { ...question, [field]: value } : question
    );
    setLocalQuestions(updatedQuestions);
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = async (index) => {
    try {
      await axios.delete(`/api/content/${contentId}/question/${index}`, {
        withCredentials: true,
      });
      const updatedQuestions = localQuestions.filter((_, i) => i !== index);
      setLocalQuestions(updatedQuestions);
      setQuestions(updatedQuestions);
      setSuccessMessage("Question deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleAddQuestion = async () => {
    if (newQuestion.question === '' || newQuestion.answer === '') {
      alert("Please fill in both the question and answer fields before adding.");
      return;
    }

    try {
      const response = await axios.put(
        `/api/content/update/questions/${contentId}`,
        { questions: [...localQuestions, newQuestion] },
        { withCredentials: true }
      );

      setLocalQuestions(response.data.questions);
      setQuestions(response.data.questions);
      setNewQuestion({ question: '', answer: '' });
      setSuccessMessage("New question added successfully");
      window.location.reload();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error adding new question:", error);
    }
  };

  const handleQuestionsSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/content/update/questions/${contentId}`,
        { questions: localQuestions },
        { withCredentials: true }
      );
      setSuccessMessage("Questions updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating questions:", error);
    }
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 font-bold">Questions</label>
      {Array.isArray(localQuestions) && localQuestions.map((q, index) => (
        <div key={index} className="mb-4">
          <ReactQuill
            value={q.question}
            onChange={(value) => handleQuestionChange(index, 'question', value)}
            modules={modules}
            className="border border-gray-300 rounded-md mb-2"
          />
          <ReactQuill
            value={q.answer}
            onChange={(value) => handleQuestionChange(index, 'answer', value)}
            modules={modules}
            className="border border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={() => handleRemoveQuestion(index)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md mt-2"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="mb-4">
        <ReactQuill
          value={newQuestion.question}
          onChange={(value) => setNewQuestion(prev => ({ ...prev, question: value }))}
          modules={modules}
          className="border border-gray-300 rounded-md mb-2"
          placeholder="Enter new question"
        />
        <ReactQuill
          value={newQuestion.answer}
          onChange={(value) => setNewQuestion(prev => ({ ...prev, answer: value }))}
          modules={modules}
          className="border border-gray-300 rounded-md"
          placeholder="Enter answer"
        />
        <button
          type="button"
          onClick={handleAddQuestion}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md mt-2"
        >
          Add Question
        </button>
      </div>

      <button
        type="button"
        onClick={handleQuestionsSubmit}
        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md mt-4"
      >
        Save All Questions
      </button>

      {successMessage && (
        <p className="mt-4 text-green-500">{successMessage}</p>
      )}
    </div>
  );
};

export default QuestionEditor;
