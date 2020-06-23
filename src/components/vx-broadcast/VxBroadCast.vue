<template>
  <div class="audio-list" >
      <div v-for="item in audioList"
          v-bind:key="item.id"
          class="audio-item">
        <audio controls autoplay playsinline ref="audios" :height="cameraHeight" :muted="item.muted" :id="item.id"></audio>
      </div>
  </div>
</template>

<script>
  import RTCMultiConnection from 'rtcmulticonnection'
  require('adapterjs')
  export default {
    name: 'vue-webrtc',
    components: {
      RTCMultiConnection
    },
    data() {
      return {
        rtcmConnection: null,
        localAudio: null,
        audioList: [],
      }
    },
    props: {
      roomId: {
        type: String,
        default: 'public-room'
      },
      socketURL: {
        type: String,
        default: 'https://rtcmulticonnection.herokuapp.com:443/'
      },
      cameraHeight: {
        type: [Number, String],
        default: 160
      },
      autoplay: {
        type: Boolean,
        default: true
      },
      screenshotFormat: {
        type: String,
        default: 'image/jpeg'
      },
      enableAudio: {
        type: Boolean,
        default: true
      },
      enableVideo: {
        type: Boolean,
        default: true
      },
      enableLogs: {
        type: Boolean,
        default: false
      },
      enableOneWay: {
        type: Boolean,
        default: true
      }
    },
    watch: {
    },
    mounted() {
      let that = this;
      this.rtcmConnection = new RTCMultiConnection()
      this.rtcmConnection.socketURL = this.socketURL
      this.rtcmConnection.autoCreateMediaElement = false
      this.rtcmConnection.enableLogs = this.enableLogs
      this.rtcmConnection.session = {
        audio: this.enableAudio,
        video: this.enableVideo,
        oneway: this.enableOneWay
      }
      this.rtcmConnection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: this.enableAudio,
        OfferToReceiveVideo: this.enableVideo
      }
      this.rtcmConnection.onstream = function (stream) {
        let found = that.audioList.find(audio => {
          return audio.id === stream.streamid
        })
        if (found === undefined) {
          let audio = {
            id: stream.streamid,
            muted: stream.type === 'local'
          }
          that.audioList.push(audio)
          if (stream.type === 'local') {
            that.localAudio = audio
          }
        }
        setTimeout(function(){
          for (let i = 0, len = that.$refs.audios.length; i < len; i++) {
            if (that.$refs.audios[i].id === stream.streamid)
            {
              that.$refs.audios[i].srcObject = stream.stream
              break
            }
          }
        }, 1000)

        that.$emit('joined-room', stream.streamid)
      }
      this.rtcmConnection.onstreamended = function (stream) {
        let newList = []
        that.audioList.forEach(function (item) {
          if (item.id !== stream.streamid) {
            newList.push(item)
          }
        })
        that.audioList = newList
        that.$emit('left-room', stream.streamid)
      }
    },
    methods: {
      join () {
        this.rtcmConnection.join(this.roomId)
      },
      open () {
        this.rtcmConnection.open(this.roomId)
      },
      leave () {
        this.rtcmConnection.attachStreams.forEach(function (localStream) {
          localStream.stop()
        })
        this.audioList = []
      },
      // capture() {
      //   return this.getCanvas().toDataURL(this.screenshotFormat)
      // },
      // getCanvas() {
      //   let audio = this.getCurrentAudio()
      //   if (audio !== null && !this.ctx) {
      //     let canvas = document.createElement('canvas')
      //     canvas.height = audio.clientHeight
      //     canvas.width = audio.clientWidth
      //     this.canvas = canvas
      //     this.ctx = canvas.getContext('2d')
      //   }
      //   const { ctx, canvas } = this
      //   ctx.drawImage(audio, 0, 0, canvas.width, canvas.height)
      //   return canvas
      // },
      getCurrentAudio () {
        if (this.localAudio === null) {
          return null
        }
        for (let i = 0, len = this.$refs.audios.length; i < len; i++) {
          if (this.$refs.audios[i].id === this.localAudio.id)
            return this.$refs.audios[i]
        }
        return null
      },
      // shareScreen() {
      //   let that = this;
      //   if (navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia) {
      //     function addStreamStopListener(stream, callback) {
      //       let streamEndedEvent = 'ended'
      //       if ('oninactive' in stream) {
      //           streamEndedEvent = 'inactive'
      //       }
      //       stream.addEventListener(streamEndedEvent, function() {
      //           callback()
      //           callback = function() {}
      //       }, false)
      //     }
      //     function onGettingSteam(stream) {
      //       that.rtcmConnection.addStream(stream)
      //       that.$emit('share-started', stream.streamid)
      //       addStreamStopListener(stream, function() {
      //         that.rtcmConnection.removeStream(stream.streamid)
      //         that.$emit('share-stopped', stream.streamid)
      //       })
      //     }
      //     function getDisplayMediaError(error) {
      //       console.log('Media error: ' + JSON.stringify(error))
      //     }
      //     if (navigator.mediaDevices.getDisplayMedia) {
      //       navigator.mediaDevices.getDisplayMedia({video: true, audio: false}).then(stream => {
      //         onGettingSteam(stream);
      //       }, getDisplayMediaError).catch(getDisplayMediaError)
      //     }
      //     else if (navigator.getDisplayMedia) {
      //       navigator.getDisplayMedia({video: true}).then(stream => {
      //         onGettingSteam(stream);
      //       }, getDisplayMediaError).catch(getDisplayMediaError)
      //     }
      //   }
      // }
    }
  }
</script>
