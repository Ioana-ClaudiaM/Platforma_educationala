<template>
    <div class="homepage">
      <Navbar class="navbar" />
      
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="main-title">Învață mai eficient.<br>Organizează-ți studiul.<br>Reușește mai ușor.</h1>
          <p class="hero-subtitle">Platforma educațională care te ajută să-ți organizezi studiul și să-ți atingi obiectivele mai ușor.</p>
          <div class="cta-buttons">
            <button @click="navigateTo('signup')" class="primary-button">Începe Gratuit</button>
            <button @click="navigateTo('login')" class="secondary-button">Am cont deja</button>
          </div>
        </div>
      </div>
  
      <div class="features-section">
        <h2 class="section-title">De ce să folosești aplicația noastră?</h2>
        
        <div class="features-grid">
          <div class="feature-card">
            <img src="../assets/calendar.png" alt="Calendar" class="feature-icon">
            <h3>Organizare Eficientă</h3>
            <p>Calendar integrat, orar personalizat și manager de sarcini pentru a-ți gestiona timpul mai bine</p>
          </div>
          
          <div class="feature-card">
            <img src="../assets/book.png" alt="Bibliotecă" class="feature-icon">
            <h3>Bibliotecă Digitală</h3>
            <p>Acces la resurse educaționale, materiale de studiu și documente importante</p>
          </div>
          
          <div class="feature-card">
            <img src="../assets/stats.png" alt="Progres" class="feature-icon">
            <h3>Urmărește Progresul</h3>
            <p>Vezi evoluția ta, calculează mediile și stabilește obiective de învățare</p>
          </div>
        </div>
      </div>
  
      <div class="testimonials-section">
        <h2 class="section-title">Ce spun utilizatorii noștri</h2>
        
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <p>"De când folosesc această aplicație, mi-am îmbunătățit considerabil rezultatele la școală."</p>
            <div class="testimonial-author">- Maria S., elevă</div>
          </div>
          
          <div class="testimonial-card">
            <p>"Cel mai mult îmi place că pot să-mi organizez toate materialele într-un singur loc."</p>
            <div class="testimonial-author">- Andrei P., student</div>
          </div>
        </div>
      </div>
  
      <div class="start-section">
        <h2>Pregătit să începi?</h2>
        <p>Creează-ți cont gratuit și începe să-ți organizezi studiul mai eficient!</p>
        <button @click="navigateTo('signup')" class="primary-button">Creează Cont Gratuit</button>
      </div>
  
      <footer class="homepage-footer">
        <div class="footer-content">
          <div class="footer-section">
            <h4>Contact</h4>
            <p>Email: contact@aplicatie.ro</p>
            <p>Tel: 0123-456-789</p>
          </div>
          <div class="footer-section">
            <h4>Link-uri Utile</h4>
            <a href="#" >Termeni și Condiții</a>
            <a href="#" >Politica de Confidențialitate</a>
          </div>
        </div>
      </footer>
    </div>
  </template>
  
  <script>
  import Navbar from '@/components/Navbar.vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: "Homepage-Component",
    components: {
      Navbar
    },
    setup() {
      const router = useRouter();
  
      const navigateTo = (route) => {
        router.push(`/${route}`);
      };
  
      return {
        navigateTo,
      };
    }
  };
  </script>
  
  <style scoped>
  .homepage {
    width: 100%;
    min-height: 100vh;
  }
  
  .hero-section {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
  }
  
  .hero-content {
    background-color: rgba(255, 255, 255, 0.85);
    padding: 3rem;
    border-radius: 20px;
    max-width: 800px;
  }
  
  .main-title {
    font-family: 'Sour Gummy', sans-serif;
    font-size: 3rem;
    color: #7f73bf;
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 2rem;
  }
  
  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  
  .primary-button {
    background-color: #7f73bf;
    color: white;
    border: none;
    border-radius: 10px;
    padding: 1rem 2rem;
    font-family: 'Sour Gummy', sans-serif;
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.3s ease, background-color 0.3s ease;
  }
  
  .primary-button:hover {
    transform: translateY(-2px);
    background-color: #6a5fa3;
  }
  
  .secondary-button {
    background-color: #faebb1;
    color: #7f73bf;
    border: none;
    border-radius: 10px;
    padding: 1rem 2rem;
    font-family: 'Sour Gummy', sans-serif;
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.3s ease, background-color 0.3s ease;
  }
  
  .secondary-button:hover {
    transform: translateY(-2px);
    background-color: #f5e08e;
  }
  
  .features-section, .testimonials-section {
    padding: 4rem 2rem;
    background-color: rgba(255, 255, 255, 0.5);
    margin: 2rem;
    border-radius: 20px;
  }
  
  .section-title {
    text-align: center;
    font-family: 'Sour Gummy', sans-serif;
    color: #7f73bf;
    font-size: 2rem;
    margin-bottom: 3rem;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .feature-card {
    text-align: center;
    padding: 2rem;
    border-radius: 15px;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
  }
  
  .feature-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
  }
  
  .feature-card h3 {
    font-family: 'Sour Gummy', sans-serif;
    color: #7f73bf;
    margin-bottom: 1rem;
  }
  
  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .testimonial-card {
    background-color: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .testimonial-author {
    color: #7f73bf;
    font-weight: bold;
    margin-top: 1rem;
  }
  
  .start-section {
    text-align: center;
    padding: 4rem 2rem;
    background-color: rgba(255, 255, 255, 0.8);
    margin: 2rem;
    border-radius: 20px;
  }
  
  .start-section h2 {
    font-family: 'Sour Gummy', sans-serif;
    color: #7f73bf;
    margin-bottom: 1rem;
  }
  
  .homepage-footer {
    background-color: rgba(255, 255, 255, 0.95);
    padding: 2rem;
    margin-top: auto;
  }
  
  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .footer-section h4 {
    font-family: 'Sour Gummy', sans-serif;
    color: #7f73bf;
    margin-bottom: 1rem;
  }
  
  .footer-section a {
    display: block;
    color: #666;
    text-decoration: none;
    margin-bottom: 0.5rem;
  }
  
  .footer-section a:hover {
    color: #7f73bf;
  }
  
  @media (max-width: 768px) {
    .main-title {
      font-size: 2rem;
    }
    
    .hero-content {
      padding: 2rem;
    }
    
    .cta-buttons {
      flex-direction: column;
    }
    
    .features-section, .testimonials-section, .start-section {
      margin: 1rem;
      padding: 2rem 1rem;
    }
  }
  </style>