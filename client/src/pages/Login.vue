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

        <div class="forgot-password">
          <a href="/recover-password">Ai uitat parola?</a>
        </div>

        <div class="button-link">
          <button type="submit" :disabled="!isFormValid" class="submit-btn">Intră în cont</button>
        </div>

        <div class="signup-link">
          Nu ai un cont? <a href="/signup">Creează cont</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
      isFormValid: false,
      isSubmitting: false,
    }
  },
  methods: {
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
      } else {
        this.passwordError = ''
        this.checkFormValidity()
        return true
      }
    },

    checkFormValidity() {
      const isEmailValid = this.email && !this.emailError
      const isPasswordValid = this.password && !this.passwordError

      this.isFormValid = isEmailValid && isPasswordValid

      return this.isFormValid
    },

    submitForm() {
      this.loginError = ''

      if (this.checkFormValidity() && !this.isSubmitting) {
        this.isSubmitting = true;

        const formData = {
          email: this.email,
          password: this.password
        };

        axios.post('http://localhost:8000/login', formData)
          .then(response => {
            localStorage.setItem('user_token', response.data.token);

            localStorage.setItem('user_info', JSON.stringify(response.data.user));

            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

            this.$router.push('/profile');
          })
          .catch(error => {
            if (error.response) {
              this.loginError = error.response.data.message || 'Eroare la autentificare';
            } else if (error.request) {
              this.loginError = 'Nu s-a putut stabili conexiunea cu serverul';
            } else {
              this.loginError = 'A apărut o eroare neașteptată';
            }
            console.error('Eroare la logarea in cont:', error);
          })
          .finally(() => {
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

.login-page {
  display: flex;
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

.forgot-password {
  text-align: right;
  margin-bottom: 20px;
}

.forgot-password a {
  color: #3498db;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password a:hover {
  text-decoration: underline;
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