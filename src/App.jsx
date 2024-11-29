import { Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";
import { useEffect, useState } from "react";
import useReload from "./hooks/useReload";
import { useSelector } from "react-redux";
import Inventory from "./Pages/Inventory";
import Users from "./Pages/Users";
import Billing from "./Pages/Billing";
import Category from "./Pages/Category";
import Roles from "./Pages/Roles";
import Tables from "./Pages/Tables";
import Services from "./Pages/Services";
import PageNotFound from "./Pages/PageNotFound";
import Cart from "./Pages/Cart";
import NotFound from "./Pages/NotFound";
import ViewBill from "./Pages/ViewBill";
import WaiterDashboard from "./Pages/WaiterDashboard";
import Register from "./Pages/RegisterPage";
import Profile from "./Pages/Profile";
import { insertFcmToken, requestForToken } from "./config/firebase";
import ForgetPassword from "./Pages/ForgetPassword";

function App() {
  const [allRoutes, setAllRoutes] = useState();
  const token = localStorage.getItem("Authorization");

  const navigate = useNavigate();
  const protectedRoutes = [
    { path: "/inventory", element: <Inventory />, roles: ["Admin"] },
    { path: "/users", element: <Users />, roles: ["Admin"] },
    { path: "/cart", element: <Cart />, roles: ["Reception"] },
    { path: "/billing", element: <Billing />, roles: ["Admin", "Reception"] },
    {
      path: "/billing/view",
      element: <ViewBill />,
      roles: ["Admin", "Reception"],
    },
    { path: "/category", element: <Category />, roles: ["Admin"] },
    { path: "/roles", element: <Roles />, roles: ["Admin"] },
    { path: "/tables", element: <Tables />, roles: ["Admin"] },
    { path: "/services", element: <Services />, roles: ["Admin"] },
  ];

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      navigate("/");
      return;
    }

    const filteredRoutes = protectedRoutes.filter((item) =>
      item.roles.includes(user.role)
    );
    setAllRoutes(filteredRoutes);
  }, [localStorage.getItem("user")]);

  useEffect(() => {
    const getToken = async () => {
      const authToken = localStorage.getItem("Authorization");
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Permission Granted");
        const fcmToken = await requestForToken();
        console.log("AUTH: ", authToken);

        if (authToken && fcmToken) {
          await insertFcmToken(authToken, fcmToken, navigate);
        }
      }
    };

    getToken();
  }, [token]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/waiter-dashboard" element={<WaiterDashboard />} />
        <Route path="/profile" element={<Profile />} />
        {allRoutes?.map((route, i) => (
          <Route path={route.path} element={route.element} key={i} />
        ))}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
