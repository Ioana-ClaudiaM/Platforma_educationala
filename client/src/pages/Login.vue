<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-image"></div>
      <form class="login-form" @submit.prevent="submitForm">
        <h2>Autentificare</h2>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" @blur="validateEmail" required>
          <span class="error-message">{{ emailError }}</span>
        </div>
        <div class="form-group">
          <label for="password">Parolă</label>
          <input type="password" id="password" v-model="password" @blur="validatePassword" required>
          <span class="error-message">{{ passwordError }}</span>
        </div>
        <div class="button-link">
          <button type="submit" :disabled="!isFormValid" class="submit-btn">Intră în cont</button>
        </div>
        <div class="signup-link">
          Nu ai un cont? <a href="/signup">Creează cont</a>
        </div>
      </form>
    </div>
    <button @click="goToHomepage()" class="homepage-button">Mergi pe pagina principală</button>

  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex'; 
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from 'axios';

export default {
  name: 'LoginForm',
  setup() {
    const store = useStore();
    const router =useRouter();
    const toast = useToast();
    const email = ref('');
    const password = ref('');
    const emailError = ref('');
    const passwordError = ref('');
    const isFormValid = computed(() => email.value && password.value && !emailError.value && !passwordError.value);
    const isSubmitting = ref(false);
    const loginError = ref('');
    const goToHomepage = () => {
      router.push('/');
    };
   
    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value) {
        emailError.value = 'Email-ul este obligatoriu';
        toast.error("Email-ul este obligatoriu!");
        return false;
      } else if (!emailRegex.test(email.value)) {
        emailError.value = 'Introdu o adresă de email validă';
        toast.warning("Adresa de email nu este validă!");
        return false;
      } else {
        emailError.value = '';
        return true;
      }
    };

    const validatePassword = () => {
      if (!password.value) {
        passwordError.value = 'Parola este obligatorie';
        toast.error("Parola este obligatorie!");
        return false;
      } else if (password.value.length < 8) {
        passwordError.value = 'Parola trebuie să aibă minimum 8 caractere';
        toast.warning("Parola trebuie să aibă minimum 8 caractere!");
        return false;
      } else {
        passwordError.value = '';
        return true;
      }
    };

    const submitForm = () => {
      loginError.value = '';

      if (isFormValid.value && !isSubmitting.value) {
        isSubmitting.value = true;

        const formData = {
          email: email.value,
          password: password.value,
        };

        axios.post('http://localhost:8000/login', formData)
          .then(response => {
            localStorage.setItem('user_token', response.data.token);
            localStorage.setItem('user_info', JSON.stringify(response.data.user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            store.dispatch('user/setUser', response.data.user);
            toast.success("Autentificare reușită! Bine ai venit!");
            router.push('/profile');
          })

          .catch(error => {
            if (error.response) {
              loginError.value = error.response.data.message || 'Eroare la autentificare';
              toast.error(error.response.data.message || 'Eroare la autentificare');
            } else if (error.request) {
              loginError.value = 'Nu s-a putut stabili conexiunea cu serverul';
              toast.error('Nu s-a putut stabili conexiunea cu serverul');
            } else {
              loginError.value = 'A apărut o eroare neașteptată';
              toast.error('A apărut o eroare neașteptată');
            }
          })
          .finally(() => {
            isSubmitting.value = false;
          });
      } else {
        toast.info("Te rugăm să completezi toate câmpurile corect!");
      }
    };

    return {
      email,
      password,
      emailError,
      passwordError,
      isFormValid,
      isSubmitting,
      loginError,
      validateEmail,
      validatePassword,
      submitForm,
      goToHomepage
    };
  }
};

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 1100px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.login-image {
  flex: 1;
  background-image: url('../assets/workplace-elements-marble-table-top-view.jpg');
  background-size: cover;
  background-position: center;
}

.login-form {
  flex: 1;
  padding: 40px;
  background-color: rgba(189, 205, 250, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: "Playwrite HR Lijeva";
}

.login-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #34495e;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d8e0;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.submit-btn:hover {
  background-color: #2980b9;
}

.submit-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
  height: 20px;
}

.signup-link {
  text-align: center;
  margin-top: 20px;
  color: #7f8c8d;
}

.signup-link a {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
}

.signup-link a:hover {
  text-decoration: underline;
}

.homepage-button{
  padding: 1rem;
  margin-top: 2rem;
}
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .login-image {
    height: 250px;
  }

  .login-form {
    padding: 30px;
  }
}
</style>