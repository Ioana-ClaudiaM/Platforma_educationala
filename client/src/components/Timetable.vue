<template>
    <div class="timetable-component">  
      <form class="form-timetable" @submit.prevent="updateSchedule">
        <label for="startTime">Ora de început (în ore):</label>
        <input type="number" v-model="startTime" id="startTime" min="0" required />
  
        <label for="hourDuration">Durata unei ore (minute):</label>
        <input type="number" v-model="hourDuration" id="hourDuration" min="1" required />
  
        <label for="breakDuration">Durata pauzei (minute):</label>
        <input type="number" v-model="breakDuration" id="breakDuration" min="1" required />
  
        <button type="submit" class="actualizare-orar-btn">Actualizează Orar</button>
      </form>
  
=      <table v-if="timeSlots.length > 0">
        <thead>
          <tr>
            <th>Ora / Zi</th>
            <th v-for="(day, index) in days" :key="index">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(time, idx) in timeSlots" :key="idx">
            <td>{{ time }}</td>
            <td v-for="(day, index) in days" :key="index">
              <div class="input-timetable-component">
                <input 
                  v-model="schedule[day][idx]" 
                  placeholder="Adaugă materie"
                />
                <button v-if="schedule[day][idx]" @click="removeSubject(day, idx)" class="remove-btn">
                  X
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import { ref, reactive, watch } from 'vue';
  
  export default {
    name:'Timetable-Comp',

    setup() {
      const startTime = ref(8); 
      const hourDuration = ref(50); 
      const breakDuration = ref(10); 
  
      const days = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri'];
  
      const schedule = reactive({
        Luni: Array(10).fill(''),
        Marti: Array(10).fill(''),
        Miercuri: Array(10).fill(''),
        Joi: Array(10).fill(''),
        Vineri: Array(10).fill(''),
      });
        const timeSlots = ref([]);
  
      const formatTime = (timeInMinutes) => {
        const hours = Math.floor(timeInMinutes / 60);
        const minutes = timeInMinutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      };
  
      const updateSchedule = () => {
        const scheduleWithTimes = [];
        const totalSlots = 10; 
  
        for (let i = 0; i < totalSlots; i++) {
          const startTimeForSlot = startTime.value * 60 + i * (hourDuration.value + breakDuration.value);
          scheduleWithTimes.push(formatTime(startTimeForSlot));
        }
  
        timeSlots.value = scheduleWithTimes; 
  
        days.forEach(day => {
          schedule[day] = Array(10).fill(''); 
        });
      };
  
      const removeSubject = (day, idx) => {
        schedule[day][idx] = '';
      };
  
      watch(timeSlots, (newTimeSlots) => {
        if (newTimeSlots.length === 0) {
          return;
        }
      });
  
      return {
        startTime,
        hourDuration,
        breakDuration,
        days,
        schedule,
        timeSlots,
        updateSchedule,
        removeSubject,
      };
    },
  };
  </script>
  
  <style scoped>
  .timetable-component {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .form-timetable {
    margin-bottom: 20px;
  }
  
  .form-timetable label {
    display: block;
    margin: 10px 0 5px;
  }
  
  .form-timetable input[type="number"] {
    width: 50px;
    padding: 5px;
  }
  
  .actualizare-orar-btn {
    padding: 5px 10px;
    background-color: #f44336;
    color: white;
    border: none;
    cursor: pointer;
  }

  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  table th, table td {
    padding: 10px;
    text-align: center;
    border: 1px solid #ddd;
  }
  
  .input-timetable-component {
    position: relative;
  }
  
  input {
    width: 100%;
    padding: 5px;
  }
  
  input:focus {
    border-color: #4caf50;
  }
  
  .remove-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
  }
  </style>
  