import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



const IsAuthorized = ({ givenUserType }) => {
  const userType = useSelector((state) => state.auth.userType);
  const navigate = useNavigate();

  // Normalize allowed types to array
  const allowed = Array.isArray(givenUserType)
    ? givenUserType
    : [givenUserType];

  // Not the right role -> redirect immediately
  if (!allowed.includes(userType)) {
    // alert("Access Denied")
    toast.warn("🦄 Wow so easy!");
    setTimeout(() => {
      navigate("/");
    }, 400);
    return null;
  }

  return <Outlet />;
};

export { IsAuthorized };
