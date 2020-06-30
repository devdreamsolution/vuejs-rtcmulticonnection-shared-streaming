<template>
  <div id="page-room-view">
    <vs-alert color="danger" title="Room Not Found" :active.sync="room_not_found">
      <span>{{ error_message }}</span>
      <span>
        <span>Check </span><router-link :to="{name:'room'}" class="text-inherit underline">All Rooms</router-link>
      </span>
    </vs-alert>
    <div id="room-data" v-if="room_data">
      <vx-card title="Room data" class="mb-base">
        <!-- Room info -->
        <div class="vx-col flex-1">
          <table>
            <tr>
              <td class="font-semibold">Room name: </td>
              <td>{{ room_data.name }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Room description: </td>
              <td>{{ room_data.description }}</td>
            </tr>
          </table>
        </div>
        <!-- Avatar -->
        <div class="vx-row mt-6">
          <!-- Avatar Col -->
          <div class="vx-col" id="owner-avatar">
            <div class="img-container mb-4">
              <img :src="room_data.owner.picture" alt="Room owner avatar" class="rounded w-full" />
            </div>
          </div>

          <!-- Information - Col 1 -->
          <div class="vx-col flex-1" id="account-info-col-1">
            <table>
              <tr>
                <td class="font-semibold">Name: </td>
                <td>{{ room_data.owner.name }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Email: </td>
                <td>{{ room_data.owner.email }}</td>
              </tr>
            </table>
          </div>
          <!-- /Information - Col 1 -->

          <!-- Information - Col 2 -->
          <div class="vx-col flex-1" id="account-info-col-2">
            <table>
              <tr>
                <td class="font-semibold">Address: </td>
                <td>{{ room_data.owner.address }}</td>
              </tr>
              <tr>
                <td class="font-semibold">VAT:</td>
                <td>{{ room_data.owner.vat }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div id="live-streaming">

          <div class="row">
            <div class="col-md-12 my-3 mt-6">
              <h3>Live streaming</h3>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="">
                <vue-webrtc ref="webrtc"
                  :broadcastId="broadcastId"
                  :roomData="room_data"
                  v-on:joined-room="logEvent"
                  v-on:left-room="logEvent"
                  v-on:opened-room="logEvent"
                  v-on:share-started="logEvent"
                  v-on:share-stopped="logEvent"
                  @error="onError"
                />
              </div>
            </div>
            <div class="col-md-6" v-if="UserInfo">
              <audio-recorder
                :upload-url="uploadURL"
                :attempts="1"
                :time="20"
                :successful-upload="successCallback"
                v-if="UserInfo.id == room_data.owner.id"
              />
            </div>
          </div>
        </div>
      </vx-card>
    </div>

    <div id="audio-list">
      <vx-card title="Audio list" class="mb-base">
        <vs-table
          ref="table"
          multiple
          v-model="selected"
          pagination
          :max-items="itemsPerPage"
          search
          :data="audiosByQrCode"
        >
          <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
            <!-- ITEMS PER PAGE -->
            <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4">
              <div
                class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium"
              >
                <span
                  class="mr-2"
                >{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ audiosByQrCode.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : audiosByQrCode.length }} of {{ queriedItems }}</span>
                <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
              </div>
              <vs-dropdown-menu>
                <vs-dropdown-item @click="itemsPerPage=4">
                  <span>4</span>
                </vs-dropdown-item>
                <vs-dropdown-item @click="itemsPerPage=10">
                  <span>10</span>
                </vs-dropdown-item>
                <vs-dropdown-item @click="itemsPerPage=15">
                  <span>15</span>
                </vs-dropdown-item>
                <vs-dropdown-item @click="itemsPerPage=20">
                  <span>20</span>
                </vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>
          </div>

          <template slot="thead">
            <vs-th sort-key="recorder">Recorder</vs-th>
            <vs-th sort-key="audio">Audio</vs-th>
            <div v-if="UserInfo">
              <vs-th v-if="UserInfo.roles.includes('ROLE_GUIDE')">Action</vs-th>
            </div>
          </template>

          <template slot-scope="{data}">
            <tbody>
              <vs-tr :data="tr" :key="indextr"  v-for="(tr, indextr) in data">
                <vs-td>
                  <img :src="tr.recorder.picture" height="80px" alt="Recorder avatar" />
                </vs-td>

                <vs-td>
                  <!-- <p class="product-category" @click.stop="$router.push({ name: 'audio_view', params: {room_id: tr.room.id ,id: tr.id} })">{{ tr.audio }}</p> -->
                  <p class="product-category" @click.stop=""><audio controls :src="tr.audio"></audio></p>
                </vs-td>

                <div v-if="UserInfo">
                  <vs-td class="whitespace-no-wrap" v-if="UserInfo.roles.includes('ROLE_GUIDE')">
                    <feather-icon
                      icon="TrashIcon"
                      svgClasses="w-5 h-5 hover:text-danger stroke-current"
                      class="ml-2"
                      @click.stop="deleteData(tr.id)"
                      v-if="UserInfo.id == tr.recorder.id"
                    />
                  </vs-td>
                </div>
              </vs-tr>
            </tbody>
          </template>
        </vs-table>
      </vx-card>
    </div>
  </div>
</template>

<script>
import moduleRoom from '@/store/room/moduleRoom.js'
import moduleAudio from '@/store/audio/moduleAudio.js'

export default {
  data () {
    return {
      room_data: null,
      room_not_found: false,
      error_message: '',
      itemsPerPage: 4,
      selected: [],
      isMounted: false,
      broadcastId: this.$route.params.qr_code,
      isBroadCast: false,
      uploadURL: "/api/audio/" + this.$route.params.id + "/create",
    }
  },
  methods: {
    removeSelectedData ()
    {
      if (this.selected.length > 0) {
          this.$vs.dialog({
          type: 'confirm',
          color: 'danger',
          title: 'Confirm Delete',
          text: `You will not be able to recover this data!`,
          accept: this.deleteRecords(this.selected),
          acceptText: 'Delete'
        })
      }
    },
    deleteData (id) {
      this.$store.dispatch("moduleAudio/removeAudio", id).catch(err => {
        console.error(err)
      });
    },
    logEvent(event) {
      console.log('Event : ', event)
    },
    onError(error, stream) {
      console.log('On Error Event', error, stream)
    },
    successCallback () {
      this.getAudios()
    },
    getAudios () {
      const qr_code = this.$route.params.qr_code
      if (!moduleAudio.isRegistered) {
        this.$store.registerModule('moduleAudio', moduleAudio)
        moduleAudio.isRegistered = true
      }
      this.$store.dispatch('moduleAudio/fetchAudiosByQrCode', qr_code)
        .then (response => {
          if (response.data.success) {
            this.room_not_found = false
            this.room_data = response.data.data.current_room
          } else {
            this.room_not_found = true;
            this.error_message = response.data.message
          }
        })
        .catch (error => {
          this.room_not_found = true
          this.error_message = `Room record with QR code: ${qr_code} not found`
          return
        })
    }
  },
  computed: {
    UserInfo() {
      return localStorage.getItem('UserInfo') ? JSON.parse(localStorage.getItem('UserInfo')) : null
    },
    currentPage () {
      if (this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0
    },
    audiosByQrCode () {
      return this.$store.state.moduleAudio.audios
    },
    queriedItems () {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.audiosByQrCode.length;
    }
  },
  created () {
    this.getAudios()
  },
  mounted () {
    this.isMounted = true
  }
}
</script>

<style lang="scss">
#owner-avatar {
  width: 10rem;
}

#recorder-avatar {
  width: 10rem;
}

#page-room-view {
  table {
    td {
      vertical-align: top;
      min-width: 140px;
      padding-bottom: .8rem;
      word-break: break-all;
    }
  }
}
#audio-list {
  .vs-con-table {
    .vs-table--header {
      display: flex;
      flex-wrap: wrap-reverse;
      margin-left: 1.5rem;
      margin-right: 1.5rem;
      > span {
        display: flex;
        flex-grow: 1;
      }

      .vs-table--search {
        padding-top: 0;

        .vs-table--search-input {
          padding: 0.9rem 2.5rem;
          font-size: 1rem;

          & + i {
            left: 1rem;
          }

          &:focus + i {
            left: 1rem;
          }
        }
      }
    }

    .vs-table {
      border-collapse: separate;
      border-spacing: 0 1.3rem;
      padding: 0 1rem;

      tr {
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
        td {
          vertical-align: middle;
          padding: 10px;
          &:first-child {
            border-top-left-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
          }
          &:last-child {
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }
        }
        td.td-check {
          padding: 20px !important;
        }
      }
    }

    .vs-table--thead {
      th {
        padding-top: 0;
        padding-bottom: 0;

        .vs-table-text {
          text-transform: uppercase;
          font-weight: 600;
        }
      }
      th.td-check {
        padding: 0 15px !important;
      }
      tr {
        background: none;
        box-shadow: none;
      }
    }

    .vs-table--pagination {
      justify-content: center;
    }
  }
}

@media screen and (min-width:1201px) and (max-width:1211px),
only screen and (min-width:636px) and (max-width:991px) {
  #account-info-col-1 {
    width: calc(100% - 12rem) !important;
  }
  #account-info-col-2 {
    width: calc(100% - 12rem) !important;
  }

}
@media screen and (max-width:636px) {
  .ar-player {
  width: auto !important;
  
  }
  .ar-player-bar {
    display: table !important;
  }
  .ar-records__record {
    width: 270px !important;
  }
}
.ar {
  width: auto !important;
}
.ar-records {
  height: 45px !important;
}
</style>
