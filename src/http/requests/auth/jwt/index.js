import axios from '../../../axios/index.js'
import store from '../../../../store/store.js'

// Token Refresh
let isAlreadyFetchingAccessToken = false
let subscribers = []

function onAccessTokenFetched (access_token) {
  subscribers = subscribers.filter(callback => callback(access_token))
}

function addSubscriber (callback) {
  subscribers.push(callback)
}

export default {
  init () {
    axios.interceptors.response.use(function (response) {
      return response
    }, function (error) {
      // const { config, response: { status } } = error
      const { config, response } = error
      const originalRequest = config

      // if (status === 401) {
      if (response && response.status === 401) {
        if (!isAlreadyFetchingAccessToken) {
          isAlreadyFetchingAccessToken = true
          store.dispatch('auth/fetchAccessToken')
            .then((access_token) => {
              isAlreadyFetchingAccessToken = false
              onAccessTokenFetched(access_token)
            })
        }

        const retryOriginalRequest = new Promise((resolve) => {
          addSubscriber(access_token => {
            originalRequest.headers.Authorization = `Bearer ${access_token}`
            resolve(axios(originalRequest))
          })
        })
        return retryOriginalRequest
      }
      return Promise.reject(error)
    })
  },

  login (username, password) {
    return axios.post('/api/login/token', {
      username,
      password: password
    })
  },

  registerUser (username, name, surename, password, roles, lang = 'en', city_residence = null, group_age = null, gender = null, address = null, age = null, vat = null, picture = null) {
    let rawData = {
      username,
      name: name,
      surename: surename,
      password: password,
      roles: roles,
      lang: lang,
      city_residence: city_residence,
      group_age: group_age,
      gender: gender,
      address: address,
      age: age,
      vat: vat,
    }

    let formData = new FormData()

    formData.append('picture', picture)
    formData.append('data', JSON.stringify(rawData))

    return axios.post('/api/user/register',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      },
    )
  },

  refreshToken () {
    return axios.post('/api/token/refresh', {refresh_token: localStorage.getItem('RefreshToken')})
  }
}
