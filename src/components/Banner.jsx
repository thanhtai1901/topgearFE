import React, { useContext } from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

const Banner = () => {
  const { user } = useAuth();
  return (
    <div className="">
      <div className="">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
        >
          <SwiperSlide>
            <img
              className="w-full h-[600px] object-cover rounded-md"
              src="https://tintuc.dienthoaigiakho.vn/wp-content/uploads/2021/08/1200x628_Banner-TT_Bang-gia-iPhone.jpg"
              alt=""
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="w-full h-[600px] object-cover rounded-md"
              src="https://bizweb.dktcdn.net/100/318/659/files/banner-iphone-12-8983a0b6-defe-415e-bb29-2b31927c45f4.jpg?v=1607485732716"
              alt=""
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="w-full h-[600px] object-cover rounded-md"
              src="https://ctmobile.vn/upload/IPHONE%2015/banner%2015-01-01.png"
              alt=""
            />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="items-center lg:flex mt-10 container px-6 py-16 mx-auto">
        <div className="w-full lg:w-1/2">
          <div className="lg:max-w-lg">
            <h1 className="text-3xl font-semibold text-gray-800 lg:text-4xl">
              <span className="text-blue-500 ">Thương mại điện tử</span>
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Khám phá thế giới công nghệ với những sản phẩm đa dạng tại Top Gear!
              Dù bạn là game thủ, người làm việc sáng tạo, hay chỉ đơn giản muốn
              nâng cấp chiếc máy tính cá nhân của mình, chúng tôi đều có các sản
              phẩm phù hợp. Các sản phẩm của chúng tôi đều được nhập khẩu chính
              hãng, bảo đảm chất lượng và đa dạng mẫu mã từ các thương hiệu uy
              tín như Apple, Dell, HP, Asus, và nhiều hãng khác.
            </p>

            <Link to="/menu">
              <button className="w-full px-5 py-2 mt-6 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform bg-blue-600 rounded-lg lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                Mua hàng ngay
              </button>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
          <img
            className="w-full h-full lg:max-w-3xl"
            src="https://www.compareandrecycle.co.uk/_next/image?url=https%3A%2F%2Fwww.datocms-assets.com%2F27942%2F1607431213-guide-to-finding-out-phone-name.jpeg&w=3840&q=75&dpl=dpl_5cwVoUf7Qe93c2q9B8TN3v8LFzfy"
            alt="Catalogue-pana.svg"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
