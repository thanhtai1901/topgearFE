/* eslint-disable react/prop-types */

import React, { useContext, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import Swal from "sweetalert2";
import useCart from "../hooks/useCart";
import { IoCartSharp } from "react-icons/io5";
import axios from "axios";
// eslint-disable-next-line react/prop-types
const Cards = ({ item }) => {
  const { name, _id, price, recipe, image } = item;
  const { user } = useContext(AuthContext);

  const [cart, refetch] = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const handleHeartClick = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  const handleAddToCart = (item) => {
    // console.log(item);
    if (user && user.email) {
      const cartItem = {
        menuItemId: _id,
        name,
        quantity: 1,
        image,
        price,
        email: user.email,
      };

      axios
        .post("https://be-8bitstores.vercel.app/cart", cartItem)
        .then((response) => {
          if (response) {
            refetch(); // refetch cart
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Thêm sản phẩm thành công.",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              navigate("/cart-pay"); // Điều hướng sang trang /cart-pay
            });
          }
        })
        .catch((error) => {
          console.log(error.response.data.message);
          const errorMessage = error.response.data.message;
          Swal.fire({
            position: "center",
            icon: "warning",
            title: `${errorMessage}`,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } else {
      Swal.fire({
        title: "Bạn chưa đăng nhập nên không mua được",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đăng nhập ngay!",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: location } });
        }
      });
    }
  };

  const handleAddToCartPay = (item) => {
    if (user && user.email) {
      const cartItem = {
        menuItemId: _id,
        name,
        quantity: 1,
        image,
        price,
        email: user.email,
      };

      axios
        .post("https://be-8bitstores.vercel.app/cart", cartItem)
        .then((response) => {
          if (response) {
            refetch(); // refetch cart
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Thêm sản phẩm thành công.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          console.log(error.response.data.message);
          const errorMessage = error.response.data.message;
          Swal.fire({
            position: "center",
            icon: "warning",
            title: `${errorMessage}`,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } else {
      Swal.fire({
        title: "Bạn chưa đăng nhập nên không mua được",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đăng nhập ngay!",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: location } });
        }
      });
    }
  };

  return (
    // eslint-disable-next-line react/prop-types
    <div
      to={`/menu/${item._id}`}
      className="card rounded-sm shadow-xl relative md:mr-5 md:my-5"
    >
      <Link to={`/menu/${item._id}`}>
        <figure>
          <img
            src={item.image}
            alt="Shoes"
            className="w-full  h-[150px] rounded-sm sm:h-[200px]  hover:scale-105 transition-all duration-300 "
          />
        </figure>
      </Link>
      <div className="  p-2 sm:p-4">
        <Link to={`/menu/${item._id}`}>
          <h2 className="card-title text-[.9rem] md:text-[1.2rem] text1">
            {item.name}!
          </h2>
        </Link>
        <p className="text-[.8rem] md:text-[1rem] text">{item.recipe}</p>
        <div className="card-actions   mt-2">
          <div className="font-semibold text-[.8rem] flex items-center justify-between w-full">
            <span className="text-md text-red">Giá tiền: </span>{" "}
            <p className="text-md text-red-500 font-bold">
              {item.price.toLocaleString("vi-VN")} VND
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            {/* 1 */}
            <button
              className="btn bg-blue-500 text-white w-full"
              onClick={() => handleAddToCartPay(item)}
            >
              Thêm giỏ hàng
            </button>
            {/* 2 */}
            <button
              className="btn bg-red-500 text-white  w-full"
              onClick={() => handleAddToCart(item)}
            >
              <IoCartSharp /> <p>Mua </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
