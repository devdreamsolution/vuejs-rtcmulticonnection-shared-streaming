/*=========================================================================================
  File Name: moduleAudio.js
  Description: Audio Module
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Xiao
==========================================================================================*/


import state from './moduleAudioState.js'
import mutations from './moduleAudioMutations.js'
import actions from './moduleAudioActions.js'
import getters from './moduleAudioGetters.js'

export default {
  isRegistered: false,
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

