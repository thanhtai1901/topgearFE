import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AddVoucher = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [vouchers, setVouchers] = useState([]);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  // Fetch vouchers from the API
  const fetchVouchers = async () => {
    try {
      const response = await axiosPublic.get("/vouchers");
      setVouchers(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách vouchers:", error);
    }
  };

  // Fetch vouchers when the component mounts
  useEffect(() => {
    fetchVouchers();
  }, []);

  // Handle form submission for adding or updating a voucher
  const onSubmit = async (data) => {
    try {
      const voucherData = {
        code: data.code,
        discountAmount: data.discountAmount || 0,
        discountPercent: data.discountPercent || 0,
        expirationDate: data.expirationDate,
        usageLimit: data.usageLimit || 1,
        isActive: data.isActive || true,
      };

      // If editing an existing voucher, update it
      if (editingVoucher) {
        const response = await axiosSecure.put(`/vouchers/${editingVoucher._id}`, voucherData);
        if (response.status) {
          reset();
          setEditingVoucher(null);  // Reset editing state
          Swal.fire({
            title: "Thành công!",
            text: "Voucher đã được cập nhật thành công!",
            icon: "success",
          });
        }
      } else {
        // If adding a new voucher, create it
        const response = await axiosSecure.post("/vouchers", voucherData);
        if (response.status) {
          reset();
          Swal.fire({
            title: "Thành công!",
            text: "Voucher đã được thêm thành công!",
            icon: "success",
          });
        }
      }
      fetchVouchers(); // Refresh the voucher list after successful submission
    } catch (error) {
      Swal.fire({
        title: "Lỗi!",
        text: error.response?.data?.message || "Đã xảy ra lỗi!",
        icon: "error",
      });
    }
  };

  // Set form values for editing a voucher
  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);
    setValue("code", voucher.code);
    setValue("discountAmount", voucher.discountAmount);
    setValue("discountPercent", voucher.discountPercent);
    setValue("expirationDate", voucher.expirationDate.slice(0, 10)); // format date
    setValue("usageLimit", voucher.usageLimit);
    setValue("isActive", voucher.isActive);
  };

  // Handle voucher deletion
  const handleDelete = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: "Bạn chắc chắn muốn xóa?",
        text: "Voucher này sẽ bị xóa vĩnh viễn!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
      });

      if (confirm.isConfirmed) {
        await axiosSecure.delete(`/vouchers/${id}`);
        Swal.fire("Đã xóa!", "Voucher đã được xóa.", "success");
        fetchVouchers(); // Refresh the voucher list after deletion
      }
    } catch (error) {
      Swal.fire({
        title: "Lỗi!",
        text: error.response?.data?.message || "Đã xảy ra lỗi!",
        icon: "error",
      });
    }
  };

  return (
    <div className="w-full  mt-4">
      <h2 className="flex items-center gap-1 mb-4">
        Thêm <p className="text-green">voucher mới</p>
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Code Voucher */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Mã Voucher*</span>
          </label>
          <input
            type="text"
            placeholder="VD: VOUCHER2024"
            className="input input-bordered"
            {...register("code", { required: true })}
          />
        </div>

        {/* Discount Amount */}
        <div className="form-control mt-3">
          <label className="label">
            <span className="label-text">Giảm giá (VNĐ)</span>
          </label>
          <input
            type="number"
            placeholder="VD: 50000"
            className="input input-bordered"
            {...register("discountAmount")}
          />
        </div>

        {/* Discount Percent */}
        <div className="form-control mt-3">
          <label className="label">
            <span className="label-text">Giảm giá (%)</span>
          </label>
          <input
            type="number"
            placeholder="VD: 10"
            className="input input-bordered"
            {...register("discountPercent")}
          />
        </div>

        {/* Expiration Date */}
        <div className="form-control mt-3">
          <label className="label">
            <span className="label-text">Ngày hết hạn*</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            {...register("expirationDate", { required: true })}
          />
        </div>

        {/* Usage Limit */}
        <div className="form-control mt-3">
          <label className="label">
            <span className="label-text">Số lần sử dụng tối đa</span>
          </label>
          <input
            type="number"
            placeholder="VD: 1"
            className="input input-bordered"
            {...register("usageLimit")}
          />
        </div>

        {/* Is Active */}
        <div className="form-control mt-3">
          <label className="label">
            <span className="label-text">Kích hoạt voucher?</span>
          </label>
          <select className="select select-bordered" {...register("isActive")}>
            <option value={true}>Có</option>
            <option value={false}>Không</option>
          </select>
        </div>

        {/* Submit Button */}
        <button className="btn bg-green text-white my-3 w-full sm:w-[200px]">
          {editingVoucher ? "Cập nhật Voucher" : "Thêm Voucher"}
        </button>
      </form>

      <h3 className="mt-6 text-lg font-semibold">Danh sách Voucher</h3>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Mã</th>
              <th>Hạn</th>
              <th>Giảm giá</th>
              <th>Hoạt động</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher, index) => (
              <tr key={voucher._id}>
                <td>{index + 1}</td>
                <td>{voucher.code}</td>
                <td>{new Date(voucher.expirationDate).toLocaleDateString()}</td>
                <td>
                  {voucher.discountAmount > 0
                    ? `${voucher.discountAmount} VNĐ`
                    : `${voucher.discountPercent}%`}
                </td>
                <td>{voucher.isActive ? "Có" : "Không"}</td>
                <td>
                  <button
                    className="btn bg-blue-500 text-white  mr-2"
                    onClick={() => handleEdit(voucher)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn bg-red-500 text-white "
                    onClick={() => handleDelete(voucher._id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddVoucher;
