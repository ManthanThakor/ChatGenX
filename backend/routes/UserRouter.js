const express = require("express");

const { register } = require("../controllers/UserController");

const UserRouter = express.Router();

UserRouter.post("/register", register);

module.exports = UserRouter;
