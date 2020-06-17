
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
  },
  VIEW_ROOM (state, room) {
    state.room = room
  }
}
