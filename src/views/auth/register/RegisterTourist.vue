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

    <vs-input
      v-validate="'required'"
      data-vv-validate-on="blur"
      name="city_residence"
      label-placeholder="City of Recidence"
      placeholder="City of Recidence"
      v-model="city_residence"
      class="w-full mt-6"
    />
    <span class="text-danger text-sm">{{ errors.first('city_residence') }}</span>

    <vs-input
      v-validate="'required|numeric'"
      data-vv-validate-on="blur"
      name="group_age"
      label-placeholder="Group of Age"
      placeholder="Group of Age"
      v-model="group_age"
      class="w-full mt-6"
    />
    <span class="text-danger text-sm">{{ errors.first('group_age') }}</span>

    <div class="mt-8 mb-base">
      <label class="text-sm">Gender</label>
      <div class="mt-2">
        <vs-radio v-model="gender" vs-value="1" class="mr-4">Male</vs-radio>
        <vs-radio v-model="gender" vs-value="2" class="mr-4">Female</vs-radio>
        <vs-radio v-model="gender" vs-value="0">Other</vs-radio>
      </div>
    </div>

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
    <vs-button type="border" to="/auth/login" class="mt-6">Login</vs-button>
    <vs-button
      class="float-right mt-6"
      @click.prevent="submitForm"
      :disabled="!isTermsConditionAccepted"
    >Register</vs-button>
  </form>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      surename: '',
      email: '',
      city_residence: '',
      group_age: '',
      gender: 1,
      password: '',
      confirm_password: '',
      isTermsConditionAccepted: true
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
              roles: 0,
              lang: 'en',
              city_residence: this.city_residence,
              group_age: this.group_age,
              gender: this.gender,
              address: null,
              age: null,
              vat: null,
              picture: null
            },
            notify: this.$vs.notify
          }
          this.$store
            .dispatch('auth/registerUserJWT', payload)
            .then(() => {
              this.$vs.loading.close()
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
        }
      })
    }
  }
}
</script>
