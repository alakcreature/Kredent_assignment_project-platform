import axios from "axios";
import apis from "./Api";

const http = axios.create({
  baseURL: apis.BASE
});

export default http;