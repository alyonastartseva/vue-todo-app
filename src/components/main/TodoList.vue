<template>
  <ul>
    <TodoItem v-for="(task, i) in tasks" :key="task.id" :task="task"/>
  </ul>
</template>

<script>
  import TodoItem from '@/components/main/TodoItem'

  export default {
    name: 'TodoList',
    props: {
      tasks: {
        type: Object,
        required: true
      }
    },

    components: {
      TodoItem
    }
  }
</script>

<style lang="scss" scoped>
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
