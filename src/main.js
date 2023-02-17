import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from "firebase/app";
import store from './store'
import excel from 'vue-excel-export'
 
Vue.use(excel)

const firebaseConfig = {
    apiKey: "AIzaSyBzCrf8p2o_Yv9Ab-QJFfzeXwvTFiwMtKc",
    authDomain: "caller-record.firebaseapp.com",
    projectId: "caller-record",
    storageBucket: "caller-record.appspot.com",
    messagingSenderId: "887807640567",
    appId: "1:887807640567:web:113120b8b7496fe9e264f2"
};

firebase.initializeApp((firebaseConfig))

Vue.config.productionTip = false

new Vue({
  router,
  firebaseConfig,
  store,
  excel,
  render: h => h(App)
}).$mount('#app')