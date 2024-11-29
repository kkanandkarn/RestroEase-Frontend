import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DROPDOWN,
  DROPDOWN_METHOD,
  VIEW_PRODUCTS,
  VIEW_PRODUCTS_METHOD,
} from "../apiCalls/endpoints";
import { hideLoader, showLoader } from "../components/Loader";
import { CRUDAPI } from "../apiCalls/crud-api";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { IoIosArrowBack, IoIosArrowForward, IoMdEye } from "react-icons/io";
import veg from "../assets/veg.png";
import nonVeg from "../assets/non-veg.png";
import ViewProductModal from "../components/Models/ViewProductModal";

const WaiterDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState();
  const [product, setProduct] = useState(null);
  const [viewProductModal, setViewProudctModal] = useState(false);
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isLastPage, setIsLastPage] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [cart, setCart] = useState([]);
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

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate("/");
  };

  const onClose = () => {
    setProduct(null);
    setViewProudctModal(false);
  };

  return (
    <div className="w-screen overflow-y-hidden">
      <nav className="flex justify-between items-center py-4 px-10 bg-primaryColor w-full">
        <div className="max-w-16">
          <img src={user.tenantLogo} alt="Tenant Logo" />
        </div>
        <div className="text-lg font-bold text-center flex-1 px-2 text-white font-poppins hidden md:block">
          {user.tenantName}
        </div>
        <button
          className="text-white font-poppins font-bold"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
      <div className="flex flex-wrap mt-4 gap-4 justify-center">
        {products?.map((product, index) => (
          <div className="flex flex-col border-2 w-48 h-48 mt-8 rounded-lg">
            <img
              src={product?.image}
              alt="product-img"
              className="h-10/12 w-full object-cover rounded-lg"
            />
            <div className="flex justify-between mt-1">
              <p className="font-poppins text-sm">
                {product?.productName?.length > 20
                  ? `${product.productName.slice(0, 20)}...`
                  : product?.productName}
              </p>
              <button
                className="text-primaryColor rounded-full hover:underline flex justify-center items-center"
                onClick={() => {
                  setProduct(product);
                  setViewProudctModal(true);
                }}
              >
                <IoMdEye size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end py-10 gap-2 px-14">
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
      {viewProductModal && (
        <ViewProductModal product={product} onClose={onClose} />
      )}
    </div>
  );
};

export default WaiterDashboard;
