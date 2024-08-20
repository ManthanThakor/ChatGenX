import { Navigate, useLocation } from "react-router-dom";
import AuthCheckingComponent from "../Alert/AuthCheckingComponent";
import { useAuth } from "../../AuthContext/AuthContext";

const AuthRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, isError } = useAuth();
  if (isLoading) {
    return <AuthCheckingComponent />;
  }
  if (isError || isAuthenticated === false) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default AuthRoute;
