<template>
  <div>
    <vs-alert color="danger" title="User Not Found" :active.sync="user_not_found">
      <span>Room record with QR code: {{ $route.params.qr_code }} not found. </span>
      <span>
        <span>Check </span><router-link :to="{name:'room'}" class="text-inherit underline">All Rooms</router-link>
      </span>
    </vs-alert>
    <div id="room_data" v-if="room_data">
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
              <img :src="room_data.owner.picture" class="rounded w-full" />
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
      room_data: null
    }
  },
  methods: {

  },
  created () {
    if (!moduleDataList.isRegistered) {
      this.$store.registerModule('roomDataList', moduleDataList)
      moduleDataList.isRegistered = true
    }

    this.$store.dispatch('roomDataList/fetchDataListItems')
    const qr_code = this.$route.params.qr_code
    this.$store.dispatch('roomDataList/fetchDataByQrCode', qr_code)
      .then(res => { this.room_data = res.data })
      .catch(err => {
        if (err.response.status === 404) {
          this.user_not_found = true
          return
        }
        console.error(err)
      })
  }
}
</script>

<script lang="scss">
#avatar-col {
  width: 10rem;
}
</script>
