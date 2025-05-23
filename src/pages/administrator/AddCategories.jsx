import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import ManageCategories from "./admin/ManageCategories ";

const AddCategories = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();
  const [refresh, setRefresh] = React.useState(false);

  const onSubmit = async (data) => {
    try {
      const newCategory = { name: data.name };

      const response = await axiosSecure.post("/categories", newCategory);

      if (response.data) {
        reset();
        Swal.fire({
          title: "Thành công!",
          text: "Bạn đã thêm danh mục!",
          icon: "success",
        });
        setRefresh((prev) => !prev); // Kích hoạt refetch
      }
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      Swal.fire({
        title: "Thất bại!",
        text: "Không thể thêm danh mục. Vui lòng thử lại.",
        icon: "error",
      });
    }
  };

  return (
    <div className="w-full  mt-4">
      <h2 className="flex items-center gap-1 mb-4">
        Thêm <p className="text-green">Danh mục</p>
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Tên danh mục*</span>
          </label>
          <input
            type="text"
            placeholder="vd: Thể thao, Công nghệ..."
            className="input input-bordered w-full"
            {...register("name", { required: "Tên danh mục là bắt buộc", minLength: 3 })}
          />
        </div>

        <button className="btn bg-green text-white my-3 w-full sm:w-[200px]">
          Thêm danh mục
        </button>
      </form>
      {/* Truyền refresh vào ManageCategories */}
      <ManageCategories refresh={refresh} />
    </div>
  );
};

export default AddCategories;
