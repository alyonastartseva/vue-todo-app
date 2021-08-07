<template>
  <div class="loader">
    <div class="preloader-wrapper big active">
      <div class="spinner-layer spinner-blue-only">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div>
        <div class="gap-patch">
          <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Loader"
  }
</script>

<style lang="scss" scoped>
  .loader {
    display: flex;
    justify-content: center;
    margin-top: 7rem;
  }
</style>
