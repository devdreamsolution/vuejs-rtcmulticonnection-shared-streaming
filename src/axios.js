// axios
import axios from 'axios'


const baseURL = 'https://127.0.0.1:8000'

export default axios.create({
  baseURL: baseURL
  // You can add your headers here
})

export const apiURL = baseURL
