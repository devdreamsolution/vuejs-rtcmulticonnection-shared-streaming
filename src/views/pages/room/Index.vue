<template>
  <div id="data-list-thumb-view" class="data-list-container">
    <data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      :data="sidebarData"
    />

    <vs-popup :title="qrCodeModalTitle" :active.sync="popupActive">
       <vx-qrcode :value="qrCodeModalValue" :size=250 class="vx-qrcode"/>
    </vs-popup>
    <vs-table
      ref="table"
      multiple
      v-model="selected"
      pagination
      :max-items="itemsPerPage"
      search
      :data="rooms"
    >
      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
        <div class="flex flex-wrap-reverse items-center">
          <!-- ACTION - DROPDOWN -->
          <!-- <div
            class="p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-between text-lg font-medium text-base text-danger border border-solid border-danger"
            v-if="userRoles.includes('ROLE_GUIDE')"
            @click="removeSelectedData"
          >
            <feather-icon icon="DeleteIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-danger">Delete</span>
          </div> -->

          <!-- ADD NEW -->
          <div
            class="p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-between text-lg font-medium text-base text-primary border border-solid border-primary"
            @click="addNewData"
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
            >{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ rooms.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : rooms.length }} of {{ queriedItems }}</span>
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
        <vs-th>Qrcode</vs-th>
        <vs-th sort-key="name">Title</vs-th>
        <vs-th sort-key="description">Description</vs-th>
        <vs-th v-if="userRoles.includes('ROLE_GUIDE')">Action</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :data="tr" :key="indextr"  v-for="(tr, indextr) in data">
            <vs-td class="img-container">
              <a @click.stop="showQrCode(tr)">
                <vx-qrcode :value="baseUrl + '/' + tr.id + '/view/' + tr.qr_code" :size=100 class="product-img"  @click.stop="editData(tr)"/>
              </a>
            </vs-td>

            <vs-td>
              <p class="product-name font-medium truncate">{{ tr.name }}</p>
            </vs-td>

            <vs-td>
              <p class="product-category">{{ tr.description }}</p>
            </vs-td>

            <vs-td class="whitespace-no-wrap">
              <feather-icon
                icon="EditIcon"
                svgClasses="w-5 h-5 hover:text-primary stroke-current"
                @click.stop="editData(tr)"
                v-if="userRoles.includes('ROLE_GUIDE') && UserInfo.id == tr.owner.id"
              />
              <feather-icon
                icon="TrashIcon"
                svgClasses="w-5 h-5 hover:text-danger stroke-current"
                class="ml-2"
                @click.stop="deleteData(tr.id)"
                v-if="userRoles.includes('ROLE_GUIDE') && UserInfo.id == tr.owner.id"
              />
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>

<script>
import DataViewSidebar from './module/DataViewSidebar.vue'
import moduleRoom from '@/store/room/moduleRoom.js'
import {apiURL} from '@/axios.js'

export default {
  components: {
    DataViewSidebar
  },
  data () {
    return {
      selected: [],
      // rooms: [],
      itemsPerPage: 4,
      isMounted: false,
      addNewDataSidebar: false,
      sidebarData: {},
      apiURL: apiURL,
      popupActive: false,
      qrCodeModalTitle: '',
      qrCodeModalValue: '',
      baseUrl: window.location.href
    }
  },
  computed: {
    userRoles()
    {
      return localStorage.getItem('UserInfo') ? JSON.parse(localStorage.getItem('UserInfo')).roles : []
    },
    UserInfo() {
      return localStorage.getItem('UserInfo') ? JSON.parse(localStorage.getItem('UserInfo')) : []
    },
    currentPage () {
      if (this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0;
    },
    rooms () {
      return this.$store.state.moduleRoom.rooms
    },
    queriedItems () {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.rooms.length;
    }
  },
  methods: {
    addNewData () {
      this.sidebarData = {}
      this.toggleDataSidebar(true)
    },
    deleteData (id) {
      this.$store.dispatch("moduleRoom/removeRoom", id).catch(err => {
        console.error(err);
      });
    },
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
    deleteRecords(data)
    {
      console.log(data)
    },
    showQrCode(data)
    {
      this.qrCodeModalTitle = data.name
      this.qrCodeModalValue = this.baseUrl + '/' + data.id + '/view/' + data.qr_code
      this.popupActive = true

    },
    editData (data) {
      // this.sidebarData = JSON.parse(JSON.stringify(this.blankData))
      this.sidebarData = data
      this.toggleDataSidebar(true)
    },
    toggleDataSidebar (val = false) {
      this.addNewDataSidebar = val
    }
  },
  created () {
    if (!moduleRoom.isRegistered) {
      this.$store.registerModule('moduleRoom', moduleRoom)
      moduleRoom.isRegistered = true
    }
    this.$store.dispatch('moduleRoom/fetchRooms')
  },
  mounted () {
    this.isMounted = true
  }
}
</script>

<style lang="scss">
.vs-popup
{
  width: 340px !important;
  height: 335px !important;
}
.vx-qrcode
{
  margin-left: 30px;
}

#data-list-thumb-view {
  .vs-con-table {
    .product-name {
      max-width: 23rem;
    }

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
          &.img-container {
            // width: 1rem;
            // background: #fff;

            span {
              display: flex;
              justify-content: flex-start;
            }

            .product-img {
              height: 110px;
            }
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
</style>
