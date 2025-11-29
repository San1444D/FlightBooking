import { useEffect, useLayoutEffect } from "react";
import api from "../axiosHelper";
import { useSelector, useDispatch } from "react-redux";
import {
  updateToken,
  setLoginStatus,
  hamdleLogout,
} from "../slicers/AuthSlice";
import { Outlet, useNavigate } from "react-router-dom";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token]);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.response.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
    });
    return () => {
      api.interceptors.response.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response.status === 403 &&
          error.response.data.message === "Unauthorized" &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const response = await api.get("/api/auth/refresh-token");
            const newToken = response.data.token;
            dispatch(updateToken(newToken));
            dispatch(setLoginStatus(true));
            // setToken(newToken);
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (err) {
            dispatch(hamdleLogout());
            // setToken(null);
            navigate("/login");
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  });

  return <>{children}</>;
};

export default AuthProvider;
