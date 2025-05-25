import React, { useEffect, useState } from "react";
import Cards from "../../components/Cards";
import { FaFilter } from "react-icons/fa";

const FilteredMenu = () => {
  const [menu, setMenu] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:6001/menu");
        const data = await response.json();
        const filteredData = data.filter(
          (item) => item.category === "Điện Thoại" || item.category === "Laptop"
        );
        setMenu(filteredData);
        setFilteredItems(filteredData);
      } catch (error) {
        console.log("Fetch lỗi:", error);
      }
    };
    fetchData();
  }, []);

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

  const indexOfLastItems = currentPage * itemsPerPage;
  const indexOfFirstItems = indexOfLastItems - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItems, indexOfLastItems);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-screen-2xl mt-20 container mx-auto px-4 lg:px-24 bg-gradient-to-r from-[#FAFAFA] to-100%">
      <div className="pt-24 pb-4 flex flex-col justify-center items-center gap-8">
        <div className="text-center">
          <h2 className="md:text-5xl text-2xl font-bold md:leading-snug leading-snug">
            Điện thoại và Laptop
          </h2>
          <p className="text-[#4A4A4A] mt-[10px] text-[1rem] md:text-xl">
            Các sản phẩm điện tử đang giảm giá
          </p>
        </div>
      </div>

      <div className="  pb-16">
        <div className="flex items-center flex-wrap justify-between">
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

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {currentItems.map((item) => (
            <Cards key={item._id} item={item} />
          ))}
        </div>

        <div className="flex justify-center px-4 flex-wrap">
          {Array.from({
            length: Math.ceil(filteredItems.length / itemsPerPage),
          }).map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`mx-1 my-5 items-center justify-between px-3 py-1 rounded-full ${
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

export default FilteredMenu;
