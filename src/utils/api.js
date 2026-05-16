import axios from "axios";
import { Api_url } from "./constant";

const api = axios.create({
  baseURL: `${Api_url}`,
  withCredentials: true,
});

export default api;
