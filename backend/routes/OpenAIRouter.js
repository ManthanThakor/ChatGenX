const express = require("express");

const isAuthenticated = require("../middlewares/isAuthenticated");
const { openAIController } = require("../controllers/OpenAIController");
const checkApiRequestLimit = require("../middlewares/CheckApiRequestLimit");

const OpenAIRouter = express.Router();

OpenAIRouter.post(
  "/generate-content",
  isAuthenticated,
  checkApiRequestLimit,
  openAIController
);

module.exports = OpenAIRouter;
