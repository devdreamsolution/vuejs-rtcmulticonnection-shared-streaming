import axios, {removeLocalStorage} from '@/axios.js'

export default {
  addItem ({ commit }, item) {
    return new Promise((resolve, reject) => {
      axios.post('/api/room/create', item)
        .then((response) => {
          commit('ADD_ITEM', Object.assign(item, {id: response.data.id}))
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchDataListItems ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/room/list')
        .then((response) => {
          commit('SET_ROOMS', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  updateItem ({ commit }, item) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/room/${item.id}/edit`, item)
        .then((response) => {
          commit('UPDATE_ITEM', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  removeItem ({ commit }, itemId) {
    return new Promise((resolve, reject) => {
      axios.delete(`/api/room/${itemId}/delete`)
        .then((response) => {
          commit('REMOVE_ITEM', itemId)
          resolve(response)
        }).catch((error) => { reject(error) })
    })
  }
}
