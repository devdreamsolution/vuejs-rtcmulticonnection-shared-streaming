
import axios from '@/axios.js'

export default {
  fetchAudiosByQrCode ({ commit }, qr_code) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/audio/list/${qr_code}`)
      .then((response) => {
        commit('SET_AUDIOS', response.data.data.audios)
        resolve(response)
      })
      .catch((error) => { reject(error) })
    })
  },
  fetchAudiosByRoomId ({ commit }, room_id) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/audio/${room_id}/list`)
      .then((response) => {
        commit('SET_AUDIOS', response.data.data)
        resolve(response)
      })
      .catch((error) => { reject(error) })
    })
  },
  removeAudio ({ commit }, audioId) {
    return new Promise((resolve, reject) => {
      axios.delete(`/api/audio/${audioId}/delete`)
        .then((response) => {
          commit('REMOVE_AUDIO', audioId)
          resolve(response)
        }).catch((error) => { reject(error) })
    })
  },
}
