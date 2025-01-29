import { createApp } from 'vue';
import App from './App.vue';
import router from '../src/router/router';  
import store from './store';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import axios from 'axios';

const token = localStorage.getItem('user_token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

createApp(App)
  .use(router)  
  .use(store)
  .use(Toast, {
    position: "top-right",
    timeout: 3000
  })
  .mount('#app');
  