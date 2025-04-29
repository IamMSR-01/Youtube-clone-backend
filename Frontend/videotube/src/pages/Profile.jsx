import React, { useEffect, useRef, useState } from "react";
import API from "../utils/axios";
import { Pencil } from "lucide-react";
import { data } from "react-router-dom";

const tabs = ["Videos", "Playlists", "About"];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("Videos");
  const [user, setUser] = useState({});
  const profilePicRef = useRef(null);
  const coverPicRef = useRef(null);
  const [editProfile, setEditProfile] = useState(false);
  const [userFormData, setUserFormData] = useState({
    fullName: "",
    username: "",
    email: "",
  });

  const userData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await API.get("/users/current-user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Error fetching user data");
    }
  };

  useEffect(() => {
    userData();
  }, []);

  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const res = await API.patch("/users/avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          alert("Profile picture updated successfully");
          userData();
        } else {
          alert("Failed to update profile picture");
        }
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("coverImage", file);

      try {
        const res = await API.patch("/users/cover-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          alert("Cover image updated successfully");
          userData();
        } else {
          alert("Failed to update cover image");
        }
      } catch (error) {
        console.error("Error updating cover image:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", userFormData.fullName);
    formData.append("username", userFormData.username);
    formData.append("email", userFormData.email);
    try {
      const res = await API.patch("/users/update-account", userFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        alert("Profile updated successfully");
        setEditProfile(false);
        userData();
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };


  return (
    <div className="max-w-7xl shadow-2xl mt-4 mb-10 mx-auto min-h-screen p-6">
      {/* Cover Image */}
      <div className="relative">
        <img
          src={
            user.coverImage ||
            "https://images.pexels.com/photos/1024975/pexels-photo-1024975.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          }
          alt="Cover"
          className="w-full h-70 object-cover rounded-lg shadow-md"
        />
        <button
          onClick={() => coverPicRef.current.click()}
          className="absolute top-3 right-3 bg-black bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80"
        >
          <Pencil size={18} />
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={coverPicRef}
          onChange={handleCoverChange}
        />

        {/* Profile Picture on Top of Cover */}
        <div className="absolute -bottom-20 left-[8%] transform -translate-x-1/2">
          <div className="relative">
            <img
              src={user.avatar}
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-xl"
            />
            <button
              onClick={() => profilePicRef.current.click()}
              className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80 cursor-pointer"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={profilePicRef}
              onChange={handleProfileChange}
            />
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      {editProfile ? (
        <div className="w-full max-w-md mt-40">
          <input
            type="text"
            name="fullName"
            onSubmit={userFormData.fullName}
            placeholder="Full Name"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            onClick={handleInputChange}
          />

          <input
            type="text"
            name="username"
            onSubmit={userFormData.username}
            placeholder="Username"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            onClick={handleInputChange}
          />

          <input
            type="email"
            name="email"
            onSubmit={userFormData.email}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            onClick={handleInputChange}
          />
          <div className="flex justify-between items-center mt-4 gap-4">
            <button
              onClick={handleEditProfile}
              className="px-4 py-1 bg-black text-white rounded hover:opacity-80"
            >
              Save
            </button>
            <button
              onClick={() => setEditProfile(false)}
              className="px-4 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between">
          <div className="mt-24 px-4">
            <h1 className="text-3xl font-bold">{user.fullName}</h1>
            <h3 className="text-lg text-gray-900">@{user.username}</h3>
            <p className="text-gray-900">{user.email}</p>
            <p className="text-gray-600">1.2M subscribers • 150 videos</p>
            <button className="mt-2 px-4 py-1 bg-black text-white rounded-full hover:opacity-90">
              Subscribe
            </button>
          </div>
          <div>
            <button
              onClick={() => setEditProfile(true)}
              className="flex justify-center items-center gap-2 mt-24 px-4 py-2 bg-black text-white rounded-full hover:opacity-80 cursor-pointer"
            >
              <Pencil className="w-5 h-5" /> Edit Profile
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-6 border-b flex space-x-6 text-gray-600 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 ${
              activeTab === tab
                ? "border-b-2 border-black text-black font-medium"
                : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === "Videos" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 p-2 rounded-md shadow-sm">
                <div className="aspect-video bg-gray-300 rounded mb-2" />
                <h3 className="font-medium">Video Title {i + 1}</h3>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Playlists" && (
          <div className="text-gray-700">
            This channel has no playlists yet.
          </div>
        )}

        {activeTab === "About" && (
          <div className="text-gray-700">
            <h2 className="font-semibold text-lg mb-2">
              About {user.fullName}
            </h2>
            <p>
              This is a demo YouTube profile created using React and Tailwind
              CSS.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
