<template>
  <div class="popup-wrapper" ref="popup-wrapper">
    <div class="popup">
      <div class="popup__header">
        <span>{{ title }}</span>
        <span>
          <i class="material-icons" @click="closePopup">close</i>
        </span>
      </div>
      <div class="popup__content">
        <slot name="content"></slot>
      </div>
      <div class="popup__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Popup',
    props: {
      title: {
        type: String,
        required: true
      }
    },

    methods: {
      closePopup() {
        this.$emit('closePopup')
      }
    },

    mounted() {
      document.addEventListener('click', item => {
        if (item.target === this.$refs['popup-wrapper']) {
          this.closePopup()
        }
      })
    }
  }
</script>

<style lang="scss" scoped>
  .popup-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    top: 0;
    background-color: rgba(0,0,0,0.5);
    z-index: 10;
  }

  .popup {
    padding: 16px;
    position: fixed;
    top: 50px;
    width: 400px;
    background: #fff;
    box-shadow: 0 0 17px 0 #e7e7e7;

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__content, &__footer {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
