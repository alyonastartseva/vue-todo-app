<template>
   <Loader v-if="loading"/>

   <div v-else class="tasks">
     <template v-if="tasks.length">
       <TodoList :tasks="tasksOfPage" />

       <ul class="pagination">
         <li class="waves-effect">
           <a href="#" v-if="pagination.page !== 1" @click="pagination.page--">Previous</a>
         </li>
         <li class="waves-effect">
           <a href="#"
              v-for="pageNumber in pagination.pages.slice(pagination.page - 1, pagination.page + 5)"
              @click="pagination.page = pageNumber"
              :class="{ current: pageNumber === pagination.page }"
           > {{ pageNumber }}
           </a>
         </li>
         <li class="waves-effect">
           <a href="#" v-if="pagination.page < pagination.pages.length" @click="pagination.page++">Next</a>
         </li>
       </ul>

     </template>
     <p v-else class="message">You have no tasks. Click on the "Create task" button to add a new task.</p>

     <router-link :to="{ name: 'create' }">
       <AppButton :text="'Create task'" :color="'pink accent-2'" :icon="'add'" :is-large="true" />
     </router-link>
   </div>
</template>

<script>
  import TodoList from '@/components/main/TodoList'
  import AppButton from '@/components/buttons/AppButton'
  import Loader from '@/components/app/Loader'

  export default {
    name: 'Tasks',

    data() {
      return {
        loading: true,
        pagination: {
          page: 1,
          perPage: 5,
          pages: []
        }
      }
    },

    methods: {
      setPages () {
        let numberOfPages = Math.ceil(this.tasks.length / this.pagination.perPage)
        for (let index = 1; index <= numberOfPages; index++) {
          this.pagination.pages.push(index)
        }
      },

      paginate (tasks) {
        let page = this.pagination.page
        let perPage = this.pagination.perPage
        let from = (page * perPage) - perPage
        let to = (page * perPage)
        return tasks.slice(from, to)
      }
    },

    computed: {
      tasks() {
        return this.$store.getters.getTasks.sort((a, b) => a.completed > b.completed ? 1 : -1)
      },

      tasksOfPage() {
        return this.paginate(this.tasks)
      }
    },

    watch: {
      tasks() {
        this.setPages()
      }
    },

    async mounted() {
      await this.$store.dispatch('fetchTasks')
      this.loading = false
    },

    components: {
      Loader,
      TodoList,
      AppButton
    }
  }
</script>

<style lang="scss" scoped>
  .current {
    background: #b6c3f5;
  }
</style>
