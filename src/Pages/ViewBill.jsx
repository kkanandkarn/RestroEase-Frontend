import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../Layout/index.Jsx";
import { TextField } from "@mui/material";
import veg from "../assets/veg.png";
import nonVeg from "../assets/non-veg.png";
import { TiArrowBackOutline } from "react-icons/ti";

const ViewBill = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bill = location.state;
  useEffect(() => {
    if (!bill) {
      navigate("/billing");
    }
  }, []);

  return (
    <Layout title="Billing">
      <div className="flex justify-between my-4 mx-10 items-center ">
        <button
          className="bg-primaryColor text-white rounded-full"
          onClick={() => navigate("/billing")}
        >
          <TiArrowBackOutline size={25} />
        </button>
        <p className="font-poppins text-sm border-2 border-primaryColor px-2 rounded-full text-primaryColor font-bold">
          {" "}
          Bill ID: {bill._id}
        </p>
      </div>

      <h1 className="px-10 font-poppins font-bold text-primaryColor">
        Customer Details
      </h1>
      <div className="flex gap-4 items-start px-10 mt-2">
        <TextField
          margin="normal"
          required
          fullWidth
          id="customerName"
          label="Customer Name"
          name="customerName"
          autoComplete="off"
          value={bill.customerName}
          placeholder="Customer Name"
          sx={{ width: "250px" }}
        />
        <TextField
          type="number"
          margin="normal"
          fullWidth
          id="customerPhone"
          label="Contact"
          name="customerPhone"
          autoComplete="off"
          value={bill.customerContact}
          placeholder="Customer Contact"
          sx={{ width: "250px" }}
        />
        <TextField
          type="email"
          margin="normal"
          fullWidth
          id="customerEmail"
          label="Email"
          name="customerEmail"
          autoComplete="off"
          value={bill.customerEmail || "N/A"}
          placeholder="Customer Email"
          sx={{ width: "250px" }}
        />
        <TextField
          type="address"
          margin="normal"
          fullWidth
          id="customerAddress"
          label="Address"
          name="customerAddress"
          autoComplete="off"
          value={bill.customerAddress}
          placeholder="Customer Address"
          sx={{ width: "250px" }}
          multiline
        />
      </div>

      <h1 className="mt-4 px-10 font-poppins font-bold text-primaryColor">
        Bill Details
      </h1>

      <div className="mt-4 px-10 flex items-start gap-4">
        <TextField
          type="text"
          margin="normal"
          fullWidth
          id="paymentMethod"
          label="Payment Method"
          name="paymentMethod"
          autoComplete="off"
          value={bill.paymentMethod}
          placeholder="Payment Method"
          sx={{ width: "250px" }}
        />

        <TextField
          type="text"
          margin="normal"
          fullWidth
          id="service"
          label="Service"
          name="service"
          autoComplete="off"
          value={bill.service}
          placeholder="Service"
          sx={{ width: "250px" }}
        />

        {bill.service && bill.service === "Fine Dining" && (
          <div className="flex gap-2">
            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="tableNumber"
              label="Table Number"
              name="tableNumber"
              autoComplete="off"
              value={bill.tableNumber}
              placeholder="Table Number"
              sx={{ width: "250px" }}
            />

            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="waiter"
              label="Waiter"
              name="waiter"
              autoComplete="off"
              value={bill.waiter}
              placeholder="Waiter"
              sx={{ width: "250px" }}
            />
          </div>
        )}
      </div>
      <h1 className="mt-4 px-10 font-poppins font-bold text-primaryColor">
        Product Details
      </h1>
      {bill.products?.map((product, index) => (
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
              Qty: {product.quantity}
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-end w-full mb-4">
        <div className="w-1/2 flex justify-end items-center">
          <div className="w-full flex flex-col justify-center px-10 items-center">
            <div className="px-10 h-10 border-2 border-primaryColor w-full flex justify-end items-center font-poppins gap-2">
              <p className="font-bold">Sub-Total: </p> <p> ₹ {bill.subTotal}</p>
            </div>
            <div className="px-8 h-16 border-b-2 border-l-2 border-r-2 border-primaryColor w-full flex flex-col justify-end items-center font-poppins">
              <div className="flex justify-end w-full items-center h-1/2 gap-2">
                <p className="font-bold">CGST ({bill.cgstPercentage}%):</p>
                <p> ₹ {bill.cgstAmount}</p>
              </div>
              <div className="flex justify-end w-full items-center h-1/2 gap-2">
                <p className="font-bold">SGST ({bill.sgstPercentage}%):</p>
                <p> ₹ {bill.sgstAmount}</p>
              </div>
            </div>
            <div className="flex justify-end w-full items-center h-full border-b-2 border-primaryColor py-2 gap-2 px-8  border-l-2 border-r-2">
              <p className="font-bold">Round off:</p>
              <p>
                {bill.isRoundPositive ? "+" : "-"}₹ {bill.roundOff}
              </p>
            </div>
            <div className="px-8 h-10 border-b-2 border-primaryColor w-full flex justify-end items-center font-poppins gap-2  border-l-2 border-r-2">
              <p className="font-bold text-primaryColor">
                Total: ₹ {bill.totalAmount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewBill;
