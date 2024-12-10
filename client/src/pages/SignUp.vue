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
import axios from 'axios';

export default {
  name: 'SignupForm',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      usernameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
      isFormValid: false,
      isSubmitting: false, 
    }
  },
  methods: {
    validateUsername() {
      if (!this.username) {
        this.usernameError = 'Numele de utilizator este obligatoriu'
        this.isFormValid = false
        return false
      } else if (this.username.length < 3) {
        this.usernameError = 'Numele de utilizator trebuie să aibă minimum 3 caractere'
        this.isFormValid = false
        return false
      } else if (!/^[a-zA-Z0-9_]+$/.test(this.username)) {
        this.usernameError = 'Numele de utilizator poate conține doar litere, cifre și under score'
        this.isFormValid = false
        return false
      } else {
        this.usernameError = ''
        this.checkFormValidity()
        return true
      }
    },
    
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.email) {
        this.emailError = 'Email-ul este obligatoriu'
        this.isFormValid = false
        return false
      } else if (!emailRegex.test(this.email)) {
        this.emailError = 'Introdu o adresă de email validă'
        this.isFormValid = false
        return false
      } else {
        this.emailError = ''
        this.checkFormValidity()
        return true
      }
    },
    
    validatePassword() {
      if (!this.password) {
        this.passwordError = 'Parola este obligatorie'
        this.isFormValid = false
        return false
      } else if (this.password.length < 8) {
        this.passwordError = 'Parola trebuie să aibă minimum 8 caractere'
        this.isFormValid = false
        return false
      } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(this.password)) {
        this.passwordError = 'Parola trebuie să conțină literă mare, literă mică, cifră și un caracter special'
        this.isFormValid = false
        return false
      } else {
        this.passwordError = ''
        this.checkFormValidity()
        return true
      }
    },
    
    validateConfirmPassword() {
      if (!this.confirmPassword) {
        this.confirmPasswordError = 'Confirmă parola'
        this.isFormValid = false
        return false
      } else if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = 'Parolele nu se potrivesc'
        this.isFormValid = false
        return false
      } else {
        this.confirmPasswordError = ''
        this.checkFormValidity()
        return true
      }
    },
    
    checkFormValidity() {
  const isUsernameValid = this.username && !this.usernameError;
  const isEmailValid = this.email && !this.emailError;
  const isPasswordValid = this.password && !this.passwordError;
  const isConfirmPasswordValid = this.confirmPassword && !this.confirmPasswordError;

  this.isFormValid = 
    isUsernameValid && 
    isEmailValid && 
    isPasswordValid && 
    isConfirmPasswordValid;

  return this.isFormValid;
}
,
    
submitForm() {
      if (this.checkFormValidity() && !this.isSubmitting) {
        this.isSubmitting = true;

        const formData = {
          username: this.username,
          email: this.email,
          password: this.password
        };
        axios.post('http://localhost:8000/register', formData)
          .then(response => {
            console.log('Contul a fost creat cu succes', response.data);
            this.$router.push('/login');
          })
          .catch(error => {
            console.error('Eroare la crearea contului:', error);
            this.isSubmitting = false;
          });
      }
    }
  }
}
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