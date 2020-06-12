<template>
  <div>
    <div id="owner-data">
      <vx-card title="Room data" class="mb-base">
        <!-- Room info -->
        <div class="vx-col flex-1">
          <table>
            <tr>
              <td class="font-semibold">Room name: </td>
              <td> testRoom</td>
            </tr>
            <tr>
              <td class="font-semibold">Room description: </td>
              <td> This is test room description.</td>
            </tr>
          </table>
        </div>
        <!-- Avatar -->
        <div class="vx-row mt-6">
          <!-- Avatar Col -->
          <div class="vx-col" id="avatar-col">
            <div class="img-container mb-4">
              <img src="@/assets/images/portrait/small/avatar-s-11.jpg" class="rounded w-full" />
            </div>
          </div>

          <!-- Information - Col 1 -->
          <div class="vx-col flex-1" id="account-info-col-1">
            <table>
              <tr>
                <td class="font-semibold">Name: </td>
                <td> Angelo Sashington</td>
              </tr>
              <tr>
                <td class="font-semibold">Email: </td>
                <td>angelo@sashington.com</td>
              </tr>
            </table>
          </div>
          <!-- /Information - Col 1 -->

          <!-- Information - Col 2 -->
          <div class="vx-col flex-1" id="account-info-col-2">
            <table>
              <tr>
                <td class="font-semibold">Address: </td>
                <td> HongKong</td>
              </tr>
              <tr>
                <td class="font-semibold">VAT:</td>
                <td> 1.223</td>
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
// import moduleDataList from '@/store/audio/moduleAudio.js'

export default {
  data () {
    return {
      owner_data: null
    }
  },
  computed: {
    // getRoom
  }
}
</script>
