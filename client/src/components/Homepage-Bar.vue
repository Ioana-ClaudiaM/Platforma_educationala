<template>
    <div class="homepage-bar">
        <MiniCalendar/>
        <ProgressTracker/>
        <WeatherWidget/>
    </div>
  </template>
  
  <script>
  import MiniCalendar from './Mini-Calendar.vue';
import ProgressTracker from './ProgressTracker.vue';
import WeatherWidget from './WeatherWidget.vue';
  
  export default {
  name:"Homepage-Bar",
  components:{
    MiniCalendar,
    ProgressTracker,
    WeatherWidget,
  }
  }
  </script>
  
  <style>
  .homepage-bar{
    height: fit-content;
    width:250px;
    display: flex;
    flex-direction: column;
    position: fixed; 
    top: 50%;
    right: 0px;
    transform: translateY(-50%);
    padding: 5px;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
    gap: 40px;
  }
  </style>