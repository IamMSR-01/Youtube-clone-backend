import React, { useEffect, useState } from "react";
import API from "../utils/axios";

const tabs = ["Videos", "Playlists", "About"];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("Videos");
  const [user, setUser] = useState({});

  const userData = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const res = await API.get("/users/current-user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(res.data.data);
    }
  };

  useEffect(() => {
    userData();
  });

  return (
    <div className="max-w-6xl mx-auto min-h-screen p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
        <img
          src={user.avatar}
          alt="Profile"
          className="w-28 h-28 rounded-full border-2 object-cover"
        />
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold">{user.fullName}</h1>
          <h3 className="text-lg text-gray-800">{user.username}</h3>
          <p className="text-gray-600">1.2M subscribers • 150 videos</p>
          <button className="mt-2 px-4 py-1 bg-black text-white rounded-full hover:opacity-90">
            Subscribe
          </button>
        </div>
      </div>

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
            <h2 className="font-semibold text-lg mb-2">About Shaqib</h2>
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
