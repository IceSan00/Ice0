import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

// import  firebase  from "firebase/app";
// import  "firebase/firestore";

import { initializeApp } from "firebase/app";

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyBrIMLcqU9DSkli4VlCd0yPk96a09axpR0",
  authDomain: "ite111-5b700.firebaseapp.com",
  projectId: "ite111-5b700",
  storageBucket: "ite111-5b700.appspot.com",
  messagingSenderId: "206753408925",
  appId: "1:206753408925:web:77b5e35417ee2598ea7174",
  measurementId: "G-CRD7W4B1P5"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

new Vue({
  vuetify,
  router,
  firebase,  
  render: h => h(App)
}).$mount('#app')
