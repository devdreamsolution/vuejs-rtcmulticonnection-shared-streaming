// axios
import axios from 'axios'


const baseURL = 'http://192.168.107.122:8000'

export default axios.create({
  baseURL: baseURL
  // You can add your headers here
})

export const apiURL = baseURL
