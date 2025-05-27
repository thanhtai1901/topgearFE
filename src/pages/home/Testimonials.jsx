/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { FaStar } from "react-icons/fa";
import imageTestimonials from "../../assets/images/home/testimonials/testimonials.png";

const Testimonials = () => {
  return (
    <section className="bg-white">
      <div className="container px-6 py-10 mx-auto">   <div className="">
        <img className="w-full mb-10 h-[300px] object-cover rounded-md" src="https://www.acervietnam.com.vn/wp-content/uploads/2021/02/Laptop-Van-Phong-Mong-Nhe-Acer-Aspire-3-2023-5.webp" alt="" />
      </div>
        <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl">
          Khám phá các lựa chọn <span className="text-blue-500">laptop đẳng cấp</span> của chúng tôi
        </h1>

        <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-16 md:grid-cols-2 xl:grid-cols-3">
          <div className="flex flex-col items-center p-6 space-y-3 text-center bg-gray-100 rounded-xl">
            <span className="inline-block p-3 text-blue-500 bg-blue-100 rounded-full">
              <FaStar className="w-6 h-6" />
            </span>

            <h2 className="text-xl font-semibold text-gray-700 capitalize">
              Bộ sưu tập laptop đẳng cấp
            </h2>

            <p className="text-gray-500">
              Mua sắm dễ dàng tại [Tên cửa hàng] với bộ sưu tập laptop đẳng cấp! Chúng tôi cung cấp nhiều mẫu từ các thương hiệu uy tín như Apple, Dell, HP, Lenovo, đáp ứng nhu cầu học tập, làm việc và giải trí.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 space-y-3 text-center bg-gray-100 rounded-xl">
            <span className="inline-block p-3 text-blue-500 bg-blue-100 rounded-full">
              <FaStar className="w-6 h-6" />
            </span>

            <h2 className="text-xl font-semibold text-gray-700 capitalize">
              Trải nghiệm dịch vụ chuyên nghiệp
            </h2>

            <p className="text-gray-500">
              Dịch vụ hàng đầu tại [Tên cửa hàng]! Đội ngũ chuyên viên sẵn sàng tư vấn và hỗ trợ bạn chọn được chiếc laptop phù hợp với nhu cầu và ngân sách, cam kết bảo hành dài hạn và hỗ trợ sau bán hàng tuyệt vời.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 space-y-3 text-center bg-gray-100 rounded-xl">
            <span className="inline-block p-3 text-blue-500 bg-blue-100 rounded-full">
              <FaStar className="w-6 h-6" />
            </span>

            <h2 className="text-xl font-semibold text-gray-700 capitalize">
              Giá cạnh tranh, ưu đãi hấp dẫn
            </h2>

            <p className="text-gray-500">
              Mua sắm laptop với giá cạnh tranh cùng nhiều ưu đãi! Tại [Tên cửa hàng], bạn sẽ tìm được các chương trình khuyến mãi và chính sách trả góp linh hoạt, giúp bạn sở hữu chiếc laptop yêu thích với giá tốt nhất.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
