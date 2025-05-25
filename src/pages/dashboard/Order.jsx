import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const Order = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("access-token");
  const axiosSecure = useAxiosSecure();

  // State for tabs
  const [activeTab, setActiveTab] = useState("all");
  const [productDetails, setProductDetails] = useState({});

  // Fetch orders
  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["orders", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:6001/payments?email=${user?.email}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.json();
    },
  });

  // Fetch product details for all orders
  useEffect(() => {
    const fetchAllProducts = async () => {
      const orderDetails = {};
      for (const order of orders) {
        try {
          const promises = order.menuItems.map((id) =>
            axiosSecure.get(`/menu/${id}`)
          );
          const results = await Promise.all(promises);

          // Associate item quantities with menu items
          const itemsWithQuantity = results.map((res, index) => {
            const quantityMatch = order.itemName[index]?.match(/\(x(\d+)\)/); // Get quantity from itemName
            const quantity = quantityMatch ? quantityMatch[1] : 1; // Default to 1 if no quantity is found
            return {
              ...res.data,
              quantity, // Add quantity to the product data
            };
          });

          orderDetails[order._id] = itemsWithQuantity;
          console.log(orderDetails);
        } catch (error) {
          console.error("Failed to fetch menu items for order:", order._id);
        }
      }
      setProductDetails(orderDetails);
    };

    if (orders.length > 0) {
      fetchAllProducts();
    }
  }, [orders, axiosSecure]);

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

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Bạn không thể khôi phục đơn hàng sau khi hủy.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hủy đơn hàng",
      cancelButtonText: "Hủy bỏ",
    });

    if (confirmCancel.isConfirmed) {
      try {
        await axiosSecure.delete(`/payments/${orderId}`);
        Swal.fire({
          title: "Đã hủy!",
          text: "Đơn hàng đã được hủy thành công.",
          icon: "success",
        });
        refetch();
      } catch {
        Swal.fire({
          title: "Lỗi!",
          text: "Có lỗi xảy ra khi hủy đơn hàng.",
          icon: "error",
        });
      }
    }
  };

  const formatDate = (createAt) => {
    const createAtDate = new Date(createAt);
    return `${createAtDate.getDate()}/${
      createAtDate.getMonth() + 1
    }/${createAtDate.getFullYear()}`;
  };

  const filteredOrders =
    activeTab === "pending"
      ? orders.filter(
          (order) =>
            order.status === "Đơn hàng đang chờ xử lý" ||
            order.status === "Đang chờ xử lý"
        )
      : orders;

  console.log(filteredOrders);
  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 pb-16 my-4 sm:my-10 px-4">
      <div className="pt-24 pb-8 sm:py-24 flex flex-col justify-center items-center gap-8">
        <div className="text-center">
          <h2 className="md:text-5xl text-2xl font-bold md:leading-snug leading-snug">
            Đơn<span className="text-green"> hàng của bạn</span>
          </h2>
          <p className="text-[#4A4A4A] text-[1rem] md:text-xl">
            Xem và quản lý các đơn hàng của bạn.
          </p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "all" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            Tất cả đơn hàng
          </button>
          <button
            className={`tab ${activeTab === "pending" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Đơn hàng đang chờ duyệt
          </button>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto w-full">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <table className="table table-zebra">
              <thead className="text-center bg-green text-white">
                <tr>
                  <th>#</th>
                  <th>Avatar</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái đơn hàng</th>
                  <th>Ngày mua</th>
                  <th>Số lượng sản phẩm</th>
                  <th>Hành động</th>
                  <th>Huỷ đơn</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {Array.isArray(filteredOrders) &&
                  filteredOrders?.map((order, index) => {
                    const products = productDetails[order._id] || [];
                    const avatar =
                      products[0]?.image || "https://via.placeholder.com/100";
                    return (
                      <React.Fragment key={order._id}>
                        <tr>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              className="w-12 rounded-full"
                              src={avatar}
                              alt="Avatar"
                            />
                          </td>
                          <td>
                            {order.cartTotals.toLocaleString("vi-VN")} VND
                          </td>
                          <td className="text-red-500 font-semibold">
                            {order.status}
                          </td>
                          <td>{formatDate(order.createAt)}</td>
                          <td>{products.length}</td>
                          <td>
                            {order.status === "Đã được duyệt" &&
                            !order.received ? (
                              <button
                                className="btn bg-blue-500 text-white"
                                onClick={() => handleMarkAsReceived(order._id)}
                              >
                                Xác nhận
                              </button>
                            ) : (
                              <button
                                className="btn bg-gray-400 text-white w-full"
                                disabled
                              >
                                {order.received
                                  ? "Đã xác nhận"
                                  : "Chưa thể xác nhận"}
                              </button>
                            )}
                          </td>
                          <td>
                            {order.status === "Đã được duyệt" ? (
                              <button
                                className="btn bg-gray-400 text-white w-full"
                                disabled
                              >
                                Không thể hủy
                              </button>
                            ) : (
                              <button
                                className="btn bg-red-500 text-white w-full"
                                onClick={() => handleCancelOrder(order._id)}
                              >
                                Hủy đơn
                              </button>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="8">
                            <table className="table table-compact w-full">
                              <thead>
                                <tr className="text-center">
                                  <th>#</th>
                                  <th>Hình ảnh</th>
                                  <th>Tên sản phẩm</th>
                                  <th>Giá</th>
                                  <th>Danh mục</th>
                                  <th>Mô tả</th>
                                  <th>Số lượng</th>
                                </tr>
                              </thead>
                              <tbody className="text-center">
                                {products.map((item, itemIndex) => {
                                  return (
                                    <tr key={itemIndex}>
                                      <td>{itemIndex + 1}</td>
                                      <td>
                                        <img
                                          src={
                                            item.image ||
                                            "https://via.placeholder.com/100"
                                          }
                                          alt={item.name}
                                          className="w-12 h-12"
                                        />
                                      </td>
                                      <td>{item.name}</td>
                                      <td>
                                        {item.price?.toLocaleString("vi-VN") *
                                          item.quantity}{" "}
                                        VND
                                      </td>
                                      <td>{item.category}</td>
                                      <td>{item.recipe}</td>
                                      <td>{item.quantity}</td>{" "}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
