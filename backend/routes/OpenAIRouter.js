const express = require("express");

const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  openAIController,
  deleteContentHistory,
} = require("../controllers/OpenAIController");
const checkApiRequestLimit = require("../middlewares/CheckApiRequestLimit");

const OpenAIRouter = express.Router();

OpenAIRouter.post(
  "/generate-content",
  isAuthenticated,
  checkApiRequestLimit,
  openAIController
);

OpenAIRouter.delete(
  "/content-history/:id",
  isAuthenticated,
  deleteContentHistory
);

module.exports = OpenAIRouter;
