import { Navigate, Outlet } from "react-router-dom";

const LoginProtector = () => {
  if (localStorage.getItem("userType")) {
    if (localStorage.getItem("userType") === "customer") {
      return <Navigate to="/" replace />;
    } else if (localStorage.getItem("userType") === "admin") {
      return <Navigate to="/admin" replace />;
    }
  }

  return <Outlet />;
};

export default LoginProtector;
