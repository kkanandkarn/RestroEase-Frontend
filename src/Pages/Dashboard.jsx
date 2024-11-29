import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Layout from "../Layout/index.Jsx";
import AdminDashboard from "../components/Dashboard/AdminDashboard";
import ReceptionDashboard from "../components/Dashboard/ReceptionDashboard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const Authorization = localStorage.getItem("Authorization");
  const navigate = useNavigate();
  useEffect(() => {
    if (!Authorization) {
      navigate("/");
    }
    if (user.role === "Waiter") {
      navigate("/waiter-dashboard");
    }
  }, [Authorization, user]);
  return (
    <Layout title="Dashboard">
      {user?.role === "Admin" && <AdminDashboard />}
      {user?.role === "Reception" && <ReceptionDashboard />}
    </Layout>
  );
};

export default Dashboard;
