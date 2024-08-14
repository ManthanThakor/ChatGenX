const asyncHandler = require("express-async-handler");
const axios = require("axios");
const ContentHistory = require("../models/ContentHistory");
const User = require("../models/User"); // Import the User model

const openAIController = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res
      .status(400)
      .json({ error: "Prompt is required and must be a non-empty string." });
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        inputs: prompt,
        parameters: {
          max_length: 700,
          temperature: 0.7,
          top_p: 0.9,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
      }
    );

    // Extract content from the response
    let content = "No content generated.";
    if (response.data && response.data.length > 0) {
      content =
        response.data[0]?.generated_text?.trim() ||
        response.data[0]?.text?.trim() ||
        "No content generated.";
    }

    // Create the history
    const newContent = await ContentHistory.create({
      user: req.user._id,
      content,
    });

    // Find the user and update their history and API request count
    const userFound = await User.findById(req.user._id);
    if (userFound) {
      userFound.contentHistory.push(newContent._id);
      userFound.apiRequestCount += 1;
      await userFound.save();
    } else {
      return res.status(404).json({ error: "User not found." });
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
