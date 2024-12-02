<template>
    <div class="progress-tracker">
      <h5>Progress Tracker</h5>
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>{{ progress }}% din aplicație a fost folosită astăzi</p>
    </div>
  </template>
  
  
  <script>
export default {
  data() {
    return {
      progress: 85, 
    };
  },
};
</script>

  
  <style scoped>
  .progress-tracker {
    background-color: rgb(252, 235, 198);
    padding: 4px;
    border-radius: 6px; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 150px;
    text-align: center;
    border:8px solid rgb(241, 213, 151);
  }
  
  .progress-bar-container {
    background-color: #b3b0b0;
    border-radius: 8px; 
    overflow: hidden;
    height: 12px; 
  }
  
  .progress-bar {
    background-color: #15d384;
    height: 100%;
    transition: width 0.3s ease;
  }
  
  h5 {
    font-size: 18px; 
    margin: 4px 0; 
    font-family: 'Playwrite HR Lijeva';
  }
  
  .progress-tracker p {
    font-family:'Sour Gummy';
    font-size: 14px; 
    margin: 4px 0; 
  }
  </style>
  