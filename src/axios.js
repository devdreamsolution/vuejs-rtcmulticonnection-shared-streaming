// axios
import axios from 'axios'


const baseURL = 'http://127.0.0.1:8000'

let roles = [];
if(localStorage.getItem('UserInfo'))
  roles = JSON.parse(localStorage.getItem('UserInfo')).roles

export default axios.create({
  baseURL: baseURL
  // You can add your headers here
})

export const apiURL = baseURL
export let userRoles = roles
