<template>
  <div class="audio-list" >
    <div v-for="item in audioList"
      v-bind:key="item.id"
      class="audio-item">
      <audio controls autoplay playsinline ref="audios" :muted="item.muted" :id="item.id"></audio>
    </div>
    {{ counter }}
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
        counter: 0,
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
        default: false
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
      this.rtcmConnection.mediaConstraints = {
        audio: this.enableAudio,
        video: this.enableVideo
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
              if (stream.type == 'local') {
                that.$refs.audios[i].muted = true
              }
              break
            }
          }
        }, 1000)
      }
      this.rtcmConnection.onstreamended = function (stream) {
        let newList = []
        that.audioList.forEach(function (item) {
          if (item.id !== stream.streamid) {
            newList.push(item)
          }
        })
        that.audioList = newList
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
    }
  }
</script>
