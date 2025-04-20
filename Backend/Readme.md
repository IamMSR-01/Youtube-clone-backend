# VideoTube - A YouTube Clone (Backend)

## 🚀 Project Overview

VideoTube is the **backend for a YouTube clone**, built using **Node.js, Express, and MongoDB**. It provides core functionalities like user authentication, video upload & streaming, and interactions (likes, comments, subscriptions).

## 🎯 Features

- ✅ **User Authentication** (Sign up, Login, Logout with JWT)
- ✅ **Video Upload & Streaming** (Cloudinary integration)
- ✅ **Like & Dislike System**
- ✅ **Comment & Reply System**
- ✅ **Subscription & Notifications**
- ✅ Tweets

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Token)
- **File Storage**: Cloudinary (for video uploads)

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository

```sh
 git clone https://github.com/IamMSR-01/Youtube-clone-backend.git
 cd youtube-backend
```

### 2️⃣ Install Dependencies

```sh
 npm install
```

### 3️⃣ Set Up Environment Variables

Create a **.env** file in the root folder and add the following:

```env
PORT=your_port_number
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=your_frontend_url
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=your_access_token_expiry
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=your_refresh_token_expiry
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4️⃣ Run the Application

```sh
 npm run dev
```

## 📦 Dependencies

```json
{
  "bcrypt": "^5.1.1",
  "cloudinary": "^2.5.1",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^4.21.2",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.10.2",
  "mongoose-aggregate-paginate-v2": "^1.1.4",
  "multer": "^1.4.5-lts.1"
}
```

## 🤝 Contributing

Want to contribute? Feel free to fork the repo and submit a pull request!

## 🔗 Connect With Me

- **LinkedIn**: [https://www.linkedin.com/in/mohd-shaqib-raza-4088aa310/]
- **GitHub**: [https://github.com/IamMSR-01]

Give a ⭐ if you like this project!

---

\#HappyCoding 🎉

