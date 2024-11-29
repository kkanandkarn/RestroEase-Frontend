import React, { useEffect, useState } from "react";
import Layout from "../Layout/index.Jsx";
import { useNavigate } from "react-router-dom";
import { hideLoader, showLoader } from "../components/Loader";
import {
  DELETE_TABLE,
  DELETE_TABLE_METHOD,
  VIEW_TABLE,
  VIEW_TABLE_METHOD,
} from "../apiCalls/endpoints";
import toast from "react-hot-toast";
import { CiEdit, CiSearch } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { CRUDAPI } from "../apiCalls/crud-api";
import AddTableModal from "../components/Models/AddTableModel";
import EditTableModal from "../components/Models/EditTableModal";
import { Confirm } from "notiflix";
import { FaPlus } from "react-icons/fa";

const Tables = () => {
  const [addTableModal, setAddTableModal] = useState(false);
  const [editTableModal, setEditTableModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState();
  const [search, setSearch] = useState("");
  const [table, setTable] = useState(null);
  const navigate = useNavigate();
  const getTables = async () => {
    setLoading(true);
    try {
      const response = await CRUDAPI(
        VIEW_TABLE,
        VIEW_TABLE_METHOD,
        null,
        navigate
      );
      if (response.status === "SUCCESS") {
        setTables(response.data.tables);
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
    getTables();
  }, []);

  const onClose = (isUpdate = false, tables = []) => {
    setTable(null);
    setAddTableModal(false);
    setEditTableModal(false);
    if (isUpdate) {
      setTables(tables);
    }
  };

  useEffect(() => {
    if (search.trim() !== "") {
      const filteredTables = tables?.filter((table) =>
        table.tableNumber.toLowerCase().includes(search.toLowerCase())
      );
      setTables(filteredTables);
    } else {
      getTables();
    }
  }, [search]);

  const deleteTable = async (deleteId) => {
    showLoader();
    try {
      const data = {
        id: deleteId,
      };
      const response = await CRUDAPI(
        DELETE_TABLE,
        DELETE_TABLE_METHOD,
        data,
        navigate
      );
      if (response.status === "SUCCESS") {
        setTables(response.data.tables);
        hideLoader();
        toast.success("Table deleted successfully.");
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
      "Confirm Delete ",
      "Are you sure want to delete this table ?",
      "Yes",
      "No",
      async () => {
        await deleteTable(deleteId);
      },
      () => {},
      {}
    );
  };
  return (
    <Layout title="Tables">
      <div className="flex justify-between items-center mx-14 pt-4 pb-1">
        {loading ? (
          <div className="bg-slate-400 animate-pulse w-10 h-10 rounded-lg"></div>
        ) : (
          <button
            className="text-primaryColor border-2 border-primaryColor hover:text-white hover:bg-primaryColor ease-in-out duration-500
              w-8 h-8 rounded flex items-center justify-center "
            onClick={() => setAddTableModal(true)}
          >
            <FaPlus size={15} />
          </button>
        )}
        <div className="flex items-center relative">
          {loading ? (
            <div className="p-4 border-b bg-slate-400 rounded-lg w-40 animate-pulse"></div>
          ) : (
            <>
              <input
                type="text"
                className="h-10 w-40 border-2 border-gray-400 outline-none pl-2 pr-8 rounded-md font-Poppins text-base"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <CiSearch className="absolute right-3 text-slate-400" size={20} />
            </>
          )}
        </div>
      </div>
      <div className="mx-10 my-6 h-auto bg-white rounded-lg">
        <div className="px-4 pb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-sm text-zinc-600 bg-slate-100 font-Poppins">
                <th className="p-4 border-b">S.No.</th>
                <th className="p-4 border-b">Table Number</th>
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
                    </tr>
                  ))
                : tables?.map((table, index) => (
                    <tr
                      key={index}
                      className={`font-Poppins text-zinc-600 text-sm`}
                    >
                      <td className="p-4 border-b">{index + 1}</td>
                      <td className="p-4 border-b">{table.tableNumber}</td>
                      <td className="p-4 border-b">{table.status}</td>

                      <td className="p-4 border-b text-left flex justify-left gap-2">
                        <button
                          className="bg-primaryColor text-white rounded-full hover:underline flex justify-center items-center p-1"
                          onClick={() => {
                            setTable(table);
                            setEditTableModal(true);
                          }}
                        >
                          <CiEdit size={15} />
                        </button>

                        <button
                          className="bg-primaryColor text-white rounded-full hover:underline flex justify-center items-center p-1"
                          onClick={() => {
                            handleDelete(table._id);
                          }}
                        >
                          <MdDeleteOutline size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
      {addTableModal && <AddTableModal tables={tables} onClose={onClose} />}
      {editTableModal && (
        <EditTableModal table={table} tables={tables} onClose={onClose} />
      )}
    </Layout>
  );
};

export default Tables;
