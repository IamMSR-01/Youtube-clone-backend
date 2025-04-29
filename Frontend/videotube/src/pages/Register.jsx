import React, { useState, useEffect } from "react";
import API from "../utils/axios";

function Register() {
  const [formData, setFormData] = useState({
    avatar: "",
    fullName: "",
    username: "",
    email: "",
    password: "",
  });


  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "avatar") {
      setFormData({
        ...formData,
        avatar: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("avatar", formData.avatar);
    data.append("fullName", formData.fullName);
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);

    try {
      const res = await API.post("/users/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("res", res.data);
      if (res.data.status === "success") {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="h-screen mx-auto flex justify-center items-center">
      <section>
        <div className="flex flex-col justify-center items-center bg-gray-100/10 p-10 rounded-lg shadow-xl">
          <form action="" onSubmit={handleSubmit}>
            <h1 className="flex justify-center items-center text-black mb-6 text-4xl font-bold">
              Register On VideoTube
            </h1>
            <div className="form-group flex flex-col gap-2 text-black text-xl">
              <label htmlFor="fullName">Avatar </label>
              <input
                onSubmit={formData.avatar}
                type="file"
                name="avatar"
                id="avatar"
                onChange={handleChange}
                className="text-black border border-gray-900 rounded-md p-1 px-4 mb-4 w-sm shadow-2xl shadow-amber-50"
              />
            </div>
            <div className="form-group flex flex-col gap-2 text-black text-xl">
              <label htmlFor="fullName">FullName </label>
              <input
                onSubmit={formData.fullName}
                type="text"
                name="fullName"
                id="fullName"
                onChange={handleChange}
                placeholder="Enter Your Full Name"
                className="text-black border border-gray-900 rounded-md p-1 px-4 mb-4 w-sm shadow-2xl shadow-amber-50"
              />
            </div>

            <div className="form-group flex flex-col gap-2 text-black text-xl">
              <label htmlFor="fullName">Username </label>
              <input
                onSubmit={formData.username}
                type="text"
                name="username"
                id="username"
                onChange={handleChange}
                placeholder="Enter Your User Name"
                className="text-black border border-gray-900 rounded-md p-1 px-4 mb-4 w-sm shadow-2xl shadow-amber-50"
              />
            </div>

            <div className="form-group flex flex-col gap-2 text-black text-xl">
              <label htmlFor="fullName">Email </label>
              <input
                onSubmit={formData.email}
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
                placeholder="Enter Your Email"
                className="text-black border border-gray-900 rounded-md p-1 px-4 mb-4 w-sm shadow-2xl shadow-amber-50"
              />
            </div>

            <div className="form-group flex flex-col gap-2 text-black text-xl">
              <label htmlFor="fullName">Password </label>
              <input
                onSubmit={formData.password}
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
                placeholder="Enter Your Password"
                className="text-black border border-gray-900 rounded-md p-1 px-4 mb-4 w-sm shadow-2xl shadow-amber-50"
              />
            </div>

            <button
              className="w-full bg-green-600 text-white font-bold text-xl p-2 px-4 rounded-md shadow-lg shadow-green-200 hover:bg-green-700 transition-all duration-300 ease-in-out mt-2"
              type="submit"
            >
              Register
            </button>
            <p className="mt-4 font-semibold text-lg">
              Already have an account?{" "}
              <a className="text-blue-600" href="/login">
                Login
              </a>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Register;
