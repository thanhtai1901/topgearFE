/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DashBoard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: stats = [] } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/adminstats");
      return res.data;
    },
  });

  const { data: orders = [], refetch } = useQuery({
    queryKey: ["approvedOrders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments/all");
      return res.data;
    },
  });

  const approvedOrders = orders
  .filter((order) => order.received === true) // Only approved orders
  .sort((a, b) => new Date(b.updateAt) - new Date(a.updateAt)); // Sort by updateAt in descending order


  const totalAmount = approvedOrders.reduce(
    (sum, order) => sum + (order.cartTotals || 0),
    0
  );

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (users?.length) {
      const roleData = users.reduce((acc, user) => {
        const role = user.role || "unknown";
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {});

      const formattedData = Object.entries(roleData).map(([role, count]) => ({
        role,
        count,
      }));

      setChartData(formattedData);
    }
  }, [users]);

  // Process orders data for chart
  const chartDatas = [
    {
      name: "Đơn hàng đã xử lý",
      value: orders.filter((order) => order.received === true).length,
    },
    {
      name: "Đơn hàng đang xử lý",
      value: orders.filter((order) => order.received === false).length,
    },
  ];

  const COLORS = ["#0088FE", "#FF8042"];

  return (
    <div className="w-full mt-4 mx-auto">
      {/* Greeting */}
      <h2 className="flex md:text-2xl items-center gap-1 mb-4">
        Xin chào <p className="text-green">{user?.displayName}</p>
      </h2>

      {/* Stat Cards */}
      <div className="overflow-x-auto w-full">
        <div className="stats w-full shadow bg-green rounded-md py-4">
          <div className="stat">
            <div className="stat-figure text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="stat-title text-white">Doanh thu</div>
            <div className="stat-value text-[1rem] text-white">
              {stats?.revenue
                ? totalAmount.toLocaleString("vi-VN")
                : "Loading..."}{" "}
              VND
            </div>
            <div className="stat-desc">Tháng 1 - Tháng 4</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                ></path>
              </svg>
            </div>
            <div className="stat-title text-white">Số người dùng</div>
            <div className="stat-value text-white">{stats?.users}</div>
            <div className="stat-desc">↗︎ 400 (22%)</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                ></path>
              </svg>
            </div>
            <div className="stat-title text-white">Tổng sản phẩm</div>
            <div className="stat-value text-white">{stats?.menus}</div>
            <div className="stat-desc">↘︎ 90 (14%)</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                ></path>
              </svg>
            </div>
            <div className="stat-title text-white">Đặt hàng</div>
            <div className="stat-value text-white">{stats?.orders}</div>
            <div className="stat-desc">↘︎ 90 (14%)</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-10 mt-4">
        {/* User Chart */}
        <div className="w-full bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-center mb-4">
            Số lượng người dùng theo vai trò
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-center mb-4">
            Trạng thái đơn hàng
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartDatas}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
