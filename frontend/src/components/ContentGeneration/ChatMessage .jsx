import React from "react";

const ChatMessage = ({ prompt, content, createdAt }) => {
  return (
    <div className="flex flex-col mb-4">
      <div className="bg-gray-200 p-3 rounded-lg max-w-xl self-start">
        <p className="text-sm text-gray-800">{prompt}</p>
      </div>
      <div className="bg-indigo-500 text-white p-3 rounded-lg max-w-xl self-end mt-2">
        <p>{content}</p>
      </div>
      <span className="text-xs text-gray-500 self-end mt-1">
        {new Date(createdAt).toLocaleString()}
      </span>
    </div>
  );
};

export default ChatMessage;
