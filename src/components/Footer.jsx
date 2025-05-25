import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/logo/logo.png";

const Footer = () => {
  return (
    <div>
      <footer className="bg-white">
        <div className="container px-6 py-12 mx-auto">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <h1 className="max-w-lg text-xl font-semibold tracking-tight text-gray-800 xl:text-2xl ">
                Đăng ký nhận bản tin để cập nhật thông tin mới nhất.
              </h1>
              <div className="flex flex-col mx-auto mt-6 space-y-3 md:space-y-0 md:flex-row">
                <input
                  id="email"
                  type="email"
                  className="px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                  placeholder="Địa chỉ email"
                  aria-label="Địa chỉ email"
                />
                <button className="w-full px-6 py-2.5 text-sm font-medium tracking-wider text-white transition-colors duration-300 transform md:w-auto md:mx-4 focus:outline-none bg-gray-800 rounded-lg hover:bg-gray-700 focus:ring focus:ring-gray-300 focus:ring-opacity-80">
                  Đăng ký
                </button>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Liên Kết Nhanh</p>
              <div className="flex flex-col items-start mt-5 space-y-2">
                <Link
                  to="/"
                  className="text-gray-600 transition-colors duration-300 hover:underline hover:text-blue-500"
                >
                  Trang Chủ
                </Link>
                <Link
                  to="/about"
                  className="text-gray-600 transition-colors duration-300 hover:underline hover:text-blue-500"
                >
                  Giới Thiệu
                </Link>
                <Link
                  to="/philosophy"
                  className="text-gray-600 transition-colors duration-300 hover:underline hover:text-blue-500"
                >
                  Triết Lý
                </Link>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Ngành Nghề</p>
              <div className="flex flex-col items-start mt-5 space-y-2">
                <Link
                  to="/retail"
                  className="text-gray-600 transition-colors duration-300 hover:underline hover:text-blue-500"
                >
                  Bán Lẻ & Thương Mại Điện Tử
                </Link>
                <Link
                  to="/it"
                  className="text-gray-600 transition-colors duration-300 hover:underline hover:text-blue-500"
                >
                  Công Nghệ Thông Tin
                </Link>
                <Link
                  to="/finance"
                  className="text-gray-600 transition-colors duration-300 hover:underline hover:text-blue-500"
                >
                  Tài Chính & Bảo Hiểm
                </Link>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200 md:my-8" />
          <div className="flex items-center justify-between">
            <Link to="/">
              <img className="w-30 h-20" src={Logo} alt="Logo" />
            </Link>
            <div className="flex -mx-2 items-center gap-10">
              <p> Coppy right @2025 by Top Gear. Design by Top Gear</p>
              <img className="w-30 h-20" src="https://webmedia.com.vn/images/2021/09/logo-da-thong-bao-bo-cong-thuong-mau-xanh.png" alt="" />
              <p></p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
