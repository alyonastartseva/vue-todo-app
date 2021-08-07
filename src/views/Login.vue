<template>
  <form @submit.prevent="Login" class="card auth-card">
    <div class="card-content">
      <span class="card-title">Todo Application</span>

      <!-- Email -->
      <div class="form-group" :class="{ error: v$.form.email.$errors.length }">
        <label for="email">Email</label>
        <input id="email" class="form-control" placeholder="Enter your password" type="email" v-model="v$.form.email.$model">
        <!-- Error message -->
        <div class="input-errors" v-for="(error, index) of v$.form.email.$errors" :key="index">
          <div class="error-msg">{{ error.$message }}</div>
        </div>
      </div>

      <!-- Password -->
      <div class="form-group" :class="{ error: v$.form.password.$errors.length }">
        <label for="password">Password</label>
        <input id="password" class="form-control" placeholder="Enter your password" type="password" v-model="v$.form.password.$model">
        <!-- Error message -->
        <div class="input-errors" v-for="(error, index) of v$.form.password.$errors" :key="index">
          <div class="error-msg">{{ error.$message }}</div>
        </div>
      </div>

      <div class="card-action">
        <SubmitButton :text="'Log in'" :icon="'send'" :disabled="v$.form.$invalid"/>
        <p class="center">
          Don't have an account?
          <router-link :to="{ name: 'register' }">Register</router-link>
        </p>
      </div>
    </div>
  </form>
</template>

<script>
  import useVuelidate from '@vuelidate/core'
  import { email, required, minLength } from '@vuelidate/validators'
  import SubmitButton from '@/components/buttons/SubmitButton'

  export default {
    name: "Login",

    setup () {
      return { v$: useVuelidate() }
    },

    data() {
      return {
        form: {
          email: '',
          password: '',
        },
      }
    },

    validations() {
      return {
        form: {
          email: {
            required, email
          },
          password: {
            required,
            min: minLength(6)
          },
        },
      }
    },

    methods: {
      async Login() {
        const dataForm = {
          email: this.form.email,
          password: this.form.password
        }

        try {
          await this.$store.dispatch('login', dataForm)
          this.$router.push('/')
        } catch (e) {}
      }
    },

    components: {
      SubmitButton
    }
  }
</script>

<style lang="scss" scoped>
</style>
