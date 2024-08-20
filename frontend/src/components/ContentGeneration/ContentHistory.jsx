import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaRegEdit, FaTrashAlt, FaEye, FaPlusSquare } from "react-icons/fa";
import { getUserProfileAPI } from "../../apis/user/usersAPI";
import StatusMessage from "../Alert/StatusMessage";
import { Link } from "react-router-dom";

const ContentGenerationHistory = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState({
    prompt: "",
    answer: "",
  });
  const modalRef = useRef(null);

  // Get the user profile
  const { isLoading, isError, data, error } = useQuery({
    queryFn: getUserProfileAPI,
    queryKey: ["profile"],
  });

  // Open modal with selected content
  const handleViewContent = (content) => {
    setSelectedContent(content);
    setModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedContent({ prompt: "", answer: "" });
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        handleCloseModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalOpen]);

  // Display loading
  if (isLoading) {
    return <StatusMessage type="loading" message="Loading please wait" />;
  }

  // Display error
  if (isError || !data?.user) {
    return (
      <StatusMessage
        type="error"
        message={error?.response?.data?.message || "Failed to load user data"}
      />
    );
  }

  const contentHistory = data?.user?.contentHistory || [];

  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Content Generation History
        </h2>

        {/* Button to create new content */}
        <Link
          to="/generate-content"
          className="mb-4 w-72 bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 flex items-center"
        >
          <FaPlusSquare className="mr-2" /> Create New Content
        </Link>

        {/* Content history list */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {contentHistory.length === 0 ? (
            <h1 className="text-center p-4">No history found</h1>
          ) : (
            <ul className="divide-y divide-gray-200">
              {contentHistory.map((content, index) => (
                <li
                  key={content.id || index}
                  className="px-6 py-4 flex items-center justify-between space-x-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {content?.prompt || "No prompt available"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(content?.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <FaEye
                      className="text-gray-500 hover:text-gray-700 cursor-pointer"
                      onClick={() =>
                        handleViewContent({
                          prompt: content?.prompt || "No prompt available",
                          answer: content?.content || "No content available",
                        })
                      }
                    />
                    <FaRegEdit className="text-blue-500 hover:text-blue-700 cursor-pointer" />
                    <FaTrashAlt className="text-red-500 hover:text-red-700 cursor-pointer" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div
            ref={modalRef}
            className="relative bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-80 overflow-hidden"
          >
            <h3 className="text-lg font-semibold mb-4">Content Details</h3>
            <div className="overflow-y-auto max-h-64">
              <h4 className="text-gray-400 mb-2">Prompt:</h4>
              <p className="text-gray-300 whitespace-pre-wrap mb-4">
                {selectedContent.prompt}
              </p>
              <h4 className="text-gray-400 mb-2">Answer:</h4>
              <p className="text-gray-300 whitespace-pre-wrap">
                {selectedContent.answer}
              </p>
            </div>
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGenerationHistory;
