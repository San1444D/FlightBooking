import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";

import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
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
          <Route
            path="/admin/dashboard"
            element={<div className="h-dvh">Admin Dash Page</div>}
          />
          <Route
            path="/oper/dashboard"
            element={<div className="h-dvh">Operator Page</div>}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
