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
      </vx-card>
    </div>

    <div id="audio-list" v-if="room_data">
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
            <vs-th v-if="userRoles.includes('ROLE_GUIDE')">Action</vs-th>
          </template>

          <template slot-scope="{data}">
            <tbody>
              <vs-tr :data="tr" :key="indextr"  v-for="(tr, indextr) in data">
                <vs-td>
                  <img :src="tr.recorder.picture" height="80px" alt="Recorder avatar" />
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
      isMounted: false,
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
      this.$store.dispatch("moduleRoom/removeAudio", id).catch(err => {
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
    const qr_code = this.$route.params.qr_code
    if (!moduleAudio.isRegistered) {
      this.$store.registerModule('moduleAudio', moduleAudio)
      moduleAudio.isRegistered = true
    }
    this.$store.dispatch('moduleAudio/fetchAudiosByQrCode', qr_code)
      .then (response => {
        if (response.data.success) {
          this.room_data = response.data.data[0].room
          this.room_not_found = false
        } else {
          this.room_not_found = true;
          this.room_data = null
          this.error_message = response.data.message
        }
      })
      .catch (error => {
        if (error.response.status == 404) {
          this.room_not_found = true
          this.room_data = null
          this.error_message = `Room record with QR code: ${route.params.qr_code} not found`
          return
        }
      })
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

</style>
