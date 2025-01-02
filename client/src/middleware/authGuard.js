import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast= useToast();

export function authGuard(to, from, next) {
  const token = localStorage.getItem('user_token');
  if (!token) {
    toast.error('Trebuie să fii autentificat pentru a accesa această pagină');
    next('/login');
    return;
  }

  axios.get('http://localhost:8000/verify-token', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(() => {
      next();
    })
    .catch((error) => {
      toast.error(error.response.data.message);
      next('/login');
    });
}
