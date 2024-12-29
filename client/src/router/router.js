import { createRouter, createWebHistory } from 'vue-router';
import Profile from '../pages/Profile.vue';
import SignUp from '@/pages/SignUp.vue';
import Login from '@/pages/Login.vue';
import Homepage from '@/pages/Homepage.vue';
import { authGuard } from '@/middleware/authGuard';
import Education from '@/pages/Education.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Homepage
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    beforeEnter:authGuard,
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
  {
    path: '/education',
    name: 'Education',
    component: Education,
    beforeEnter:authGuard,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.FRONT_URL),
  routes
});

export default router;
