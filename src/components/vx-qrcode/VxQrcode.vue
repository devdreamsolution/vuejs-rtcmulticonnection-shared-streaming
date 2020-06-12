<template>
  <div>
    <qrcode-vue :value="value" :size="size" level="H"></qrcode-vue>
  </div>
</template>
<script>
  import QrcodeVue from 'qrcode.vue'
  export default {
    name: 'vx-qrcode',
    props: ['value','size'],
    components: {
      QrcodeVue,
    },
  }
</script>
