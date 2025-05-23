import React from "react";

const serviceLists = [
  { id: 1, title: "Dịch vụ", des: "Đem đến sự hài lòng cho mọi người", img: "https://cdn-icons-png.flaticon.com/512/9481/9481555.png" },
  { id: 2, title: "Chuyển phát nhanh", des: "Chúng tôi giao hàng nhanh chóng đến tận nhà bạn", img: "https://cdn.ntlogistics.vn/images/NTX/new_images/ly-do-nen-thue-dich-vu-van-chuyen-nhanh-hon-tu-ship-.04.jpg" },
  { id: 3, title: "Đặt hàng trực tuyến", des: "Khám phá sản phẩm công nghệ và đặt hàng một cách dễ dàng bằng cách sử dụng Đặt hàng trực tuyến của chúng tôi", img: "https://png.pngtree.com/png-clipart/20230317/original/pngtree-colorful-order-now-label-png-image_8990854.png" },
  { id: 4, title: "Thẻ quà tặng", des: "Tặng quà ẩm thực đặc sắc với Thẻ quà tặng từ 8 bit store", img: "https://img.lovepik.com/free-png/20210922/lovepik-vector-gift-box-icon-png-image_401047822_wh1200.png" },
];

const OurServices = () => {
  return (
    <section className="bg-white">
      <div className="container px-6 py-12 mx-auto">
        <div>
          <p className="font-medium text-blue-500">Dịch vụ của chúng tôi</p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-800 md:text-3xl">Đem đến trải nghiệm tốt nhất cho bạn</h1>
          <p className="mt-3 text-gray-500">Chúng tôi luôn sẵn sàng phục vụ với các dịch vụ chất lượng cao.</p>
        </div>

        <div className="grid grid-cols-1 gap-12 mt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {serviceLists.map((service) => (
            <div key={service.id} className="p-4 rounded-lg bg-blue-50 md:p-6">
              <span className="inline-block p-3 text-blue-500 rounded-lg bg-blue-100/80">
                <img src={service.img} alt={service.title} className="w-8 h-8" />
              </span>

              <h2 className="mt-4 text-base font-medium text-gray-800">{service.title}</h2>
              <p className="mt-2 text-sm text-gray-500">{service.des}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
