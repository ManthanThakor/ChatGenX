import React from "react";
import ChatMessage from "./ChatMessage ";

const ChatWindow = ({ contentHistory }) => {
  return (
    <div className="flex flex-col p-4 bg-gray-100 rounded-lg h-96 overflow-y-auto">
      {contentHistory?.map((item, index) => (
        <ChatMessage key={index} {...item} />
      ))}
    </div>
  );
};

export default ChatWindow;
