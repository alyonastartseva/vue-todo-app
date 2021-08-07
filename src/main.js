import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import 'material-design-icons-iconfont'
import 'materialize-css/dist/js/materialize.min'

import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/database'

let app = null
firebase.initializeApp({
    apiKey: "AIzaSyAQ3GVbi3nrZuvsS5uzH1wZf2IR-BWQvko",
    authDomain: "vue-todo-app-8d58a.firebaseapp.com",
    projectId: "vue-todo-app-8d58a",
    storageBucket: "gs://vue-todo-app-8d58a.appspot.com",
    messagingSenderId: "433353243006",
    appId: "1:433353243006:web:7e782ec88d2ddf0acf1b2f",
    measurementId: "G-M5EZHXX2X0"
})

firebase.auth().onAuthStateChanged(() => {
    if (!app) {
        app = createApp(App).use(store).use(router).mount('#app')
    }
})


