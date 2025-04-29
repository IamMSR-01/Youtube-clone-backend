import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import "./index.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { Outlet } from "react-router-dom";
import { login } from "./features/authSlice"; // Import the login action

function App() {

  const dispatch = useDispatch();

  // useEffect(() => {
  //   // Check if user data is in localStorage
  //   const userData = JSON.parse(localStorage.getItem("user"));
  //   if (userData) {
  //     dispatch(login(userData)); 
  //   }
  // }, [dispatch]);

  return (
      <div>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
  );
}

export default App;
