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

      <!-- AUDIO CARD -->
      <div class="vx-row">
        <div class="vx-col w-full sm:w-1/4 lg:w-1/4 mb-base">
          <vx-card>
            <div slot="no-body">
                <img src="@/assets/card-img.jpg" alt="audio-img" class="responsive card-img-top">
            </div>
            <h5 class="mb-2">Audio title</h5>
            <p class="text-grey">This is test audio description.</p>
            <vs-button type="gradient" class="w-full mt-6" color="#7367F0" gradient-color-secondary="#CE9FFC">Audio</vs-button>
          </vx-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moduleDataList from '@/store/room/moduleDataList.js'
// import moduleDataList from '@/store/audio/moduleAudio.js'

export default {
  data () {
    return {
      room_data: null,
      room_not_found: false,
      error_message: ''
    }
  },
  methods: {

  },
  created () {
    if (!moduleDataList.isRegistered) {
      this.$store.registerModule('roomDataList', moduleDataList)
      moduleDataList.isRegistered = true
    }

    const qr_code = this.$route.params.qr_code
    this.$store.dispatch('roomDataList/fetchDataByQrCode', qr_code)
      .then(res => {
        if (res.data.success) {
          this.room_data = res.data.data
          this.room_not_found = false
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
      })
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

    &:not(.permissions-table) {
      td {
        @media screen and (max-width:370px) {
          display: block;
        }
      }
    }
  }
}

@media screen and (min-width:1201px) and (max-width:1211px),
only screen and (min-width:636px) and (max-width:991px) {
  #account-info-col-1 {
    width: calc(100% - 12rem) !important;
  }

  // #account-manage-buttons {
  //   width: 12rem !important;
  //   flex-direction: column;

  //   > button {
  //     margin-right: 0 !important;
  //     margin-bottom: 1rem;
  //   }
  // }

}

</style>
