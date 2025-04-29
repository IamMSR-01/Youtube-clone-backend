import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/authSlice"; 
import API from "../utils/axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/login", formData); 
      if (res.data.success === true) {
        const userData = res.data.user; 
        const token = res.data.token;

        // Store token and user in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData)); 

        // Dispatch login action to Redux
        dispatch(login(userData)); 

        // Redirect to home page after successful login
        navigate("/");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen mx-auto flex justify-center items-center">
      <div className="flex flex-col justify-center items-center bg-gray-100/10 p-10 rounded-lg shadow-xl">
        <h1 className="flex justify-center items-center text-black mb-6 text-4xl font-bold">
          Login On VideoTude
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group flex flex-col gap-2 text-black text-xl">
            <label htmlFor="email">Email</label>
            <input
              onChange={handleChange}
              className="text-black border border-gray-900 rounded-md p-1 px-4 mb-4 w-sm shadow-2xl shadow-amber-50"
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter Your Email"
            />
          </div>
          <div className="form-group flex flex-col gap-2 text-black text-xl">
            <label htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              className="text-black border border-gray-900 rounded-md p-1 px-4 mb-4 w-sm shadow-2xl shadow-amber-50"
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter Your Password"
            />
          </div>
          <button
            className="w-full bg-green-600 text-white font-bold text-xl p-2 px-4 rounded-md shadow-lg shadow-green-200 hover:bg-green-700 transition-all duration-300 ease-in-out mt-2"
            type="submit"
          >
            Login
          </button>
        </form>
        <p className="mt-4 font-semibold text-lg">
          You don't have any account! {""}
          <a className="text-blue-600" href="/register">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
