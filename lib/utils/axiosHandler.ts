import { getSession } from "./cookies";

export async function apiRequest<T>(
  config: RequestInit & { url: string; data?: any }
): Promise<{ success: boolean; data?: T; message: string }> {
  try {
    const session = await getSession();
    const datas = session.token.split(",between,");
    const token = datas[0];
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const requestOptions: RequestInit = {
      ...config,
      headers: {
        ...headers,
        ...(config.headers || {}),
      },
    };

    // Attach body if data is provided and the method is not GET
    if (config.data && config.method !== "GET") {
      requestOptions.body = JSON.stringify(config.data);
    }

    const response = await fetch(`${config.url}`, requestOptions);

    const responseData = await response.json();

    let message: string;

    if (responseData && typeof responseData === "object") {
      message = !!Object.keys(responseData).length
        ? String(responseData[Object.keys(responseData)[0]])
        : "Success but no data";
    } else {
      message = String(responseData);
    }

    return {
      success: response.ok,
      data: response.ok ? responseData : undefined,
      message,
    };
  } catch (error: any) {
    const message = error?.response?.data
      ? Object.keys(error.response.data)[0] +
        " : " +
        Object.values(error.response.data)[0]
      : error.message || "An unexpected error occurred";

    return {
      success: false,
      message,
    };
  }
}

export default { apiRequest };
// import axios, {
//   AxiosRequestConfig,
//   AxiosResponse,
//   InternalAxiosRequestConfig,
// } from "axios";
// import { getSession } from "./cookies";

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   timeout: 100000000,
// });

// export type ResponseReq = {
//   success: boolean;
//   message: string;
//   data: any;
// };

// axiosInstance.interceptors.request.use(
//   async (config: InternalAxiosRequestConfig) => {
//     try {
//       const session = await getSession();
//       const datas = session.token.split(",between,");
//       const token = datas[0];

//       if (session?.token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     } catch (error) {
//       console.error("Error fetching session:", error);
//       return config;
//     }
//   }
// );

// export async function apiRequest<T>(
//   config: AxiosRequestConfig
// ): Promise<{ success: boolean; data?: T; message: string }> {
//   try {
//     const response: AxiosResponse<T> = await axiosInstance.request<T>(config);

//     let message: string;

//     if (response.data && typeof response.data === "object") {
//       const responseData = response.data as Record<string, any>;
//       message = !!Object.keys(responseData).length
//         ? String(responseData[Object.keys(responseData)[0]])
//         : "Success but no data";
//     } else {
//       message = String(response.data);
//     }

//     return {
//       success: true,
//       data: response.data,
//       message,
//     };
//   } catch (error: any) {
//     const message =
//       Object.keys(error.response.data)[0] +
//       " : " +
//       Object.values(error.response.data)[0];

//     return {
//       success: false,
//       message,
//     };
//   }
// }

// export default axiosInstance;
