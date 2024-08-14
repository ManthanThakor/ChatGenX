const asyncHandler = require("express-async-handler");
const axios = require("axios");
const ContentHistory = require("../models/ContentHistory");
const User = require("../models/User");

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
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
      }
    );

    const content = response?.data?.generated_text?.trim();

    const newContent = await ContentHistory.create({
      user: req?.user?._id,
      content,
    });

    const userFound = await User.findById(req?.user?.id);
    if (userFound) {
      userFound.contentHistory.push(newContent?._id);
      userFound.apiRequestCount += 1;
      await userFound.save();
    }

    res.status(200).json({ content });
  } catch (error) {
    console.error(
      "Error with Hugging Face API:",
      error.response?.data || error.message
    );

    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

module.exports = {
  openAIController,
};
