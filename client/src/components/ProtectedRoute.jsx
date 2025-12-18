import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const loggedIn = Boolean(localStorage.getItem("authToken"));

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
