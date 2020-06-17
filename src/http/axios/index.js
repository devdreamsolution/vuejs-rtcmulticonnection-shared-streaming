import axios, {apiURL} from '../../axios.js'
import store from '../../store/store'
import router from '../../router'


// Add a request interceptor
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('AccessToken');
    if (token) {
          config.headers['Authorization'] = 'Bearer ' + token;
      }
      config.headers['Content-Type'] = 'application/json';
      return config;
  },
  error => {
      Promise.reject(error)
})

axios.interceptors.response.use((response) => {
  return response
}, function (error) {
    const originalRequest = error.config
    if (error.response.status === 401 && originalRequest.url === '/api/token/refresh') {

      localStorage.removeItem('UserInfo')
      localStorage.removeItem('AccessToken')
      localStorage.removeItem("RefreshToken")
      // This is just for demo Purpose. If user clicks on logout -> redirect
      router.push('/auth/login')
      return Promise.reject(error)
    }

    console.log(originalRequest.url);
    if (error.response.status === 401 && !originalRequest._retry && originalRequest.url != `/api/login/token`) {
      originalRequest._retry = true
      return store.dispatch('auth/fetchAccessToken')
    }
  return Promise.reject(error);
})

export default axios
