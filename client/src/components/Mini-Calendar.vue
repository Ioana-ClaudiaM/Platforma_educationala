<template>
    <div class="calendar">
      <div class="calendar-header">
        <button @click="previousMonth">←</button>
        <span>{{ currentMonthName }} {{ currentYear }}</span>
        <button @click="nextMonth">→</button>
      </div>
      <div class="calendar-grid">
        <div class="day-label" v-for="day in dayLabels" :key="day">{{ day }}</div>
        <div
          class="calendar-day"
          v-for="day in days"
          :key="day.date"
          :class="{ 'has-event': day.hasEvent }"
          @click="selectDay(day)"
        >
          {{ day.day }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from "vue";
  
  export default {
    name: "MiniCalendar",
    setup() {
      const today = new Date();
      const currentYear = ref(today.getFullYear());
      const currentMonth = ref(today.getMonth()); 
  
      const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
      const currentMonthName = computed(() =>
        new Date(currentYear.value, currentMonth.value).toLocaleString("default", {
          month: "long",
        })
      );
  
      const days = computed(() => {
        const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1);
        const lastDayOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0);
        const daysArray = [];
  
        const leadingEmptyDays = firstDayOfMonth.getDay();
  
        for (let i = 0; i < leadingEmptyDays; i++) {
          daysArray.push({ day: "", date: null, hasEvent: false });
        }
  
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
          daysArray.push({
            day: i,
            date: new Date(currentYear.value, currentMonth.value, i),
            hasEvent: Math.random() > 0.8, 
          });
        }
  
        return daysArray;
      });
  
      const previousMonth = () => {
        if (currentMonth.value === 0) {
          currentMonth.value = 11;
          currentYear.value--;
        } else {
          currentMonth.value--;
        }
      };
  
      const nextMonth = () => {
        if (currentMonth.value === 11) {
          currentMonth.value = 0;
          currentYear.value++;
        } else {
          currentMonth.value++;
        }
      };
  
      const selectDay = (day) => {
        if (day.date) {
          alert(`Ai selectat ziua: ${day.date.toLocaleDateString()}`);
        }
      };
  
      return {
        currentYear,
        currentMonthName,
        dayLabels,
        days,
        previousMonth,
        nextMonth,
        selectDay,
      };
    },
  };
  </script>
  
  <style scoped>
  .calendar {
    width: 200px; 
    padding: 8px;
    background-color: rgb(250, 247, 212);
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    font-family:'Playwrite HR Lijeva';
    border:8px solid rgb(243, 235, 158);

  }
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: bold;
  }
  
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }
  
  .day-label {
    font-weight: bold;
    text-align: center;
    color: #f39f20;
    font-size: 12px; 
  }
  
  .calendar-day {
    text-align: center;
    padding: 6px;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 10px; 
  }
  
  .calendar-day:hover {
    background-color: #d6834c;
  }
  
  .calendar-day.has-event {
    background-color: #f5d5b0;
    color: #292929;
    font-weight: bold;
  }
  
  .calendar-day.has-event:hover {
    background-color: #f1b6c1;
  }
  </style>
  