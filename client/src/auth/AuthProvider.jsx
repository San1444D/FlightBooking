import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import api from "../axiosHelper";
import {
  updateToken,
  setLoginStatus,
  handleLogout,
} from "../slicers/AuthSlice";

const AuthProvider = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const initialized = useSelector((state) => state.auth.initialized);
  const logoutInProgressRef = useRef(false);

  // Avoid unconditional navigation loops — only navigate when user is on protected path
  useEffect(() => {
    const isAtLoginOrRoot = ["/", "/login", "/signup"].includes(
      location.pathname
    );
    if (!token && !isAtLoginOrRoot) {
      // Protect against repeated navigation calls
      if (!logoutInProgressRef.current) {
        logoutInProgressRef.current = true;
        if (!localStorage.getItem("userType"))
          navigate("/login", { replace: true });
      }
    } else {
      // reset flag when token exists or we're at allowed paths
      logoutInProgressRef.current = false;
    }
  }, [token, initialized, location.pathname, navigate]);

  // Attach request interceptor: MUST return config
  useEffect(() => {
    const authInterceptor = api.interceptors.request.use(
      (config) => {
        if (!config) config = {};
        if (!config.headers) config.headers = {};
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config; // critical: return config
      },
      (error) => Promise.reject(error)
    );

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  // Attach response interceptor: refresh token once on 401/403 and prevent repeated logout navigation
  useEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error?.config;
        if (!originalRequest) return Promise.reject(error);

        const status = error?.response?.status;
        if ((status === 401 || status === 403) && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const response = await api.get("/auth/refresh-token");
            const newToken =
              response?.data?.accessToken || response?.data?.token;
            if (!newToken) throw new Error("No token returned by refresh");

            dispatch(updateToken(newToken));
            dispatch(setLoginStatus(true));
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (err) {
            if (!logoutInProgressRef.current) {
              logoutInProgressRef.current = true;
              dispatch(handleLogout && handleLogout());
              navigate("/login", { replace: true });
            }
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, [dispatch, navigate]);

  return <Outlet />;
};

export default AuthProvider;

// import { useEffect, useLayoutEffect } from "react";
// import api from "../axiosHelper";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   updateToken,
//   setLoginStatus,
//   handleLogout,
// } from "../slicers/AuthSlice";
// import { Outlet, useNavigate } from "react-router-dom";

// const AuthProvider = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const token = useSelector((state) => state.auth.token);

//   useEffect(() => {
//     if (!token) {
//       navigate("/");
//     }
//   }, [token]);

//   useLayoutEffect(() => {
//     const authInterceptor = api.interceptors.request.use(
//       (config) => {
//         // Ensure config & headers exist and return it
//         if (!config) config = {};
//         if (!config.headers) config.headers = {};
//         if (token) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config; // <<----- Must return the config!
//       },
//       (error) => Promise.reject(error)
//     );
//     return () => {
//       api.interceptors.request.eject(authInterceptor);
//     };
//     // const authInterceptor = api.interceptors.request.use((config) => {
//     //   config.headers.Authorization =
//     //     !config._retry && token
//     //       ? `Bearer ${token}`
//     //       : config.headers.Authorization;
//     // });
//     // return () => {
//     //   api.interceptors.request.eject(authInterceptor);
//     // };
//   }, [token]);

//   useLayoutEffect(() => {
//     const refreshInterceptor = api.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const originalRequest = error?.config;
//         if (!originalRequest) {
//           // no original request -> nothing to retry
//           return Promise.reject(error);
//         }

//         const status = error?.response?.status;
//         if ((status === 401 || status === 403) && !originalRequest._retry) {
//           originalRequest._retry = true;
//           try {
//             // use relative path (axios baseURL is /api)
//             const response = await api.get("/auth/refresh-token");
//             const newToken =
//               response?.data?.accessToken || response?.data?.token;
//             if (!newToken) throw new Error("No token returned by refresh");

//             dispatch(updateToken(newToken));
//             dispatch(setLoginStatus(true));
//             originalRequest.headers = originalRequest.headers || {};
//             originalRequest.headers.Authorization = `Bearer ${newToken}`;
//             return api(originalRequest);
//           } catch (err) {
//             dispatch(handleLogout && handleLogout());
//             navigate("/login");
//             return Promise.reject(err);
//           }
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       api.interceptors.response.eject(refreshInterceptor);
//     };
//     // const refreshInterceptor = api.interceptors.response.use(
//     //   (response) => response,
//     //   async (error) => {
//     //     console.log("authpro error res", error);
//     //     const originalRequest = error.config;
//     //     if (
//     //       error.response?.status === 403 &&
//     //       error.response?.data.message === "Unauthorized" &&
//     //       !originalRequest._retry
//     //     ) {
//     //       originalRequest._retry = true;
//     //       try {
//     //         const response = await api.get("/auth/refresh-token");
//     //         const newToken = response.data.token;
//     //         dispatch(updateToken(newToken));
//     //         dispatch(setLoginStatus(true));
//     //         // setToken(newToken);
//     //         originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//     //         return api(originalRequest);
//     //       } catch (err) {
//     //         dispatch(handleLogout());
//     //         // setToken(null);
//     //         navigate("/login");
//     //         return Promise.reject(err);
//     //       }
//     //     }
//     //     return Promise.reject(error);
//     //   }
//     // );

//     // return () => {
//     //   api.interceptors.response.eject(refreshInterceptor);
//     // };
//   }, [dispatch, navigate]);

//   // return <>{children}</>;
//   return <Outlet />;
// };

// export default AuthProvider;
