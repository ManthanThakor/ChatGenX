const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middlewares/ErrorMiddleware");
const usersRouter = require("./routes/UserRouter");
const OpenAIRouter = require("./routes/OpenAIRouter");
const stripeRouter = require("./routes/stripeRouter");
const cron = require("node-cron");
const User = require("./models/User");

//! Connect to MongoDB
require("./utils/ConnectDB")();

const app = express();
const port = process.env.PORT || 8000;

//Cron for the trial period : run every single
cron.schedule("0 0 * * * *", async () => {
  console.log("This task runs every second");
  try {
    //get the current date
    const today = new Date();
    const updatedUser = await User.updateMany(
      {
        trialActive: true,
        trialExpires: { $lt: today },
      },
      {
        trialActive: false,
        subscriptionPlan: "Free",
        monthlyRequestCount: 5,
      }
    );
    console.log(updatedUser);
  } catch (error) {
    console.log(error);
  }
});

//Cron for the Free plan: run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Free",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//Cron for the Basic plan: run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Basic",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//Cron for the Premium plan: run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Premium",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});
//Cron paid plan

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
