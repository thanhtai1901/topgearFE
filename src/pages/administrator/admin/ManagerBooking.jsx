import React, { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { GiConfirmed } from "react-icons/gi";
import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const ManagerBooking = () => {
  const { user, loading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [selectedMenuItems, setSelectedMenuItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State cho bộ lọc ngày
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { refetch, data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments/all");
      return res.data;
    },
  });

  const fetchMenuItems = async (menuItems) => {
    try {
      const promises = menuItems.map((id) => axiosSecure.get(`/menu/${id}`));
      const results = await Promise.all(promises);
      console.log(results);
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
  const handleFilter = () => {
    refetch(); // Refetch dữ liệu sau khi chọn ngày
  };

  const formatDate = (date) => {
    if (!date) {
      return "Chưa update";
    }
    const formattedDate = new Date(date);

    const day = String(formattedDate.getDate()).padStart(2, "0");
    const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const year = formattedDate.getFullYear();

    const hours = String(formattedDate.getHours()).padStart(2, "0");
    const minutes = String(formattedDate.getMinutes()).padStart(2, "0");
    const seconds = String(formattedDate.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleConfirm = async (items) => {
    await axiosSecure.patch(`/payments/${items._id}`).then((res) => {
      Swal.fire({
        title: "Chúc mừng!",
        text: "Bạn đã duyệt đơn hàng thành công.",
        icon: "success",
      });
      if (res.data.status === "Đã được duyệt") {
        refetch();
      }
    });
  };

  
    const handleMarkAsReceived = async (orderId) => {
      await axiosSecure.patch(`/payments/${orderId}/received`).then(() => {
        Swal.fire({
          title: "Chúc mừng!",
          text: "Bạn đã xác nhận nhận được đơn hàng thành công.",
          icon: "success",
        });
        refetch();
      });
    };

  const handleDeleteBooking = async (items) => {
    Swal.fire({
      title: "Bạn có chắc không?",
      text: "Bạn sẽ không thể quay lại điều này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vâng, xóa nó đi!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/payments/${items._id}`);
        if (res) {
          refetch();
          Swal.fire({
            title: "Đã xóa!",
            text: "Đơn hàng của bạn đã bị xóa.",
            icon: "success",
          });
        }
      }
    });
  };

  // Bộ lọc ngày
  const filteredOrders = orders.filter((order) => {
    if (!startDate || !endDate) return true;
    const orderDate = new Date(order.createAt);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return orderDate >= start && orderDate <= end;
  });

  return (
    <div className="w-full  mt-4">
      <div className="">
        {/* banner */}

        <h2 className="flex items-center gap-1 mb-4">
          Quản lí <p className="text-green">đơn hàng,</p>{" "}
          <span>Tổng đơn: {filteredOrders.length}</span>
        </h2>

        {/* Bộ lọc ngày */}
        <div className="flex items-center space-x-4 mb-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium">
              Từ ngày:
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium">
              Đến ngày:
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
        </div>
        {/* table */}
        <div className="overflow-x-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredOrders.map((order, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-md bg-white flex flex-col space-y-2"
              >
                {/* Thông tin khách hàng */}
                <div className="flex items-center space-x-4">
                  <img
                    src="https://zycrypto.com/wp-content/uploads/2018/11/Bearish-Crypto-Market-Is-This-The-Best-Time-To-Buy.png"
                    alt="avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-bold">
                      {order.displayName || order.name}
                    </p>
                    <p className="text-sm text-gray-500">{order.phone}</p>
                    <p className="text-sm text-gray-500">{order.address}</p>
                  </div>
                </div>

                {/* Thông tin đơn hàng */}
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Mã đơn:</strong>{" "}
                    {order.idTransaction ? order.idTransaction : "Đơn tiền mặt"}
                  </p>
                  <p>
                    <strong>Số lượng:</strong> {order.quantity}
                  </p>
                  <p>
                    <strong>Tổng tiền:</strong>{" "}
                    {order.cartTotals?.toLocaleString("vi-VN")} VND
                  </p>
                  <p>
                    <strong>Ngày mua:</strong> {formatDate(order.createAt)}
                  </p>
                  <p>
                    <strong>Thời gian cập nhật:</strong>{" "}
                    {formatDate(order.updateAt)}
                  </p>
                </div>

                {/* Hành động */}
                <div className="mt-2 space-y-2">
                  <button
                    onClick={() => fetchMenuItems(order.menuItems)}
                    className="btn btn-sm bg-blue-500 text-white w-full"
                  >
                    Xem sản phẩm
                  </button>
                  {order.received ? (
                    <p className="text-blue-500 font-bold text-center">
                      Đã hoàn thành đơn hàng
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2 text-center">
                      {order.received === true ? (
                        <p className=" text-blue-500">Khách đã nhận hàng</p>
                      ) : (
                        <>
                          <p className="font-bold text-red-500">
                            Khách chờ giao & nhận hàng
                          </p>
                          {order.received !== true && order.status === "Đã được duyệt" && (
                            <button
                            onClick={() => handleMarkAsReceived(order._id)}
                              className="btn btn-sm bg-blue-500 text-white w-full"
                            >
                              Xác nhận nhận hàng
                            </button>
                          )}
                          {order.status !== "Đã được duyệt" && (
                            <button
                              onClick={() => handleConfirm(order)}
                              className="btn btn-sm bg-blue-500 text-white w-full"
                            >
                              Duyệt đơn hàng
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  {order.status !== "Đã được duyệt" && (
                    <button
                      onClick={() => handleDeleteBooking(order)}
                      className="btn btn-sm bg-red-500 text-white w-full"
                    >
                      Xoá
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for displaying selected menu items */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box p-4">
            <h3 className="font-bold text-lg">Chi tiết sản phẩm</h3>
            <table className="table table-compact">
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
                    <td className="line-clamp-2">{item.recipe}</td>
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

export default ManagerBooking;
