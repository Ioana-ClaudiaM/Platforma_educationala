<template>
    <div class="weather-widget">
      <h2>Weather</h2>
      <div v-if="weatherData">
        <p><strong>{{ weatherData.name }}</strong></p>
        <p>{{ weatherData.main.temp }}°C</p>
        <p>{{ weatherData.weather[0].description }}</p>
        <p class="weather-icon">{{ getWeatherEmoji(weatherData.weather[0].description) }}</p>
      </div>
      <div v-else>
        <p>Loading weather...</p>
      </div>
    </div>
  </template>
  
  
  <script>
export default {
  data() {
    return {
      weatherData: null,
      city: "Bucharest", 
      apiKey: "170841e7645eb895f0e5b8cd1f3ffc32", 
    };
  },
  mounted() {
    this.fetchWeather();
  },
  methods: {
    async fetchWeather() {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.apiKey}&units=metric`
        );
        const data = await response.json();
        this.weatherData = data;
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    },
    getWeatherEmoji(description) {
      const weatherIcons = {
        clear: "☀️", 
        clouds: "☁️", 
        "few clouds": "🌤️", 
        rain: "🌧️", 
        thunderstorm: "⛈️", 
        snow: "❄️", 
        mist: "🌫️", 
      };

      for (const key in weatherIcons) {
        if (description.toLowerCase().includes(key)) {
          return weatherIcons[key];
        }
      }
      return "🌈"; 
    },
  },
};
</script>

  <style scoped>
  .weather-widget {
    background-color: rgb(252, 226, 210);
    padding: 12px; 
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 120px;
    text-align: center;
    border:8px solid rgb(250, 200, 170);
  }
  
  .weather-widget h2 {
    font-size: 18px; 
    margin-bottom: 8px; 
    font-family: 'Sour Gummy';
    font-family: "Playwrite HR Lijeva";
  }
  
  p {
    margin: 4px 0;
    font-family:'Sour Gummy';
  }
  
  strong {
    font-size: 16px; 
  }
  
  .weather-icon {
    font-size: 24px; 
    margin-top: 6px; 
  }
  </style>
  