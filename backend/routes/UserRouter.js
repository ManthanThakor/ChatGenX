const express = require("express");

const {
  register,
  login,
  logout,
  UserProfile,
} = require("../controllers/UserController");

const UserRouter = express.Router();

UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.post("/logout", logout);
UserRouter.get("/profile", UserProfile);

module.exports = UserRouter;
