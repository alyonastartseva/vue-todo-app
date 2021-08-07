<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
  import AuthLayout from '@/layouts/AuthLayout'
  import MainLayout from '@/layouts/MainLayout'

  export default {
    name: 'App',

    computed: {
      layout() {
        return (this.$route.meta.layout || 'mainLayout')
      }
    },

    components: {
      AuthLayout,
      MainLayout
    }
  }
</script>

<style lang="scss">
  @import "~materialize-css/dist/css/materialize.min.css";

  body {
    color: #311b92;
  }

  .message {
    padding: 1rem 2rem;
    color: #3b0000;
    background: #fde0e0;
    border: 2px solid #fdc3c3;
    border-radius: 6px;
  }
</style>
