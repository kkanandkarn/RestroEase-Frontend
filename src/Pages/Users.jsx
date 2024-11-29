import React, { useEffect, useState } from "react";
import Layout from "../Layout/index.Jsx";
import { useNavigate } from "react-router-dom";
import {
  DELETE_USER,
  DELETE_USER_METHOD,
  DROPDOWN,
  DROPDOWN_METHOD,
  VIEW_USER,
  VIEW_USER_BY_ID_METHOD,
  VIEW_USER_METHOD,
} from "../apiCalls/endpoints";
import { CRUDAPI } from "../apiCalls/crud-api";
import { CiEdit, CiSearch } from "react-icons/ci";
import { IoIosArrowBack, IoIosArrowForward, IoMdEye } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { hideLoader, showLoader } from "../components/Loader";
import ViewUserModal from "../components/Models/ViewUserModal";
import AddUserModal from "../components/Models/AddUserModal";
import EditUserModal from "../components/Models/EditUserModal";
import { Confirm } from "notiflix";
import FilterSelect from "../components/Mui/FilterSelect";
import { FaPlus } from "react-icons/fa6";

const Users = () => {
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  const [roles, setRoles] = useState();
  const [search, setSearch] = useState("");
  const [viewUserModal, setViewUserModal] = useState(false);
  const [addUserModal, setAddUserModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);
  const [id, setId] = useState(null);
  const [user, setUser] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLastPage, setIsLastPage] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const navigate = useNavigate();
  const [filter, setFilter] = useState([{ role: "" }, { status: "" }]);
  const [statusOptions, setStatusOptions] = useState([
    { value: "Active", label: "Active" },
    { value: "Hold", label: "Hold" },
    { value: "Suspended", label: "Suspended" },
  ]);

  const getRole = async () => {
    setRoleLoading(true);
    try {
      const response = await CRUDAPI(
        DROPDOWN,
        DROPDOWN_METHOD,
        {
          dropdownCode: "ROLE_LIST",
        },
        navigate
      );
      if (response.status === "SUCCESS") {
        const transformedData = response.data.map((item) => ({
          value: item._id,
          label: item.role,
        }));
        setRoles(transformedData);
        setRoleLoading(false);
      } else {
        toast.error(response.message);
        setRoleLoading(false);
      }
    } catch (error) {
      setRoleLoading(false);
      console.log(error);
      toast.error("Internal server error");
      onClose(false, []);
    }
  };

  const getUsers = async (page) => {
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
        VIEW_USER,
        VIEW_USER_METHOD,
        data,
        navigate
      );
      if (response.status === "SUCCESS") {
        setUsers(response.data.users);
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

  useEffect(() => {
    getRole();
  }, []);

  const onClose = (isUpdate = false, users = []) => {
    setId(null);
    setViewUserModal(false);
    setAddUserModal(false);
    setEditUserModal(false);
    setUser(null);
    if (isUpdate) {
      setUsers(users);
    }
  };

  const deleteUser = async (deleteId) => {
    showLoader();
    try {
      const data = {
        id: deleteId,
      };
      const response = await CRUDAPI(
        DELETE_USER,
        DELETE_USER_METHOD,
        data,
        navigate
      );
      if (response.status === "SUCCESS") {
        setUsers(response.data.users);
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
      "Are you sure want to delete this user ?",
      "Yes",
      "No",
      async () => {
        await deleteUser(deleteId);
      },
      () => {},
      {}
    );
  };

  useEffect(() => {
    getUsers(pageNo);
  }, [pageNo]);
  useEffect(() => {
    setPageNo(0);
    getUsers(0);
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

  const handleRoleChange = (newValue) => {
    setFilter((prevFilter) => {
      const newFilter = [...prevFilter];
      newFilter[0] = { role: newValue };
      return newFilter;
    });
  };
  const handleStatusChange = (newValue) => {
    setFilter((prevFilter) => {
      const newFilter = [...prevFilter];
      newFilter[1] = { status: newValue };
      return newFilter;
    });
  };

  return (
    <Layout title="Users">
      <div className="flex justify-between items-center mx-14 pt-4 pb-1">
        {loading || roleLoading ? (
          <div className="bg-slate-400 animate-pulse w-8 h-8 rounded-lg"></div>
        ) : (
         
          <button
            className="text-primaryColor border-2 border-primaryColor hover:text-white hover:bg-primaryColor ease-in-out duration-500
          w-8 h-8 rounded flex items-center justify-center "
            onClick={() => setAddUserModal(true)}
          >
            <FaPlus size={15} />
          </button>
        )}

        <div className="flex items-center relative gap-2">
          {roleLoading || loading ? (
            <div className="p-4 border-b bg-slate-400 rounded-lg w-32 animate-pulse"></div>
          ) : (
            <FilterSelect
              options={roles}
              value={filter[0].role}
              onChange={handleRoleChange}
              placeholder={"All Roles"}
            />
          )}

          {roleLoading || loading ? (
            <div className="p-4 border-b bg-slate-400 rounded-lg w-32 animate-pulse"></div>
          ) : (
            <FilterSelect
              options={statusOptions}
              value={filter[1].status}
              onChange={handleStatusChange}
              placeholder={"All Status"}
            />
          )}

          {roleLoading || loading ? (
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
          {!roleLoading && !loading && (
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
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Username</th>
                <th className="p-4 border-b">Role</th>
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
                    </tr>
                  ))
                : users?.map((user, index) => (
                    <tr
                      key={index}
                      className={`font-Poppins text-zinc-600 text-sm`}
                    >
                      <td className="p-4 border-b">{index + 1}</td>
                      <td className="p-4 border-b">{user.name}</td>
                      <td className="p-4 border-b">{user.username}</td>
                      <td className="p-4 border-b">{user.role.role}</td>
                      <td className="p-4 border-b">{user.status}</td>

                      <td className="p-4 border-b text-left flex justify-left gap-2">
                        <button
                          className="bg-primaryColor text-white rounded-full hover:underline flex justify-center items-center p-1"
                          onClick={() => {
                            setId(user._id);
                            setUser(user);
                            setViewUserModal(true);
                          }}
                        >
                          <IoMdEye size={15} />
                        </button>

                        {roleLoading ? (
                          <div className="bg-slate-400 w-6 h-6 animate-pulse rounded-full flex justify-center items-center"></div>
                        ) : (
                          <button
                            className="bg-primaryColor text-white rounded-full hover:underline flex justify-center items-center p-1"
                            onClick={() => {
                              setId(user._id);
                              setUser(user);
                              setEditUserModal(true);
                            }}
                          >
                            <CiEdit size={15} />
                          </button>
                        )}

                        <button
                          className="bg-primaryColor text-white rounded-full hover:underline flex justify-center items-center p-1"
                          onClick={() => {
                            handleDelete(user._id);
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
            {loading || roleLoading ? (
              <div className="bg-slate-400 animate-pulse w-28 h-10 rounded-lg"></div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
      {viewUserModal && <ViewUserModal user={user} onClose={onClose} />}
      {addUserModal && <AddUserModal roles={roles} onClose={onClose} />}
      {editUserModal && (
        <EditUserModal user={user} roles={roles} onClose={onClose} />
      )}
    </Layout>
  );
};

export default Users;
