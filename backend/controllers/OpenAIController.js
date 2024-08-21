const asyncHandler = require("express-async-handler");
const ContentHistory = require("../models/ContentHistory");
const User = require("../models/User"); // Import the User model
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const openAIController = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res
      .status(400)
      .json({ error: "Prompt is required and must be a non-empty string." });
  }

  try {
    // Use Groq SDK to get chat completion
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });

    // Extract content from the response
    let content = "No content generated.";
    if (response.choices && response.choices.length > 0) {
      content =
        response.choices[0]?.message?.content?.trim() ||
        "No content generated.";
    }

    // Create the history
    const newContent = await ContentHistory.create({
      user: req.user._id,
      prompt, // Save the prompt
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
    console.error("Error with Groq API:", error.message);

    res.status(500).json({
      error: "An error occurred while processing your request.",
      details: error.message,
    });
  }
});

const deleteContentHistory = async (req, res) => {
  const contentId = req.params.id;

  try {
    console.log(`Attempting to delete content with ID: ${contentId}`);

    const result = await ContentHistory.findByIdAndDelete(contentId);

    if (!result) {
      console.log(`No content found with ID: ${contentId}`);
      return res.status(404).json({ message: "Content not found" });
    }

    console.log(`Content deleted successfully with ID: ${contentId}`);
    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error(`Error occurred while deleting content: ${error.message}`);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the content" });
  }
};

module.exports = {
  openAIController,
  deleteContentHistory,
};
