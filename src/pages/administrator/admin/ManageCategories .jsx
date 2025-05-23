import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const ManageCategories = ({ refresh }) => {
  const axiosSecure = useAxiosSecure();
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newName, setNewName] = useState("");
  const axiosPublic = useAxiosPublic();

  // Lấy danh sách tất cả categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosPublic.get("/categories");
        setCategories(response.data); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [axiosPublic, refresh]);

  // Xử lý xóa danh mục
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Bạn có chắc muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/categories/${id}`);
          setCategories(categories.filter((category) => category._id !== id));
          Swal.fire("Đã xóa!", "Danh mục đã được xóa.", "success");
        } catch (error) {
          console.error("Lỗi khi xóa danh mục:", error);
          Swal.fire("Thất bại!", "Không thể xóa danh mục.", "error");
        }
      }
    });
  };

  console.log(categories);

  // Xử lý cập nhật danh mục
  const handleUpdate = async (id) => {
    try {
      const updatedCategory = { name: newName };
      const response = await axiosPublic.patch(`/categories/${id}`, updatedCategory);

      if (response.data) {
        setCategories(
          categories.map((category) =>
            category._id === id ? { ...category, name: newName } : category
          )
        );
        setEditingCategory(null);
        Swal.fire("Thành công!", "Danh mục đã được cập nhật.", "success");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      Swal.fire("Thất bại!", "Không thể cập nhật danh mục.", "error");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl mb-4">Quản lý danh mục</h2>

      <table className="table w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories?.map((category, index) => (
            <tr key={category._id}>
              <td>{index + 1}</td>
              <td>
                {editingCategory === category._id ? (
                  <input
                    type="text"
                    defaultValue={category.name}
                    onChange={(e) => setNewName(e.target.value)}
                    className="input input-bordered"
                  />
                ) : (
                  category.name
                )}
              </td>
              <td>
                {editingCategory === category._id ? (
                  <>
                    <button
                      className="btn btn-success btn-sm mr-2"
                      onClick={() => handleUpdate(category._id)}
                    >
                      Lưu
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => setEditingCategory(null)}
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn text-white bg-blue-500 mr-2"
                      onClick={() => setEditingCategory(category._id)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn bg-red-500 text-white"
                      onClick={() => handleDelete(category._id)}
                    >
                      Xóa
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCategories;
