
export default {
  ADD_ROOM (state, room) {
    state.rooms.unshift(room)
  },
  SET_ROOMS (state, rooms) {
    state.rooms = rooms
  },
  UPDATE_ROOM (state, room) {
    const itemIndex = state.rooms.findIndex((p) => p.id === room.id)
    Object.assign(state.rooms[itemIndex], room)
  },
  REMOVE_ROOM (state, roomId) {
    const ItemIndex = state.rooms.findIndex((p) => p.id === roomId)
    state.rooms.splice(ItemIndex, 1)
  },
}
