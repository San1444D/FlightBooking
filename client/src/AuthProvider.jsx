import { useEffect, useLayoutEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  updateToken,
  setLoginStatus,
  hamdleLogout,
} from "../slicers/AuthSlice";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }) => {
  // const [token, setToken] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get("/api/auth/refresh-token");
        dispatch(updateToken(response.data.token));
        dispatch(setLoginStatus(true));

        // setToken(response.data.token);
      } catch {
        dispatch(updateToken(null));
        dispatch(setLoginStatus(false));
        // setToken(null);
      }
    };

    fetchToken();
  }, []);
  useEffect(() => {

    if (!token) {
      navigate('/')
    }
  }, [token]);

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
            dispatch(updateToken(newToken));
            dispatch(setLoginStatus(true));
            // setToken(newToken);
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch {
            dispatch(hamdleLogout());
            // setToken(null);
            navigate("/login");
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
