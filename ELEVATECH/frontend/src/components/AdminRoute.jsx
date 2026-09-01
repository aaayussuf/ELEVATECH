import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { token, user, isLoading } = useContext(AuthContext);
  const location = useLocation();

  // Wait until AuthContext finishes checking the user
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        Loading...
      </div>
    );
  }

  // No JWT → redirect to login
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Not an admin → redirect to home page
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin user
  return children;
}