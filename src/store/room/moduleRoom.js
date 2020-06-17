
import state from './moduleRoomState.js'
import mutations from './moduleRoomMutations.js'
import actions from './moduleRoomActions.js'
import getters from './moduleRoomGetters.js'

export default {
  isRegistered: false,
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

