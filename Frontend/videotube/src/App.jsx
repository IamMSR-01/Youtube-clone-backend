import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import "./index.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { Outlet } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   authSlice.getCurrentUser()
  //     .then((userData) => {
  //       if (userData) {
  //         dispatch(login({ userData }))
  //       } else {
  //         dispatch(logout())
  //       }
  //     })
  //     .finally(() => setLoading(false))
  // }, [])

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
