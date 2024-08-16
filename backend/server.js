const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middlewares/ErrorMiddleware");
const usersRouter = require("./routes/UserRouter");
const OpenAIRouter = require("./routes/OpenAIRouter");
const stripeRouter = require("./routes/stripeRouter");
const corn = require("node-cron");

//! Connect to MongoDB
require("./utils/ConnectDB")();

const app = express();
const port = process.env.PORT || 8000;

//! Cron for the trial period
//! Cron Paid Plan
//! Middleware

app.use(express.json());
app.use(cookieParser());

//! Routes

app.use("/api/users", usersRouter);
app.use("/api/openai", OpenAIRouter);
app.use("/api/stripe", stripeRouter);

//! Error Handling

app.use(errorHandler);

//! Start server

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
