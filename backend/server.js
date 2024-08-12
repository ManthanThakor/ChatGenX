const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const { errorHandler } = require("./middlewares/ErrorMiddleware");
const usersRouter = require("./routes/UserRouter");

//! Connect to MongoDB
require("./utils/ConnectDB")();

const app = express();

const port = process.env.PORT || 8000;

//! Middleware

app.use(express.json());

//! Routes

app.use("/api/users", usersRouter);

//! Error Handling

app.use(errorHandler);

//! Start server

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
