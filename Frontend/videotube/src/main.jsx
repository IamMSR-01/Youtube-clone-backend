import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./app/store"; // ✅ Ensure correct import
import App from "./App";
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import { RouterProvider } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Additional routes here
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />
      }
    ],
  },
  // Add more routes as needed
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>,
)
