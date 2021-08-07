<template>
  <div class="row">
   <div class="container">
     <Loader v-if="loading"/>

     <div v-else class="details">
       <div v-if="task">

        <!-- Description of the task -->
         <h4 class="center">Task "{{ task.title }}"</h4>

         <p v-if="task.description">Description: {{ task.description }}</p>
         <p>Creation / modification datetime: {{ task.date }}</p>
         <p>Importance: {{ task.importance }}</p>
         <p>Datetime of completion: {{ task.dateCompletion}} {{ task.timeCompletion }}</p>
         <p v-if="overdueBy !== 0">The task is overdue for {{ overdueBy }} days</p>
         <p v-if="task.completed">Completed: Task completed</p>
         <p v-else>Completed: Task not completed</p>

         <!-- Uploaded files -->
         <template v-if="task.files">
           <div v-if="task.files.length" class="files">
             <div v-for="(file, idx) in task.files" :key="idx">
               <div class="file">
                 <div class="file__preview_img">
                   <figure v-if="file.preview">
                     <img :src="file.preview" alt="Preview of uploaded image" height="100">
                   </figure>
                   <div v-else class="file__preview">
                     <i class="material-icons">upload_file</i>
                     <span>{{ file.name }}</span>
                   </div>
                 </div>
                 <div class="file__download">
                   <TodoItemButton v-if="file.preview" :href="file.preview" :download="file.name" :icon="'file_download'" :color="'blue darken-2'"/>
                   <TodoItemButton v-else :href="task.filesUrl[idx]" :download="file.name" :icon="'file_download'" :color="'blue darken-2'"/>
                 </div>
               </div>
             </div>
           </div>
         </template>

         <!-- Subtasks of the task -->
         <div v-if="task.id === task.parentId">
           <hr>
           <h5 class="center">Subtasks</h5>
           <TodoList v-if="subtasks.length" :tasks="subtasks" />
           <p v-else class="message">This task has no subtasks. Click the "Create Subtask" button to add a subtask.</p>
         </div>

         <!-- Buttons -->
         <div class="details__buttons">
           <!--Create button-->

           <router-link v-if="task.id === task.parentId" :to="{ name: 'create', params: { parentId: task.id }}">
             <AppButton :text="'Create subtask'" :icon="'add'" :color="'pink accent-2'" :is-large="false"/>
           </router-link>

           <!--Back button-->
           <AppButton @click="backRoute" :text="'back'" :icon="'arrow_back'" :color="'grey'" :is-large="false"/>
         </div>

       </div>
       <p v-else class="message">There is no such task</p>
     </div>
   </div>
  </div>
</template>

<script>
  import AppButton from '@/components/buttons/AppButton'
  import TodoItemButton from '@/components/buttons/TodoItemButton'
  import Loader from '@/components/app/Loader'
  import TodoList from '@/components/main/TodoList'

  function zeroPadding(num, digit) {
    let zero = ''
    for(let i = 0; i < digit; i++) {
      zero += '0'
    }
    return (zero + num).slice(-digit)
  }

  export default {
    name: "DetailsTask",

    data() {
      return {
        task: null,
        loading: true
      }
    },

    methods: {
      backRoute() {
        this.$router.go(-1)
      }
    },

    computed: {
      subtasks() {
        return this.$store.getters.getSubtasks.sort((a, b) => a.completed > b.completed ? 1 : -1)
      },

      overdueBy() {
        const date = new Date()

        const dateCompletion = new Date(this.task.dateCompletion.slice(3, 5) + '.' + this.task.dateCompletion.slice(0, 2) + '.' + this.task.dateCompletion.slice(6))
        const dateNow = new Date(zeroPadding(date.getMonth() + 1, 2) + '.' + zeroPadding(date.getDate(), 2)  + '.' + zeroPadding(date.getFullYear(), 4))

        let timeDiff = dateNow.getTime() - dateCompletion.getTime()

        if (timeDiff > 0) {
          return Math.ceil(timeDiff / (1000 * 3600 * 24))
        }
        else {
          return 0
        }
      }
    },

    async updated() {
      const id = this.$route.params.id,
          parentId = this.$route.params.parentId
      let task

      if (id === parentId) {
        task = this.$store.getters.getTaskById(id)
        await this.$store.dispatch('fetchSubtasks', id)
      }
      else {
        task = this.$store.getters.getSubtaskById(id)
      }

      this.task = {
        ...task
      }

      this.loading = false
    },

    async mounted() {
      const id = this.$route.params.id,
            parentId = this.$route.params.parentId
      let task

      if (id === parentId) {
        task = this.$store.getters.getTaskById(id)
        await this.$store.dispatch('fetchSubtasks', id)
      }
      else {
        task = this.$store.getters.getSubtaskById(id)
      }

      this.task = {
        ...task
      }

      this.loading = false
    },

    components: {
      TodoItemButton,
      AppButton,
      Loader,
      TodoList
    }
  }
</script>

<style lang="scss" scoped>

  .material-icons {
    font-size: 3rem;
  }

  figure {
    width: 200px;
    height: 200px;
    margin: 0;
  }

  figure img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .files {
    display: flex;
  }

  .file {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;
    margin-right: 20px;
    &__preview {
      display: flex;
      align-items: center;
    }
    &__download {
      margin-top: 15px;
    }
  }
  .details {
    &__buttons {
      display: flex;
      justify-content: space-between;
    }
  }
</style>
