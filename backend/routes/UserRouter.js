const express = require("express");

const {
  register,
  login,
  logout,
  UserProfile,
  checkAuth,
} = require("../controllers/UserController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { verifyPayment } = require("../controllers/handleStripePayment");

const UserRouter = express.Router();

UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.post("/logout", logout);
UserRouter.get("/profile", isAuthenticated, UserProfile);
UserRouter.get("/auth/check", isAuthenticated, checkAuth);

module.exports = UserRouter;
