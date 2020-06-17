
import axios from '@/axios.js'

export default {
  fetchAudiosByRoomId ({ commit }, room_id) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/audio/${room_id}/list`)
      .then((response) => {
        commit('SET_AUDIOS', response.data)
        resolve(response)
      })
      .catch((error) => { reject(error) })
    })
  }
}
