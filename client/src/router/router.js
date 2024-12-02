import { createRouter, createWebHistory } from 'vue-router';
import Profile from '../pages/Profile.vue';

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: HomePage
  // },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
];

const router = createRouter({
  history: createWebHistory(process.env.FRONT_URL),
  routes
});

export default router;
