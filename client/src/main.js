import { createApp } from 'vue';
import App from './App.vue';
import router from '../src/router/router';  
import store from './store';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

createApp(App)
  .use(router)  
  .use(store)
  .use(Toast, {
    position: "top-right",
    timeout: 3000
  })
  .mount('#app');
  