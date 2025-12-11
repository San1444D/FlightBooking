import api from "../axiosHelper";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../slicers/AuthSlice";
import { toast } from "react-toastify";

const customerMenu = [
  { name: "Home", path: "/" },
  { name: "Search", path: "/search" },
  { name: "Bookings", path: "/bookings" },
  // { name: "Profile", path: "/profile" },
  { name: "Logout", path: "/" },
];

const adminMenu = [
  { name: "Dashboard", path: "/admin" },
  { name: "Users", path: "/admin/all-users" },
  { name: "All Bookings", path: "/all-bookings" },
  { name: "Manage Flights", path: "/all-flights" },
  { name: "Logout", path: "/" },
];

const operatorMenu = [
  { name: "Dashboard", path: "/flight-admin" },
  { name: "Bookings", path: "/flight-bookings" },
  { name: "Flights", path: "/flights" },
  { name: "Logout", path: "/" },
];

const logoutMenu = [
  { name: "Home", path: "/" },
  { name: "Login", path: "/login" },
];

const Navbar = () => {
  const isLoginedIn = useSelector((state) => state.auth.isLoginedIn);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userType = user?.userType;
  const menuItems = isLoginedIn
    ? userType === "admin"
      ? adminMenu
      : userType === "operator"
      ? operatorMenu
      : customerMenu
    : logoutMenu;

  function capitalizeFirstLetter(str) {
    if (typeof str !== "string" || str.length === 0) {
      return str; // Handle non-string input or empty strings
    }
    return '('+str.charAt(0).toUpperCase() + str.slice(1)+')';
  }

  const handlePath = async (item) => {
    if (item.name === "Logout") {
      try {
        await api.get("/auth/logout");
        dispatch(handleLogout());
        localStorage.removeItem("userType");
        toast.success("Logout Success");
        navigate("/");
      } catch (err) {
        console.error("Logout failed:", err);
      }
      return;
    }
    navigate(item.path);
  };

  return (
    <>
      <nav className="navbar">
        <div className="flex items-center gap-2 ml-2">
          <img
            src="/logo.png"
            alt=""
            srcSet=""
            className="size-10"
          />
          <button
            className="font-semibold text-2xl hover:cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            {`SB Flight Booking ${
              ["admin", "operator"].includes(userType)
                ? capitalizeFirstLetter(userType)
                : ""
            }`}
          </button>
        </div>
        {
          <div className="text-white md:text-lg flex gap-2 md:gap-4 ">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="hover:cursor-pointer hover:underline hover:scale-105 active:scale-95 transition duration-75"
                onClick={() => {
                  handlePath(item);
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        }
      </nav>
    </>
  );
};

export default Navbar;
