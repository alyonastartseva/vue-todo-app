<template>
  <div class="row">

    <div class="create col s6 offset-s3">
      <h2>Create task</h2>
      <form class="create__form" @submit.prevent="createTask">
        <FormTask @sendData="getData" :submit-button="'create'"/>
      </form>
    </div>

    <!-- Popup -->
    <Popup v-if="isPopupVisible" @closePopup="closePopupInfo" :title="'Create task'">
      <template v-slot:content>
        <p>The task has been created</p>
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
    name: "CreateTask",

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

      async createTask() {
        if (this.$route.params.parentId) {
          const id = this.$route.params.parentId

          try {
            await this.$store.dispatch('createSubtask', {
              ...this.task,
              date: this.getTime,
              completed: false,
              parentId: id
            })

            this.showPopupInfo()
          } catch (e) {}
        }
        else {
          try {
            await this.$store.dispatch('createTask', {
              ...this.task,
              date: this.getTime,
              completed: false
            })

            this.showPopupInfo()
          } catch (e) {}
        }
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
