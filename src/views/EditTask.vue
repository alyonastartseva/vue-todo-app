<template>
  <div class="row">

    <div class="edit col s6 offset-s3">
      <h2>Edit task</h2>
      <form class="edit__form" @submit.prevent="updateTask">
        <FormTask :editView="true" @sendData="getData" :submit-button="'edit'"/>
      </form>
    </div>

    <!-- Popup -->
    <Popup v-if="isPopupVisible" @closePopup="closePopupInfo" :title="'Edit task'">
      <template v-slot:content>
        <p>The task has been updated</p>
      </template>

      <template v-slot:footer>
        <AppButton @click="backRoute" :is-large="false" :color="'grey lighten-2'" :text="'Ok'" :text-color="'black-text'"/>
      </template>
    </Popup>
  </div>
</template>

<script>
  import Popup from '@/components/app/Popup'
  import FormTask from '@/components/main/FormTask'
  import AppButton from '@/components/buttons/AppButton'

  function zeroPadding(num, digit) {
    let zero = ''
    for(let i = 0; i < digit; i++) {
      zero += '0'
    }
    return (zero + num).slice(-digit)
  }

  export default {
    name: "EditTask",

    data() {
      return {
        task: {},
        isPopupVisible: false
      }
    },

    methods: {
      getData(data) {
        this.task = {
          ...data
        }
      },

      async updateTask() {
        try {
          const updatedTask = {
            ...this.task,
            date: this.getTime
          }

          if (this.task.id === this.task.parentId) {
            await this.$store.dispatch('updateTask', updatedTask)
          }
          else {
            await this.$store.dispatch('updateSubtask', updatedTask)
          }

          this.showPopupInfo()

        } catch (e) {}
      },

      showPopupInfo() {
        this.isPopupVisible = true
      },

      closePopupInfo() {
        this.isPopupVisible = false
      },

      backRoute() {
        this.$router.go(-1)
      }
    },

    computed: {
      getTime() {
        let date = new Date()

        return zeroPadding(date.getDate(), 2) + '.' + zeroPadding(date.getMonth() + 1, 2) + '.' + zeroPadding(date.getFullYear(), 4) + ' ' +
            zeroPadding(date.getHours(), 2) + ':' + zeroPadding(date.getMinutes(), 2)
      }
    },

    components: {
      Popup,
      AppButton,
      FormTask
    }
  }
</script>

<style lang="scss" scoped>
</style>
