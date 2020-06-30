<template>
  <div class="mt-5" id="audio-create">
    <audio-recorder
      :upload-url="uploadUrl"
      :attempts="1"
      :time="2"
      :before-recording="callback"
      :pause-recording="callback"
      :after-recording="callback"
      :select-record="callback"
      :before-upload="callback"
      :successful-upload="callback"
      :failed-upload="callback"
    />
  </div>
</template>

<script>

export default {
  data () {
    return {
      uploadUrl: "/api/audio/" + this.$route.params.room_id + "/create",
    }
  },
  methods: {
    callback (data) {
      // console.log('success')
    }
  }
}
</script>

<style lang="scss">
#audio-create {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
