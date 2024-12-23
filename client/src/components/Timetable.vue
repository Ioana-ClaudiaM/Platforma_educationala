<template>
    <div class="timetable-wrapper">
      <div class="timetable-header">
        <h2> 📅 Orar Personalizat</h2>
      </div>
      
      <form class="timetable-configuration" @submit.prevent="updateSchedule">
        <div class="config-inputs">
          <div class="input-container">
            <label for="startTime">Ora de început</label>
            <div class="input-wrapper">
              <span class="input-icon">🕒</span>
              <input 
                type="number" 
                v-model="startTime" 
                id="startTime" 
                min="0" 
                max="23" 
                required 
              />
            </div>
          </div>
  
          <div class="input-container">
            <label for="hourDuration">Durată oră</label>
            <div class="input-wrapper">
              <span class="input-icon">⏱️</span>
              <input 
                type="number" 
                v-model="hourDuration" 
                id="hourDuration" 
                min="15" 
                max="90" 
                required 
              />
            </div>
          </div>
  
          <div class="input-container">
            <label for="breakDuration">Durată pauză</label>
            <div class="input-wrapper">
              <span class="input-icon">☕</span>
              <input 
                type="number" 
                v-model="breakDuration" 
                id="breakDuration" 
                min="5" 
                max="30" 
                required 
              />
            </div>
          </div>
  
          <button type="submit" class="generate-btn">
            <span>Generează Orar  🔄 </span>
          </button>
        </div>
      </form>
    
      <div class="timetable-container" v-if="timeSlots.length > 0">
        <table class="elegant-table">
          <thead>
            <tr>
              <th>Timp</th>
              <th v-for="(day, index) in days" :key="index">{{ day }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(time, idx) in timeSlots" :key="idx">
              <td class="time-cell">{{ time }}</td>
              <td v-for="(day, index) in days" :key="index" class="subject-cell">
                <div class="subject-input-wrapper">
                  <input 
                    v-model="schedule[day][idx]" 
                    class="subject-input"
                  />
                  <button 
                    v-if="schedule[day][idx]" 
                    @click="() => removeSubject(day, idx)" 
                    class="remove-subject"
                    title="Șterge disciplină"
                  >
                    ✕
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button type="submit" class="generate-btn" @click="saveSchedule">
        <span>Salvează Orar 💾 </span>
      </button>
    </div>
  </template>
    
  <script>
  import { ref, reactive, onMounted } from 'vue';
  import axios from 'axios';
  
  export default {
    name: 'TimetableComp',
    setup() {
      const startTime = ref(8); 
      const hourDuration = ref(50); 
      const breakDuration = ref(10); 
      const days = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri'];
    
      const schedule = reactive({
        Luni: Array(10).fill(''),
        Marți: Array(10).fill(''),
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
    const newTimeSlots = [];
    const totalSlots = 10;
  
    for (let i = 0; i < totalSlots; i++) {
      const startTimeForSlot = startTime.value * 60 + i * (hourDuration.value + breakDuration.value);
      newTimeSlots.push(formatTime(startTimeForSlot));
    }
  
    timeSlots.value = newTimeSlots;
  
    days.forEach(day => {
      if (!schedule[day]) schedule[day] = Array(totalSlots).fill('');
      const currentSubjects = [...schedule[day]]; 
      schedule[day] = Array(totalSlots).fill('').map((_, idx) => currentSubjects[idx] || '');
    });
  };
  
            const saveSchedule = async () => {
    const scheduleWithTimes = [];
    const totalSlots = 10;
  
    for (let i = 0; i < totalSlots; i++) {
      const startTimeForSlot = startTime.value * 60 + i * (hourDuration.value + breakDuration.value);
      scheduleWithTimes.push(formatTime(startTimeForSlot));
    }
  
    timeSlots.value = scheduleWithTimes;
  
    const userSchedule = {
      userId: getUserIdFromToken(),
      schedule: { ...schedule },
      startTime: startTime.value,
      hourDuration: hourDuration.value,
      breakDuration: breakDuration.value
    };
  
    try {
      await axios.post('http://localhost:8000/saveTimetable', userSchedule);
      alert("Orarul a fost actualizat cu succes!");
    } catch (error) {
      console.error("Eroare la trimiterea orarului:", error);
      alert("A apărut o eroare!");
    }
  };
  
      const loadSchedule = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;
  
    try {
      const response = await axios.get(`http://localhost:8000/loadTimetable/${userId}`);
      
      if (response.data.timeConfig) {
        startTime.value = response.data.timeConfig.startTime;
        hourDuration.value = response.data.timeConfig.hourDuration;
        breakDuration.value = response.data.timeConfig.breakDuration;
        
        updateSchedule();
      }
  
      if (response.data.schedule) {
        days.forEach(day => {
          schedule[day] = response.data.schedule[day] || Array(10).fill('');
        });
      }
    } catch (error) {
      console.error("Eroare la încărcarea orarului:", error);
    }
  };

  
      const getUserIdFromToken = () => {
        const token = localStorage.getItem('user_token');
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          return decodedToken.id;
        }
        return null;
      };
  
      const removeSubject = async (day, idx) => {
  const userId = getUserIdFromToken();

  try {
    await axios.post('http://localhost:8000/deleteSubject', {
      userId,
      day,
      index: idx,
    });

    schedule[day][idx] = '';
    alert('Materia a fost ștearsă cu succes!');
  } catch (error) {
    console.error('Eroare la ștergerea materiei:', error);
    alert('A apărut o eroare la ștergerea materiei.');
  }
};

    
      onMounted(loadSchedule);
    
      return {
        startTime,
        hourDuration,
        breakDuration,
        days,
        schedule,
        timeSlots,
        updateSchedule,
        saveSchedule,
        removeSubject,
      };
    },
  };
  </script>
  <style scoped>
  .timetable-wrapper {
    font-family: 'Playwrite HR Lijeva';
    width: 700px;
    margin: 20px auto;
    background-color: #f9f1d0b6;  
    border-radius: 15px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    height: fit-content;
  }
  
  .timetable-container {
  overflow-x: auto;
}
  .timetable-header {
    text-align: center;
    margin-bottom: 5px;
  }
  
  .timetable-header h2 {
    color: #7f73bf;
    font-size: 1.5em;
    font-weight: 600;
    letter-spacing: -0.5px;
    font-family:"Sour Gummy";
  }
  
  .timetable-configuration {
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: fit-content;
  }
  
  .config-inputs {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    flex-wrap: wrap;
  }
  
  .input-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .input-container label {
    color: #34495e;
    font-weight: 500;
    font-size: 0.9em;
  }
  
  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .input-icon {
    position: absolute;
    left: 10px;
    opacity: 0.6;
  }
  
  .input-container input {
    padding: 10px 10px 10px 45px;
    border: 2px solid #e0e0e05f;
    border-radius: 8px;
    width: 40px;
    transition: all 0.3s ease;
    font-size: 0.9em;
  }
  
  .input-container input:focus {
    border-color: #9cceef;
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
  
  .generate-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 15px;
    background-color: #c4e7ff;
    color: rgb(0, 0, 0);
    font-family: 'Sour Gummy';
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    margin: 10px auto 0;
  }
  
  .generate-btn svg {
    width: 20px;
    height: 20px;
  }
  
  .generate-btn:hover {
    background-color: #f5c1f8;
    transform: translateY(-2px);
  }
  
  .timetable-container {
    overflow-x: auto;
  }
  
  .elegant-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background-color: rgb(255, 255, 255);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  }
  
  .elegant-table th, .elegant-table td {
    padding: 3px;
    text-align: center;
    border-bottom: 1px solid #ffffff;
  }


  .elegant-table th {
    background-color: #f7f3d9;
    color: #2c3e50;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-family: "Sour Gummy";
  }
  
  .time-cell {
    background-color: #f7f3d9;
    font-weight: bold;
    color: #34495e;
    font-size: 12px;
  }
  
  .subject-cell {
    position: relative;
  }
  
  .subject-input-wrapper {
    position: relative;
  }
  
  .subject-input {
    width: 90%;
    border: 2px solid #e0e0e036;
    transition: all 0.3s ease;
    font-family: "Sour Gummy";
    text-align: center;
    border-radius: 3px;
  }
  
  .subject-input:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
  }
  
  .remove-subject {
    position: absolute;
    right: 1px;
    top: 60%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #e74c3c;
    cursor: pointer;
    font-size: 13px;
    opacity: 0.7;
    transition: opacity 0.3s ease;
    font-weight: bold;
    
  }
  
  .remove-subject:hover {
    opacity: 1;
  }
  </style>