import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hideLoader, showLoader } from "../Loader";
import {
  DROPDOWN,
  DROPDOWN_METHOD,
  VIEW_PRODUCTS,
  VIEW_PRODUCTS_METHOD,
} from "../../apiCalls/endpoints";
import { CRUDAPI } from "../../apiCalls/crud-api";
import toast from "react-hot-toast";
import veg from "../../assets/veg.png";
import nonVeg from "../../assets/non-veg.png";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import FilterSelect from "../Mui/FilterSelect";
import { CiSearch } from "react-icons/ci";
import { FaCartPlus, FaCartArrowDown } from "react-icons/fa";

const ReceptionDashboard = () => {
  const [products, setProducts] = useState();
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLastPage, setIsLastPage] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const [filter, setFilter] = useState([
    { category: "" },
    { type: "" },
    { status: "" },
  ]);
  const [categories, setCategories] = useState();
  const firstProductRef = useRef(null);
  const [typeOptions, setTypeOptions] = useState([
    { value: "veg", label: "veg" },
    { value: "non-veg", label: "non-veg" },
  ]);
  const [statusOptions, setStatusOptions] = useState([
    { value: "Active", label: "Active" },
    { value: "Hold", label: "Hold" },
  ]);

  const getProducts = async (page) => {
    if (search.trim() === "") {
      showLoader();
    }
    try {
      const data = {
        search: search,
        filters: filter,
        page: page + 1,
        limit: itemsPerPage,
      };
      const response = await CRUDAPI(
        VIEW_PRODUCTS,
        VIEW_PRODUCTS_METHOD,
        data,
        navigate
      );
      if (response.status === "SUCCESS") {
        const sortedProducts = response.data.products.sort((a, b) => {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });

        setProducts(sortedProducts);
        setTotalData(response?.data?.totalCount);
        if ((pageNo + 1) * itemsPerPage >= response.data?.totalCount) {
          setIsLastPage(true);
        } else {
          setIsLastPage(false);
        }

        hideLoader();
      } else {
        hideLoader();
        toast.error(response?.message);
      }
    } catch (error) {
      hideLoader();
      toast.error("Internal server error. Please try again later.");
      console.log(error);
    }
  };

  const getCategory = async () => {
    showLoader();
    try {
      const response = await CRUDAPI(
        DROPDOWN,
        DROPDOWN_METHOD,
        {
          dropdownCode: "CATEGORY_LIST",
        },
        navigate
      );
      if (response.status === "SUCCESS") {
        const transformedData = response?.data?.map((item) => ({
          value: item._id,
          label: item.category,
        }));
        const sortedCategory = transformedData.sort((a, b) =>
          a.label.localeCompare(b.label)
        );
        setCategories(sortedCategory);

        hideLoader();
      } else {
        hideLoader();
        toast.error(response?.message);
      }
    } catch (error) {
      hideLoader();
      console.log(error);
      toast.error("Internal server error");
    }
  };

  useEffect(() => {
    getProducts(pageNo);
  }, [pageNo]);

  useEffect(() => {
    if (localStorage.getItem("cart")) {
      setCart(JSON.parse(localStorage.getItem("cart")));
    }
    getCategory();
  }, []);

  useEffect(() => {
    setPageNo(0);
    getProducts(0);
  }, [search, filter]);

  // Shift focus to the first product after loading new data
  useEffect(() => {
    if (products && products.length > 0 && firstProductRef.current) {
      firstProductRef.current.focus();
    }
  }, [products]);

  const handleCartChange = (product, method) => {
    let updatedCart;
    if (method === "ADD") {
      const productWithQuantity = { ...product, quantity: 1 };
      updatedCart = [...cart, productWithQuantity];
      setCart(updatedCart);
      toast.success("Added to cart");
    } else if (method === "REMOVE") {
      updatedCart = cart.filter((item) => item._id !== product._id);
      setCart(updatedCart);
      toast.success("Removed from cart");
    }
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save updated cart to localStorage
  };

  // Check if the product is already in the cart
  const isProductInCart = (product) => {
    return cart.some((cartItem) => cartItem._id === product._id);
  };

  const handlePageChange = (method) => {
    if (method === "FORWARD" && !isLastPage) {
      setPageNo(pageNo + 1);
    } else if (method === "BACKWARD" && pageNo > 0) {
      setPageNo(pageNo - 1);
    }
  };

  const handleCategoryChange = (newValue) => {
    setFilter((prevFilter) => {
      const newFilter = [...prevFilter];
      newFilter[0] = { category: newValue }; // Update the category
      return newFilter;
    });
  };

  const handleTypeChange = (newValue) => {
    setFilter((prevFilter) => {
      const newFilter = [...prevFilter];
      newFilter[1] = { type: newValue };
      return newFilter;
    });
  };

  // Handle status change
  const handleStatusChange = (newValue) => {
    setFilter((prevFilter) => {
      const newFilter = [...prevFilter];
      newFilter[2] = { status: newValue }; // Update the status
      return newFilter;
    });
  };

  const startIndex = pageNo * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalData);

  return (
    <div>
      <div className="flex justify-end items-center px-20 mt-4">
        <div className="flex justify-end items-center relative gap-2">
          <FilterSelect
            options={categories}
            value={filter[0].category !== "" ? filter[0].category : null}
            onChange={handleCategoryChange}
            placeholder={"All Categories"}
          />
          <FilterSelect
            options={typeOptions}
            value={filter[1].type}
            onChange={handleTypeChange}
            placeholder={"All Types"}
          />
          <FilterSelect
            options={statusOptions}
            value={filter[2].status}
            onChange={handleStatusChange}
            placeholder={"All Status"}
          />

          <input
            type="text"
            className="h-9 w-40 text-sm shadow-sm font-poppins border-2 border-gray-200 outline-none pl-2 pr-8 rounded-md font-Poppins"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <CiSearch className="absolute right-3 text-slate-400" size={20} />
        </div>
      </div>

      {products?.map((product, index) => (
        <div
          key={index}
          className="mx-10 my-2 px-10 py-4 text-sm font-poppins flex gap-4"
          tabIndex={index === 0 ? 0 : -1}
          ref={index === 0 ? firstProductRef : null}
        >
          <div className="w-40 flex justify-start">
            <div className="w-full h-full flex justify-center items-center rounded-lg">
              {product.image && product.image !== "" ? (
                <img
                  src={product?.image}
                  alt="product-img"
                  className="w-full h-full object-fit rounded-lg"
                />
              ) : (
                <p className="font-poppins text-primaryColor text-sm text-center">
                  No image uploaded
                </p>
              )}
            </div>
          </div>
          <div className="leading-6 w-11/12">
            <div className="text-primaryColor font-bold">
              {product.productName}
            </div>
            <div className="">{product.productDesc}</div>
            <div>₹ {product.price}</div>
            <div className="flex items-center gap-2">
              {product?.type === "veg" ? (
                <img src={veg} alt="veg-icon" className="w-4 h-4" />
              ) : (
                <img src={nonVeg} alt="non-veg-icon" className="w-4 h-4" />
              )}
              <p className="text-sm font-poppins">{product?.type}</p>
            </div>

            {product.status === "Hold" ? (
              <p className="mt-2 text-primaryColor font-bold font-poppins">
                Status: Hold
              </p>
            ) : isProductInCart(product) ? (
              <button
                className="mt-2 flex items-center gap-2 border-2 border-red-500 rounded-full px-4 text-red-500 hover:bg-red-500 hover:text-white ease-in-out duration-500"
                onClick={() => handleCartChange(product, "REMOVE")}
              >
                <FaCartArrowDown size={18} /> Remove from cart
              </button>
            ) : (
              <button
                className="mt-2 flex items-center gap-2 border-2 border-primaryColor rounded-full px-4 text-primaryColor hover:bg-primaryColor hover:text-white ease-in-out duration-500"
                onClick={() => handleCartChange(product, "ADD")}
              >
                <FaCartPlus size={18} /> Add to cart
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="flex items-center justify-end py-2 gap-2 px-14">
        <div className="font-poppins text-sm">
          {startIndex}-{endIndex} of {totalData}
        </div>
        {pageNo > 0 && (
          <button
            onClick={() => handlePageChange("BACKWARD")}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <IoIosArrowBack />
          </button>
        )}

        {!isLastPage && (
          <button
            onClick={() => handlePageChange("FORWARD")}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <IoIosArrowForward />
          </button>
        )}
      </div>
    </div>
  );
};

export default ReceptionDashboard;
