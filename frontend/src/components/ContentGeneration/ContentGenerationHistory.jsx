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
          content: response.content,
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
        setTextToDisplay(response.content);
      } else {
        console.error("Generated content is undefined or not a string.");
        console.log("Received data structure:", response);
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

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + (index > 0 ? " " : "") + words[index]);
      index++;
      if (index >= words.length) {
        clearInterval(interval);
      }
    }, 100);
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
    <div className="min-h-screen bg-gray-900 flex justify-center items-center p-8">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
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
          className="bg-indigo-700 text-white p-4 rounded-lg mt-6 shadow-md"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          <p>{displayedText}</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6 mt-8">
          <div>
            <label
              htmlFor="prompt"
              className="block text-gray-700 text-lg font-semibold mb-2"
            >
              Enter a topic or idea
            </label>
            <input
              id="prompt"
              type="text"
              {...formik.getFieldProps("prompt")}
              className="px-4 py-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter a topic or idea"
            />
            {formik.touched.prompt && formik.errors.prompt && (
              <div className="text-red-500 mt-1">{formik.errors.prompt}</div>
            )}
          </div>

          <div>
            <label
              htmlFor="tone"
              className="block text-gray-700 text-lg font-semibold mb-2"
            >
              Select Tone
            </label>
            <select
              id="tone"
              {...formik.getFieldProps("tone")}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="block text-gray-700 text-lg font-semibold mb-2"
            >
              Select Category
            </label>
            <select
              id="category"
              {...formik.getFieldProps("category")}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="w-full py-3 px-6 border border-transparent rounded-md shadow-md text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform"
          >
            Generate Content
          </button>
          <button
            type="button"
            onClick={handleNewChat}
            className="w-full py-3 px-6 mt-4 border border-transparent rounded-md shadow-md text-lg font-semibold text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 transition-transform"
          >
            New Chat
          </button>
          <Link
            to="/history"
            className="block text-center text-indigo-600 hover:underline mt-4"
          >
            View history
          </Link>
        </form>
      </div>
    </div>
  );
};

export default BlogPostAIAssistant;
