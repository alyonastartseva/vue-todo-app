<template>
  <a class="waves-effect waves-light btn-small" :class="color">
    <i class="material-icons left">{{ icon }}</i>
  </a>
</template>

<script>
  export default {
    name: "TodoItemButton",
    props: {
      color: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        required: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  a {
    margin-left: 1.1rem;
  }
  i {
    margin-right: 0;
  }
</style>
