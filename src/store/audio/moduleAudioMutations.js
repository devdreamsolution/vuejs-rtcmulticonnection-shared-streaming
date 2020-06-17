
export default {
  ADD_AUDIO (state, audio) {
    state.audios.unshift(audio)
  },
  SET_AUDIOS (state, audios) {
    state.audios = audios
  },
}
