<template>
  <a class="waves-effect waves-light btn-large" :class="[ { 'btn-large': isLarge, 'btn-small': !isLarge }, color, textColor]">
    <i class="material-icons left">{{ icon }}</i>
    {{ text }}
  </a>
</template>

<script>
  export default {
    name: "AppButton",
    props: {
      text: {
        type: String,
        required: false
      },
      textColor: {
        type: String,
        required: false
      },
      icon: {
        type: String,
        required: false
      },
      color: {
        type: String,
        required: false
      },
      isLarge: {
        type: Boolean,
        required: true
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
