import { createStore } from 'vuex'

import user from './modules/user'
import auth from './modules/auth'
import task from './modules/task'

export default createStore({
  modules: {
    auth,
    user,
    task
  }
})
