import React, { useContext, useState, useEffect } from "react";
import useCart from "../../hooks/useCart";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";

const CartPay = () => {
  const [cart, refetch] = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({}); // To track selected items
  const [selectAll, setSelectAll] = useState(false); // To track "Select All" checkbox

  const { user } = useContext(AuthContext);

  // Function to toggle the checkbox selection for an item
  const toggleSelection = (cartId) => {
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [cartId]: !prevSelectedItems[cartId], // Toggle selected state
    }));
  };

  // Function to toggle "Select All" checkbox
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const updatedSelectedItems = {};
    cart.forEach((item) => {
      updatedSelectedItems[item._id] = newSelectAll; // Select all or deselect all
    });
    setSelectedItems(updatedSelectedItems);
  };

  const handleDeleteCart = (cart) => {
    Swal.fire({
      title: "Hãy nghĩ kĩ đi?",
      text: "Bạn thật sự không muốn mua món này sao =((!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "không mua!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://be-8bitstores.vercel.app/cart/${cart._id}`, {
          method: "DELETE",
        })
        refetch();
      }
    });
    refetch();
  };

  const handleDecrease = (cart) => {
    if (cart.quantity > 1) {
      fetch(`https://be-8bitstores.vercel.app/cart/${cart._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: cart.quantity - 1 }),
      })
        .then((res) => res.json())
        .then(() => {
          const updatedCartItems = cartItems.map((cartItem) =>
            cartItem.id === cart.id
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          );
          refetch();
          setCartItems(updatedCartItems);
        })
        .catch((error) => console.error("Error fetching data:", error));
    } else {
      alert("Số lượng phải lớn hơn hoặc bằng 1.");
    }
  };

  const handleIncrease = (cart) => {
    if (cart.quantity < 10) {
      fetch(`https://be-8bitstores.vercel.app/cart/${cart._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: cart.quantity + 1 }),
      })
        .then((res) => res.json())
        .then(() => {
          const updatedCartItems = cartItems.map((cartItem) =>
            cartItem.id === cart.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
          refetch();
          setCartItems(updatedCartItems);
        })
        .catch((error) => console.error("Error fetching data:", error));
    } else {
      alert("Sản phẩm không thể có số lượng vượt quá 10.");
    }
  };

  // Calculate price for selected items only
  const calculatePrice = (cart) => {
    if (selectedItems[cart._id]) {
      return cart.price * cart.quantity;
    }
    return 0;
  };

  // Calculate total for selected items
  const cartSubTitle = Array.isArray(cart)
    ? cart.reduce((total, cart) => total + calculatePrice(cart), 0)
    : 0;

  // Calculate number of selected items
  const selectedItemCount = Object.values(selectedItems).filter(Boolean).length;

  const orderTotal = cartSubTitle;
  const handleBatchDelete = () => {
    const selectedIds = Object.keys(selectedItems).filter(
      (cartId) => selectedItems[cartId]
    );

    if (selectedIds.length === 0) {
      Swal.fire({
        title: "Không có sản phẩm nào được chọn",
        text: "Hãy chọn ít nhất một sản phẩm để xoá.",
        icon: "warning",
      });
      return;
    }

    Swal.fire({
      title: "Xác nhận xoá",
      text: `Bạn muốn xoá ${selectedIds.length} sản phẩm đã chọn?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xoá",
    }).then((result) => {
      if (result.isConfirmed) {
        selectedIds.forEach((cartId) => {
          fetch(`https://be-8bitstores.vercel.app/cart/${cartId}`, {
            method: "DELETE",
          });
          refetch();
        });
        Swal.fire({
          title: "Xoá thành công",
          text: `${selectedIds.length} sản phẩm đã được loại khỏi giỏ hàng!`,
          icon: "success",
        });
      }
    });
  };
  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 pb-16 px-4">
      <div className="pt-24 pb-8 sm:py-24 flex flex-col justify-center items-center gap-8">
        <div className="text-center">
          <h2 className="md:text-5xl text-2xl font-bold md:leading-snug leading-snug">
            Thanh toán<span className="text-green"> sản phẩm</span>
          </h2>
          <p className="text-[#4A4A4A] mt-[10px] text-[1rem] md:text-xl">
            Giỏ hàng của bạn phía dưới!
          </p>
        </div>
      </div>
      {/* Table */}
      <div className="rounded-sm">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-green text-white">
              <tr className="text-center">
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Số thứ tự</th>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Chỉnh sửa</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(cart) &&
                cart.map((cart, index) => (
                  <tr className="text-center" key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!selectedItems[cart._id]}
                        onChange={() => toggleSelection(cart._id)}
                      />
                    </td>
                    <th>{index + 1}</th>
                    <td>
                      <Link to={`/menu/${cart._id}`}>
                        <div className="flex items-center gap-3">
                          <div className="avatar cursor-pointer">
                            <div className="mask mask-squircle w-12 h-12">
                              <img src={cart.image} alt="ảnh lỗi" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td>{cart.name}</td>
                    <th className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => handleDecrease(cart)}
                        className="btn"
                      >
                        -
                      </button>
                      <p>{cart.quantity}</p>
                      <button
                        onClick={() => handleIncrease(cart)}
                        className="btn"
                      >
                        +
                      </button>
                    </th>
                    <td>
                      {(cart.price * cart.quantity).toLocaleString("vi-VN")} VND
                    </td>
                    <th className="flex items-center text-red justify-center">
                      <button
                        onClick={() => handleDeleteCart(cart)}
                        className="btn bg-red-500 text-white"
                      >
                        Xoá
                        <FaTrash />
                      </button>
                    </th>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total and User Info */}
      <div className="my-12 flex flex-col md:flex-row justify-between gap-6 items-start">
        <div className="md:w-1/2 space-y-3 text-[.9rem]">
          <h3 className="text-green">Thông tin người mua</h3>
          <p>Tên: {user?.displayName}</p>
          <p>Email: {user?.email}</p>
          <p>Uid: {user?.uid}</p>
        </div>
        <div className="md:w-1/2 space-y-3 text-[.9rem]">
          <h3 className="text-green">Thông tin thanh toán</h3>
          <p>Tổng sản phẩm đã chọn: {selectedItemCount}</p>
          <p>Tổng tiền: {orderTotal.toLocaleString("vi-VN")} vnđ</p>
          <div className="flex items-center gap-4 w-full">
            <button
              onClick={handleBatchDelete}
              className="btn bg-red-500 text-white flex items-center gap-2 w-[50%]"
            >
              Xoá đã chọn
            </button>
            <Link
              to={{
                pathname: "/process-checkout",
                search: `?selectedItems=${JSON.stringify(selectedItems)}`,
              }}
              className={`btn bg-blue-500 text-white flex items-center gap-2 w-[50%] ${
                selectedItemCount === 0 ? "btn-disabled opacity-50" : ""
              }`}
            >
              Thanh toán
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPay;
