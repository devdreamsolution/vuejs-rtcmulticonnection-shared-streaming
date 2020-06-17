import axios, {removeLocalStorage} from '@/axios.js'

export default {
  addRoom ({ commit }, room) {
    return new Promise((resolve, reject) => {
      axios.post('/api/room/create', room)
        .then((response) => {
          commit('ADD_ROOM', Object.assign(room, {id: response.data.id}))
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchRooms ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/room/list')
        .then((response) => {
          commit('SET_ROOMS', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  updateRoom ({ commit }, room) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/room/${room.id}/edit`, room)
        .then((response) => {
          commit('UPDATE_ROOM', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  removeRoom ({ commit }, roomId) {
    return new Promise((resolve, reject) => {
      axios.delete(`/api/room/${roomId}/delete`)
        .then((response) => {
          commit('REMOVE_ROOM', roomId)
          resolve(response)
        }).catch((error) => { reject(error) })
    })
  },
  fetchRoomByQrCode ({ commit }, qr_code) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/room/view/${qr_code}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
    })
  }
}
