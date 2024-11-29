import React, { useEffect, useState } from "react";
import Layout from "../Layout/index.Jsx";
import {
  DROPDOWN,
  DROPDOWN_METHOD,
  VIEW_BILL_BY_ID,
  VIEW_BILL_BY_ID_METHOD,
  VIEW_BILLS,
  VIEW_BILLS_METHOD,
} from "../apiCalls/endpoints";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { hideLoader, showLoader } from "../components/Loader";
import { CRUDAPI } from "../apiCalls/crud-api";
import formatDate from "../utils/format-date";
import { IoIosArrowBack, IoIosArrowForward, IoMdEye } from "react-icons/io";
import { BsFileEarmarkPdf } from "react-icons/bs";
import LoadingGif from "../components/LoadingGif";
import PDFModal from "../components/Mui/PDFModal";
import FilterSelect from "../components/Mui/FilterSelect";
import { CiSearch } from "react-icons/ci";
import { IoFilterSharp } from "react-icons/io5";
import BillFilterModal from "../components/Models/BillFilterModal";
import { FaRegFileExcel } from "react-icons/fa";

const Billing = () => {
  const [bills, setBills] = useState();
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfModal, setPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [billId, setBillId] = useState();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLastPage, setIsLastPage] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [filter, setFilter] = useState([
    { paymentMethod: "" },
    { service: "" },
  ]);
  const [paymentOptions, setPaymentOptions] = useState([
    { value: "Online", label: "Online" },
    { value: "Cash", label: "Cash" },
  ]);
  const [services, setServices] = useState();
  const [serviceLoading, setServiceLoading] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [totalAmountRange, setTotalAmountRange] = useState(null);
  const [createdAtRange, setCreatedAtRange] = useState(null);
  const [filterApplied, setFilterApplied] = useState(false);
  const [pdfReportLoading, setPDfReportLoading] = useState(false);
  const [excelReportLoading, setExcelReportLoading] = useState(false);
  const navigate = useNavigate();
  const getBills = async (page) => {
    if (search.trim() === "") {
      setLoading(true);
    }
    try {
      const data = {
        search: search,
        filters: filter,
        page: page + 1,
        limit: itemsPerPage,
        totalAmountRange: totalAmountRange,
        createdAtRange: createdAtRange,
      };
      const response = await CRUDAPI(
        VIEW_BILLS,
        VIEW_BILLS_METHOD,
        data,
        navigate
      );
      if (response.status === "SUCCESS") {
        const sortedBills = response?.data?.bills?.sort((a, b) => {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });

        setBills(sortedBills);
        setTotalData(response?.data?.totalCount);
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
  const getBill = async (id, exportFlag) => {
    try {
      if (exportFlag) {
        setPdfLoading(true);
      }
      const response = await CRUDAPI(
        VIEW_BILL_BY_ID,
        VIEW_BILL_BY_ID_METHOD,
        { id: id, exportFlag: exportFlag },
        navigate
      );
      if (response.status === "SUCCESS") {
        if (exportFlag) {
          setPdfLoading(false);
          setPdfUrl(response.data);
          setPdfModal(true);
        }
      } else {
        setPdfLoading(false);
        hideLoader();
        toast.error(response.message);
      }
    } catch (error) {
      setPdfLoading(false);
      toast.error("Internal server error. Please try again lator.");
      console.log(error);
    }
  };

  useEffect(() => {
    getBills(pageNo);
  }, [pageNo]);

  useEffect(() => {
    setPageNo(0);
    getBills(0);
  }, [search, filter, totalAmountRange, createdAtRange]);

  const handleCloseModal = (min, max, start, end, editMode = false) => {
    setPdfModal(false);
    setPdfUrl("");
    if (editMode) {
      console.log(editMode);
      if (!min && !max) {
        setTotalAmountRange(null);
      } else {
        setTotalAmountRange({ min: min, max: max });
      }

      if (!start && !end) {
        setCreatedAtRange(null);
      } else {
        setCreatedAtRange({ start: start, end: end });
      }
    }

    setFilterModal(false);
  };

  const handlePageChange = (method) => {
    if (method === "FORWARD" && !isLastPage) {
      setPageNo(pageNo + 1);
    } else if (method === "BACKWARD" && pageNo > 0) {
      setPageNo(pageNo - 1);
    }
  };
  const startIndex = pageNo * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalData);

  const handlePaymentMethodChange = (newValue) => {
    setFilter((prevFilter) => {
      const newFilter = [...prevFilter];
      newFilter[0] = { paymentMethod: newValue };
      return newFilter;
    });
  };
  const handleServiceChange = (newValue) => {
    setFilter((prevFilter) => {
      const newFilter = [...prevFilter];
      newFilter[1] = { service: newValue };
      return newFilter;
    });
  };
  const getServices = async () => {
    setServiceLoading(true);
    try {
      const response = await CRUDAPI(
        DROPDOWN,
        DROPDOWN_METHOD,
        {
          dropdownCode: "SERVICE_LIST",
        },
        navigate
      );
      if (response.status === "SUCCESS") {
        const transformedData = response?.data?.map((item) => ({
          value: item.service,
          label: item.service,
        }));
        const sortedService = transformedData.sort((a, b) =>
          a.label.localeCompare(b.label)
        );
        setServices(sortedService);
        setServiceLoading(false);
      } else {
        setServiceLoading(false);
        toast.error(response?.message);
      }
    } catch (error) {
      setServiceLoading(false);
      console.log(error);
      toast.error("Internal server error");
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  useEffect(() => {
    if (totalAmountRange || createdAtRange) {
      setFilterApplied(true);
    } else {
      setFilterApplied(false);
    }
  }, [totalAmountRange, createdAtRange]);
  const handleExport = async (exportType) => {
    try {
      if (exportType === "excel") {
        setExcelReportLoading(true);
      }
      if (exportType === "pdf") {
        setPDfReportLoading(true);
      }
      const data = {
        search: search,
        filters: filter,
        page: 1,
        limit: itemsPerPage,
        totalAmountRange: totalAmountRange,
        createdAtRange: createdAtRange,
        exportFlag: true,
        exportType: exportType,
      };
      const response = await CRUDAPI(
        VIEW_BILLS,
        VIEW_BILLS_METHOD,
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
        setExcelReportLoading(false);
        setPDfReportLoading(false);
      } else {
        setExcelReportLoading(false);
        setPDfReportLoading(false);
        toast.error(response.message);
      }
    } catch (error) {
      setExcelReportLoading(false);
      setPDfReportLoading(false);
      toast.error("Internal server error. Please try again lator.");
      console.log(error);
    }
  };

  return (
    <Layout title="Billing">
      <div className="flex items-center justify-between mt-4">
        <div className="mx-10 flex items-center gap-2">
          <div>
            {serviceLoading || loading ? (
              <div className="bg-slate-400 animate-pulse w-8 h-8 rounded-lg"></div>
            ) : (
              <button
                className="text-primaryColor w-8 h-8 rounded flex items-center justify-center "
                onClick={() => {
                  if (bills.length) {
                    handleExport("pdf");
                  } else {
                    toast.error("No bills found for report.");
                  }
                }}
              >
                {pdfReportLoading ? (
                  <LoadingGif additionalStyle="bg-primaryColor rounded-full" />
                ) : (
                  <BsFileEarmarkPdf size={30} />
                )}
              </button>
            )}
          </div>
          <div>
            {serviceLoading || loading ? (
              <div className="bg-slate-400 animate-pulse w-8 h-8 rounded-lg"></div>
            ) : (
              <button
                className="text-primaryColor w-8 h-8 rounded flex items-center justify-center "
                onClick={() => {
                  if (bills.length) {
                    handleExport("excel");
                  } else {
                    toast.error("No bills found for report.");
                  }
                }}
              >
                {excelReportLoading ? (
                  <LoadingGif additionalStyle="bg-primaryColor rounded-full" />
                ) : (
                  <FaRegFileExcel size={30} />
                )}
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end mx-10 relative gap-2">
          {serviceLoading || loading ? (
            <div className="p-4 border-b bg-slate-400 rounded-lg w-32 animate-pulse"></div>
          ) : (
            <FilterSelect
              options={paymentOptions}
              value={filter[0].paymentMethod}
              onChange={handlePaymentMethodChange}
              placeholder={"All Method"}
            />
          )}

          {serviceLoading || loading ? (
            <div className="p-4 border-b bg-slate-400 rounded-lg w-32 animate-pulse"></div>
          ) : (
            <FilterSelect
              options={services}
              value={filter[1].service}
              onChange={handleServiceChange}
              placeholder={"All Service"}
            />
          )}

          {serviceLoading || loading ? (
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
          {!serviceLoading && !loading && (
            <CiSearch className="absolute right-12 text-slate-400" size={20} />
          )}

          {serviceLoading || loading ? (
            <div className="p-4 border-b bg-slate-400 rounded-lg w-8 animate-pulse"></div>
          ) : (
            <button
              className={` ${
                filterApplied
                  ? "bg-primaryColor text-white"
                  : "border-primaryColor text-primaryColor"
              } border-2  p-1 rounded-lg hover:bg-primaryColor hover:text-white ease-in-out duration-500`}
              onClick={() => setFilterModal(true)}
            >
              <IoFilterSharp size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="px-10 py-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-sm text-zinc-600 bg-slate-100 font-Poppins">
              <th className="p-4 border-b">S.No.</th>
              <th className="p-4 border-b">Customer Name</th>
              <th className="p-4 border-b">Customer Contact</th>
              <th className="p-4 border-b">Amount</th>
              <th className="p-4 border-b">Payment Method</th>
              <th className="p-4 border-b">Service</th>
              <th className="p-4 border-b">Date</th>
              <th className="p-4 border-b">View</th>
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
                    <td className="p-4 border-b bg-slate-400 rounded-full"></td>
                  </tr>
                ))
              : bills?.map((bill, index) => (
                  <tr
                    key={index}
                    className={`font-Poppins text-zinc-600 text-sm`}
                  >
                    <td className="p-4 border-b">{index + 1}</td>
                    <td className="p-4 border-b">{bill.customerName}</td>
                    <td className="p-4 border-b">{bill.customerContact}</td>

                    <td className="p-4 border-b">₹ {bill.totalAmount}</td>
                    <td className="p-4 border-b">{bill.paymentMethod}</td>
                    <td className="p-4 border-b">{bill.service}</td>
                    <td className="p-4 border-b">
                      {formatDate(bill.createdAt)}
                    </td>
                    <td className="p-4 border-b flex items-center gap-1">
                      <button
                        className="bg-primaryColor text-white rounded-full hover:underline flex justify-center items-center p-1"
                        onClick={() =>
                          navigate("/billing/view", { state: bill })
                        }
                      >
                        <IoMdEye size={15} />
                      </button>

                      <button
                        className="text-primaryColor rounded-full hover:underline flex justify-center items-center p-1"
                        disabled={pdfLoading}
                        onClick={() => {
                          setBillId(bill._id);
                          getBill(bill._id, true);
                        }}
                      >
                        {pdfLoading && billId === bill._id ? (
                          <LoadingGif additionalStyle="bg-primaryColor rounded-full" />
                        ) : (
                          <BsFileEarmarkPdf size={25} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        <div className="flex items-center justify-end py-2 gap-2">
          {loading || serviceLoading ? (
            <div className="bg-slate-400 animate-pulse w-28 h-10 rounded-lg"></div>
          ) : bills?.length ? (
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
      <PDFModal open={pdfModal} onClose={handleCloseModal} pdfUrl={pdfUrl} />
      {filterModal && (
        <BillFilterModal
          totalAmountRange={totalAmountRange}
          createdAtRange={createdAtRange}
          onClose={handleCloseModal}
        />
      )}
    </Layout>
  );
};

export default Billing;
