import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfileAPI } from "../../apis/user/usersAPI";
import StatusMessage from "../Alert/StatusMessage";
import { generateContentAPI } from "../../apis/chatGPT/chatGPT";
import { useQuery } from "@tanstack/react-query";
import ChatWindow from "./ChatWindow";

const BlogPostAIAssistant = () => {
  const [contentHistory, setContentHistory] = useState([]);
  const [displayedText, setDisplayedText] = useState("");
  const [textToDisplay, setTextToDisplay] = useState("");
  const queryClient = useQueryClient();

  const { isLoading, isError, data, error } = useQuery({
    queryFn: getUserProfileAPI,
    queryKey: ["profile"],
  });

  const mutation = useMutation({
    mutationFn: generateContentAPI,
    onSuccess: (response) => {
      if (
        response &&
        response.content &&
        typeof response.content === "string"
      ) {
        const newContent = {
          prompt: formik.values.prompt,
          content: response.content, // Use 'content' here
          createdAt: new Date().toISOString(),
        };

        queryClient.setQueryData(["profile"], (oldData) => {
          return {
            ...oldData,
            user: {
              ...oldData.user,
              contentHistory: [
                ...(oldData?.user?.contentHistory || []),
                newContent,
              ],
            },
          };
        });

        setContentHistory([...contentHistory, newContent]);
        setTextToDisplay(response.content); // Set text to be displayed word by word
      } else {
        console.error("Generated content is undefined or not a string.");
        console.log("Received data structure:", response); // Log the problematic data
      }
    },
    onError: (error) => {
      console.error("Error generating content:", error.message);
    },
  });

  const formik = useFormik({
    initialValues: {
      prompt: "",
      tone: "",
      category: "",
    },
    validationSchema: Yup.object({
      prompt: Yup.string().required("A prompt is required"),
      tone: Yup.string().required("Selecting a tone is required"),
      category: Yup.string().required("Selecting a category is required"),
    }),
    onSubmit: (values) => {
      mutation.mutate({
        prompt: values.prompt,
        category: values.category,
        tone: values.tone,
      });
    },
  });

  useEffect(() => {
    if (textToDisplay) {
      displayTextWordByWord(textToDisplay);
    }
  }, [textToDisplay]);

  const displayTextWordByWord = (text) => {
    if (!text || typeof text !== "string") {
      console.error("Text is either undefined or not a string.");
      return;
    }

    const words = text.split(" ");
    let index = 0;
    let displayed = "";

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + (index > 0 ? " " : "") + words[index]);
      index++;
      if (index >= words.length) {
        clearInterval(interval);
      }
    }, 100); // Adjust speed by changing the interval time (100ms in this case)
  };

  const handleNewChat = () => {
    setDisplayedText("");
    setTextToDisplay("");
    formik.resetForm();
  };

  if (isLoading) {
    return <StatusMessage type="loading" message="Loading please wait..." />;
  }

  if (isError) {
    console.error("Error loading profile:", error?.response?.data?.message);
    return (
      <StatusMessage type="error" message={error?.response?.data?.message} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 flex justify-center items-center p-6">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-2xl w-full p-6">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          AI Blog Post Generator
        </h2>

        <ChatWindow contentHistory={contentHistory} />

        {mutation.isLoading && (
          <StatusMessage
            type="loading"
            message="Generating content, please wait..."
          />
        )}

        {mutation.isSuccess && (
          <StatusMessage
            type="success"
            message="Content generation is successful!"
          />
        )}

        {mutation.isError && (
          <StatusMessage
            type="error"
            message={mutation.error?.message || "An error occurred"}
          />
        )}

        <div
          className="bg-indigo-500 text-white p-3 rounded-lg max-w-xl self-end mt-2 overflow-auto"
          style={{ maxHeight: "200px", maxWidth: "100%" }}
        >
          <p>{displayedText}</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4 mt-6">
          <div>
            <label
              htmlFor="prompt"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Enter a topic or idea
            </label>
            <input
              id="prompt"
              type="text"
              {...formik.getFieldProps("prompt")}
              className="px-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter a topic or idea"
            />
            {formik.touched.prompt && formik.errors.prompt && (
              <div className="text-red-500 mt-1">{formik.errors.prompt}</div>
            )}
          </div>

          <div>
            <label
              htmlFor="tone"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Select Tone
            </label>
            <select
              id="tone"
              {...formik.getFieldProps("tone")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Choose a tone...</option>
              <option value="formal">Formal</option>
              <option value="informal">Informal</option>
              <option value="humorous">Humorous</option>
            </select>
            {formik.touched.tone && formik.errors.tone && (
              <div className="text-red-500 mt-1">{formik.errors.tone}</div>
            )}
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Select Category
            </label>
            <select
              id="category"
              {...formik.getFieldProps("category")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Choose a category...</option>
              <option value="technology">Technology</option>
              <option value="health">Health</option>
              <option value="business">Business</option>
            </select>
            {formik.touched.category && formik.errors.category && (
              <div className="text-red-500 mt-1">{formik.errors.category}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Content
          </button>
          <button
            type="button"
            onClick={handleNewChat}
            className="w-full py-2 px-4 mt-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            New Chat
          </button>
          <Link to="/history">View history</Link>
        </form>
      </div>
    </div>
  );
};

export default BlogPostAIAssistant;
