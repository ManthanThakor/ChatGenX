import axios from "axios";

//=======Generation API=====

export const generateContentAPI = async ({ prompt, category, tone }) => {
  if (!prompt.trim()) {
    throw new Error("Prompt is required and must be a non-empty string.");
  }
  try {
    const response = await axios.post(
      "http://localhost:8000/api/openai/generate-content",
      { prompt, category, tone },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    // Customize error handling as needed
    if (error.response) {
      throw new Error(error.response.data.message || "An error occurred");
    } else {
      throw new Error("An error occurred");
    }
  }
};
