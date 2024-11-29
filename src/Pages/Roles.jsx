import React, { useEffect, useState } from "react";
import Layout from "../Layout/index.Jsx";
import { useNavigate } from "react-router-dom";
import { DROPDOWN, DROPDOWN_METHOD } from "../apiCalls/endpoints";
import { hideLoader, showLoader } from "../components/Loader";
import toast from "react-hot-toast";
import { CRUDAPI } from "../apiCalls/crud-api";

const Roles = () => {
  const [roles, setRoles] = useState();
  const [loading, setLoading] = useState();
  const navigate = useNavigate();

  const getRoles = async () => {
    setLoading(true);
    try {
      const response = await CRUDAPI(
        DROPDOWN,
        DROPDOWN_METHOD,
        { dropdownCode: "ROLE_LIST" },
        navigate
      );
      if (response.status === "SUCCESS") {
        setRoles(response.data);
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
    getRoles();
  }, []);

  return (
    <Layout title="Roles">
      <div className="mx-10 my-6 h-auto bg-white rounded-lg">
        <div className="px-4 pb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-sm text-zinc-600 bg-slate-100 font-Poppins">
                <th className="p-4 border-b">S.No.</th>
                <th className="p-4 border-b">Role</th>
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
                : roles?.map((role, index) => (
                    <tr
                      key={index}
                      className={`font-Poppins text-zinc-600 text-sm`}
                    >
                      <td className="p-4 border-b">{index + 1}</td>
                      <td className="p-4 border-b">{role.role}</td>
                      <td className="p-4 border-b">{role.status}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Roles;
