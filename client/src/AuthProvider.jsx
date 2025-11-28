import { useState, useEffect, useLayoutEffect } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState();
//   const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get("/api/auth/token");
        setToken(response.data.token);
      } catch {
        setToken(null);
      }
    };

    fetchToken();
  }, []);

  useLayoutEffect(() => {
    const authInterceptor = axios.interceptors.response.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
    });
    return () => {
      axios.interceptors.response.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = axios.interceptors.response.use(
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
            const response = await axios.get("/api/auth/refresh-token");
            const newToken = response.data.token;
            setToken(newToken);
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch {
            setToken(null);
            // navigate("/login");
            // return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(refreshInterceptor);
    };
  });

  return <>{children}</>;
};

export default AuthProvider;
