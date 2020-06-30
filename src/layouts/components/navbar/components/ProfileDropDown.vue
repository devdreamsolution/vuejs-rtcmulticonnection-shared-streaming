<template>
  <div class="the-navbar__user-meta flex items-center">
    <div class="text-right leading-tight hidden sm:block">
      <p class="font-semibold" v-if="UserInfo">{{ UserInfo.name }} {{ UserInfo.surename }}</p>
      <p class="font-semibold" v-else>Unknown</p>
      <small>Available</small>
    </div>
    <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
      <div class="con-img ml-3">
        <img
          v-if="UserInfo"
          key="onlineImg"
          :src="UserInfo.picture"
          alt="user-img"
          width="40"
          height="40"
          class="rounded-full shadow-md cursor-pointer block"
        />
        <img
          v-else
          key="onlineImg"
          :src="apiURL + '/assets/images/unknown-avatar.jpg'"
          alt="user-img"
          width="40"
          height="40"
          class="rounded-full shadow-md cursor-pointer block"
        />
      </div>

      <vs-dropdown-menu class="vx-navbar-dropdown">
        <ul style="min-width: 9rem">
          <!-- <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="UserIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Profile</span>
          </li>

          <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="MailIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Inbox</span>
          </li>

          <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="CheckSquareIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Tasks</span>
          </li>

          <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="MessageSquareIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Chat</span>
          </li>

          <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="HeartIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Wish List</span>
          </li>

          <vs-divider class="m-1" /> -->

          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="loginOrLogout"
          >
            <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
            <span class="ml-2" v-if="UserInfo">Logout</span>
            <span class="ml-2" v-else>Login</span>
          </li>
        </ul>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>

<script>
import {apiURL} from '@/axios.js'

export default {
  data () {
    return {
      apiURL: apiURL,
    }
  },
  computed: {
    // activeUserInfo () {
    //   return this.$store.state.AppActiveUser
    // },
    UserInfo () {
      return localStorage.getItem('UserInfo') ? JSON.parse(localStorage.getItem('UserInfo')) : null
    }
  },
  methods: {
    loginOrLogout () {
      localStorage.removeItem('UserInfo')
      localStorage.removeItem('AccessToken')
      localStorage.removeItem("RefreshToken")
      // This is just for demo Purpose. If user clicks on logout -> redirect
      this.$router.push('/auth/login').catch(() => {})
    },
  }
}
</script>
