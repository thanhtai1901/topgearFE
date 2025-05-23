/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FaMoneyBill, FaPaypal } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const CheckoutForm = ({ cart, cartTotals }) => {
  const [cartError, setCartError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [successPayment, setSuccessPayment] = useState("");
  const navigate = useNavigate();
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0); // Giảm giá
  const axiosPublic = useAxiosPublic();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái của modal
  const totalProduct = cartTotals;
  const exchangeRate = 0.000041;
  const shipCash = 30000;

  // Quy đổi tổng tiền từ VND sang USD
  // const totalUSD = cartTotals * exchangeRate;
  const totalPayment = totalProduct + shipCash - discount;
  //dung stripe
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const finalAmount = Math.max((cartTotals) - discount, 0); // Trừ giảm giá, đảm bảo không âm

    axiosSecure
      .post("/create-payment-intent", {
        cartTotals: finalAmount, // Sử dụng tổng tiền đã giảm
      })
      .then((res) => setClientSecret(res.data.clientSecret));
  }, [cartTotals, discount, axiosSecure]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const hasVoucher = !!voucherCode;
    const finalAmount = Math.max((cartTotals) - discount , 0);
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (card == null) return;

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.displayName || user?.name || "Ẩn danh",
            email: user?.email || "Không xác định",
          },
        },
      });

    if (confirmError) {
      Swal.fire({
        icon: "error",
        title: "Thanh toán thất bại",
        text: confirmError.message,
      });
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        for (const item of cart) {
          await axiosSecure.delete(`/cart/${item._id}`);
        }

        if (hasVoucher) {
          await axiosPublic.post("/vouchers/use", { code: voucherCode });
        }

        Swal.fire({
          icon: "success",
          title: "Thanh toán thành công",
          text: `Mã giao dịch: ${paymentIntent.id}`,
        });
        const paymentInfor = {
          idTransaction: paymentIntent.id,
          name: user?.displayName || user?.name || "Ẩn danh",
          email: user?.email || "không xác định được email",
          cartTotals: finalAmount + shipCash,
          quantity: cart.length,
          status: "Đơn hàng đang chờ xử lý",
          itemName: cart.map((item) => `${item.name} (x${item.quantity})`),
          cartItem: cart.map((item) => item._id),
          menuItems: cart.map((item) => item.menuItemId),
          address,
          phone,
        };
        await axiosSecure.post("/payments", paymentInfor);
        navigate("/order");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể xử lý sau khi thanh toán. Vui lòng thử lại!",
        });
      }
    }
  };

  const handleCashPayment = async () => {
    try {
      const paymentInfor = {
        name: user?.displayName || user?.name || "Ẩn danh",
        email: user?.email || "không xác định được email",
        cartTotals: (cartTotals + shipCash) - discount,
        quantity: cart.length,
        status: "Đang chờ xử lý",
        itemName: cart.map((item) => `${item.name} (x${item.quantity})`),
        cartItem: cart.map((item) => item._id),
        menuItems: cart.map((item) => item.menuItemId),
        address,
        phone,
      };

      const response = await axiosSecure.post("/payments/cash", {
        payment: paymentInfor,
      });

      if (response.status === 200) {
        // Delete items from cart
        for (const item of cart) {
          await axiosSecure.delete(`/cart/${item._id}`);
        }

        Swal.fire({
          icon: "success",
          title: "Thanh toán thành công",
          text: "Đơn hàng của bạn đã được đặt. Thanh toán khi nhận hàng.",
        });

        if (voucherCode) {
          await axiosPublic.post("/vouchers/use", { code: voucherCode });
        }

        navigate("/order");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể xử lý đơn hàng. Vui lòng thử lại!",
      });
    }
  };

  const handleVoucherCheck = async () => {
    if (!voucherCode.trim()) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Bạn phải nhập mã voucher!",
      });
      return;
    }

    try {
      const res = await axiosPublic.post("/vouchers/validate-voucher", {
        code: voucherCode,
      });

      const { isValid, discountAmount, discountPercent, message } = res.data;

      if (isValid) {
        const calculatedDiscount =
          discountAmount || (cartTotals * discountPercent) / 100;
        setDiscount(calculatedDiscount);

        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: `Voucher hợp lệ. Giảm giá: ${calculatedDiscount.toLocaleString(
            "vi-VN"
          )} đ`,
        });
      } else {
        setDiscount(0);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Voucher đã hết hạn hoặc không tồn tại!",
      });
    }
  };

  return (
    <div>
      <div className="text-center mb-7 ">
        <h2 className="md:text-5xl text-2xl font-bold md:leading-snug leading-snug">
          Thông tin<span className="text-green"> đơn hàng</span>
        </h2>
        <p className="text-[#4A4A4A] text-[1rem] md:text-xl">
          Hình thức thanh toán trả trước
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-6 items-start">
        {/* left */}
        <div className="space-y-3 w-full text-[.9rem]">
          {/* <h3 className="text-green">Thông tin thanh toán</h3> */}
          <p className="text-red mb-2 text-xl">
            Tổng số lượng sản phẩm: {cart.length}
          </p>

          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Hình ảnh</th>

                <th className="border border-gray-300 px-4 py-2">
                  Tên sản phẩm
                </th>
                <th className="border border-gray-300 px-4 py-2">Số lượng</th>
                <th className="border border-gray-300 px-4 py-2">Giá tiền</th>
                <th className="border border-gray-300 px-4 py-2">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2 flex justify-center">
                    <img src={item.image} className="w-20 h-10" alt="" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.price.toLocaleString("vi-VN")} đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-6">
            <div className="">
              <div className="">
                <label
                  htmlFor="address"
                  className="block text-gray-700 font-medium text-md"
                >
                  Địa chỉ giao hàng:
                </label>
                <input
                  type="text"
                  placeholder="Nhập địa chỉ giao hàng"
                  value={address}
                  className="input rounded-sm input-bordered  w-full"
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />

                <div className="mt-4">
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 font-medium"
                  >
                    Số điện thoại:
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập số điện thoại"
                    value={phone}
                    className="input rounded-sm input-bordered w-full"
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="">
                  <div className="mt-8 flex items-center">
                    <input
                      type="text"
                      placeholder="Nhập mã voucher nếu có"
                      value={voucherCode}
                      className="input rounded-sm input-bordered w-full max-w-xs mr-4"
                      onChange={(e) => setVoucherCode(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn bg-red-500 text-white"
                      onClick={handleVoucherCheck}
                    >
                      Áp dụng voucher
                    </button>
                  </div>

                  <div className="flex gap-4  items-center w-full mt-6">
                    <button
                      className="btn bg-blue-500 text-white w-[50%]"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <FaPaypal className="inline mr-2" />
                      Thanh toán Online
                    </button>
                    <button
                      className="btn bg-orange-500 text-white w-[50%]"
                      onClick={handleCashPayment}
                    >
                      <FaMoneyBill className="inline mr-2" />
                      Thanh toán Tiền mặt
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-base">Tổng tiền: </p>
                <p> {totalProduct.toLocaleString("vi-VN")} vnđ</p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-base mt-4">Tổng tiền phí vận chuyển </p>
                <p className="mt-4">{shipCash} vnđ </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-green-500 text-base my-4">
                  Tổng cộng Voucher giảm giá
                </p>
                <p className="my-4">-{discount.toLocaleString("vi-VN")} vnđ</p>
              </div>
          
              <div className="flex items-center justify-between gap-4">
                <p className="text-base">Tổng thanh toán</p>
                <p className="my-4 text-xl text-blue-500 font-bold">
                  {totalPayment.toLocaleString("vi-VN")} vnđ{" "}
                </p>
              </div>
            </div>
          </div>
          {/* <input
            type="text"
            placeholder="Nhập mã voucher"
            value={voucherCode}
            className="input rounded-sm input-bordered input-sm w-full max-w-xs"
            onChange={(e) => setVoucherCode(e.target.value)}
          /> */}
        </div>
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
              <h3 className="text-center mb-4">Thông tin thanh toán</h3>
              <form onSubmit={handleSubmit}>
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#000",
                        "::placeholder": {
                          color: "#000",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    className="btn bg-red-500 text-white"
                    onClick={() => setIsModalOpen(false)} // Đóng modal
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="btn bg-blue-500 text-white"
                    disabled={!stripe}
                  >
                    Thanh toán
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutForm;
