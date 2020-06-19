<template>
  <div id="audio-create">
    <audio-recorder
      upload-url="http://localhost:8000/audio/7/create"
      :attempts="1"
      :time="2"
      :before-recording="callback"
      :pause-recording="callback"
      :after-recording="callback"
      :select-record="callback"
      :before-upload="callback"
      :successful-upload="callback"
      :failed-upload="callback"
    />
  </div>
</template>

<script>
import AudioRecorder from 'vue-audio-recorder'
import Vue from 'vue'

Vue.use(AudioRecorder)

export default {
  data () {
    return {
      uploadUrl: 'sdfsdf',
    }
  },
  methods: {
    callback (data) {
      // console.log('success')
    },
  }
}
</script>

<style lang="scss">
#audio-create {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
