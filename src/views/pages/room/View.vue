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
          <div class="vx-col" id="avatar-col">
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
      </vx-card>
    </div>

    <div v-if="room_data">
      <vx-card title="Audio list" class="mb-base">
        <vs-table
          ref="table"
          multiple
          v-model="selected"
          pagination
          :max-items="itemsPerPage"
          search
          :data="audiosByRoomId"
        >
          <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
            <div class="flex flex-wrap-reverse items-center">
              <!-- ACTION - DROPDOWN -->
              <div
                class="p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-between text-lg font-medium text-base text-danger border border-solid border-danger"
                v-if="userRoles.includes('ROLE_GUIDE')"
                @click="removeSelectedData"
              >
                <feather-icon icon="DeleteIcon" svgClasses="h-4 w-4" />
                <span class="ml-2 text-base text-danger">Delete</span>
              </div>

              <!-- ADD NEW -->
              <div
                class="p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-between text-lg font-medium text-base text-primary border border-solid border-primary"
                @click="$router.push({ name: 'home' })"
                v-if="userRoles.includes('ROLE_GUIDE')"
              >
                <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                <span class="ml-2 text-base text-primary">Add Room</span>
              </div>
            </div>

            <!-- ITEMS PER PAGE -->
            <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4">
              <div
                class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium"
              >
                <span
                  class="mr-2"
                >{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ audiosByRoomId.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : audiosByRoomId.length }} of {{ queriedItems }}</span>
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
            <vs-th v-if="userRoles.includes('ROLE_GUIDE')">Action</vs-th>
          </template>

          <template slot-scope="{data}">
            <tbody>
              <vs-tr :data="tr" :key="indextr"  v-for="(tr, indextr) in data">
                <vs-td>
                  <p class="product-name font-medium truncate">{{ tr.recorder.name }}</p>
                </vs-td>

                <vs-td>
                  <p class="product-category">{{ tr.audio }}</p>
                </vs-td>

                <vs-td class="whitespace-no-wrap" v-if="userRoles.includes('ROLE_GUIDE')">
                  <feather-icon
                    icon="EditIcon"
                    svgClasses="w-5 h-5 hover:text-primary stroke-current"
                    @click.stop="$router.push({ name: 'home' })"
                  />
                  <feather-icon
                    icon="TrashIcon"
                    svgClasses="w-5 h-5 hover:text-danger stroke-current"
                    class="ml-2"
                    @click.stop="deleteData(tr.id)"
                  />
                </vs-td>
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
      this.$store.dispatch("moduleRoom/removeRoom", id).catch(err => {
        console.error(err);
      });
    },
  },
  computed: {
    userRoles()
    {
      return localStorage.getItem('UserInfo') ? JSON.parse(localStorage.getItem('UserInfo')).roles : []
    },
    currentPage () {
      if (this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0;
    },
    audiosByRoomId () {
      return this.$store.state.moduleAudio.audios
    },
    queriedItems () {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.audiosByRoomId.length;
    }
  },
  created () {
    if (!moduleRoom.isRegistered) {
      this.$store.registerModule('moduleRoom', moduleRoom)
      moduleRoom.isRegistered = true
    }

    const qr_code = this.$route.params.qr_code
    this.$store.dispatch('moduleRoom/fetchRoomByQrCode', qr_code)
      .then(res => {
        if (res.data.success) {
          this.room_data = res.data.data
          this.room_not_found = false

          // Get audios by room
          if (!moduleAudio.isRegistered) {
            this.$store.registerModule('moduleAudio', moduleAudio)
            moduleAudio.isRegistered = true
          }
          const room_id = this.room_data.id
          this.$store.dispatch('moduleAudio/fetchAudiosByRoomId', room_id)
        } else {
          this.room_data = null
          this.error_message = res.data.message
          this.room_not_found = true
        }
      })
      .catch(err => {
        if (err.response.status === 404) {
          this.user_not_found = true
          this.room_data = null
          this.error_message = `Room record with QR code: ${route.params.qr_code} not found.`
          return
        }
      }
    )
  }
}
</script>

<style lang="scss">

#avatar-col {
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

@media screen and (min-width:1201px) and (max-width:1211px),
only screen and (min-width:636px) and (max-width:991px) {
  #account-info-col-1 {
    width: calc(100% - 12rem) !important;
  }
  #account-info-col-2 {
    width: calc(100% - 12rem) !important;
  }
}

</style>
