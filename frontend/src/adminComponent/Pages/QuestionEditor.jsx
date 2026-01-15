import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [newQuestion, setNewQuestion] = useState({ question: '', answer: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize with default empty question if no questions exist
  useEffect(() => {
    if (Array.isArray(initialQuestions) && initialQuestions.length > 0) {
      setLocalQuestions(initialQuestions);
    } else {
      setLocalQuestions([{ question: '', answer: '' }]);
    }
  }, [initialQuestions]);

  const validateQuestion = (question, index = null) => {
    const newErrors = { ...errors };
    let isValid = true;

    if (!question.question || question.question === '<p><br></p>') {
      newErrors[`question-${index}`] = 'Question is required';
      isValid = false;
    } else {
      delete newErrors[`question-${index}`];
    }

    if (!question.answer || question.answer === '<p><br></p>') {
      newErrors[`answer-${index}`] = 'Answer is required';
      isValid = false;
    } else {
      delete newErrors[`answer-${index}`];
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...localQuestions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setLocalQuestions(updatedQuestions);
    validateQuestion(updatedQuestions[index], index);
  };

  const handleRemoveQuestion = async (index) => {
    if (!window.confirm('Are you sure you want to remove this question?')) {
      return;
    }

    setIsLoading(true);
    try {
      const questionToRemove = localQuestions[index];
      
      // If the question has an _id, it exists in the backend
      if (questionToRemove._id) {
        await axios.delete(`/api/content/${contentId}/question/${questionToRemove._id}`, {
          withCredentials: true,
        });
      }

      const updatedQuestions = localQuestions.filter((_, i) => i !== index);
      setLocalQuestions(updatedQuestions);
      setQuestions(updatedQuestions);
      
      // If no questions left, add an empty one
      if (updatedQuestions.length === 0) {
        const emptyQuestion = { question: '', answer: '' };
        setLocalQuestions([emptyQuestion]);
        setQuestions([emptyQuestion]);
      }
      
      toast.success('Question removed successfully');
    } catch (error) {
      console.error("Error removing question:", error);
      toast.error('Failed to remove question');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuestion = () => {
    if (!validateQuestion(newQuestion, 'new')) {
      toast.error('Please fill in both question and answer fields');
      return;
    }

    const updatedQuestions = [...localQuestions, { ...newQuestion }];
    setLocalQuestions(updatedQuestions);
    setQuestions(updatedQuestions);
    setNewQuestion({ question: '', answer: '' });
    toast.success('Question added successfully');
  };

  const handleSaveAllQuestions = async (e) => {
    e.preventDefault();
    
    // Validate all questions
    const allValid = localQuestions.every((q, index) => validateQuestion(q, index));
    if (!allValid) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (localQuestions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        `/api/content/update/questions/${contentId}`,
        { questions: localQuestions },
        { withCredentials: true }
      );

      setLocalQuestions(response.data.questions || []);
      setQuestions(response.data.questions || []);
      toast.success('Questions saved successfully');
    } catch (error) {
      console.error("Error saving questions:", error);
      toast.error(error.response?.data?.message || 'Failed to save questions');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRichTextEditor = (value, onChange, placeholder, error) => (
    <div className="mb-2">
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        className={`border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );

  return (
    <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">Manage Questions</h2>
      
      {/* Existing Questions */}
      {localQuestions.map((q, index) => (
        <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Question {index + 1}</h3>
            <button
              type="button"
              onClick={() => handleRemoveQuestion(index)}
              disabled={isLoading}
              className="text-red-500 hover:text-red-700 disabled:opacity-50"
              title="Remove question"
            >
              × Remove
            </button>
          </div>
          
          {renderRichTextEditor(
            q.question,
            (value) => handleQuestionChange(index, 'question', value),
            'Enter question...',
            errors[`question-${index}`]
          )}
          
          {renderRichTextEditor(
            q.answer,
            (value) => handleQuestionChange(index, 'answer', value),
            'Enter answer...',
            errors[`answer-${index}`]
          )}
        </div>
      ))}

      {/* Add New Question */}
      <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <h3 className="font-semibold mb-3">Add New Question</h3>
        
        {renderRichTextEditor(
          newQuestion.question,
          (value) => setNewQuestion(prev => ({ ...prev, question: value })),
          'Enter new question...',
          errors['question-new']
        )}
        
        {renderRichTextEditor(
          newQuestion.answer,
          (value) => setNewQuestion(prev => ({ ...prev, answer: value })),
          'Enter answer...',
          errors['answer-new']
        )}
        
        <div className="mt-3">
          <button
            type="button"
            onClick={handleAddQuestion}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {isLoading ? 'Adding...' : 'Add Question'}
          </button>
        </div>
      </div>

      {/* Save All Button */}
      <div className="mt-6 pt-4 border-t">
        <button
          type="button"
          onClick={handleSaveAllQuestions}
          disabled={isLoading || localQuestions.length === 0}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save All Questions'}
        </button>
      </div>
    </div>
  );
};

export default QuestionEditor;