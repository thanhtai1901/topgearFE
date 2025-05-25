import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo/logo.png";
import { IoCallOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import { useQuery } from "@tanstack/react-query";
import { GiHamburgerMenu } from "react-icons/gi";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import Profile from "./Profile";
import useMenu from "../hooks/useMenu";

const Navbar = () => {
  const [cart] = useCart();
  const [isSticky, setSticky] = useState(false);
  const { user, logout } = useAuth();
  const token = localStorage.getItem("access-token");
  const [selectedItem, setSelectedItem] = useState("Trang chủ"); // Added state to track selected item

  const [searchTerm, setSearchTerm] = useState(""); // Giá trị nhập vào
  const [searchResults, setSearchResults] = useState([]); // Kết quả tìm kiếm
  const [menu] = useMenu(); // Lấy dữ liệu menu từ custom hook useMenu

  const handleSearch = () => {
    const results = menu.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  const { data: orders = [] } = useQuery({
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

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setSticky(offset > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = (
    <>
      <li>
        <Link
          to="/"
          className={selectedItem === "Trang chủ" ? "text-green" : ""}
          onClick={() => setSelectedItem("Trang chủ")}
        >
          Trang chủ
        </Link>
      </li>
      <li tabIndex={0}>
        <div>
          <summary>
            {" "}
            <Link
              to="/menu"
              className={selectedItem === "Tất cả" ? "text-green" : ""}
              onClick={() => setSelectedItem("Tất cả")}
            >
              Tất cả sản phẩm
            </Link>
          </summary>
        </div>
      </li>
      <li tabIndex={0}>
        <div>
          <summary>
            <Link
              to="/contact"
              className={selectedItem === "Liên hệ" ? "text-green" : ""}
              onClick={() => setSelectedItem("Liên hệ")}
            >
              Liên hệ
            </Link>
          </summary>
        </div>
      </li>
      <li>
        <Link
          to="/blog"
          className={selectedItem === "Blogs" ? "text-green" : ""}
          onClick={() => setSelectedItem("Blogs")}
        >
          Blogs
        </Link>
      </li>
    </>
  );

  return (
    <header className="w-full bg-white fixed z-50 top-0 left-0 right-0 transition-all duration-300 ease-in-out">
      <div className="">
        <div
          className={`navbar shadow-md xl:px-24 px-4 ${
            isSticky
              ? "shadow-md py-4 bg-white transition-all duration-300 ease-in-out"
              : ""
          }`}
        >
          <div className="navbar-start">
            <div className="dropdown justify-between">
              <label tabIndex={0} className="btn btn-ghost p-0 mr-8 lg:hidden">
                <GiHamburgerMenu className="text-[1.3rem]" />
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm bg-white dropdown-content  mt-3 z-10 p-2 shadow rounded-box w-64 space-y-3"
              >
                {navItems}
              </ul>
            </div>
            <Link to="/">
              <img
                className="w-[100px] ml-[-30px] sm:ml-0 text-center"
                src={logo}
                alt=""
              />
            </Link>
          </div>
          <div className="navbar-center hidden lg:flex z-10">
            <ul className="menu menu-horizontal px-1">{navItems}</ul>
          </div>
          <div className="navbar-end">
            <button
              className="btn btn-ghost btn-circle hidden lg:flex"
              onClick={() =>
                document.getElementById("search_modal").showModal()
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <dialog id="search_modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Tìm kiếm sản phẩm</h3>
          <input
            type="text"
            placeholder="Nhập tên sản phẩm..."
            className="input input-bordered w-full mt-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-primary mt-4"
            onClick={handleSearch}
          >
            Tìm kiếm
          </button>

          {/* Hiển thị kết quả tìm kiếm */}
          <ul className="mt-4">
            {searchResults.map((item) => (
              <li key={item._id} className="py-2">
                <Link
                  to={`/menu/${item._id}`}
                  className="text-blue-500 hover:underline"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="modal-action">
            <button className="btn">Đóng</button>
          </div>
        </form>
      </dialog>
            <Link to="/cart-pay">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle hidden lg:flex items-center justify-center mr-3"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="badge badge-sm indicator-item">
                    {cart.length}
                  </span>
                </div>
              </label>
            </Link>
            {user ? (
              <Profile user={user} logout={logout} orders={orders} />
            ) : (
              <button
                onClick={() =>
                  document.getElementById("my_modal_5").showModal()
                }
                className="btn bg-green px-6 text-white flex items-center gap-2"
              >
                <FaRegUser /> Tài khoản
              </button>
            )}
            <Modal />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
