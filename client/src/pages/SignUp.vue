<template>
  <div class="signup-page">
    <div class="signup-container">
      <div class="signup-image"></div>
      <form class="signup-form" @submit.prevent="submitForm">
        <h2>Creare Cont Nou</h2>
        
        <div class="form-group">
          <label for="username">Nume de utilizator</label>
          <input 
            type="text" 
            id="username" 
            v-model="username"
            @blur="validateUsername"
            required
          >
          <span class="error-message">{{ usernameError }}</span>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            @blur="validateEmail"
            required
          >
          <span class="error-message">{{ emailError }}</span>
        </div>
        
        <div class="form-group">
          <label for="password">Parolă</label>
          <input 
            type="password" 
            id="password" 
            v-model="password"
            @blur="validatePassword"
            required
          >
          <span class="error-message">{{ passwordError }}</span>
        </div>
        
        <div class="form-group">
          <label for="confirm-password">Confirmă parola</label>
          <input 
            type="password" 
            id="confirm-password" 
            v-model="confirmPassword"
            @blur="validateConfirmPassword"
            required
          >
          <span class="error-message">{{ confirmPasswordError }}</span>
        </div>
        
        <div class="button-link">
          <button type="submit" :disabled="!isFormValid" class="submit-btn">Creează cont</button>
        </div>
        
        <div class="login-link">
          Ai deja un cont? <a href="/login">Intră în cont</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'SignupForm',
  setup() {
    const router =useRouter();
    const toast = useToast();
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const isSubmitting = ref(false);
    const usernameError = ref('');
    const emailError = ref('');
    const passwordError = ref('');
    const confirmPasswordError = ref('');
    const isFormValid = computed(() => {
      return (
        !usernameError.value && !emailError.value && 
        !passwordError.value && !confirmPasswordError.value &&
        username.value && email.value && password.value && confirmPassword.value
      );
    });

    const validateUsername = () => {
      if (!username.value) {
        usernameError.value = 'Numele de utilizator este obligatoriu';
        toast.error("Numele de utilizator este obligatoriu!");
        return false;
      } else if (username.value.length < 3) {
        usernameError.value = 'Numele de utilizator trebuie să aibă minimum 3 caractere';
        toast.warning("Numele de utilizator trebuie să aibă minimum 3 caractere");
        return false;
      } else if (!/^[a-zA-Z0-9_]+$/.test(username.value)) {
        usernameError.value = 'Numele de utilizator poate conține doar litere, cifre și under score';
        toast.warning("Numele de utilizator poate conține doar litere, cifre și under score");
        return false;
      } else {
        usernameError.value = '';
        return true;
      }
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
        toast.warning("Parola trebuie să aibă minimum 8 caractere");
        return false;
      } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(password.value)) {
        passwordError.value = 'Parola trebuie să conțină literă mare, literă mică, cifră și un caracter special';
        toast.warning("Parola trebuie să conțină literă mare, literă mică, cifră și un caracter special");
        return false;
      } else {
        passwordError.value = '';
        return true;
      }
    };

    const validateConfirmPassword = () => {
      if (!confirmPassword.value) {
        confirmPasswordError.value = 'Confirmă parola';
        return false;
      } else if (password.value !== confirmPassword.value) {
        confirmPasswordError.value = 'Parolele nu se potrivesc';
        return false;
      } else {
        confirmPasswordError.value = '';
        return true;
      }
    };

    const submitForm = () => {
      if (isFormValid.value && !isSubmitting.value) {
        isSubmitting.value = true;

        const formData = {
          username: username.value,
          email: email.value,
          password: password.value,
        };

        axios.post('http://localhost:8000/register', formData)
          .then((response) => {
            toast.success("Contul a fost creat cu succes pentru utilizatorul cu emailul "+response.data.email);
            router.push('/login');
          })
          .catch(error => {
            const errors = error.response.data.errors;
            console.log(errors)
            errors.forEach((error) => {
              toast.error(`${error.msg}`);
            });
          })
          .finally(() => {
            isSubmitting.value = false;
          });
      }
      else{
        toast.info("Te rugăm să completezi toate câmpurile corect!");
      }
    };

    return {
      username,
      email,
      password,
      confirmPassword,
      isFormValid,
      usernameError,
      emailError,
      passwordError,
      confirmPasswordError,
      validateUsername,
      validateEmail,
      validatePassword,
      validateConfirmPassword,
      submitForm,
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

.signup-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.signup-container {
  display: flex;
  width: 100%;
  max-width: 1100px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.signup-image {
  flex: 1;
  background-image: url('../assets/workplace-elements-marble-table-top-view.jpg');
  background-size: cover;
  background-position: center;
}

.signup-form {
  flex: 1;
  padding: 40px;
  background-color: rgba(189, 205, 250, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: "Playwrite HR Lijeva";
}

.signup-form h2 {
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

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #7f8c8d;
}

.login-link a {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .signup-container {
    flex-direction: column;
  }
  
  .signup-image {
    height: 250px;
  }
  
  .signup-form {
    padding: 30px;
  }
}
</style>