import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home";
import AboutUs from "./components/About/AboutUs";
import Registration from "./components/Users/Register";
import AppFeatures from "./components/Features/Features";
import PaymentSuccess from "./components/StripePayment/PaymentSuccess";
import CheckoutForm from "./components/StripePayment/CheckoutForm";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import ContentGenerationHistory from "./components/ContentGeneration/ContentHistory";
import BlogPostAIAssistant from "./components/ContentGeneration/ContentGenerationHistory";
import Dashboard from "./components/Users/UserDashboard";
import Login from "./components/Users/Login";
import PublicNavbar from "./components/Navbar/PublicNavbar";
import PrivateNavbar from "./components/Navbar/PrivateNavbar";
import { useAuth } from "./AuthContext/AuthContext";
import FreePlanSignup from "./components/StripePayment/FreePlanSignup";
import Plans from "./components/Plans/Plan";

function App() {
  const [count, setCount] = useState(0);
  const { isAuthenticated } = useAuth();

  return (
    <>
      <BrowserRouter>
        {/* Navbar */}
        {isAuthenticated ? <PrivateNavbar /> : <PublicNavbar />}
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <AuthRoute>
                <Dashboard />
              </AuthRoute>
            }
          />
          <Route
            path="/generate-content"
            element={
              <AuthRoute>
                <BlogPostAIAssistant />
              </AuthRoute>
            }
          />
          <Route
            path="/history"
            element={
              <AuthRoute>
                <ContentGenerationHistory />
              </AuthRoute>
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="/plans" element={<Plans />} />
          <Route
            path="/free-plan"
            element={
              <AuthRoute>
                <FreePlanSignup />
              </AuthRoute>
            }
          />
          <Route
            path="/checkout/:plan"
            element={
              <AuthRoute>
                <CheckoutForm />
              </AuthRoute>
            }
          />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/features" element={<AppFeatures />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
