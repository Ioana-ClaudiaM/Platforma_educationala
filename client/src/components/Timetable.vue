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
            <input type="number" v-model="startTime" id="startTime" min="0" max="23" required />
          </div>
        </div>

        <div class="input-container">
          <label for="hourDuration">Durată oră</label>
          <div class="input-wrapper">
            <span class="input-icon">⏱️</span>
            <input type="number" v-model="hourDuration" id="hourDuration" min="15" max="90" required />
          </div>
        </div>

        <div class="input-container">
          <label for="breakDuration">Durată pauză</label>
          <div class="input-wrapper">
            <span class="input-icon">☕</span>
            <input type="number" v-model="breakDuration" id="breakDuration" min="5" max="30" required />
          </div>
        </div>

        <button type="submit" class="generate-btn">
          <span>Generează Orar 🔄 </span>
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
                <input v-model="schedule[day][idx]" class="subject-input" />
                <button v-if="schedule[day][idx]" @click="() => removeSubject(day, idx)" class="remove-subject"
                  title="Șterge disciplină">
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
import { ref, reactive, onMounted,watch} from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';

export default {
  name: 'TimetableComp',
  setup() {
  const store = useStore();
  const toast = useToast();
  const userId = store.getters['user/userId'];
  const days = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri'];
 
  const startTime = ref(store.getters['timetable/timeConfig'].startTime);
  const hourDuration = ref(store.getters['timetable/timeConfig'].hourDuration);
  const breakDuration = ref(store.getters['timetable/timeConfig'].breakDuration);

  const schedule = reactive({
    Luni: Array(10).fill(''),
    Marți: Array(10).fill(''),
    Miercuri: Array(10).fill(''),
    Joi: Array(10).fill(''),
    Vineri: Array(10).fill('')
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
  };

  const saveSchedule = async () => {
    const scheduleData = {
      schedule: { ...schedule },
      startTime: startTime.value,
      hourDuration: hourDuration.value,
      breakDuration: breakDuration.value
    };

    try {
      await store.dispatch('timetable/saveTimetable', {
        userId,
        scheduleData
      });
      toast.success('Orarul a fost salvat cu succes!');
    } catch (error) {
      console.error("Eroare la salvarea orarului:", error);
      toast.error('A apărut o eroare la salvarea orarului.');
    }
  };

  const loadSchedule = async () => {
    if (!userId) return;

    try {
      await store.dispatch('timetable/loadTimetable', userId);
      
      const timeConfig = store.getters['timetable/timeConfig'];
      startTime.value = timeConfig.startTime;
      hourDuration.value = timeConfig.hourDuration;
      breakDuration.value = timeConfig.breakDuration;
      
      updateSchedule();

      const storeSchedule = store.getters['timetable/schedule'];
      if (storeSchedule) {
        days.forEach(day => {
          schedule[day] = storeSchedule[day] || Array(10).fill('');
        });
      }
    } catch (error) {
      toast.error('A apărut o eroare la încărcarea orarului.');
    }
  };

  const removeSubject = async (day, idx) => {
    try {
      await store.dispatch('timetable/deleteSubject', {
        userId,
        day,
        index: idx
      });
      toast.success('Materia a fost ștearsă cu succes!');
    } catch (error) {
      toast.error('A apărut o eroare la ștergerea materiei.');
    }
  };

  watch(() => store.getters['timetable/schedule'], (newSchedule) => {
    if (newSchedule) {
      days.forEach(day => {
        schedule[day] = newSchedule[day] || Array(10).fill('');
      });
    }
  });

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
  width: fit-content;
  background-color: #f9f1d0b6;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  margin: 0 auto;
}

.timetable-configuration {
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: fit-content;
  margin-bottom: 20px;
}

.config-inputs {
  display: flex;
  align-items: flex-end;
  gap: 10px;
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

.timetable-container {
  overflow-x: auto;
}

.elegant-table {
  width: 100%;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  overflow: hidden;
}

.elegant-table th,
.elegant-table td {
  padding: 3px;
  text-align: center;
  border-bottom: 1px solid #ffffff;
}


.elegant-table th {
  background-color: #f7f3d9;
  color: #2c3e50;
  font-weight: 600;
  text-transform: uppercase;
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
}

.remove-subject {
  position: absolute;
  right: 0px;
  top: 20%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 13px;
  opacity: 0.7;
  font-weight: bold;

}

.remove-subject:hover {
  opacity: 1;
}
</style>