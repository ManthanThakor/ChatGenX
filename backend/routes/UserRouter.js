const express = require("express");

const {
  register,
  login,
  logout,
  UserProfile,
} = require("../controllers/UserController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const UserRouter = express.Router();

UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.post("/logout", logout);
UserRouter.get("/profile", isAuthenticated, UserProfile);
UserRouter.get("/auth/check", isAuthenticated, UserProfile);

module.exports = UserRouter;
