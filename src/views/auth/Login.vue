<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center" id="page-login">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">

          <div class="vx-row no-gutter justify-center items-center">

            <div class="vx-col hidden lg:block lg:w-1/2">
              <img src="@/assets/images/pages/login.png" alt="login" class="mx-auto">
            </div>

            <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
              <div class="p-8 login-tabs-container">

                <div class="vx-card__title mb-4">
                  <h4 class="mb-4">Login</h4>
                  <p>Welcome back, please login to your account.</p>
                </div>

                <form>
                  <vs-input
                    name="email"
                    icon-no-border
                    icon="icon icon-user"
                    icon-pack="feather"
                    label-placeholder="Email"
                    v-model="email"
                    class="w-full mt-6"
                    v-validate="'required|email|min:3'"
                  />
                  <span class="text-danger text-sm" v-show="errors.has('email')">{{ errors.first('email') }}</span>

                  <vs-input
                    type="password"
                    name="password"
                    icon-no-border
                    icon="icon icon-lock"
                    icon-pack="feather"
                    label-placeholder="Password"
                    v-model="password"
                    class="w-full mt-6"
                    v-validate="'required'"
                    @keyup.enter="submitForm"
                  />
                  <span class="text-danger text-sm" v-show="errors.has('password')">{{ errors.first('password') }}</span>

                  <div class="flex flex-wrap justify-between my-5 mt-6">
                      <vs-checkbox v-model="checkbox_remember_me" class="mb-3">Remember Me</vs-checkbox>
                      <router-link to="">Forgot Password?</router-link>
                  </div>

                  <router-link class="flex flex-wrap mb-5" to="/room">Go to room</router-link>

                  <vs-button to="/auth/register" type="border" class="mb-2">Register</vs-button>
                  <vs-button @click.prevent="submitForm" class="float-right mb-2">Login</vs-button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

export default{
  data () {
    return {
      email: "",
      password: "",
      checkbox_remember_me: false,
    }
  },
  methods: {
    submitForm () {
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          this.$vs.loading()

          const payload = {
            checkbox_remember_me: this.checkbox_remember_me,
            userDetails: {
              email: this.email,
              password: this.password
            }
          }

          this.$store.dispatch('auth/loginJWT', payload)
            .then(() => {
              this.$vs.loading.close()
              this.$router.go(-1)
            })
            .catch(error => {
              this.$vs.loading.close()
              this.$vs.notify({
                title: 'Error',
                text: error.message,
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'danger'
              })
            })
        } else {
        }
      })
    },
  }
}
</script>

<style lang="scss">
#page-login {
  .social-login-buttons {
    .bg-facebook { background-color: #1551b1 }
    .bg-twitter { background-color: #00aaff }
    .bg-google { background-color: #4285F4 }
    .bg-github { background-color: #333 }
  }
}
</style>
