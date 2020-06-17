<!-- =========================================================================================
  File Name: AddNewDataSidebar.vue
  Description: Add New Data - Sidebar component
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <vs-sidebar
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{ Object.entries(this.data).length === 0 ? "ADD NEW" : "UPDATE" }} ROOM</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <component
      :is="scrollbarTag"
      class="scroll-area--data-list-add-new"
      :settings="settings"
      :key="$vs.rtl"
    >
      <div class="p-6">
        <template v-if="dataQrCode">
          <div class="img-container w-64 mx-auto flex items-center justify-center">
            <vx-qrcode :value="dataQrCode" :size="220" class="responsive" />
          </div>

          <div class="w-64 mx-auto flex items-center justify-center mt-5">
            <vs-button class="mr-4" type="flat" @click="updateCurrQrCode">Update QrCode</vs-button>
          </div>
        </template>

        <vs-input
          label="Title"
          v-model="dataTitle"
          class="mt-5 w-full"
          name="item-title"
          v-validate="'required'"
        />
        <span
          class="text-danger text-sm"
          v-show="errors.has('item-title')"
        >{{ errors.first('item-title') }}</span>

        <vs-textarea
          label="Description"
          v-model="dataDescription"
          class="mt-5 w-full"
          rows="5"
          v-validate="'required'"
          name="item-description"
        />
        <span
          class="text-danger text-sm"
          v-show="errors.has('item-description')"
        >{{ errors.first('item-description') }}</span>

        <div class="upload-img mt-5" v-if="!dataQrCode">
          <vs-button @click="updateCurrQrCode">Generate QrCode</vs-button>
        </div>
      </div>
    </component>

    <div class="flex flex-wrap items-center float-right p-6" slot="footer">
      <vs-button class="mr-6" @click="submitData" :disabled="!isFormValid">Submit</vs-button>
      <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">Cancel</vs-button>
    </div>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import randomstring from 'randomstring'
import {apiURL} from '@/axios.js'

export default {
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    VuePerfectScrollbar
  },
  data () {
    return {
      dataId: null,
      dataTitle: '',
      dataQrCode: '',
      dataDescription: '',

      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    }
  },
  watch: {
    isSidebarActive (val) {
      if (!val) return
      if (Object.entries(this.data).length === 0) {
        this.initValues()
        this.$validator.reset()
      } else {
        const { description, id, qr_code, name } = JSON.parse(
          JSON.stringify(this.data)
        )
        this.dataId = id
        this.dataDescription = description
        this.dataQrCode = apiURL + '/room/view/' + qr_code
        this.dataTitle = name
        this.initValues()
      }
      // Object.entries(this.data).length === 0 ? this.initValues() : { this.dataId, this.dataName, this.dataCategory, this.dataOrder_status, this.dataPrice } = JSON.parse(JSON.stringify(this.data))
    }
  },
  computed: {
    isSidebarActiveLocal: {
      get () {
        return this.isSidebarActive
      },
      set (val) {
        if (!val) {
          this.$emit('closeSidebar')
          // this.$validator.reset()
          // this.initValues()
        }
      }
    },
    isFormValid () {
      return !this.errors.any() && this.dataTitle && this.dataDescription && this.dataQrCode
    },
    scrollbarTag () {
      return this.$store.getters.scrollbarTag
    }
  },
  methods: {
    initValues () {
      if (this.data.id) return
      this.dataQrCode = ''
      this.dataId = null
      this.dataTitle = ''
      this.dataDescription = ''
    },
    submitData () {
      this.$validator.validateAll().then(result => {
        if (result) {
          let qr_code = this.dataQrCode.substring(this.dataQrCode.lastIndexOf('/') + 1)
          const obj = {
            id: this.dataId,
            name: this.dataTitle,
            qr_code: qr_code,
            description: this.dataDescription
          }

          if (this.dataId !== null && this.dataId >= 0) {
            this.$store.dispatch('moduleRoom/updateRoom', obj).catch(err => {
              console.error(err)
            })
          } else {
            delete obj.id;
            this.$store.dispatch('moduleRoom/addRoom', obj).catch(err => {
              console.error(err)
            })
          }
          this.$emit('closeSidebar')
          this.initValues()
        }
      })
    },
    updateCurrQrCode () {
      this.dataQrCode = apiURL + '/room/view/' + randomstring.generate({length: 30})
    }
  }
}
</script>

<style lang="scss" scoped>
.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
    z-index: 52010;
    width: 400px;
    max-width: 90vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }
}

.scroll-area--data-list-add-new {
  // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
  height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);

  &:not(.ps) {
    overflow-y: auto;
  }
}
</style>
