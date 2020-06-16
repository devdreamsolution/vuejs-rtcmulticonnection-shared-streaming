/*=========================================================================================
  File Name: moduleCalendarMutations.js
  Description: Calendar Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
  ADD_ITEM (state, item) {
    state.rooms.unshift(item)
  },
  SET_ROOMS (state, rooms) {
    state.rooms = rooms
  },
  UPDATE_ITEM (state, item) {
    const itemIndex = state.rooms.findIndex((p) => p.id === item.id)
    Object.assign(state.rooms[itemIndex], item)
  },
  REMOVE_ITEM (state, itemId) {
    const ItemIndex = state.rooms.findIndex((p) => p.id === itemId)
    state.rooms.splice(ItemIndex, 1)
  }
}
