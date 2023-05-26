import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

export default {
  request: axios.request,
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
