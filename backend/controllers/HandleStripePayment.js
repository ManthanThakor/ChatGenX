const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");
const User = require("../models/User");
const {
  calculateNextBillingDate,
} = require("../utils/calculateNextBillingDate");
const {
  shouldRenewSubcriptionPlan,
} = require("../utils/shouldRenewsubcriptionPlan");

//-----Stripe payment-----
const handlestripePayment = asyncHandler(async (req, res) => {
  const { amount, subscriptionPlan } = req.body;
  const user = req?.user;

  try {
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "usd",
      metadata: {
        userId: user?._id?.toString(),
        userEmail: user?.email,
        subscriptionPlan,
      },
    });

    res.json({
      clientSecret: paymentIntent?.client_secret,
      paymentId: paymentIntent?.id,
      metadata: paymentIntent?.metadata,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//-----Verify payment-----
const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

    if (paymentIntent.status === "requires_payment_method") {
      return res.status(400).json({
        status: false,
        message:
          "Payment method required. Please complete the payment process.",
      });
    }

    if (paymentIntent.status === "succeeded") {
      const metadata = paymentIntent?.metadata;
      const subscriptionPlan = metadata?.subscriptionPlan;
      const userEmail = metadata?.userEmail;
      const userId = metadata?.userId;

      // Find the user
      const userFound = await User.findById(userId);
      if (!userFound) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      // Get the payment details
      const amount = paymentIntent?.amount / 100;
      const currency = paymentIntent?.currency;
      const paymentId = paymentIntent?.id;

      // Create the payment history
      const newPayment = await Payment.create({
        user: userId,
        email: userEmail,
        subscriptionPlan,
        amount,
        currency,
        status: "success",
        reference: paymentId,
      });

      // Check for the subscription plan and update the user accordingly
      let updatedUser;
      if (subscriptionPlan === "Basic") {
        updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            subscriptionPlan,
            trialPeriod: 0,
            nextBillingDate: calculateNextBillingDate(),
            apiRequestCount: 0,
            monthlyRequestCount: 50,
            $addToSet: { payments: newPayment?._id },
          },
          { new: true }
        );
      } else if (subscriptionPlan === "Premium") {
        updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            subscriptionPlan,
            trialPeriod: 0,
            nextBillingDate: calculateNextBillingDate(),
            apiRequestCount: 0,
            monthlyRequestCount: 100,
            $addToSet: { payments: newPayment?._id },
          },
          { new: true }
        );
      }

      res.json({
        status: true,
        message: "Payment verified, user updated",
        updatedUser,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: `Payment not successful. Current status: ${paymentIntent.status}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//-----Handle free subscription-----
const handleFreeSubscription = asyncHandler(async (req, res) => {
  const user = req?.user;

  try {
    if (shouldRenewSubcriptionPlan(user)) {
      // Update the user account
      user.subscriptionPlan = "Free";
      user.monthlyRequestCount = 5;
      user.apiRequestCount = 0;
      user.nextBillingDate = calculateNextBillingDate();

      // Create new payment and save into DB
      const newPayment = await Payment.create({
        user: user?._id,
        subscriptionPlan: "Free",
        amount: 0,
        status: "success",
        reference: Math.random().toString(36).substring(7),
        currency: "usd",
      });
      user.payments.push(newPayment?._id);

      // Save the user
      await user.save();

      // Send the response
      res.json({
        status: "success",
        message: "Subscription plan updated successfully",
        user,
      });
    } else {
      return res
        .status(403)
        .json({ error: "Subscription renewal not due yet" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  handlestripePayment,
  handleFreeSubscription,
  verifyPayment,
};
