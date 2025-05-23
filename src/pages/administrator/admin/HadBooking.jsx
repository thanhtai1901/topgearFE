import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const HadBooking = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedMenuItems, setSelectedMenuItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for date filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Fetch orders
  const { data: orders = [], refetch } = useQuery({
    queryKey: ["approvedOrders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments/all");
      return res.data;
    },
  });

  // Filter orders that are approved and sort by updateAt (most recent first)
  const approvedOrders = orders
    .filter((order) => order.received === true) // Only approved orders
    .sort((a, b) => new Date(b.updateAt) - new Date(a.updateAt)); // Sort by updateAt in descending order

  console.log(approvedOrders);

  // Filter function based on start and end date
  const filterOrdersByDate = () => {
    const filtered = approvedOrders.filter((order) => {
      const orderDate = new Date(order.updateAt); // Filter based on updateAt
      const isAfterStart = startDate ? orderDate >= new Date(startDate) : true;
      const isBeforeEnd = endDate ? orderDate <= new Date(endDate) : true;
      return isAfterStart && isBeforeEnd;
    });
    setFilteredOrders(filtered);
  };

  // Update filtered orders whenever the dates change
  useEffect(() => {
    filterOrdersByDate();
  }, [startDate, endDate, approvedOrders]);

  const fetchMenuItems = async (menuItems) => {
    try {
      const promises = menuItems.map((id) => axiosSecure.get(`/menu/${id}`));
      const results = await Promise.all(promises);
      setSelectedMenuItems(results.map((res) => res.data));
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMenuItems([]);
  };

  const formatDate = (date) => {
    if (!date) {
      return "Chưa update";
    }
    const formattedDate = new Date(date);
    return `${formattedDate.toLocaleDateString(
      "vi-VN"
    )} ${formattedDate.toLocaleTimeString("vi-VN")}`;
  };
  // Tính tổng tiền của các đơn hàng đã nhận
  const totalAmount = approvedOrders.reduce(
    (sum, order) => sum + (order.cartTotals || 0),
    0
  );
  return (
    <div className="w-full mt-4">
      <h2 className="flex items-center gap-1 mb-4">
        Danh sách đơn hàng <span className="text-green">đã duyệt</span>, Tổng
        đơn: {filteredOrders.length}
      </h2>

      {/* Date filters */}
      <div className="flex gap-4 mb-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm mb-2">
              Ngày bắt đầu:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input input-bordered"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm mb-2">
              Ngày kết thúc:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input input-bordered"
            />
          </div>
        </div>
        <div className="">
          <h2 className="flex items-center gap-1 mb-4">
            Danh sách đơn hàng{" "}
            <span className="text-blue-500 font-bold">đã hoàn thành</span>
          </h2>
          <p>Tổng đơn: {filteredOrders.length}</p>
          <div className="">
           
            <p className="text-red-500 font-bold">
            Tổng tiền:{" "}
              {totalAmount.toLocaleString("vi-VN")} VND
            </p>
            
          </div>
          
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <div className="flex flex-col space-y-4">
          {filteredOrders.map((order, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-sm flex flex-wrap gap-4 bg-white"
            >
              {/* Avatar và thông tin khách hàng */}
              <div className="flex items-center gap-4">
                <img
                  src="https://zycrypto.com/wp-content/uploads/2018/11/Bearish-Crypto-Market-Is-This-The-Best-Time-To-Buy.png"
                  alt="avatar"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="font-semibold">
                    {order.displayName || order.name}
                  </p>
                  <p className="text-sm text-gray-500">{order.email}</p>
                </div>
              </div>

              {/* Thông tin đơn hàng */}
              <div className="flex-1 grid grid-cols-2 gap-2 text-sm">
                <p>
                  <strong>Số điện thoại:</strong> {order.phone || "Không có"}
                </p>
                <p>
                  <strong>Mã đơn hàng:</strong>{" "}
                  {order.idTransaction ? order.idTransaction : "Đơn tiền mặt"}
                </p>
                <p>
                  <strong>Số lượng sản phẩm:</strong> {order.quantity}
                </p>
                <p>
                  <strong>Tổng tiền:</strong>{" "}
                  {order.cartTotals?.toLocaleString("vi-VN")} VND
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {order.address || "Không có"}
                </p>
                <p>
                  <strong>Ngày đặt đơn:</strong> {formatDate(order.createAt)}
                </p>
                <p>
                  <strong>Ngày hoàn thành đơn:</strong>{" "}
                  {formatDate(order.updateAt)}
                </p>
              </div>

              {/* Hành động */}
              <div className="flex flex-col gap-2 items-end">
                <button
                  onClick={() => fetchMenuItems(order.menuItems)}
                  className="btn btn-sm bg-blue-500 text-white"
                >
                  Xem sản phẩm
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Chi tiết sản phẩm</h3>
            <table className="table table-compact w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên sản phẩm</th>
                  <th>Mô tả</th>
                  <th>Giá</th>
                  <th>Hình ảnh</th>
                </tr>
              </thead>
              <tbody>
                {selectedMenuItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td className="line-clamp-1">{item.recipe}</td>
                    <td>{item.price?.toLocaleString("vi-VN")} VND</td>
                    <td>
                      <img
                        src={item.image || "https://via.placeholder.com/100"}
                        alt={item.name}
                        className="w-12 h-12"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="modal-action">
              <button
                onClick={closeModal}
                className="btn bg-red-500 text-white"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HadBooking;
