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
            <input type="number" v-model="startTime" id="startTime" min="0" max="23" required
              @blur="validateStartTime" />
          </div>
        </div>
        <div class="input-container">
          <label for="hourDuration">Durată oră</label>
          <div class="input-wrapper">
            <span class="input-icon">⏱️</span>
            <input type="number" v-model="hourDuration" id="hourDuration" min="0" max="90" required />
          </div>
        </div>
        <div class="input-container">
          <label for="breakDuration">Durată pauză</label>
          <div class="input-wrapper">
            <span class="input-icon">☕</span>
            <input type="number" v-model="breakDuration" id="breakDuration" min="0" max="30" required />
          </div>
        </div>
        <button type="submit" class="generate-btn">
          <span>🔄 </span>
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
                <input v-model="schedule[day][idx]" class="subject-input" :disabled="!timeSlots[idx]"
                  @blur="validateSubject(day, idx)" />
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
    <div v-else class="no-schedule">Nu a fost generat un orar încă.</div>
    <button type="submit" class="generate-btn" @click="saveSchedule" v-show="timeSlots.length > 0">
      <span>Salvează 💾 </span>
    </button>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';

export default {
  name: 'TimetableComp',
  setup() {
    const store = useStore();
    const toast = useToast();

    const startTime = ref(store.getters['timetable/timeConfig'].startTime);
    const hourDuration = ref(store.getters['timetable/timeConfig'].hourDuration);
    const breakDuration = ref(store.getters['timetable/timeConfig'].breakDuration);
    const userId = computed(() => store.getters['user/userId']);

    const days = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri'];

    const timeSlots = ref([]);

    const schedule = reactive({
      Luni: Array(10).fill(''),
      Marți: Array(10).fill(''),
      Miercuri: Array(10).fill(''),
      Joi: Array(10).fill(''),
      Vineri: Array(10).fill('')
    });

    function validateStartTime() {
      if (startTime.value < 0 || startTime.value > 23) {
        toast.warning('Ora de început trebuie să fie între 0 și 23.');
      }
    }

    const validateSubject = (day, idx) => {
      const regex = /^[a-zA-ZăîâșțĂÎÂȘȚ0-9\s]*$/;
      if (!regex.test(schedule[day][idx])) {
        toast.warning("Numele materiei conține caractere invalide!");
      }
    };

    const formatTime = (timeInMinutes) => {
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = timeInMinutes % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const updateSchedule = () => {
      const newTimeSlots = [];
      const totalSlots = 10;

      for (let i = 0; i < totalSlots; i++) {
        const startTimeForSlot = startTime.value * 60 + i * hourDuration.value + i * breakDuration.value;
        if (startTimeForSlot > 1440)
          newTimeSlots.push('');
        else
          newTimeSlots.push(formatTime(startTimeForSlot));
      }

      timeSlots.value = newTimeSlots;
    };

    async function saveSchedule() {
      const scheduleData = {
        schedule: { ...schedule },
        startTime: startTime.value,
        hourDuration: hourDuration.value,
        breakDuration: breakDuration.value
      };

      try {
        await store.dispatch('timetable/saveTimetable', {
          userId: userId.value,
          scheduleData
        });
        toast.success('Orarul a fost salvat cu succes!');
      } catch (error) {
        const errors = error.response.data.errors;
        for (const error of errors) {
          toast.error(error.msg);
        }
      }
    }

    const loadSchedule = async () => {
      if (!userId.value) return;
      try {
        await store.dispatch('timetable/loadTimetable', userId.value);
        const storeSchedule = store.getters['timetable/schedule'];
        if (storeSchedule) {
          days.forEach(day => {
            schedule[day] = storeSchedule[day] || Array(10).fill('');
          });
        }

        const timeConfig = store.getters['timetable/timeConfig'];
        startTime.value = timeConfig.startTime;
        hourDuration.value = timeConfig.hourDuration;
        breakDuration.value = timeConfig.breakDuration;
        updateSchedule()
      } catch (error) {
        if (error.status === 404)
          toast.warning('Nu ai adăugat încă nicio materie în orar!');
      }
    };

    const removeSubject = async (day, idx) => {
      if (!confirm('Ești sigur că vrei să ștergi această materie?')) return;
      try {
        await store.dispatch('timetable/deleteSubject', {
          userId: userId.value,
          day,
          index: idx
        });
        toast.success('Materia a fost ștearsă cu succes!');
      } catch (error) {
        toast.error('A apărut o eroare la ștergerea materiei.' + error);
      }
    };

    onMounted(async () => {
      if (userId.value) {
        await loadSchedule();
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
      saveSchedule,
      removeSubject,
      validateStartTime,
      validateSubject
    };
  },
};
</script>

<style scoped>
.timetable-wrapper {
  width: 100%;
  padding: 35px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fffefece;
  border-radius: 20px;
  margin-top: 20px;
  height: 80%;
  font-family: 'Segoe UI', sans-serif;

}

.timetable-configuration {
  background-color: #fffefece;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: fit-content;
  margin-bottom: 20px;
  margin-top: 20px;
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
  width: 100%;
  transition: all 0.3s ease;
  font-size: 0.9em;
}

.timetable-container {
  overflow-x: auto;
}

.elegant-table {
  width: 100%;
  background-color: rgb(238, 238, 238);
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
  background-color: #f4d9f7;
  color: #000000;
  font-weight: 600;
  text-transform: uppercase;
  font-weight: bold;
}

.time-cell {
  background-color: #f4d9f7;
  font-weight: bold;
  color: #000000;
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

.no-schedule {
  font-size: 1.2em;
  font-weight: bold;
  color: #2c3e50;
}

@media screen and (max-width: 768px) {
  .timetable-configuration {
    padding: 5px;
  }

  .config-inputs {
    flex-direction: column;
    align-items: center;
  }

  .input-container {
    width: 100%;
    max-width: 250px;
  }

  .subject-input {
    width: 100%;
  }
}

@media screen and (max-width: 480px) {
  .elegant-table {
    font-size: 0.8em;
  }

  .timetable-wrapper {
    padding: 10px;
  }
}
</style>