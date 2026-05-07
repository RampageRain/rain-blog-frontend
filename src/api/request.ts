import axios from "axios";

const request = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

// 请求拦截器：请求发送前自动带上token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('rain_blog_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
})

// 响应拦截器：后端返回统一处理
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('rain_blog_token');
      localStorage.removeItem('rain_blog_admin');
      window.location.href = '/studio/login';
    }
    return Promise.reject(error);
  }
)

export default request
