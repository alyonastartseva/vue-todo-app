<template>
  <button class="btn waves-effect waves-light" type="submit" name="action" :class="color">
    {{ text }}
    <i class="material-icons right">{{ icon }}</i>
  </button>
</template>

<script>
  export default {
    name: "SubmitButton",
    props: {
      text: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        required: false
      },
      color: {
        type: String,
        required: false
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
