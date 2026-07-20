import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, isLoading } = useContext(AuthContext);
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

  // Logged in
  return children;
}

