import { createRouter, createWebHistory } from 'vue-router';
import Profile from '../pages/Profile.vue';
import SignUp from '@/pages/SignUp.vue';
import Login from '@/pages/Login.vue';

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
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
];

const router = createRouter({
  history: createWebHistory(process.env.FRONT_URL),
  routes
});

export default router;
