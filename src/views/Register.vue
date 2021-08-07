<template>
  <form @submit.prevent="Register" class="card auth-card">
    <div class="card-content">
      <span class="card-title">Todo Application</span>

      <!-- Name -->
      <div class="form-group">
        <label for="name">Name</label>
        <input id="name" class="form-control" placeholder="Enter first name" type="text" v-model="v$.form.name.$model">
        <!-- Error Message -->
        <div class="input-errors" v-for="(error, index) of v$.form.name.$errors" :key="index">
          <div class="error-msg">{{ error.$message }}</div>
        </div>
      </div>

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

      <!-- Rules -->
      <div class="form-group" :class="{ error: v$.form.isAgree.$errors.length }">
        <p>
          <label for="isAgree">
            <input id="isAgree" type="checkbox" v-model="v$.form.isAgree.$model" />
            <span>I agree with the rules</span>
          </label>
        </p>
        <!-- Error message -->
        <div class="input-errors" v-for="(error, index) of v$.form.isAgree.$errors" :key="index">
          <div class="error-msg">{{ error.$message }}</div>
        </div>
      </div>

    </div>

    <div class="card-action">
      <SubmitButton :text="'register'" :icon="'send'" :disabled="v$.form.$invalid"/>
      <p class="center">
        Already have an account?
        <router-link :to="{ name: 'login' }">Log in!</router-link>
      </p>
    </div>
  </form>
</template>

<script>
  import useVuelidate from '@vuelidate/core'
  import { email, minLength, required } from '@vuelidate/validators'

  import SubmitButton from '@/components/buttons/SubmitButton'

  export function validName(name) {
    let validNamePattern = new RegExp("^[a-zA-Z]+(?:[-'\\s][a-zA-Z]+)*$");
    return validNamePattern.test(name);
  }

  export default {
      name: "Register",

      setup () {
        return { v$: useVuelidate() }
      },

      data() {
        return {
          form: {
            name: '',
            email: '',
            password: '',
            isAgree: false
          },
        }
      },

      validations() {
        return {
          form: {
            name: {
              required, name_validation: {
                $validator: validName,
                $message: 'Invalid Name. Valid name only contain letters, dashes (-) and spaces'
              }
            },
            email: {
              required, email
            },
            password: {
              required,
              min: minLength(6)
            },
            isAgree: {
              required
            }
          },
        }
      },

      methods: {
        async Register() {
          const dataForm = {
            email: this.form.email,
            password: this.form.password,
            name: this.form.name,
            isAgree: this.form.isAgree
          }

          try {
            await this.$store.dispatch('register', dataForm)
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
