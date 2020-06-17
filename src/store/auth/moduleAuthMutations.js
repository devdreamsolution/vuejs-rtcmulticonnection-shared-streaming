
import axios from '../../http/axios/index.js'

export default {
  SET_BEARER (state, token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}
