import axios from "axios"
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"
import { toast } from "sonner";

// Base API URL
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:3020/api/v1"

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  // baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      let token = localStorage.getItem("auth_token")
      if (token) {
        try {
          config.headers["Authorization"] = "Bearer " + token
        } catch (e) {
          console.error("Failed to parse user data:", e)
        }
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle error responses
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data.message || "Request failed";
      console.log(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        closeButton: true
      });
      return Promise.reject(errorMessage)
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API Error Request:", error.request)
      return Promise.reject("No response received from server")
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("API Error:", error.message)
      return Promise.reject(error.message)
    }
  },
)

// Generic API request function with better typing
export const apiRequest = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.get(url, config).then((response: AxiosResponse<T>) => response.data)
  },
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.post(url, data, config).then((response: AxiosResponse<T>) => response.data)
  },
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.put(url, data, config).then((response: AxiosResponse<T>) => response.data)
  },
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.patch(url, data, config).then((response: AxiosResponse<T>) => response.data)
  },
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.delete(url, config).then((response: AxiosResponse<T>) => response.data)
  },
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export default axiosInstance
