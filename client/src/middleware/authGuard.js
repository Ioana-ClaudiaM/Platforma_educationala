import axios from 'axios';

export function authGuard(to, from, next) {
   const token = localStorage.getItem('user_token');
  console.log("Token din localStorage:", token);  
  if (!token) {
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
    console.error("Error details:", error.response ? error.response.data : error);
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_info');
    next('/login');
  });
}
