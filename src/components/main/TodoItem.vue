<template>
  <!-- TodoItem -->
  <li class="item" :class="{ completed: task.completed, overdue: isOverdue }">
     <label>
       <input @change="updateProgress(task)" type="checkbox" v-model="task.completed"/>
       <span class="item__title">{{ task.title }}</span>
     </label>

     <div class="item__config">
       <router-link :to="{ name: 'details', params: { id: task.id, parentId: task.parentId }}">
         <TodoItemButton :color="'light-blue lighten-2'" :icon="'open_in_new'"/>
       </router-link>

       <router-link :to="{ name: 'edit', params: { parentId: task.parentId, id: task.id }}">
         <TodoItemButton :color="'teal lighten-2'" :icon="'edit'"/>
       </router-link>

       <TodoItemButton @click="showPopupInfo" :color="'grey'" :icon="'delete_outline'"/>
    </div>
  </li>

    <!-- Popup -->
    <popup v-if="isPopupVisible" @closePopup="closePopupInfo" :title="'Delete task'">
      <template v-slot:content>
        <p>Delete task "{{ task.title }}" ?</p>
      </template>

      <template v-slot:footer>
        <AppButton @click="deleteTask(task)" :is-large="false" :color="'red lighten-1'" :text="'Delete'"/>
      </template>
    </popup>
</template>

<script>
  import Popup from '@/components/app/Popup'
  import TodoItemButton from '@/components/buttons/TodoItemButton'
  import AppButton from '@/components/buttons/AppButton'

  function zeroPadding(num, digit) {
    let zero = ''
    for(let i = 0; i < digit; i++) {
      zero += '0'
    }
    return (zero + num).slice(-digit)
  }

  export default {
    name: 'TodoItem',
    props: {
      task: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        isPopupVisible: false
      }
    },

    computed: {
      isOverdue() {
        const date = new Date()

        const dateCompletion = new Date(this.task.dateCompletion)
        const dateNow = new Date(zeroPadding(date.getDate(), 2) + '.' + zeroPadding(date.getMonth() + 1, 2) + '.' + zeroPadding(date.getFullYear(), 4))

        const timeCompletion = this.task.timeCompletion
        const timeNow = zeroPadding(date.getHours(), 2) + ':' + zeroPadding(date.getMinutes(), 2)

        if (dateCompletion.getTime() < dateNow.getTime()) {
          return true
        }
        else if (dateCompletion.getTime() === dateNow.getTime()) {
          return timeCompletion <= timeNow
        }
        else {
          return false
        }
      }
    },

    methods: {
      async deleteTask(task) {

        if (task.id === task.parentId) {
          await this.$store.dispatch('deleteTask', task)
        }
        else {
          await this.$store.dispatch('deleteSubtask', task)
        }

        this.closePopupInfo()
      },

      async updateProgress(task) {

        if (task.id === task.parentId) {
          await this.$store.dispatch('updateProgressTask', task)
        }
        else {
          await this.$store.dispatch('updateProgressSubtask', task)
        }

      },

      showPopupInfo() {
        this.isPopupVisible = true
      },

      closePopupInfo() {
        this.isPopupVisible = false
      }
    },

    components: {
      TodoItemButton,
      AppButton,
      Popup
    }
  }
</script>

<style lang="scss" scoped>
  .item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding: 1.2rem 2rem;
    background: #FAFAFD;
    border: 2px solid #E4E4E4;
    border-radius: 6px;

    &__title {
      color: #06131f;
      font-weight: bold;
      font-size: 1.1rem;
    }
  }

  .completed {
    background: #e0f2f1;
    border-color: #e0f2f1;
  }

  .overdue {
    background: #fccbdb;
    border-color: #fccbdb;
  }
</style>
