<!-- =========================================================================================
File Name: RegisterJWT.vue
Description: Register Page for JWT
----------------------------------------------------------------------------------------
Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <form>
    <vs-input
      v-validate="'required|alpha_dash'"
      data-vv-validate-on="blur"
      label-placeholder="Name"
      name="name"
      placeholder="Name"
      v-model="name"
      class="w-full"
    />
    <span class="text-danger text-sm">{{ errors.first('name') }}</span>

    <vs-input
      v-validate="'required|alpha_dash'"
      data-vv-validate-on="blur"
      label-placeholder="Surename"
      name="surename"
      placeholder="Surename"
      v-model="surename"
      class="w-full mt-6"
    />
    <span class="text-danger text-sm">{{ errors.first('surename') }}</span>

    <vs-input
      v-validate="'required|email'"
      data-vv-validate-on="blur"
      name="email"
      type="email"
      label-placeholder="Email"
      placeholder="Email"
      v-model="email"
      class="w-full mt-6"
    />
    <span class="text-danger text-sm">{{ errors.first('email') }}</span>

    <div>
      <vs-avatar :src="url" size="130px" class="mt-6"></vs-avatar>
      <vs-input
        type="file"
        name="picture"
        v-validate="'required'"
        data-vv-validate-on="blur"
        v-model="picture"
        class="w-full"
        @change="onFileChange"
      />
      <span class="text-danger text-sm">{{ errors.first('picture') }}</span>
    </div>

    <vs-input
      v-validate="'required|numeric'"
      data-vv-validate-on="blur"
      name="age"
      label-placeholder="Age"
      placeholder="Age"
      v-model="age"
      class="w-full mt-6"
    />
    <span class="text-danger text-sm">{{ errors.first('age') }}</span>

    <vs-input
      v-validate="'required|between:0,9999999999'"
      data-vv-validate-on="blur"
      name="vat"
      label-placeholder="VAT"
      placeholder="VAT"
      v-model="vat"
      class="w-full mt-6"
    />
    <span class="text-danger text-sm">{{ errors.first('vat') }}</span>

    <vs-input
      v-validate="'required'"
      data-vv-validate-on="blur"
      name="address"
      label-placeholder="Address or City"
      placeholder="Address or City"
      v-model="address"
      class="w-full mt-6"
    />
    <span class="text-danger text-sm">{{ errors.first('address') }}</span>

    <vs-input
      ref="password"
      type="password"
      data-vv-validate-on="blur"
      v-validate="'required|min:6|max:10'"
      name="password"
      label-placeholder="Password"
      placeholder="Password"
      v-model="password"
      class="w-full mt-6"
    />
    <span class="text-danger text-sm">{{ errors.first('password') }}</span>

    <vs-input
      type="password"
      v-validate="'min:6|max:10|confirmed:password'"
      data-vv-validate-on="blur"
      data-vv-as="password"
      name="confirm_password"
      label-placeholder="Confirm Password"
      placeholder="Confirm Password"
      v-model="confirm_password"
      class="w-full mt-6"
    />
    <span class="text-danger text-sm">{{ errors.first('confirm_password') }}</span>

    <vs-checkbox v-model="isTermsConditionAccepted" class="mt-6">I accept the terms & conditions.</vs-checkbox>
    <vs-button  type="border" to="/auth/login" class="mt-6">Login</vs-button>
    <vs-button class="float-right mt-6" @click.prevent="submitForm" :disabled="!isTermsConditionAccepted">Register</vs-button>
  </form>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      surename: '',
      email: '',
      password: '',
      confirm_password: '',
      age: '',
      vat: '',
      address: '',
      isTermsConditionAccepted: true,
      picture: null,
      file: null,
      url: ''
    }
  },
  methods: {
    submitForm () {
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          this.$vs.loading()

          const payload = {
            userDetails: {
              username: this.email,
              name: this.name,
              surename: this.surename,
              password: this.password,
              confirmPassword: this.confirm_password,
              roles: 1,
              lang: 'en',
              city_residence: null,
              group_age: null,
              gender: null,
              address: this.address,
              age: this.age,
              vat: this.vat,
              picture: this.file
            },
            notify: this.$vs.notify
          }
          this.$store.dispatch('auth/registerUserJWT', payload)
          .then(() => { this.$vs.loading.close() })
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
        }
      })
    },

    onFileChange (e) {
      const file = e.target.files[0]

      if (file) {
        this.url = URL.createObjectURL(file)
        this.file = file
      } else {
        this.url = ''
        this.file = null
      }
    }
  }
}
</script>
