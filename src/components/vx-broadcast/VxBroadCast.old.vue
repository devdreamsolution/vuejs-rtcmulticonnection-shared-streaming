<template>
  <div class="audio-list" >
    <div class="mb-3" v-if="isBroadcastExists">Broadcasting is runing...</div>
    <div class="mb-3" id="broadcast-viewers-counter" v-if="isShowCounter">Broadcast viewer counter: <b>{{ viewerCount }}</b></div>
    <audio id="audio-preview" controls></audio>
    <div class="row">
      <div class="col-md-12 my-3">
        <vs-button color="primary" :disabled="isDisableOpen" v-if="UserInfo.id == roomData.owner.id" class="mr-2" type="filled" @click="onOpen">Open</vs-button>
        <vs-button color="success" :disabled="isDisableJoin" class="mr-2" type="filled" @click="onJoin">Join</vs-button>
        <vs-button color="warning" :disabled="isDisableLeave" class="mr-2" type="filled" @click="onLeave">Leave</vs-button>
        <vs-button @click="onRecordingStart">start</vs-button>
        <vs-button @click="onRecordingStop">stop</vs-button>
        <vs-button @click="onRecordingDownload">download</vs-button>
      </div>
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
        recorder: null,
        microphone: null,
        viewerCount: null,
        isShowCounter: false,
        isBroadcastExists: false,
        isDisableOpen: false,
        isDisableJoin: true,
        isDisableLeave: true,
        isClickedJoin: false,
      }
    },
    props: {
      roomData: null,
      broadcastId: {
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
      enableAudio: {
        type: Boolean,
        default: true
      },
      enableVideo: {
        type: Boolean,
        default: false
      },
      enableOneWay: {
        type: Boolean,
        default: true
      },
      enableScalableBroadcast: {
        type: Boolean,
        default: true
      }
    },
    mounted() {
      let that = this
      that.rtcmConnection = new RTCMultiConnection()
      that.rtcmConnection.enableScalableBroadcast = that.enableScalableBroadcast
      that.rtcmConnection.maxRelayLimitPerUser = 1
      that.rtcmConnection.autoCloseEntireSession = true
      that.rtcmConnection.socketURL = that.socketURL
      that.rtcmConnection.socketMessageEvent = 'scalable-media-broadcast-demo'
      that.rtcmConnection.mediaConstraints = {
        video: that.enableVideo,
        audio: that.enableAudio
      }
      that.rtcmConnection.connectSocket(function(socket) {
        // this event is emitted when a broadcast is already created.
        socket.on('join-broadcaster', function(hintsToJoinBroadcast) {
            that.rtcmConnection.session = hintsToJoinBroadcast.typeOfStreams
            that.rtcmConnection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: !!that.rtcmConnection.session.video,
                OfferToReceiveAudio: !!that.rtcmConnection.session.audio
            }
            that.rtcmConnection.broadcastId = hintsToJoinBroadcast.broadcastId
            that.rtcmConnection.join(hintsToJoinBroadcast.userid)
        })

        socket.on('rejoin-broadcast', function(broadcastId) {
          that.rtcmConnection.attachStreams = []
          socket.emit('check-broadcast-presence', broadcastId, function(isBroadcastExists) {
            if (!isBroadcastExists) {
              // the first person (i.e. real-broadcaster) MUST set his user-id
              that.rtcmConnection.userid = broadcastId
            }
            socket.emit('join-broadcast', {
              broadcastId: broadcastId,
              userid: that.rtcmConnection.userid,
              typeOfStreams: that.rtcmConnection.session
            })
          })
        })

        socket.on('broadcast-stopped', function(broadcastId) {
          alert('This broadcast has been stopped.')
          location.reload()
        })

        // this event is emitted when a broadcast is absent.
        socket.on('start-broadcasting', function(typeOfStreams) {
          // host i.e. sender should always use this!
          that.rtcmConnection.sdpConstraints.mandatory = {
            OfferToReceiveVideo: that.enableVideo,
            OfferToReceiveAudio: false
          }
          that.rtcmConnection.session = typeOfStreams

          // "open" method here will capture media-stream
          // we can skip this function always it is totally optional here.
          // we can use "connection.getUserMediaHandler" instead
          that.rtcmConnection.open(that.rtcmConnection.userid)
        })
      })
      let audioPreview = document.getElementById('audio-preview')
      this.rtcmConnection.onstream = function(event) {
        if (that.rtcmConnection.isInitiator && event.type !== 'local') {
          return
        }

        that.rtcmConnection.isUpperUserLeft = false
        audioPreview.srcObject = event.stream
        audioPreview.play()

        audioPreview.userid = event.userid

        if (event.type === 'local') {
          audioPreview.muted = true
        }

        if (that.rtcmConnection.isInitiator == false && event.type === 'remote') {
          // he is merely relaying the media
          that.rtcmConnection.dontCaptureUserMedia = true
          that.rtcmConnection.attachStreams = [event.stream]
          that.rtcmConnection.sdpConstraints.mandatory = {
            OfferToReceiveVideo: that.enableVideo,
            OfferToReceiveAudio: false
          }

          that.rtcmConnection.getSocket(function(socket) {
            socket.emit('can-relay-broadcast')

            if (that.rtcmConnection.DetectRTC.browser.name === 'Chrome') {
              that.rtcmConnection.getAllParticipants().forEach(function(p) {
                if (p + '' != event.userid + '') {
                  let peer = that.rtcmConnection.peers[p].peer
                  peer.getLocalStreams().forEach(function(localStream) {
                    peer.removeStream(localStream)
                  })
                  event.stream.getTracks().forEach(function(track) {
                    peer.addTrack(track, event.stream)
                  })
                  that.rtcmConnection.dontAttachStream = true
                  that.rtcmConnection.renegotiate(p)
                  that.rtcmConnection.dontAttachStream = false
                }
              })
            }

            if (that.rtcmConnection.DetectRTC.browser.name === 'Firefox') {
              // Firefox is NOT supporting removeStream method
              // that's why using alternative hack.
              // NOTE: Firefox seems unable to replace-tracks of the remote-media-stream
              // need to ask all deeper nodes to rejoin
              that.rtcmConnection.getAllParticipants().forEach(function(p) {
                if (p + '' != event.userid + '') {
                  that.rtcmConnection.replaceTrack(event.stream, p)
                }
              })
            }
          })
        }

        // to keep room-id in cache
        localStorage.setItem(that.rtcmConnection.socketMessageEvent, that.rtcmConnection.sessionid)
      }
      this.rtcmConnection.onstreamended = function() {}
      this.rtcmConnection.onleave = function(event) {
          if (event.userid !== audioPreview.userid) return

          that.rtcmConnection.getSocket(function(socket) {
            socket.emit('can-not-relay-broadcast')

            that.rtcmConnection.isUpperUserLeft = true
          })
      }
      this.rtcmConnection.onNumberOfBroadcastViewersUpdated = function(event) {
        if (!that.rtcmConnection.isInitiator) {
          that.isShowCounter = false
        }
        that.viewerCount = event.numberOfBroadcastViewers
        that.isShowCounter = true
      }

      let checkBroadcast = function() {
        that.rtcmConnection.checkPresence(that.broadcastId, function(isBroadcastExists, broadcastId, error) {
          that.isBroadcastExists = isBroadcastExists
          if (that.isBroadcastExists) {
            that.isDisableOpen = true
            if (!that.isClickedJoin)
              that.isDisableJoin = false
          } else {
            that.isDisableOpen = false
            if (!that.isClickedJoin)
              that.isDisableJoin = true
          }
          setTimeout(checkBroadcast, 3000); // recheck after every 3 seconds
        })
      }
      checkBroadcast()
    },
    methods: {
      // recording start
      onRecordingStart () {
        let that = this

        let options = {
          type: 'audio',
          numberOfAudioChannels: isEdge ? 1 : 2,
          checkForInactiveTracks: true,
          bufferSize: 16384
        };

        if(isSafari || isEdge) {
            options.recorderType = StereoAudioRecorder;
        }

        if(navigator.platform && navigator.platform.toString().toLowerCase().indexOf('win') === -1) {
            options.sampleRate = 48000; // or 44100 or remove this line for default
        }

        if(isSafari) {
            options.sampleRate = 44100;
            options.bufferSize = 4096;
            options.numberOfAudioChannels = 2;
        }

        if(this.recorder) {
            this.recorder.destroy();
            this.recorder = null;
        }

        this.recorder = RecordRTC(options);

        this.recorder.startRecording();
      },

      // recording stop
      onRecordingStop () {
        this.recorder.stopRecording()
      },
      onRecordingDownload () {
        let that = this
        if (!this.recorder || !this.recorder.getBlob())
          return
        if (isSafari) {
          this.recorder.getDataURL(function(dataURL) {
            that.saveToDisk(dataURL, getFileName('mp3'))
          })
          return
        }

        let blob = this.recorder.getBlob()
        let file = new File([blob], getFileName('mp3'), {
          type: 'audio/mp3'
        })
        invokeSaveAsDialog(file)
      },
      onJoin () {
        let that = this
        let broadcastId = this.broadcastId

        this.rtcmConnection.extra.broadcastId = broadcastId

        this.rtcmConnection.session = {
          video: that.enableVideo,
          audio: that.enableAudio,
          oneway: that.enableOneWay
        }

        this.rtcmConnection.getSocket(function(socket) {
          socket.emit('check-broadcast-presence', broadcastId, function(isBroadcastExists) {
            if (!isBroadcastExists) {
              // the first person (i.e. real-broadcaster) MUST set his user-id
              that.rtcmConnection.userid = broadcastId
            }

            socket.emit('join-broadcast', {
              broadcastId: broadcastId,
              userid: that.rtcmConnection.userid,
              typeOfStreams: that.rtcmConnection.session
            })
          })
        })

        that.isDisableLeave = false
        that.isDisableJoin = true
        that.isClickedJoin = true
      },
      onOpen () {
        let that = this
        let broadcastId = this.broadcastId

        this.rtcmConnection.extra.broadcastId = broadcastId

        this.rtcmConnection.session = {
          video: that.enableVideo,
          audio: that.enableAudio,
          oneway: that.enableOneWay
        }

        this.rtcmConnection.getSocket(function(socket) {
          socket.emit('check-broadcast-presence', broadcastId, function(isBroadcastExists) {
            if (!isBroadcastExists) {
              // the first person (i.e. real-broadcaster) MUST set his user-id
              that.rtcmConnection.userid = broadcastId
            }

            socket.emit('join-broadcast', {
              broadcastId: broadcastId,
              userid: that.rtcmConnection.userid,
              typeOfStreams: that.rtcmConnection.session
            })
          })
        })

        that.isDisableOpen = true
        that.isDisableLeave = false
        that.isClickedJoin = true
      },
      onLeave () {
        // this.rtcmConnection.attachStreams.forEach(function (localStream) {
        //   localStream.stop()
        // })
        location.reload()
      },
      // save to disk recording
      saveToDisk (fileURL, fileName) {
        if (!window.ActiveXObject) {
          let save = document.createElement('a')
          save.href = fileURL
          save.download = fileName || 'unknown'
          save.style = 'display:none;opacity:0;color:transparent;'
          (document.body || document.documentElement).appendChild(save)

          if (typeof save.click === 'function')
            save.click()
          else {
            save.target = '_blank'
            let event = document.createEvent('Event')
            event.initEvent('click', true, true)
            save.dispatchEvent(event)
          }

          (window.URL || window.webkitURL).revokeObjectURL(save.href)
        } else if (!!window.ActiveXObject && document.execCommand) {
          let _window = window.open(fileURL, '_blank')
          _window.document.close()
          _window.document.execCommand('SaveAs', true, fileName || fileURL)
          _window.close()
        }
      },
    },
    computed: {
      UserInfo() {
        return localStorage.getItem('UserInfo') ? JSON.parse(localStorage.getItem('UserInfo')) : []
      },
    }
  }
</script>
