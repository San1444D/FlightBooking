import api from "../axiosHelper";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hamdleLogout } from "../slicers/AuthSlice";
import { toast } from "react-toastify";

const customerMenu = [
  { name: "Home", path: "/" },
  { name: "Bookings", path: "/bookings" },
  { name: "Profile", path: "/profile" },
  { name: "Logout", path: "/" },
];

const adminMenu = [
  { name: "Dashboard", path: "/admin" },
  { name: "Manage Flights", path: "/admin/flights" },
  { name: "Users", path: "/admin/users" },
   { name: "Logout", path: "/" },
];

const operatorMenu = [
  { name: "Flights", path: "/flight-admin" },
  { name: "Bookings", path: "/operator/bookings" },
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

  const handlePath = async (item) => {
    if (item.name === "Logout") {
      try {
        await api.get("/api/auth/logout");
        dispatch(hamdleLogout());
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
            src="https://placehold.co/400"
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
            Flight Booking
          </button>
        </div>
        {
          <div className="text-white md:text-lg flex gap-2 md:gap-4 ">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="hover:cursor-pointer hover:underline"
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
