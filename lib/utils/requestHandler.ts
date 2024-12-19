import { redirect } from "next/navigation";
import { getSession, logout } from "./cookies";
import { unstable_noStore as noStore } from "next/cache";
import axios from "axios";

export interface SuccessResponse<T> {
  status: "ok";
  data: T;
  message: string;
}

export interface ErrorResponse {
  status: "error";
  message: string;
}

export type ResponseType<T> = SuccessResponse<T> | ErrorResponse;

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  timeout: 100000000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(async (config) => {
  const session = await getSession();
  const datas = session.token.split(",between,");
  const token = datas[0];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function request<T>(
  url: string,
  params?: any,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  options?: RequestInit
): Promise<ResponseType<T>> {
  noStore();
  const token = await getSession();

  if (!token) return generateErrorResponse("Unauthorized access");

  const option: RequestInit = {
    ...options,
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.token}`,
    },
  };

  if (params) {
    if (method !== "GET") {
      option.body! = JSON.stringify(params);
    }
    //else {
    //url += "?" + objectToQueryString(params);
    //}
  }

  const response = await fetch(url, option);
  const result = await response.json();

  if (response.status === 401) autoSignOut();

  if (response.status == 200) {
    return {
      status: "ok",
      data: result as T,
      message: result?.[Object.keys(result)[0]],
    };
  }

  return generateErrorResponse(
    result[Object.keys(result)[0]] ||
      response.statusText ||
      "An error occurred while fetching data"
  ) as ErrorResponse;
}

// get JSON from multiple URLs and pass to setters
export const fetchAndSetAll = async (collection = []) => {
  // fetch all data first
  const allData = await Promise.allSettled(
    collection.map(({ url, init }) => request(url, init))
  );

  // iterate setters and pass in data
  collection.forEach(({ setter }: { setter: (data: any) => void }, i) => {
    setter(allData[i]);
  });
};

export const autoSignOut = async () => {
  try {
    await logout();
    redirect("/sign-in");
  } catch (error) {}
};

export function generateErrorResponse(message: string): ErrorResponse {
  return {
    status: "error",
    message,
  };
}
