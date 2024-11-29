import React, { useEffect, useState } from "react";
import Layout from "../Layout/index.Jsx";
import { useNavigate } from "react-router-dom";
import { hideLoader, showLoader } from "../components/Loader";
import { CRUDAPI } from "../apiCalls/crud-api";
import { DROPDOWN, DROPDOWN_METHOD } from "../apiCalls/endpoints";
import toast from "react-hot-toast";

const Services = () => {
  const [services, setServices] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getServices = async () => {
    setLoading(true);
    try {
      const response = await CRUDAPI(
        DROPDOWN,
        DROPDOWN_METHOD,
        { dropdownCode: "SERVICE_LIST" },
        navigate
      );
      if (response.status === "SUCCESS") {
        setServices(response.data);
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

  useEffect(() => {
    getServices();
  }, []);

  return (
    <Layout title="Services">
      <div className="mx-10 my-6 h-auto bg-white rounded-lg">
        <div className="px-4 pb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-sm text-zinc-600 bg-slate-100 font-Poppins">
                <th className="p-4 border-b">S.No.</th>
                <th className="p-4 border-b">Service</th>
                <th className="p-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 10 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="p-4 border-b bg-slate-400 rounded-full"></td>
                      <td className="p-4 border-b bg-slate-400 rounded-full"></td>
                      <td className="p-4 border-b bg-slate-400 rounded-full"></td>
                    </tr>
                  ))
                : services?.map((service, index) => (
                    <tr
                      key={index}
                      className={`font-Poppins text-zinc-600 text-sm`}
                    >
                      <td className="p-4 border-b">{index + 1}</td>
                      <td className="p-4 border-b">{service?.service}</td>
                      <td className="p-4 border-b">{service?.status}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
