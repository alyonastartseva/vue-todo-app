<template>
  <nav class="indigo lighten-1">
    <div class="nav-wrapper">
      <router-link :to="{ name: 'tasks' }" class="brand-logo">
        Todo App
      </router-link>
      <ul class="right hide-on-small-and-down">
        <li>
          <a
              class="dropdown-trigger white-text"
              href="#"
              data-target="dropdown"
              ref="dropdown"
          >
            {{ userName }}
            <i class="material-icons right">arrow_drop_down</i>
          </a>

          <ul id='dropdown' class='dropdown-content'>
            <li class="divider" tabindex="-1"></li>
            <li>
              <a href="#" class="black-text" @click.prevent="logout">
                <i class="material-icons">assignment_return</i>
                Log out
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
  export default {
    name: "Navbar",

    methods: {
      async logout() {
        await this.$store.dispatch('logout')
        this.$router.push('/login')
      }
    },

    computed: {
      userName() {
        return this.$store.getters.getInfo.name
      }
    },

    mounted() {
      this.dropdown = M.Dropdown.init(this.$refs.dropdown, {
        constrainWidth: false
      })
    }
  }
</script>

<style lang="scss" scoped>
  nav {
    padding: 0 2rem;
  }
</style>
