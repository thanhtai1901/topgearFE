import React from "react";
import { Link } from "react-router-dom";

const Categories = () => {
  return (
    <div className="container flex flex-col px-6 py-4 mx-auto space-y-6 lg:h-[32rem] lg:py-16 lg:flex-row lg:items-center">
      <div className="flex items-center justify-center w-full h-96 lg:w-1/2">
        <img
          className="object-cover w-full h-full max-w-2xl rounded-md"
          src="https://assets.gqindia.com/photos/5f242fdc85e7703226f06c6f/master/pass/5%20reasons%20you%20should%20buy%20a%20mid%20range%20phone%20over%20an%20expensive%20one.jpg"
          alt="apple watch photo"
        />
      </div>
      <div className="flex flex-col items-center w-full lg:flex-row lg:w-1/2">
        <div className="flex justify-center order-2 mt-6 lg:mt-0 lg:space-y-3 lg:flex-col">
          <button className="w-3 h-3 mx-2 bg-blue-500 rounded-full lg:mx-0 focus:outline-none"></button>
          <button className="w-3 h-3 mx-2 bg-gray-300 rounded-full lg:mx-0 focus:outline-none hover:bg-blue-500"></button>
          <button className="w-3 h-3 mx-2 bg-gray-300 rounded-full lg:mx-0 focus:outline-none hover:bg-blue-500"></button>
          <button className="w-3 h-3 mx-2 bg-gray-300 rounded-full lg:mx-0 focus:outline-none hover:bg-blue-500"></button>
        </div>

        <div className="max-w-lg lg:mx-12 lg:order-2">
          <h1 className="text-3xl font-semibold tracking-wide text-gray-800 dark:text-white lg:text-4xl">
            The best Apple Watch apps
          </h1>
          <p className="mt-4">
            Đừng bỏ lỡ những chương trình khuyến mãi và ưu đãi đặc biệt tại [Tên
            cửa hàng]! Với mong muốn mang lại giá trị tốt nhất cho khách hàng,
            chúng tôi thường xuyên cập nhật các chương trình giảm giá, quà tặng
            và ưu đãi đặc biệt cho từng dòng sản phẩm. Hãy theo dõi trang web
            hoặc đăng ký nhận tin từ chúng tôi để không bỏ lỡ bất kỳ ưu đãi nào.
          </p>
          <div className="mt-6">
            <Link 
             to='/menu'
              className="px-6 py-2.5 mt-6 text-sm font-medium leading-5 text-center text-white capitalize bg-blue-600 rounded-lg hover:bg-blue-500 lg:mx-0 lg:w-auto focus:outline-none"
            >
              Mua sắm apple watch ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
