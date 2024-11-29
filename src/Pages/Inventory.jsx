import React, { useEffect, useState } from "react";
import Layout from "../Layout/index.Jsx";
import { hideLoader, showLoader } from "../components/Loader";
import { CRUDAPI } from "../apiCalls/crud-api";
import {
  DELETE_PRODUCT,
  DELETE_PRODUCT_METHOD,
  DROPDOWN,
  DROPDOWN_METHOD,
  VIEW_PRODUCTS,
  VIEW_PRODUCTS_METHOD,
} from "../apiCalls/endpoints";
import { useNavigate } from "react-router-dom";
import { CiCirclePlus, CiEdit, CiSearch } from "react-icons/ci";
import { IoIosArrowBack, IoIosArrowForward, IoMdEye } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { HiOutlineRefresh } from "react-icons/hi";
import AddProductModal from "../components/Models/AddProductModal";
import ViewProductModal from "../components/Models/ViewProductModal";
import EditProductModal from "../components/Models/EditProductModal";
import { Confirm } from "notiflix";
import toast from "react-hot-toast";
import SingleSelect from "../components/Mui/SingleSelect";
import FilterSelect from "../components/Mui/FilterSelect";
import { FaPlus } from "react-icons/fa";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { FaRegFileExcel } from "react-icons/fa";
import LoadingGif from "../components/LoadingGif";
import PDFModal from "../components/Mui/PDFModal";

const Inventory = () => {
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [products, setProducts] = useState();
  const [product, setProduct] = useState();
  const [search, setSearch] = useState("");
  const [addProductModal, setAddProudctModal] = useState(false);
  const [viewProductModal, setViewProudctModal] = useState(false);
  const [editProductModal, setEditProudctModal] = useState(false);
  const [id, setId] = useState(null);
  const [pageNo, setPageNo] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLastPage, setIsLastPage] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const navigate = useNavigate();
  const [filter, setFilter] = useState([
    { category: "" },
    { type: "" },
    { status: "" },
  ]);
  const [categories, setCategories] = useState();
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [typeOptions, setTypeOptions] = useState([
    { value: "veg", label: "veg" },
    { value: "non-veg", label: "non-veg" },
  ]);
  const [statusOptions, setStatusOptions] = useState([
    { value: "Active", label: "Active" },
    { value: "Hold", label: "Hold" },
  ]);
  const [excelLoading, setExcelLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfModal, setPdfModal] = useState(false);

  const getProducts = async (page) => {
    if (search.trim() === "") {
      setLoading(true);
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
        setTotalData(response.data?.totalCount);
        if ((pageNo + 1) * itemsPerPage >= response.data?.totalCount) {
          setIsLastPage(true);
        } else {
          setIsLastPage(false);
        }
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(response.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Internal server error. Please try again lator.");
      console.log(error);
    }
  };
  const getCategory = async () => {
    setCategoryLoading(true);
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
        const transformedData = response.data.map((item) => ({
          value: item._id,
          label: item.category,
        }));
        const sortedCategory = transformedData.sort((a, b) =>
          a.label.localeCompare(b.label)
        );

        setCategories(sortedCategory);
        setCategoryLoading(false);
      } else {
        setCategoryLoading(false);
        toast.error(response.message);
      }
    } catch (error) {
      setCategoryLoading(false);
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

  const onClose = (isUpdate = false, products = [], totalCount) => {
    setId(null);
    setProduct(null);
    setAddProudctModal(false);
    setViewProudctModal(false);
    setEditProudctModal(false);
    setPdfModal(false);
    setPdfUrl(null);

    if (isUpdate) {
      console.log("is update");
      setTotalData(totalCount);
      setProducts(products);
      if ((pageNo + 1) * itemsPerPage >= totalCount) {
        setIsLastPage(true);
      } else {
        setIsLastPage(false);
      }
    }
  };

  const deleteProduct = async (deleteId) => {
    showLoader();
    try {
      const data = {
        id: deleteId,
      };
      const response = await CRUDAPI(
        DELETE_PRODUCT,
        DELETE_PRODUCT_METHOD,
        data,
        navigate
      );
      if (response.status === "SUCCESS") {
        setProducts(response.data.products);
        hideLoader();
        toast.success("Product deleted successfully.");
      } else {
        hideLoader();
        toast.error(response.message);
      }
    } catch (error) {
      hideLoader();
      toast.error("Internal server error. Please try again lator.");
      console.log(error);
    }
  };

  const handleDelete = async (deleteId) => {
    Confirm.show(
      "Confirm Delete",
      "Are you sure want to delete this product ?",
      "Yes",
      "No",
      async () => {
        await deleteProduct(deleteId);
      },
      () => {},
      {}
    );
  };

  useEffect(() => {
    setPageNo(0);
    getProducts(0);
  }, [search, filter]);

  const handlePageChange = (method) => {
    if (method === "FORWARD" && !isLastPage) {
      setPageNo(pageNo + 1);
    } else if (method === "BACKWARD" && pageNo > 0) {
      setPageNo(pageNo - 1);
    }
  };
  const startIndex = pageNo * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalData);

  const handleCategoryChange = (newValue) => {
    setFilter((prevFilter) => {
      const newFilter = [...prevFilter];
      newFilter[0] = { category: newValue }; // Update the category
      return newFilter;
    });
  };

  // Handle type change
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

  const handleExport = async (exportType) => {
    try {
      if (exportType === "excel") {
        setExcelLoading(true);
      }
      if (exportType === "pdf") {
        setPdfLoading(true);
      }
      const data = {
        search: search,
        filters: filter,
        page: 1,
        limit: itemsPerPage,
        exportFlag: true,
        exportType: exportType,
      };
      const response = await CRUDAPI(
        VIEW_PRODUCTS,
        VIEW_PRODUCTS_METHOD,
        data,
        navigate
      );
      if (response.status === "SUCCESS") {
        if (exportType === "excel" && response.data) {
          window.open(response.data, "_blank");
        }
        if (exportType === "pdf" && response.data) {
          setPdfUrl(response.data);
          setPdfModal(true);
        }

        toast.success("File exported successfully.");
        setExcelLoading(false);
        setPdfLoading(false);
      } else {
        setExcelLoading(false);
        setPdfLoading(false);
        toast.error(response.message);
      }
    } catch (error) {
      setExcelLoading(false);
      setPdfLoading(false);
      toast.error("Internal server error. Please try again lator.");
      console.log(error);
    }
  };

  return (
    <Layout title="Invantory">
      <div className="flex justify-between items-center mx-14 pt-4 pb-1">
        <div className="flex justify-start items-center gap-1">
          {categoryLoading || loading ? (
            <div className="bg-slate-400 animate-pulse w-10 h-10 rounded-lg"></div>
          ) : (
            <button
              className="text-primaryColor border-2 border-primaryColor hover:text-white hover:bg-primaryColor ease-in-out duration-500
              w-8 h-8 rounded flex items-center justify-center "
              onClick={() => setAddProudctModal(true)}
            >
              <FaPlus size={15} />
            </button>
          )}
          {categoryLoading || loading ? (
            <div className="bg-slate-400 animate-pulse w-10 h-10 rounded-lg"></div>
          ) : (
            <button
              className="text-primaryColor 
              w-8 h-8 rounded flex items-center justify-center "
              onClick={() => {
                if (products?.length) {
                  handleExport("pdf");
                } else {
                  toast.error("No products found for report.");
                }
              }}
            >
              {pdfLoading ? (
                <LoadingGif additionalStyle="bg-primaryColor rounded-full" />
              ) : (
                <BsFileEarmarkPdf size={30} />
              )}
            </button>
          )}
          {categoryLoading || loading ? (
            <div className="bg-slate-400 animate-pulse w-10 h-10 rounded-lg"></div>
          ) : (
            <button
              className="text-primaryColor 
              w-8 h-8 rounded flex items-center justify-center "
              disabled={excelLoading}
              onClick={() => {
                if (products?.length) {
                  handleExport("excel");
                } else {
                  toast.error("No products found for report.");
                }
              }}
            >
              {excelLoading ? (
                <LoadingGif additionalStyle="bg-primaryColor rounded-full" />
              ) : (
                <FaRegFileExcel size={30} />
              )}
            </button>
          )}
        </div>

        <div className="flex items-center relative gap-2">
          {categoryLoading || loading ? (
            <div className="p-4 border-b bg-slate-400 rounded-lg w-32 animate-pulse"></div>
          ) : (
            <FilterSelect
              options={categories}
              value={filter[0].category}
              onChange={handleCategoryChange}
              placeholder={"All Categories"}
            />
          )}

          {categoryLoading || loading ? (
            <div className="p-4 border-b bg-slate-400 rounded-lg w-32 animate-pulse"></div>
          ) : (
            <FilterSelect
              options={typeOptions}
              value={filter[1].type}
              onChange={handleTypeChange}
              placeholder={"All Types"}
            />
          )}
          {categoryLoading || loading ? (
            <div className="p-4 border-b bg-slate-400 rounded-lg w-32 animate-pulse"></div>
          ) : (
            <FilterSelect
              options={statusOptions}
              value={filter[2].status}
              onChange={handleStatusChange}
              placeholder={"All Status"}
            />
          )}

          {categoryLoading || loading ? (
            <div className="p-4 border-b bg-slate-400 rounded-lg w-32 animate-pulse"></div>
          ) : (
            <input
              type="text"
              className="h-9 w-40 text-sm font-poppins border-2 border-gray-200 shadow-sm outline-none pl-2 pr-8 rounded-md font-Poppins"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
          {!categoryLoading && !loading && (
            <CiSearch className="absolute right-3 text-slate-400" size={20} />
          )}
        </div>
      </div>
      <div className="mx-10 my-6 h-auto bg-white rounded-lg">
        <div className="px-4 pb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-sm text-zinc-600 bg-slate-100 font-Poppins">
                <th className="p-4 border-b">S.No.</th>
                <th className="p-4 border-b">Product Name</th>
                <th className="p-4 border-b">Product Price</th>
                <th className="p-4 border-b">Category</th>
                <th className="p-4 border-b">Type</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 10 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="p-4 border-b bg-slate-400 rounded-full"></td>
                      <td className="p-4 border-b bg-slate-400 rounded-full"></td>
                      <td className="p-4 border-b bg-slate-400 rounded-full"></td>
                      <td className="p-4 border-b bg-slate-400 rounded-full"></td>
                      <td className="p-4 border-b bg-slate-400 rounded-full"></td>
                      <td className="p-4 border-b bg-slate-400 rounded-full"></td>
                      <td className="p-4 border-b bg-slate-400 rounded-full"></td>
                    </tr>
                  ))
                : products?.map((product, index) => (
                    <tr
                      key={index}
                      className={`font-Poppins text-zinc-600 text-sm`}
                    >
                      <td className="p-4 border-b">{startIndex + index}</td>
                      <td className="p-4 border-b">{product.productName}</td>
                      <td className="p-4 border-b">₹ {product.price}</td>

                      <td className="p-4 border-b">
                        {product.category.category}
                      </td>
                      <td className="p-4 border-b">{product.type}</td>
                      <td className="p-4 border-b">{product.status}</td>

                      <td className="p-4 border-b text-left flex justify-left gap-2">
                        {/* {categoryLoading ? ()} */}
                        <button
                          className="bg-primaryColor text-white rounded-full hover:underline flex justify-center items-center p-1"
                          onClick={() => {
                            setId(product._id);
                            setProduct(product);
                            setViewProudctModal(true);
                          }}
                        >
                          <IoMdEye size={15} />
                        </button>

                        {categoryLoading ? (
                          <div className="bg-slate-400 w-6 h-6 animate-pulse rounded-full flex justify-center items-center"></div>
                        ) : (
                          <button
                            className="bg-primaryColor text-white rounded-full hover:underline flex justify-center items-center p-1"
                            onClick={() => {
                              setId(product._id);
                              setProduct(product);
                              setEditProudctModal(true);
                            }}
                          >
                            <CiEdit size={15} />
                          </button>
                        )}

                        <button
                          className="bg-primaryColor text-white rounded-full hover:underline flex justify-center items-center p-1"
                          onClick={() => {
                            handleDelete(product._id);
                          }}
                        >
                          <MdDeleteOutline size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          <div className="flex items-center justify-end py-2 gap-2">
            {loading || categoryLoading ? (
              <div className="bg-slate-400 animate-pulse w-28 h-10 rounded-lg"></div>
            ) : products?.length ? (
              <React.Fragment>
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
              </React.Fragment>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      {addProductModal && (
        <AddProductModal categories={categories} onClose={onClose} />
      )}
      {viewProductModal && (
        <ViewProductModal product={product} onClose={onClose} />
      )}

      {editProductModal && (
        <EditProductModal
          product={product}
          categories={categories}
          onClose={onClose}
        />
      )}
      <PDFModal
        open={pdfModal}
        onClose={() => setPdfModal(false)}
        pdfUrl={pdfUrl}
      />
    </Layout>
  );
};

export default Inventory;
