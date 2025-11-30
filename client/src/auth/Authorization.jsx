import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const IsAuthorized = ({ givenUserType }) => {
  const userType = useSelector((state) => state.auth.userType);
  // const isLoginedIn = useSelector((state) => state.auth.isLoginedIn);
  const navigate = useNavigate();

  // Normalize allowed types to array
  const allowed = Array.isArray(givenUserType)
    ? givenUserType
    : [givenUserType];

  // Not the right role -> redirect immediately
  if (!allowed.includes(userType) && userType) {
    // alert("Access Denied")
    toast.warn("Access Denied!", {
      toastId: "customId",
    });
    setTimeout(() => {
      navigate("/");
    }, 400);
    return null;
  }

  return <Outlet />;
};

export { IsAuthorized };
