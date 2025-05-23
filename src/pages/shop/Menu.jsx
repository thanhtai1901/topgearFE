import React, { useEffect, useState } from "react";
import Cards from "../../components/Cards";
import { FaFilter } from "react-icons/fa";
import axios from "axios"; // Import axios nếu chưa làm

const Menu = () => {
  const [menu, setMenu] = useState([]); // Dữ liệu sản phẩm
  const [categories, setCategories] = useState([]); // Dữ liệu danh mục
  const [filteredItems, setFilteredItems] = useState([]); // Danh sách sản phẩm đã filter
  const [selectedCategory, setSelectedCategory] = useState("all"); // Danh mục đang chọn
  const [sortOption, setSortOption] = useState("default"); // Tùy chọn sắp xếp
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage] = useState(8); // Số sản phẩm mỗi trang

  // API URL (nếu axiosPublic không cần thì thay axios)
  const axiosPublic = axios.create({ baseURL: "https://be-8bitstores.vercel.app/" });

  // Fetch menu
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axiosPublic.get("/menu");
        setMenu(response.data);
        setFilteredItems(response.data);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      }
    };

    fetchMenu();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosPublic.get("/categories");
        setCategories(response.data); // Lưu danh mục vào state
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [axiosPublic]);

  // Filter sản phẩm theo danh mục
  const filterItems = (category) => {
    const filtered =
      category === "all"
        ? menu
        : menu.filter((item) => item.category === category);
    setFilteredItems(filtered);
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Hiển thị tất cả sản phẩm
  const showAll = () => {
    setFilteredItems(menu);
    setSelectedCategory("all");
    setCurrentPage(1);
  };

  // Sắp xếp sản phẩm
  const handleSortChange = (option) => {
    setSortOption(option);

    let sortedItems = [...filteredItems];

    switch (option) {
      case "a-z":
        sortedItems.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "z-a":
        sortedItems.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "low-to-high":
        sortedItems.sort((a, b) => a.price - b.price);
        break;
      case "high-to-low":
        sortedItems.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredItems(sortedItems);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastItems = currentPage * itemsPerPage;
  const indexOfFirstItems = indexOfLastItems - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItems, indexOfLastItems);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="max-w-screen-2xl mt-20 container mx-auto px-4 lg:px-24 bg-gradient-to-r from-[#FAFAFA] to-100%">
      {/* Header */}
      <div className="pt-24 pb-10 sm:py-24 flex flex-col justify-center items-center gap-8">
        <div className="text-center">
          <h2 className="md:text-5xl text-2xl font-bold md:leading-snug leading-snug">
            Sản phẩm tại<span className="text-green"> 8 Bit Store</span>
          </h2>
          <p className="text-[#4A4A4A] mt-[10px] text-[1rem] md:text-xl">
            Đa dạng các loại sản phẩm laptop, đồ điện tử đang giảm giá sốc
          </p>
          <button className="bg-green w-full md:w-[200px] font-primary btn mt-[8px] text-white px-6">
            Mua hàng tại đây
          </button>
        </div>
      </div>

      {/* Menu Filter & Sort */}
      <div className="max-w-screen-2xl container mx-auto xl:px-24 pb-16">
        <div className="flex items-center flex-wrap justify-between">
          {/* Filter Categories */}
          <div className="flex flex-row justify-start md:items-center md:gap-8 gap-4 flex-wrap">
            <button
              onClick={showAll}
              className={selectedCategory === "all" ? "active bg-blue-500" : ""}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => filterItems(category.name)}
                className={
                  selectedCategory === category.name ? "active bg-blue-500" : ""
                }
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="p-2 flex items-center gap-2">
            <FaFilter />
            <select
              name="sort"
              id="sort"
              className="bg-none p-2 cursor-pointer"
              onChange={(e) => handleSortChange(e.target.value)}
              value={sortOption}
            >
              <option value="default">Mặc định</option>
              <option value="a-z">a-z</option>
              <option value="z-a">z-a</option>
              <option value="low-to-high">Thấp đến cao</option>
              <option value="high-to-low">Cao đến thấp</option>
            </select>
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {currentItems.map((item) => (
            <Cards key={item._id} item={item} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center px-4 flex-wrap">
          {Array.from({
            length: Math.ceil(filteredItems.length / itemsPerPage),
          }).map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`mx-1 my-5 px-3 py-1 rounded-full ${
                currentPage === index + 1
                  ? "bg-green text-white"
                  : "bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
