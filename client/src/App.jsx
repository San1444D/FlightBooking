import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import api from "./axiosHelper";
import "./App.css";
import { setInitialized } from "./slicers/AuthSlice";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";

import AdminDash from "./pages/admin/AdminDashboard";
import FlightAdmin from "./pages/operator/FlightAdmin";
import AllBookings from "./pages/AllBookings";
import AllFlights from "./pages/AllFlights";
import AllUsers from "./pages/AllUsers";
import BookFlight from "./pages/customer/BookFlight";
import Bookings from "./pages/customer/Bookings";
import FlightBookings from "./pages/operator/FlightBookings";
import Flights from "./pages/operator/Flights";
import NewFlight from "./pages/operator/NewFlight";
import EditFlight from "./pages/operator/EditFlight";
import LandingPage from "./pages/LandingPage";

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
    let mounted = true;
    const fetchToken = async () => {
      try {
        const response = await api.get("/auth/get-me");
        dispatch(updateToken(response.data.accessToken));
        console.log("fetchToken home");
        dispatch(updateUser(response.data.userData));
        dispatch(setLoginStatus(true));
        dispatch(updateUserType(response.data.userData.userType));
      } catch {
        dispatch(updateToken(null));
        dispatch(setLoginStatus(false));
        localStorage.removeItem("userType");
      } finally{
        if (mounted) dispatch(setInitialized(true));
      }
    };

    if (userType != null) {
      fetchToken();
    }
    if (userType === "admin") {
      navigate("/admin");
    } else if (userType === "operator") {
      navigate("/flight-admin");
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
            element={
              <LoginForm
                title={"Admin"}
                userType={"admin"}
                redirectUrl="/admin"
              />
            }
          />
          <Route
            path="/Asignup"
            element={
              <SignUpForm
                title={"Admin"}
                userType={"admin"}
                redirectUrl="/Alogin"
              />
            }
          />
          <Route
            path="/Ologin"
            element={
              <LoginForm
                title={"Flight Operator"}
                userType={"operator"}
                redirectUrl="/flight-admin"
              />
            }
          />
          <Route
            path="/Osignup"
            element={
              <SignUpForm
                title={"Flight Operator"}
                userType={"operator"}
                redirectUrl="/Ologin"
              />
            }
          />
        </Route>
        <Route element={<AuthProvider />}>
          <Route path="/all-bookings" element={<AllBookings />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/book-Flight/:id" element={<BookFlight />} />

          <Route path="/search" element={<LandingPage />} />

          <Route element={<IsAuthorized givenUserType={"admin"} />}>
            <Route path="/admin" element={<AdminDash />} />
          </Route>

          <Route element={<IsAuthorized givenUserType={"operator"} />}>
            <Route path="/flight-admin" element={<FlightAdmin />} />
          </Route>
          <Route
            element={<IsAuthorized givenUserType={["operator", "admin"]} />}
          >
            <Route path="/all-flights" element={<AllFlights />} />
            <Route path="/admin/all-users" element={<AllUsers />} />
            <Route path="/flight-bookings" element={<FlightBookings />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/new-flight" element={<NewFlight />} />
            <Route path="/edit-flight/:id" element={<EditFlight />} />
          </Route>
        </Route>

        {/* Handle page not fount */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
