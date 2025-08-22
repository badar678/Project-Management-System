import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRole, children }) => {
  const role = sessionStorage.getItem("role");
  const token = role ? sessionStorage.getItem(`${role}_token`) : null;

  const allowedRoles = Array.isArray(allowedRole)
    ? allowedRole
    : allowedRole.split("|");

  console.log("🔐 ProtectedRoute check:");
  console.log("  - Role:", role);
  console.log("  - Token exists:", !!token);
  console.log("  - Allowed roles:", allowedRoles);
  console.log("  - Authorized:", allowedRoles.includes(role));

  if (!token || !role) {
    console.log("🚫 No token or role found — redirecting to login.");
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role)) {
    console.log("🚫 Role not authorized — redirecting to login.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
