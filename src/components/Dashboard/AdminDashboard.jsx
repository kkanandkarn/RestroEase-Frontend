import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the plugin

// Register chart.js components and the plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement, // For Pie chart
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Register the plugin
);

import { IoMdEye } from "react-icons/io";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { hideLoader, showLoader } from "../Loader";
import toast from "react-hot-toast";
import { CRUDAPI } from "../../apiCalls/crud-api";
import { DASHBOARD, DASHBOARD_METHOD } from "../../apiCalls/endpoints";
import { useNavigate } from "react-router-dom";
import socket from "../../Socket";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();

  const getDashboardData = async (loader) => {
    if (loader) {
      showLoader();
    }

    try {
      const response = await CRUDAPI(
        DASHBOARD,
        DASHBOARD_METHOD,
        null,
        navigate
      );
      if (response.status === "SUCCESS") {
        setDashboardData(response.data);
        hideLoader();
      } else {
        hideLoader();
        toast.error(response.message);
      }
    } catch (error) {
      hideLoader();
      toast.error("Internal server error. Please try again later.");
      console.log(error);
    }
  };

  useEffect(() => {
    getDashboardData(true);
  }, []);

  useEffect(() => {
    // Listen for new notifications
    socket.on("notificationCount", (count) => {
      console.log("Updated notification count received:", count);
      setNotificationCount(count);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("notificationCount");
    };
  }, [navigate]);

  useEffect(() => {
    if (notificationCount > 0) {
      getDashboardData(false);
    }
  }, [notificationCount]);

  if (!dashboardData) {
    // If no data, show a loading state or return null
    return null;
  }

  const salesData = {
    labels: dashboardData.salesDataLabels,
    datasets: [
      {
        label: "Sales (₹)",
        data: dashboardData.salesData,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  // Sales category data (Pie chart)
  const categoryData = {
    labels: dashboardData.categoryDataLabels,
    datasets: [
      {
        label: "Category Sales (₹)",
        data: dashboardData.categoryData,
        backgroundColor: dashboardData.categoryBackgroundColors,
        hoverOffset: 4,
      },
    ],
  };

  // Options for Pie chart with percentage labels
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Category-wise Sales Report",
      },
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart._metasets[0].total;
          const percentage = ((value / total) * 100).toFixed(2) + "%";
          return percentage;
        },
        color: "#fff",
        font: {
          weight: "bold",
        },
      },
    },
  };

  // Line chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Sales Data",
      },
      datalabels: {
        display: false, // Disable data labels to prevent overlap
      },
    },
  };

  return (
    <div className="p-4">
      <div className="flex justify-evenly w-full h-[450px]">
        <div className="w-1/2">
          <div className="flex gap-8">
            <div className="flex flex-col items-center justify-center gap-4 border-b-4 border-b-primaryColor rounded-lg w-72 h-28">
              <h1 className="font-poppins font-bold text-lg">Today Income</h1>
              <p className="font-poppins text-base">
                ₹ {dashboardData.todayIncome}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 border-b-4 border-b-primaryColor rounded-lg w-72 h-28">
              <h1 className="font-poppins font-bold text-lg">Total Income</h1>
              <p className="font-poppins text-base">
                ₹ {dashboardData.totalIncome}
              </p>
            </div>
          </div>
          <div>
            {/* Line Chart */}
            <div
              className="chart-container mt-4"
              style={{ width: "600px", height: "400px" }}
            >
              <Line data={salesData} options={options} />
            </div>
          </div>
        </div>
        <div className="w-2/5 h-96 mt-4 p-4 ">
          <div className="chart-container w-full h-full flex items-center justify-center">
            <Pie data={categoryData} options={pieOptions} />
          </div>
        </div>
      </div>
      <div className="mx-10 h-auto bg-white rounded-lg">
        <div className="px-4 pb-4">
          <div className="border-b-2 border-t-2 border-b-zinc-400 border-t-slate-400 px-2 flex items-center justify-start h-14">
            <h1 className="font-poppins font-bold text-lg w-full">
              Recent Bills
            </h1>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-sm text-zinc-600 bg-slate-100 font-Poppins">
                <th className="p-4 border-b">S.No.</th>
                <th className="p-4 border-b">Customer Name</th>
                <th className="p-4 border-b">Customer Contact</th>
                <th className="p-4 border-b">Bill ID</th>
                <th className="p-4 border-b">Amount</th>
                <th className="p-4 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentBills.map((bill, index) => (
                <tr key={index} className="font-Poppins text-zinc-600 text-sm">
                  <td className="p-4 border-b">{index + 1}</td>
                  <td className="p-4 border-b">{bill.customerName}</td>
                  <td className="p-4 border-b">{bill.customerContact}</td>
                  <td className="p-4 border-b">{bill._id}</td>
                  <td className="p-4 border-b">₹ {bill.totalAmount}</td>
                  <td className="p-4 border-b">{bill.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
