
import jwt from '../../http/requests/auth/jwt/index.js'

import router from '@/router'

export default {
  // JWT
  loginJWT({ commit }, payload) {
    return new Promise((resolve, reject) => {
      jwt
        .login(payload.userDetails.email, payload.userDetails.password)
        .then(response => {
          if (response.data.token) {
            // Navigate User to homepage

            // Set token

            localStorage.setItem(
              'UserInfo',
              JSON.stringify(response.data.userdata)
            )

            localStorage.setItem('AccessToken', response.data.token)
            localStorage.setItem('RefreshToken', response.data.refresh_token)


            // Set bearer token in axios
            commit('SET_BEARER', response.data.token)

            router.push(router.currentRoute.query.to || '/')

            resolve(response)
          } else {
            reject({message: 'Invalid credentials.'})
          }
        })
        .catch(error => {
          reject({message: error.response.data.message})
        })
    })
  },
  registerUserJWT({ commit }, payload) {
    const {
      username,
      name,
      surename,
      password,
      confirmPassword,
      roles,
      lang,
      city_residence,
      group_age,
      gender,
      address,
      age,
      vat,
      picture
    } = payload.userDetails

    return new Promise((resolve, reject) => {
      // Check confirm password
      if (password !== confirmPassword) {
        reject({message: "Password doesn't match. Please try again."})
      }

      jwt
        .registerUser(
          username,
          name,
          surename,
          password,
          roles,
          lang,
          city_residence,
          group_age,
          gender,
          address,
          age,
          vat,
          picture
        )
        .then(response => {
          if (response.data == 'Successfully') {
            // Redirect User
            router.push(router.currentRoute.query.to || '/')

            // Update data in localStorage
            localStorage.setItem(
              'UserInfo',
              JSON.stringify(response.data.userdata)
            )
            localStorage.setItem('AccessToken', response.data.token)
            localStorage.setItem('RefreshToken', response.data.refresh_token)

            // Set bearer token in axios
            commit('SET_BEARER', response.data.token)

            resolve(response)
          } else {
            reject({ message: response.data['email'] })
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchAccessToken() {
    return new Promise(resolve => {
      jwt.refreshToken().then(response => {
        localStorage.setItem(
            'UserInfo',
              JSON.stringify(response.data.userdata)
            )
        localStorage.setItem('AccessToken', response.data.token)
        localStorage.setItem('RefreshToken', response.data.refresh_token)
        resolve(response)
      })
      .catch(error => {
      })
    })
  }
};
