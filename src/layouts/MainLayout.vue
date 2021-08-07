<template>
  <Loader v-if="loading"/>
  <div v-else class="layout">
    <Navbar />
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/app/Navbar'
import Loader from '@/components/app/Loader'

  export default {
    name: "MainLayout",

    data() {
      return {
        loading: true
      }
    },

    async mounted() {
      if (!Object.keys(this.$store.getters.getInfo).length) {
        await this.$store.dispatch('fetchInfo')
        this.loading = false
      }
    },

    components: {
      Navbar,
      Loader
    }
  }
</script>

<style lang="scss" scoped>
  .layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: url('../assets/images/bg.png') no-repeat center;
  }

  .container {
    flex: 1 0 auto;
    padding-top: 1.5rem;
  }
</style>
