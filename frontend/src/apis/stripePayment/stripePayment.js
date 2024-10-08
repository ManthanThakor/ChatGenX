import axios from "axios";
//=======Stripe Payment=====

export const handleFreeSubscriptionAPI = async () => {
  const response = await axios.post(
    "http://localhost:8000/api/stripe/free-plan",
    {},
    {
      withCredentials: true,
    }
  );
  return response?.data;
};
//=======Stripe  Payment intent=====

export const createStripePaymentIntentAPI = async (payment) => {
  console.log(payment);
  const response = await axios.post(
    "http://localhost:8000/api/stripe/checkout",
    {
      amount: Number(payment?.amount),
      subscriptionPlan: payment?.plan,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};
//=======Verify  Payment =====

export const verifyPaymentAPI = async (paymentId) => {
  const response = await axios.post(
    `http://localhost:8000/api/stripe/verify-payment/${paymentId}`,
    {},
    {
      withCredentials: true,
    }
  );
  return response?.data;
};
