<template>
  <div id="audio-create">
    <audio-recorder
    upload-url="http://localhost:8000/api/audio/7/create"
    :attempts="1"
    :time="2"
    :before-recording="callback"
    :pause-recording="callback"
    :after-recording="afterRecordingCallback"
    :select-record="callback"
    :before-upload="beforeUploadCallback"
    :successful-upload="successUploadCallback"
    :failed-upload="callback"/>
  </div>
</template>

<script>
import AudioRecorder from 'vue-audio-recorder'
import Vue from 'vue'

Vue.use(AudioRecorder)

export default {
  data () {
    return {
      isUploaded: false,
      uploadedRecordArray: []
    }
  },
  methods: {
    afterRecordingCallback (data) {
      this.isUploaded = false
    },
    callback (data) {
      // console.log('success')
    },
    beforeUploadCallback (data) {
      console.log(this.isUploaded)
      return false
      if (this.isUploaded) {
        return
      }
    },
    successUploadCallback (data) {
      this.isUploaded = true
    },
    upload () {
      console.log('Re-define')
    }
  }
}
</script>

<style lang="scss">
#audio-create {
  display: flex;
  align-items: center;
  justify-content: center;;
}
</style>
