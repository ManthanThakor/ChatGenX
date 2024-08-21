import React, { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FaRegEdit,
  FaEye,
  FaPlusSquare,
  FaRegCopy,
  FaTrashAlt,
} from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { getUserProfileAPI } from "../../apis/user/usersAPI";
import StatusMessage from "../Alert/StatusMessage";
import { Link } from "react-router-dom";
import { deleteContentHistoryAPI } from "../../apis/chatGPT/chatGPT";

const ContentGenerationHistory = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState({
    prompt: "",
    content: "",
    _id: "", // Added to manage content ID for deletion
  });
  const modalRef = useRef(null);
  const queryClient = useQueryClient();

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

  // Open warning modal
  const handleOpenWarningModal = (content) => {
    setSelectedContent(content);
    setWarningModalOpen(true);
  };

  // Close modals
  const handleCloseModal = () => {
    setModalOpen(false);
    setWarningModalOpen(false);
    setSelectedContent({ prompt: "", content: "", _id: "" });
  };

  // Handle content deletion
  const handleDeleteContent = async () => {
    try {
      await deleteContentHistoryAPI(selectedContent._id);
      queryClient.invalidateQueries("profile"); // Refetch content history after deletion
      handleCloseModal(); // Close the warning modal after successful deletion
    } catch (error) {
      console.error("Failed to delete content:", error.message);
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <StatusMessage type="loading" message="Loading please wait..." />;
  }

  if (isError) {
    return (
      <StatusMessage type="error" message={error?.response?.data?.message} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 flex justify-center items-center p-6">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-2xl w-full p-6">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Content Generation History
        </h2>

        <div className="flex justify-between mb-4">
          <Link
            to="/generate-content"
            className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold rounded-md hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaPlusSquare className="mr-2" />
            Generate New Content
          </Link>
        </div>

        {data?.user?.contentHistory.length === 0 ? (
          <div className="text-gray-600 text-center py-4">
            No content generated yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {data?.user?.contentHistory?.map((content, index) => (
              <li
                key={index}
                className="flex justify-between items-center py-4"
              >
                <div>
                  <p className="text-gray-800 font-semibold">
                    {content.prompt || "No prompt available"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {new Date(content.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleViewContent(content)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEye />
                  </button>

                  <button
                    onClick={() => handleOpenWarningModal(content)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Content Modal */}
        {modalOpen && (
          <div
            className="fixed z-10 inset-0 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                aria-hidden="true"
              ></div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div
                ref={modalRef}
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start sm:justify-between">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Prompt and Content
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${selectedContent.prompt}\n\n${selectedContent.content}`
                          );
                        }}
                      >
                        <FaRegCopy />
                      </button>
                      <button
                        className="text-red-500 hover:text-gray-700"
                        onClick={handleCloseModal}
                      >
                        <IoIosCloseCircle />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      <strong>Prompt:</strong>
                    </p>
                    <pre className="bg-gray-100 p-4 rounded-md border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedContent.prompt}
                    </pre>
                    <p className="text-sm text-gray-500 mt-4">
                      <strong>Content:</strong>
                    </p>
                    <pre className="bg-gray-100 p-4 rounded-md border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedContent.content}
                    </pre>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Warning Modal */}
        {warningModalOpen && (
          <div
            className="fixed z-10 inset-0 overflow-y-auto"
            aria-labelledby="warning-modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-900 bg-opacity-80 transition-opacity"
                aria-hidden="true"
              ></div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-gray-700 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">
                <div className="bg-gray-700 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start sm:justify-between">
                    <h3
                      className="text-lg leading-6 font-medium text-white"
                      id="warning-modal-title"
                    >
                      Delete chat?
                    </h3>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-white">
                      This will delete "{selectedContent.prompt}"
                    </p>
                  </div>
                </div>
                <div className="bg-gray-600 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-black hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleDeleteContent}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-black hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentGenerationHistory;
