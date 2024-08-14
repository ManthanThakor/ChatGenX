const express = require("express");

const isAuthenticated = require("../middlewares/isAuthenticated");
const { openAIController } = require("../controllers/OpenAIController");

const OpenAIRouter = express.Router();

OpenAIRouter.post("/generate-content", isAuthenticated, openAIController);

module.exports = OpenAIRouter;
