import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { RiFeedbackLine } from "react-icons/ri";
import { MdFileUpload } from "react-icons/md";

function UploadVideo() {
  const [fileName, setFileName] = useState("Upload Video");
  const [thumbnailName, setThumbnailName] = useState("Upload Thumbnail");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video: "",
    thumbnail: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "video") {
      setFormData({
        ...formData,
        video: files[0],
      });
    }
    if (name === "thumbnail") {
      setFormData({
        ...formData,
        thumbnail: files[0],
      });
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  console.log("data", formData);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("Upload Video");
    }
  };

  const handleThumbnailChange = (e) => {
    if (e.target.files.length > 0) {
      setThumbnailName(e.target.files[0].name);
    } else {
      setThumbnailName("Upload Thumbnail");
    }
  };

  return (
    <div className="max-w-4xl flex flex-col mx-auto items-center justify-between shadow-2xl mt-10 mb-10">
      <div className="flex w-full justify-between items-center border-b-2 border-gray-900">
        <h1 className="text-xl font-bold text-center p-4">Upload Video</h1>
        <div className="flex gap-4 p-4">
          <RiFeedbackLine className="text-2xl text-gray-900 cursor-pointer hover:text-red-500" />
          <IoClose className="text-2xl text-gray-900 cursor-pointer hover:text-red-500" />
        </div>
      </div>

      <div className="flex gap-8">
        <div className="mt-20 border-2 border-gray-900 p-4 flex flex-col items-center justify-center rounded-full w-[200px] h-[200px] relative shadow-2xl">
          <MdFileUpload className="text-5xl" />
          <label htmlFor="fileUpload">{fileName}</label>
          <input
            type="file"
            id="fileUpload"
            name="video"
            accept="video/*"
            className="hidden"
            // onChange={handleFileChange}
            onSubmit={handleChange}
          />
        </div>
        <div className="mt-20 border-2 border-gray-900 p-4 flex flex-col items-center justify-center rounded-full w-[200px] h-[200px] relative shadow-2xl">
          <MdFileUpload className="text-5xl" />
          <label htmlFor="thumbnail">{thumbnailName}</label>
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            accept="image/*"
            className="hidden"
            // onChange={handleThumbnailChange}
            onSubmit={handleChange}
          />
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-2 mt-10">
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Title"
          className="border p-2 w-2xl"
          onChange={handleChange}
        />

        <textarea
          type="text"
          name="description"
          id="description"
          placeholder="Description"
          className="border p-2 w-2xl min-h-[100px]"
          onSubmit={handleChange}
        />
      </div>

      <div className="flex flex-col justify-center items-center p-8 text-sm gap-1 text-gray-600">
        <p>
          By submitting your videos to VideoTube, you acknowledge that you agree
          to VideoTube's <span className="text-blue-600">Terms of Service</span>{" "}
          and <span className="text-blue-600">Community Guidelines</span>.
        </p>
        <p>
          Please make sure that you do not violate others' copyright or privacy
          rights. <span className="text-blue-600">Learn more</span>
        </p>
      </div>
    </div>
  );
}

export default UploadVideo;
