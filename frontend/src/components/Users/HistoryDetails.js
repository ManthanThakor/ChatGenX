import React from "react";
import { FaRegEdit, FaTrashAlt, FaRegClock, FaRegStar } from "react-icons/fa";

const HistoryDetails = () => {
  // Dummy history data for demonstration
  const historyItem = {
    id: 1,
    title: "AI Innovations in Healthcare",
    content:
      "Exploring the transformation brought by AI in healthcare, including diagnostics and patient care improvements...",
    date: "2023-03-15",
    moreDetails:
      "The article delves into AI applications in medical data analysis, patient interaction, and emerging technologies...",
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden m-4">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">{historyItem.title}</h2>
        <div className="flex items-center text-sm">
          <FaRegClock className="mr-2" />
          <span>{historyItem.date}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <FaRegStar className="text-yellow-400 mr-1" />
            <span className="text-lg font-semibold">Featured Article</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-600">
            <FaRegEdit className="hover:text-blue-600 cursor-pointer" />
            <FaTrashAlt className="hover:text-red-600 cursor-pointer" />
          </div>
        </div>
        <p className="text-gray-700 mb-4">{historyItem.content}</p>
        <h3 className="text-xl font-semibold mb-2">Detailed Analysis</h3>
        <p className="text-gray-600">{historyItem.moreDetails}</p>
      </div>
    </div>
  );
};

export default HistoryDetails;
