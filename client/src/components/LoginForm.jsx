import {  useState } from "react";
import {  useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  setLoginStatus,
  updateToken,
  updateUser,
  updateUserType,
} from "../slicers/AuthSlice";
import api from "../axiosHelper";
import passIcon from "../assets/password.svg";

const LoginForm = ({ title, userType = "customer", redirectUrl = "/" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tid = toast.loading("Loging...");
    //do something else

    await api
      .post("/api/auth/login", {
        email,
        password,
        userType,
      })
      .then((response) => {
        console.log(response)
        dispatch(updateToken(response.data.accessToken));
        dispatch(updateUser(response.data.userData));
        dispatch(setLoginStatus(true));
        dispatch(updateUserType(response.data.userData.userType));
        console.log("Login successful:", response.data);
        setTimeout(() => {
          navigate(redirectUrl);
        }, 2000);
        toast.update(tid, {
          render: "Login Success",
          type: "success",
          isLoading: false,
          autoClose: 2000,
          closeButton: null,
        });
      })
      .catch((error) => {
        console.error("Login failed:", error);
        toast.update(tid, {
          render: `Login failed: ${error.response.data.message}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: null,
        });
      });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div
        className="flex w-2/6  max-w-sm mx-auto my-10 flex-col p-6 items-center justify-center
       border-2 border-gray-300/80 rounded-2xl shadow-lg/20 "
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full mx-auto mt-4"
        >
          <h2 className="text-3xl  text-center font-bold mb-4">
            {title} Login
          </h2>
          <div className="relative">
            <input
              type="email"
              id="email"
              className="px-4 py-2 w-full text-md border-2 border-gray-300/80 rounded-xl peer"
              placeholder=" "
              required
              value={email}
              onChange={handleEmailChange}
            />
            <label
              htmlFor="email"
              className="inline-flex  items-center absolute text-sm text-body duration-300 transform
               -translate-y-4  scale-75 top-2 z-10 origin-left bg-neutral-primary px-2 peer-focus:px-2 
               peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
               peer-placeholder-shown: peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 
               peer-focus:-translate-y-4 peer-focus:translate-x-2 rtl:peer-focus:translate-x-1/4 
               rtl:peer-focus:left-auto start-1"
            >
              <svg
                className="size-4 mr-1 mt-0.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
                />
              </svg>
              Email
            </label>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="px-4 py-2 w-full text-md border-2 border-gray-300/80 rounded-xl peer"
              placeholder=" "
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <label
              htmlFor="password"
              className="inline-flex  items-center absolute text-sm text-body duration-300 transform
               -translate-y-4 translate-x-2 scale-75 top-2 z-10 origin-left bg-neutral-primary px-2 peer-focus:px-2 
               peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
               peer-placeholder-shown:translate-x-0 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 
               peer-focus:-translate-y-4 peer-focus:translate-x-2 rtl:peer-focus:translate-x-1/4 
               rtl:peer-focus:left-auto start-1"
            >
              <img
                src={passIcon}
                alt=""
                srcSet=""
                className="size-4 mr-1 mt-0.5"
              />
              Password
            </label>
            <button
              type="button"
              className="inline-flex absolute text-xs text-gray-500 hover:text-gray-600 w-fit hover:cursor-pointer  top-3.5 right-2"
              onClick={toggleShowPassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="text-center text-lg font-semibold text-white py-1 mt-4
            w-1/2 mx-auto bg-blue-500 border-2 border-blue-200 rounded-xl transition duration-100
            hover:cursor-pointer hover:bg-blue-600 hover:scale-110"
          >
            Login
          </button>
        </form>
        <p>
          Create new account?{" "}
          <button
            type="button"
            className="text-blue-500 hover:underline mt-8 mb-5"
            onClick={() => {
              navigate("/signup");
            }}
          >
            SignUp
          </button>
        </p>
        {userType !== "customer" ? (
          <p>
            Login as{" "}
            <button
              type="button"
              className="text-blue-500 hover:underline "
              onClick={() => {
                navigate("/login");
              }}
            >
              User
            </button>
          </p>
        ) : (
          <></>
        )}
        {userType !== "admin" ? (
          <p>
            Login as{" "}
            <button
              type="button"
              className="text-blue-500 hover:underline "
              onClick={() => {
                navigate("/Alogin");
              }}
            >
              Admin
            </button>
          </p>
        ) : (
          <></>
        )}
        {userType !== "operator" ? (
          <p>
            Login as{" "}
            <button
              type="button"
              className="text-blue-500 hover:underline "
              onClick={() => {
                navigate("/Ologin");
              }}
            >
              Operator
            </button>
          </p>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default LoginForm;
