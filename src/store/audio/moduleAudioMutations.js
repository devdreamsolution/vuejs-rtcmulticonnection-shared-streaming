
export default {
  ADD_AUDIO (state, audio) {
    state.audios.unshift(audio)
  },
  SET_AUDIOS (state, audios) {
    state.audios = audios
  },
  REMOVE_AUDIO (state, audioId) {
    const ItemIndex = state.audios.findIndex((p) => p.id === audioId)
    state.audios.splice(ItemIndex, 1)
  },
}
