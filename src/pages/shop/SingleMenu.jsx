import React, { useEffect, useState } from "react";
import { Navigate, useLoaderData, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { IoCartSharp } from "react-icons/io5";
import Swal from "sweetalert2";
import axios from "axios";
import useCart from "../../hooks/useCart";

const SingleMenu = () => {
  const { _id, createAt, category, image, name, price, recipe } =
    useLoaderData();
  const [refetch] = useCart();
  const { user } = useAuth();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1); // State để quản lý số lượng

  // Xử lý thời gian hiển thị
  const createdAtDate = new Date(createAt);
  const hours = createdAtDate.getHours();
  const minutes = createdAtDate.getMinutes();
  const day = createdAtDate.getDate();
  const month = createdAtDate.getMonth() + 1;
  const year = createdAtDate.getFullYear();

  useEffect(() => {
    axios
      .get(`http://localhost:6001/menu/related`)
      .then((response) => setRelatedProducts(response.data))
      .catch((error) => console.error("Error fetching related products:", error));
  }, []);
  const navigate = useNavigate();

  // Hàm xử lý tăng số lượng
  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  // Hàm xử lý giảm số lượng
  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = (item) => {
    if (user && user.email) {
      const cartItem = {
        menuItemId: _id,
        name,
        quantity,
        image,
        price,
        email: user.email,
      };
  
      axios
        .post("http://localhost:6001/cart", cartItem)
        .then((response) => {
          console.log(response);
          if (response.status === 201) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Thêm sản phẩm thành công.",
              showConfirmButton: false,
              timer: 1500,
            })
          }
        })
        .catch((error) => {
          // Check if error.response and error.response.data exist before accessing them
          const errorMessage =
            error.response && error.response.data
              ? error.response.data.message
              : "Đã xảy ra lỗi. Vui lòng thử lại.";
          
          console.error(error); // Log the full error for debugging
          Swal.fire({
            position: "center",
            icon: "warning",
            title: errorMessage,
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
  const handleBuyNow = () => {
    if (user && user.email) {
      const cartItem = {
        menuItemId: _id,
        name,
        quantity,
        image,
        price,
        email: user.email,
      };

      axios
        .post("http://localhost:6001/cart", cartItem)
        .then((response) => {
          if (response.status === 201) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Sản phẩm đã được thêm vào giỏ hàng.",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              navigate("/cart-pay"); // Điều hướng sang /cart-pay
            });
          }
        })
        .catch((error) => {
          const errorMessage =
            error.response && error.response.data
              ? error.response.data.message
              : "Đã xảy ra lỗi. Vui lòng thử lại.";
          Swal.fire({
            position: "center",
            icon: "warning",
            title: errorMessage,
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
    <div className="max-w-screen-2xl container mx-auto xl:px-24 pb-16 px-4">
      {/* Product details */}
      <div className="pt-24 pb-8 sm:py-24 flex flex-col justify-center items-center gap-8">
        <h2 className="text-2xl font-bold">Chi tiết sản phẩm</h2>
        <p className="text-[#4A4A4A] mt-[10px] text-[1rem] md:text-xl">
          Bạn đang xem sản phẩm{" "}
          <span className="text-green font-bold">{name}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 justify-between">
        <div className="md:w-[400px] w-full relative rounded-sm">
          <img src={image} alt={name} className="rounded-md" />
        </div>
        <div className="mt-3">
          <p className="font-medium">Sản phẩm: {name}</p>
          <p className="my-2 text-red">
            Giá: {price.toLocaleString("vi-VN")}{" "}
            VND
          </p>
          <p className="font-light">Danh mục: {category}</p>
          <p className="my-2">
            Ngày đăng bán sản phẩm:{" "}
            {`lúc ${hours}:${minutes} vào ${day}/${month}/${year}`}
          </p>
          <p className="mt-4 border border-gray-400 p-2 rounded-md font-light">
            Mô tả: {recipe}
          </p>
          {/* Phần tăng, giảm số lượng */}
          <div className="flex items-center gap-4 mt-4">
            <button
              className="btn bg-green text-white px-4 py-2"
              onClick={handleDecrease}
            >
              -
            </button>
            <span className="text-lg font-bold">{quantity}</span>
            <button
              className="btn bg-green text-white px-4 py-2"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>
          {/* Nút thêm vào giỏ hàng */}
         <div className="flex items-center gap-4">
         <button
            className="btn bg-green mt-4 text-white flex items-center"
            onClick={handleAddToCart}
          >
            <IoCartSharp /> <p>Thêm vào giỏ hàng</p>
          </button>
          <button
            className="btn bg-red-500 mt-4 text-white"
            onClick={handleBuyNow}
          >
            Mua ngay
          </button>
         </div>
        </div>
      </div>

      {/* Related Products */}
      {/* <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Sản phẩm liên quan</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <p className="mt-2 font-semibold">{product.name}</p>
              <p className="text-red">
                Giá: {product.price.toLocaleString("vi-VN", { minimumFractionDigits: 3 })} VND
              </p>
              <button
                className="btn bg-green mt-2 text-white w-full"
                onClick={() => handleAddToCart(product._id)}
              >
                <IoCartSharp /> <p>Thêm vào giỏ hàng</p>
              </button>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default SingleMenu;
