import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import {
  GET_USER_BY_TOKEN,
  GET_USER_BY_TOKEN_METHOD,
} from "../apiCalls/endpoints";
import { CRUDAPI } from "../apiCalls/crud-api";
import { login } from "../store/authSlice";
import { hideLoader, showLoader } from "../components/Loader";

const useReload = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isDataFetched, setIsDataFetched] = useState(false);
  const authData = useSelector((state) => state.auth);

  useEffect(() => {
    const onReload = async () => {
      showLoader();
      const token = localStorage.getItem("Authorization");
      if (token) {
        try {
          const response = await CRUDAPI(
            GET_USER_BY_TOKEN,
            GET_USER_BY_TOKEN_METHOD
          );

          if (response.status === "SUCCESS") {
            const { user, tenant, token } = response.data;

            const userData = {
              username: user.username,
              userId: user.userId,
              role: user.role,
              tenantId: tenant.tenantId,
              tenantName: tenant.tenantName,
              tenantLogo: tenant.tenantLogo,
              token: token,
            };
            dispatch(login(userData));
            setIsDataFetched(true);
            hideLoader();
          } else {
            console.log("Error restoring redux");
            setIsDataFetched(true);
            hideLoader();
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setIsDataFetched(true);
          hideLoader();
        }
      } else {
        hideLoader();
        navigate("/");
      }
    };

    if (!authData.token) {
      onReload();
    }
  }, [dispatch, navigate]);
  return { isDataFetched };
};

export default useReload;
