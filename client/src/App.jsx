import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import api from "./axiosHelper";
import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";

import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import NotFound from "./pages/NotFound";
import AuthProvider from "./auth/AuthProvider";
import LoginProtector from "./auth/LoginProtector";
import { IsAuthorized } from "./auth/Authorization";
import { useDispatch, useSelector } from "react-redux";
import {
  updateToken,
  updateUser,
  setLoginStatus,
  updateUserType,
} from "./slicers/AuthSlice";

function App() {
  const userType = useSelector((state) => state.auth.userType);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await api.get("/api/auth/get-me");
        dispatch(updateToken(response.data.accessToken));
        console.log("fetchToken home");
        dispatch(updateUser(response.data.userData));
        dispatch(setLoginStatus(true));
        dispatch(updateUserType(response.data.userData.userType));
      } catch {
        dispatch(updateToken(null));
        dispatch(setLoginStatus(false));
        localStorage.removeItem("userType");
      }
    };

    if (userType === "admin") {
      navigate("/admin");
    } else if (userType === "flight-operator") {
      navigate("/flight-admin");
    }
    if (userType != null) {
      fetchToken();
    }
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<LoginProtector />}>
          <Route
            path="/login"
            element={<LoginForm title={""} userType={"customer"} />}
          />
          <Route
            path="/signup"
            element={<SignUpForm title={""} userType={"customer"} />}
          />
          <Route
            path="/Alogin"
            element={<LoginForm title={"Admin"} userType={"admin"} />}
          />
          <Route
            path="/Asignup"
            element={<SignUpForm title={"Admin"} userType={"admin"} />}
          />
          <Route
            path="/Ologin"
            element={
              <LoginForm title={"Flight Operator"} userType={"operator"} />
            }
          />
          <Route
            path="/Osignup"
            element={
              <SignUpForm title={"Flight Operator"} userType={"operator"} />
            }
          />
        </Route>

        <Route element={<IsAuthorized givenUserType={"admin"} />}>
          <Route
            path="/admin"
            element={<div className="h-dvh">Admin Dash Page</div>}
          />
        </Route>

        <Route element={<IsAuthorized givenUserType={"operator"} />}>
          <Route
            path="/flight-admin"
            element={<div className="h-dvh">Operator Page</div>}
          />
        </Route>

        {/* Handle page not fount */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
