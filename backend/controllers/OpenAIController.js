const asyncHandler = require("express-async-handler");
const axios = require("axios");

const openAIController = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res
      .status(400)
      .json({ error: "Prompt is required and must be a non-empty string." });
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B",
      {
        inputs: prompt,
        parameters: {
          max_length: 700,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
      }
    );

    // Log the full response for debugging
    console.log("Hugging Face API Response:", response.data);

    // Adjust content extraction based on actual response
    let content = "No content generated.";

    // Check different possible response formats
    if (response.data && response.data.length > 0) {
      content =
        response.data[0]?.generated_text?.trim() ||
        response.data[0]?.text?.trim() ||
        "No content generated.";
    }

    res.status(200).json({ content });
  } catch (error) {
    console.error(
      "Error with Hugging Face API:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error:
        error.response?.data?.error ||
        "An error occurred while processing your request.",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = {
  openAIController,
};
