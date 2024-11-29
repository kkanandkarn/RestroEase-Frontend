import React, { useEffect, useState } from "react";
import Layout from "../Layout/index.Jsx";
import { CRUDAPI } from "../apiCalls/crud-api";
import {
  DELETE_CATEGORY,
  DELETE_CATEGORY_METHOD,
  VIEW_CATEGORY,
  VIEW_CATEGORY_METHOD,
} from "../apiCalls/endpoints";
import { CiEdit, CiSearch } from "react-icons/ci";
import { IoMdEye } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { hideLoader, showLoader } from "../components/Loader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AddCategoryModal from "../components/Models/AddCategoryModal";
import EditCategoryModal from "../components/Models/EditCategoryModal";
import { Confirm } from "notiflix";
import { FaPlus } from "react-icons/fa";

const Category = () => {
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editCategoryModal, setEditCategoryModal] = useState(false);
  const [categories, setCategories] = useState();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(null);
  const navigate = useNavigate();
  const getCategories = async () => {
    setLoading(true);
    try {
      const response = await CRUDAPI(
        VIEW_CATEGORY,
        VIEW_CATEGORY_METHOD,
        null,
        navigate
      );
      if (response.status === "SUCCESS") {
        setCategories(response.data.categories);
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
    getCategories();
  }, []);

  const onClose = (isUpdate = false, categories = []) => {
    setCategory(null);
    setAddCategoryModal(false);
    setEditCategoryModal(false);
    if (isUpdate) {
      setCategories(categories);
    }
  };

  useEffect(() => {
    if (search.trim() !== "") {
      const filteredCategories = categories?.filter((category) =>
        category.category.toLowerCase().includes(search.toLowerCase())
      );
      setCategories(filteredCategories);
    } else {
      getCategories();
    }
  }, [search]);

  const deleteCategory = async (deleteId) => {
    showLoader();
    try {
      const data = {
        id: deleteId,
      };
      const response = await CRUDAPI(
        DELETE_CATEGORY,
        DELETE_CATEGORY_METHOD,
        data,
        navigate
      );
      if (response.status === "SUCCESS") {
        setCategories(response.data.categories);
        hideLoader();
        toast.success("Category deleted successfully.");
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
      "Are you sure want to delete ?",
      "Deleting category will delete all the products.",
      "Yes",
      "No",
      async () => {
        await deleteCategory(deleteId);
      },
      () => {},
      {}
    );
  };
  return (
    <Layout title="Category">
      <div className="flex justify-between items-center mx-14 pt-4 pb-1">
        {loading ? (
          <div className="bg-slate-400 animate-pulse w-10 h-10 rounded-lg"></div>
        ) : (
          <button
            className={`text-primaryColor ${
              addCategoryModal
                ? "text-white bg-primaryColor"
                : "border-2 border-primaryColor hover:text-white hover:bg-primaryColor ease-in-out duration-500"
            }
           w-8 h-8 rounded flex items-center justify-center`}
            onClick={() => setAddCategoryModal(true)}
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
                <th className="p-4 border-b">Category</th>
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
                : categories?.map((category, index) => (
                    <tr
                      key={index}
                      className={`font-Poppins text-zinc-600 text-sm`}
                    >
                      <td className="p-4 border-b">{index + 1}</td>
                      <td className="p-4 border-b">{category.category}</td>
                      <td className="p-4 border-b">{category.status}</td>

                      <td className="p-4 border-b text-left flex justify-left gap-2">
                        <button
                          className="bg-primaryColor text-white rounded-full hover:underline flex justify-center items-center p-1"
                          onClick={() => {
                            setCategory(category);
                            setEditCategoryModal(true);
                          }}
                        >
                          <CiEdit size={15} />
                        </button>

                        <button
                          className="bg-primaryColor text-white rounded-full hover:underline flex justify-center items-center p-1"
                          onClick={() => {
                            handleDelete(category._id);
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
      {addCategoryModal && <AddCategoryModal onClose={onClose} />}
      {editCategoryModal && (
        <EditCategoryModal category={category} onClose={onClose} />
      )}
    </Layout>
  );
};

export default Category;
