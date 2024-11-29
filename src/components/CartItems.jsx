import React, { useEffect, useRef, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import Layout from "../Layout/index.Jsx";
import veg from "../assets/veg.png";
import nonVeg from "../assets/non-veg.png";
import { FaCartArrowDown } from "react-icons/fa";
import QuantityInput from "../components/Mui/QuantityInput";
import { IconButton, TextField } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import toast from "react-hot-toast";
import { CRUDAPI } from "../apiCalls/crud-api";
import { useNavigate } from "react-router-dom";
import {
  CREATE_PAYMENT,
  CREATE_PAYMENT_METHOD,
  DROPDOWN,
  DROPDOWN_METHOD,
  VERIFY_PAYMENT,
  VERIFY_PAYMENT_METHOD,
} from "../apiCalls/endpoints";
import { hideLoader, showLoader } from "../components/Loader";
import FilterSelect from "../components/Mui/FilterSelect";
import { FaArrowRight } from "react-icons/fa";
import LoadingGif from "../components/LoadingGif";

const CartItems = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState();
  const [cgst, setCgst] = useState(2.5);
  const [sgst, setSgst] = useState(2.5);
  const [cgstPrice, setCgstPrice] = useState();
  const [sgstPrice, setSgstPrice] = useState();
  const [totalPrice, setTotalPrice] = useState();
  const [roundOff, setRoundOff] = useState();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerPhone: "",
    customerName: "",
    customerEmail: "",
    customerAddress: "",
  });
  const [paymentMethod, setPaymentMethod] = useState();
  const [errors, setErrors] = React.useState({
    customerPhone: "",
    customerName: "",
    customerAddress: "",
    paymentMethod: "",
    service: "",
  });

  const [paymentOptions, setPaymentOptions] = useState([
    { value: "Online", label: "Online" },
    { value: "Cash", label: "Cash" },
  ]);
  const [tables, setTables] = useState();
  const [tableNumber, setTableNumber] = useState();
  const [services, setServices] = useState();
  const [service, setService] = useState();
  const [serviceName, setServiceName] = useState("");
  const [waiter, setWaiter] = useState();
  const [waiters, setWaiters] = useState();
  const [isRoundPositive, setIsRoundPositive] = useState(false);
  const customerNameRef = useRef(null);
  const customerPhoneRef = useRef(null);
  const customerAddressRef = useRef(null);
  const paymentMethodRef = useRef(null);
  const serviceRef = useRef(null);
  const tableNumberRef = useRef(null);
  const waiterRef = useRef(null);

  const getTables = async () => {
    try {
      const response = await CRUDAPI(
        DROPDOWN,
        DROPDOWN_METHOD,
        {
          dropdownCode: "TABLE_LIST",
        },
        navigate
      );
      if (response.status === "SUCCESS") {
        const transformedData = response?.data?.map((item) => ({
          value: item._id,
          label: item.tableNumber,
        }));
        const sortedTable = transformedData.sort((a, b) =>
          a.label.localeCompare(b.label)
        );
        setTables(sortedTable);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal server error");
    }
  };

  const getWaiters = async () => {
    try {
      const response = await CRUDAPI(
        DROPDOWN,
        DROPDOWN_METHOD,
        {
          dropdownCode: "WAITER_LIST",
        },
        navigate
      );
      if (response.status === "SUCCESS") {
        const transformedData = response?.data?.map((item) => ({
          value: item._id,
          label: item.name,
        }));
        const sortedWaiter = transformedData.sort((a, b) =>
          a.label.localeCompare(b.label)
        );
        setWaiters(sortedWaiter);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal server error");
    }
  };
  const getServices = async () => {
    showLoader();
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
          value: item._id,
          label: item.service,
        }));
        const sortedService = transformedData.sort((a, b) =>
          a.label.localeCompare(b.label)
        );
        setServices(sortedService);
        await getTables();
        await getWaiters();
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
    const cart = localStorage.getItem("cart");
    if (cart) {
      setProducts(JSON.parse(cart));
    }

    getServices();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      let sum = 0;
      products.forEach((item) => {
        sum = sum + parseInt(item.price) * parseInt(item.quantity);
      });
      setPrice(sum);

      const cgstCalcualte = (sum * (cgst / 100)).toFixed(2);
      const sgstCalcualte = (sum * (sgst / 100)).toFixed(2);

      setCgstPrice(cgstCalcualte);
      setSgstPrice(sgstCalcualte);

      sum = sum + parseFloat(cgstCalcualte) + parseFloat(sgstCalcualte);
      let totalBeforeDecimal = sum.toFixed(2).split(".")[0];
      let totalAfterDecimal = sum.toFixed(2).split(".")[1];

      if (parseInt(totalAfterDecimal) >= 50) {
        const addingValue = 1.0 - parseFloat(`0.${totalAfterDecimal}`);

        setIsRoundPositive(true);
        setRoundOff(addingValue.toFixed(2));
        setTotalPrice(parseInt(totalBeforeDecimal) + 1);
      } else {
        setIsRoundPositive(false);
        setRoundOff(`0.${totalAfterDecimal}`);
        setTotalPrice(totalBeforeDecimal);
      }
    }
  }, [products]);

  useEffect(() => {
    const foundService = getLabelByValue(service);
    setServiceName(foundService);
  }, [service]);

  const handleCartChange = (product) => {
    let updatedCart;

    updatedCart = products.filter((item) => item._id !== product._id);
    setProducts(updatedCart);
    toast.success("Removed from cart");

    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (product, action) => {
    const updatedProducts = products.map((item) => {
      if (item._id === product._id) {
        if (action === "increase") {
          return { ...item, quantity: item.quantity + 1 };
        } else if (action === "decrease" && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
      }
      return item;
    });

    setProducts(updatedProducts);
    localStorage.setItem("cart", JSON.stringify(updatedProducts));
  };

  const getSessionId = async () => {
    try {
      setLoading(true);
      const data = {
        customerName: formData.customerName,
        customerContact: formData.customerPhone,
        paymentMethod: paymentMethod,
        service: getLabelByValue(service),
        cartProducts: products.map((item) => ({
          productName: item.productName,
          productDesc: item.productDesc,
          price: item.price,
          category: item.category.category,
          image: item.image || "",
          type: item.type,
          quantity: item.quantity,
        })),
        subTotal: price,
        cgstPercentage: String(cgst),
        cgstAmount: String(cgstPrice),
        sgstPercentage: String(sgst),
        sgstAmount: String(sgstPrice),
        roundOff: String(roundOff),
        isRoundPositive: isRoundPositive,
        totalAmount: totalPrice,
      };

      if (formData.customerEmail) {
        data.customerEmail = formData.customerEmail;
      }
      if (tableNumber) {
        data.table = getTableByValue(tableNumber);
      }
      if (formData.customerAddress) {
        data.customerAddress = formData.customerAddress;
      }
      if (waiter) {
        data.waiter = getWaiterByValue(waiter);
      }

      const response = await CRUDAPI(
        CREATE_PAYMENT,
        CREATE_PAYMENT_METHOD,
        data,
        navigate
      );

      if (paymentMethod === "Cash") {
        if (response.status === "SUCCESS") {
          toast.success("Billing successfull");
          localStorage.removeItem("cart");
          setTimeout(() => {
            setLoading(false);
            navigate("/dashboard");
          }, 3000);
        } else {
          setLoading(false);
          toast.error(response.message);
        }
      }
      if (paymentMethod === "Online") {
        if (response.data && response.data.payment_session_id) {
          return {
            sessionId: response.data.payment_session_id,
            orderId: response.data.order_id,
          };
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const verifyPayment = async (orderId) => {
    setLoading(true);
    try {
      const response = await CRUDAPI(
        VERIFY_PAYMENT,
        VERIFY_PAYMENT_METHOD,
        { orderId: orderId },
        navigate
      );
      if (response.status === "SUCCESS") {
        toast.success("Billing successfull");
        localStorage.removeItem("cart");
        setTimeout(() => {
          setLoading(false);
          navigate("/dashboard");
        }, 3000);
      } else {
        setLoading(false);
        toast.error(response.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getLabelByValue = (value) => {
    const found = services?.find((option) => option.value === value);
    return found ? found.label : null;
  };
  const getTableByValue = (value) => {
    const found = tables?.find((option) => option.value === value);
    return found ? found.label : null;
  };
  const getWaiterByValue = (value) => {
    const found = waiters?.find((option) => option.value === value);
    return found ? found.label : null;
  };

  const validateForm = () => {
    const { customerName, customerPhone } = formData;
    // Collect all validation checks in one go
    const errorsCopy = {
      customerName: customerName ? "" : "Customer name is required",
      customerPhone: customerPhone ? "" : "Customer contact is required",
      paymentMethod: paymentMethod ? "" : "Payment method is required",
      service: service ? "" : "Service is required",
    };

    if (customerPhone.length !== 10) {
      errorsCopy.customerPhone = "Invalid contact number.";
    }

    const foundService = getLabelByValue(service);

    if (foundService === "Delivery" && !formData.customerAddress) {
      errorsCopy.customerAddress = "Customer Address is required";
    }

    if (foundService === "Fine Dining" && !tableNumber) {
      errorsCopy.tableNumber = "Table Number is required";
    }

    if (foundService === "Fine Dining" && !waiter) {
      console.log("no wiater");
      errorsCopy.waiter = "Waiter is required";
    }

    // Filter out empty error messages
    const filteredErrors = Object.fromEntries(
      Object.entries(errorsCopy).filter(([_, value]) => value)
    );

    setErrors(filteredErrors);

    if (filteredErrors.customerName) {
      customerNameRef.current.focus();
    } else if (filteredErrors.customerPhone) {
      customerPhoneRef.current.focus();
    } else if (filteredErrors.customerAddress) {
      customerAddressRef.current.focus();
    } else if (filteredErrors.paymentMethod) {
      customerNameRef.current.focus();
    } else if (filteredErrors.service) {
      customerNameRef.current.focus();
    } else if (filteredErrors.tableNumber) {
      customerNameRef.current.focus();
    } else if (filteredErrors.waiter) {
      customerNameRef.current.focus();
    }

    return Object.keys(filteredErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (validateForm()) {
        if (paymentMethod === "Cash") {
          await getSessionId();
        } else {
          const cashfree = await load({
            mode: "sandbox",
          });
          const { sessionId, orderId } = await getSessionId();

          const checkoutOptions = {
            paymentSessionId: sessionId,
            redirectTarget: "_modal",
          };
          await cashfree.checkout(checkoutOptions);
          await verifyPayment(orderId);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handlePaymentMethodChange = (newValue) => {
    setPaymentMethod(newValue);

    setErrors((prevError) => ({
      ...prevError,
      paymentMethod: "",
    }));
  };
  const handleServiceChange = (newValue) => {
    setService(newValue);
    setErrors((prevError) => ({
      ...prevError,
      service: "",
    }));
  };
  const handleTableChange = (newValue) => {
    setTableNumber(newValue);
    setErrors((prevError) => ({
      ...prevError,
      tableNumber: "",
    }));
  };
  const handleWaiterChange = (newValue) => {
    setWaiter(newValue);
    setErrors((prevError) => ({
      ...prevError,
      waiter: "",
    }));
  };

  return (
    <div>
      {products.length > 0 ? (
        <div>
          <h1 className="mt-4 px-10 font-poppins font-bold text-primaryColor">
            Customer Details
          </h1>
          <div className="flex gap-4 items-start px-8 mt-2">
            <TextField
              error={!!errors.customerName}
              helperText={errors.customerName}
              margin="normal"
              required
              fullWidth
              id="customerName"
              label="Customer Name"
              name="customerName"
              autoComplete="off"
              autoFocus
              value={formData.customerName}
              onChange={handleChange}
              placeholder="max 100 characters is allowed"
              inputProps={{ maxLength: 100 }}
              sx={{ width: "250px" }}
              inputRef={customerNameRef}
            />
            <TextField
              error={!!errors.customerPhone}
              helperText={errors.customerPhone}
              type="number"
              margin="normal"
              required
              fullWidth
              id="customerPhone"
              label="Contact"
              name="customerPhone"
              autoComplete="off"
              value={formData.customerPhone}
              onChange={(e) => {
                const input = e.target.value;
                if (/^\d{0,10}$/.test(input)) {
                  handleChange(e);
                }
              }}
              placeholder="max 10 digit is allowed"
              inputProps={{ maxLength: 10 }}
              sx={{ width: "250px" }}
              inputRef={customerPhoneRef}
            />
            <TextField
              type="email"
              margin="normal"
              fullWidth
              id="customerEmail"
              label="Email"
              name="customerEmail"
              autoComplete="off"
              value={formData.customerEmail}
              onChange={handleChange}
              placeholder="max 100 characters is allowed"
              inputProps={{ maxLength: 100 }}
              sx={{ width: "250px" }}
            />
            <TextField
              error={!!errors.customerAddress}
              helperText={errors.customerAddress}
              type="address"
              margin="normal"
              fullWidth
              id="customerAddress"
              label="Address"
              name="customerAddress"
              autoComplete="off"
              value={formData.customerAddress}
              onChange={handleChange}
              placeholder="max 100 characters is allowed"
              inputProps={{ maxLength: 100 }}
              sx={{ width: "250px" }}
              multiline
              inputRef={customerAddressRef}
            />
          </div>

          <h1 className="mt-4 px-10 font-poppins font-bold text-primaryColor">
            Bill Details
          </h1>

          <div className="mt-4 px-10 flex items-start gap-4">
            <div className="">
              <div
                ref={paymentMethodRef}
                className={`${
                  errors.paymentMethod
                    ? "border-2 border-red-500 rounded-lg"
                    : ""
                }`}
              >
                <FilterSelect
                  options={paymentOptions}
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                  placeholder={"Payment method"}
                />
              </div>
              {errors.paymentMethod && (
                <p className="text-sm text-red-500">Required</p>
              )}
            </div>
            <div className="">
              <div
                ref={serviceRef}
                className={`${
                  errors.service ? "border-2 border-red-500 rounded-lg" : ""
                }`}
              >
                <FilterSelect
                  options={services}
                  value={service}
                  onChange={handleServiceChange}
                  placeholder={"Choose Service"}
                />
              </div>
              {errors.service && (
                <p className="text-sm text-red-500">Required</p>
              )}
            </div>
            {serviceName && serviceName === "Fine Dining" && (
              <div className="flex gap-2">
                <div className="">
                  <div
                    ref={tableNumberRef}
                    className={`${
                      errors.tableNumber
                        ? "border-2 border-red-500 rounded-lg"
                        : ""
                    }`}
                  >
                    <FilterSelect
                      options={tables}
                      value={tableNumber}
                      onChange={handleTableChange}
                      placeholder={"Choose Table"}
                    />
                  </div>
                  {errors.tableNumber && (
                    <p className="text-sm text-red-500">Required</p>
                  )}
                </div>
                <div className="">
                  <div
                    ref={waiterRef}
                    className={`${
                      errors.waiter ? "border-2 border-red-500 rounded-lg" : ""
                    }`}
                  >
                    <FilterSelect
                      options={waiters}
                      value={waiter}
                      onChange={handleWaiterChange}
                      placeholder={"Choose Waiter"}
                    />
                  </div>
                  {errors.waiter && (
                    <p className="text-sm text-red-500">Required</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <h1 className="mt-4 px-10 font-poppins font-bold text-primaryColor">
            Product Details
          </h1>
          {products?.map((product, index) => (
            <div
              key={index}
              className="my-2 px-10 py-4 text-sm font-poppins flex gap-4"
              //   tabIndex={index === 0 ? 0 : -1}
              //   ref={index === 0 ? firstProductRef : null}
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

                <div className="flex items-center gap-2">
                  <IconButton
                    color="primary"
                    onClick={() => handleQuantityChange(product, "decrease")}
                  >
                    <Remove />
                  </IconButton>
                  <span>{product.quantity}</span>
                  <IconButton
                    color="primary"
                    onClick={() => handleQuantityChange(product, "increase")}
                  >
                    <Add />
                  </IconButton>
                </div>
                <button
                  className="flex items-center gap-2 border-2 border-red-500 rounded-full px-4 text-red-500 hover:bg-red-500 hover:text-white ease-in-out duration-500"
                  onClick={() => handleCartChange(product)}
                >
                  <FaCartArrowDown size={18} /> Remove from cart
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-end w-full ">
            <div className="w-1/2 flex justify-end items-center">
              <div className="w-full flex flex-col justify-center px-10 items-center">
                <div className="px-10 h-10 border-2 border-primaryColor w-full flex justify-end items-center font-poppins gap-2">
                  <p className="font-bold">Sub-Total: </p> <p> ₹ {price}</p>
                </div>
                <div className="px-8 h-16 border-b-2 border-l-2 border-r-2 border-primaryColor w-full flex flex-col justify-end items-center font-poppins">
                  <div className="flex justify-end w-full items-center h-1/2 gap-2">
                    <p className="font-bold">CGST ({cgst}%):</p>
                    <p> ₹ {cgstPrice}</p>
                  </div>
                  <div className="flex justify-end w-full items-center h-1/2 gap-2">
                    <p className="font-bold">SGST ({sgst}%):</p>
                    <p> ₹ {sgstPrice}</p>
                  </div>
                </div>
                <div className="flex justify-end w-full items-center h-full border-b-2 border-primaryColor py-2 gap-2 px-8  border-l-2 border-r-2">
                  <p className="font-bold">Round off:</p>
                  <p>
                    {" "}
                    {isRoundPositive ? "+" : "-"}₹ {roundOff}
                  </p>
                </div>
                <div className="px-8 h-10 border-b-2 border-primaryColor w-full flex justify-end items-center font-poppins gap-2  border-l-2 border-r-2">
                  <p className="font-bold text-primaryColor">
                    Total: ₹ {totalPrice}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="my-8 w-full flex justify-end items-center px-8">
            <button
              className={`gap-2 flex items-center border-2 border-primaryColor 
                        px-2 py-1 rounded-full text-sm font-bold font-poppins ${
                          loading
                            ? "text-pink-400"
                            : "text-primaryColor hover:bg-primaryColor hover:text-white ease-in-out duration-500"
                        } `}
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Generating Bill" : "Proceed to Checkout"}
              {loading ? <LoadingGif /> : <FaArrowRight />}
            </button>
          </div>
        </div>
      ) : (
        <p className="flex justify-center font-poppins font-bold text-lg py-10 text-primaryColor ">
          Cart is empty.
        </p>
      )}
    </div>
  );
};

export default CartItems;
