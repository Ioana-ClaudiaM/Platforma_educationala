<template>
  <div class="calendar-container">
    <h2>📆 Calendar Interactiv</h2>
        <div class="event-legend">
      <div v-for="(color, type) in eventTypes" :key="type" class="legend-item">
        <span class="legend-dot" :style="{ backgroundColor: color }"></span>
        {{ type }}
      </div>
    </div>

    <div class="calendar-header">
      <button @click="prevMonth">⬅️ Luna anterioară</button>
      <h3>{{ formattedMonthYear }}</h3>
      <button @click="nextMonth">Luna următoare ➡️</button>
    </div>

    <div class="calendar-grid">
      <div class="day-header" v-for="day in daysOfWeek" :key="day">{{ day }}</div>

      <div class="empty-cell" v-for="n in leadingEmptyDays" :key="'empty-' + n"></div>

      <div
        class="day-cell"
        v-for="day in calendarDays"
        :key="day.date"
        :class="{ today: day.isToday, event: day.hasEvents }"
        @click="selectDay(day)"
      >
        <span v-if="day.isToday">⭐</span>
        <span class="day-number">{{ day.date.getDate() }}</span>
        <div v-if="day.hasEvents" class="event-indicators">
          <span 
            v-for="eventType in day.eventTypes" 
            :key="eventType" 
            class="event-dot" 
            :style="{ backgroundColor: eventTypes[eventType] }"
          ></span>
        </div>
      </div>
    </div>

<div v-if="showModal" class="modal-overlay">
  <div class="modal-content">
    <h3>🎉 Evenimente pentru {{ selectedDay.date.toLocaleDateString() }}</h3>
    <ul>
      <li 
        v-for="event in selectedDay.events" 
        :key="event.id"
        class="event-list-item"
      >
        <span 
          class="event-dot" 
          :style="{ backgroundColor: eventTypes[event.type] }"
        ></span>
        <div class="event-details">
          <strong>{{ event.title }}</strong>
          <p v-if="event.description">{{ event.description }}</p>
        </div>
        <button @click="updateEvent(event)">✏️ Modifică</button>
        <button @click="deleteEvent(event.id)">🗑️ Șterge</button>
      </li>
    </ul>
    <button @click="closeModal">❌ Închide</button>
  </div>
</div>


<div v-if="showEditModal" class="modal-overlay">
  <div class="modal-content edit-event-modal">
    <h3>Modifică Eveniment</h3>
    <form @submit.prevent="saveEditedEvent">
      <div class="form-group">
        <label>Titlu Eveniment</label>
        <input 
          v-model="editingEvent.title" 
          placeholder="Introdu titlul evenimentului" 
          type="text"
          required
        />
      </div>
      
      <div class="form-group">
        <label>Data Evenimentului</label>
        <input 
          v-model="editingEvent.date" 
          type="date" 
          required
        />
      </div>
      
      <div class="form-group">
        <label>Tip Eveniment</label>
        <select v-model="editingEvent.type" required>
          <option 
            v-for="(color, type) in eventTypes" 
            :key="type" 
            :value="type"
          >
            {{ type }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Descriere Eveniment</label>
        <textarea 
          v-model="editingEvent.description"
          placeholder="Adaugă detalii suplimentare (opțional)"
          rows="3"
        ></textarea>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="save-btn">💾 Salvează Modificările</button>
        <button type="button" @click="closeEditModal" class="cancel-btn">❌ Anulează</button>
      </div>
    </form>
  </div>
</div>

 <div v-if="showAddEventModal" class="modal-overlay">
      <div class="modal-content add-event-modal">
        <h3>Adaugă Eveniment Nou</h3>
        <form @submit.prevent="addEvent">
          <div class="form-group">
            <label>Titlu Eveniment</label>
            <input 
              v-model="newEvent.title" 
              placeholder="Introdu titlul evenimentului" 
              type="text"
              required
            />
          </div>
          
          <div class="form-group">
            <label>Data Evenimentului</label>
            <input 
              v-model="newEvent.date" 
              type="date" 
              required
            />
          </div>
          
          <div class="form-group">
            <label>Tip Eveniment</label>
            <select v-model="newEvent.type" required>
              <option 
                v-for="(color, type) in eventTypes" 
                :key="type" 
                :value="type"
              >
                {{ type }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Descriere Eveniment</label>
            <textarea 
              v-model="newEvent.description"
              placeholder="Adaugă detalii suplimentare (opțional)"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="save-btn">💾 Salvează Eveniment</button>
            <button type="button" @click="closeAddEventModal" class="cancel-btn">❌ Anulează</button>
          </div>
        </form>
      </div>
    </div>
    <button @click="openAddEventModal" class="add-event-btn">+ Adaugă Eveniment</button>
  </div>
</template>

<script>
import { ref, computed,onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'CalendarPage',
  setup() {
    const currentDate = ref(new Date());
    const selectedDay = ref(null);
    const showModal = ref(false);
    const showAddEventModal = ref(false);
    const events = ref([]);
    const showEditModal = ref(false);
    const editingEvent = ref({
      id: null,
      title: '',
      date: '',
      type: '',
      description: ''
    });

    const eventTypes = {
      'Examen final': '#FF6B6B',         
      'Test de seminar': '#FF9800',       
      'Test parțial': '#FFC107',          
      'Colocviu': '#FF5722',              

      'Deadline proiect': '#4CAF50',     
      'Prezentare proiect': '#8BC34A',    

      'Vizită secretariat': '#E91E63',    
      'Depunere cereri': '#F44336',      

      'Întâlnire de grup': '#795548',    
      'Workshop': '#607D8B',              
      'Career fair': '#3F51B5',         

      'Concurs academic': '#FFEB3B',     
      'Voluntariat': '#4CAF50',           
      'Eveniment sportiv': '#9E9E9E'      
    };


    const daysOfWeek = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];

    const newEvent = ref({
      title: '',
      date: '',
      type: Object.keys(eventTypes)[0],
      description: ''
    });

    const openAddEventModal = () => {
      newEvent.value.date = currentDate.value.toISOString().split('T')[0];
      showAddEventModal.value = true;
    };

    const closeAddEventModal = () => {
      showAddEventModal.value = false;
      newEvent.value = {
        title: '',
        date: '',
        type: Object.keys(eventTypes)[0],
        description: ''
      };
    };

    const addEvent = async () => {
  const userId = getUserIdFromToken();

  if (newEvent.value.title && newEvent.value.date) {
    const eventDate = new Date(newEvent.value.date);
    const newEventData = {
      id: events.value.length+1,
      title: newEvent.value.title,
      date: eventDate,
      type: newEvent.value.type,
      description: newEvent.value.description,
      userId,
    };

    try {
      await axios.post('http://localhost:8000/events', { userId, event: newEventData });
      events.value.push(newEventData); 
      closeAddEventModal(); 
    } catch (error) {
      console.error('Eroare la adăugarea evenimentului:', error);
    }
  }
};

const updateEvent = (event) => {
      editingEvent.value = {
        id: event.id,
        title: event.title,
        date: new Date(event.date).toISOString().split('T')[0],
        type: event.type,
        description: event.description
      };
      showEditModal.value = true;
    };

    const closeEditModal = () => {
      showEditModal.value = false;
      editingEvent.value = {
        id: null,
        title: '',
        date: '',
        type: '',
        description: ''
      };
    };

    const saveEditedEvent = async () => {
      const userId = getUserIdFromToken();
      
      try {
        const updatedEventData = {
          id: editingEvent.value.id,
          title: editingEvent.value.title,
          date: new Date(editingEvent.value.date),
          type: editingEvent.value.type,
          description: editingEvent.value.description,
          userId,
        };

        await axios.put('http://localhost:8000/events', { userId, event: updatedEventData });
        
        const index = events.value.findIndex(event => event.id === updatedEventData.id);
        if (index !== -1) {
          events.value[index] = updatedEventData;
        }
        
        closeEditModal();
        showModal.value = false; 
      } catch (error) {
        console.error('Eroare la actualizarea evenimentului:', error);
      }
    };

const deleteEvent = async (eventId
) => {
  const userId = getUserIdFromToken()
  events.value = events.value.filter(event => event.id !== eventId);

  try {
    await axios.delete(`http://localhost:8000/events`, {
      data: { eventId, userId }  
    });
  } catch (error) {
    console.error('Eroare la ștergerea evenimentului:', error);
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

    const formattedMonthYear = computed(() => {
      return currentDate.value.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' });
    });

    const firstDayOfMonth = computed(() => {
      return new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1);
    });

    const leadingEmptyDays = computed(() => {
      return firstDayOfMonth.value.getDay() === 0 ? 6 : firstDayOfMonth.value.getDay() - 1;
    });

    const calendarDays = computed(() => { 
  const days = [];
  const month = currentDate.value.getMonth();
  const year = currentDate.value.getFullYear();
  const today = new Date();
  const lastDay = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i <= lastDay; i++) {
    const date = new Date(year, month, i);
    const isToday = date.toDateString() === today.toDateString();
    
    const dayEvents = events.value.filter((event) => {
      const eventDate = new Date(event.date); 
      return eventDate.toDateString() === date.toDateString();
    });

    const eventTypes = [...new Set(dayEvents.map(event => event.type))];

    days.push({
      date,
      isToday,
      hasEvents: dayEvents.length > 0,
      events: dayEvents,
      eventTypes: eventTypes
    });
  }

  return days;
});


    const prevMonth = () => {
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() - 1, 1
      );
    };

    const nextMonth = () => {
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1, 1
      );
    };

    const selectDay = (day) => {
      if (day.hasEvents) {
        selectedDay.value = day;
        showModal.value = true;
      }
    };

    const closeModal = () => {
      showModal.value = false;
      selectedDay.value = null;
    };

    const fetchEvents = async () => {
    const userId = getUserIdFromToken();

  try {
    const response = await axios.get(`http://localhost:8000/events/${userId}`); 
    console.log('Răspuns server:', response.data);

    events.value = response.data.events; 
    console.log(events.value);

  } catch (error) {
    console.error('Eroare la preluarea evenimentelor:', error);
  }
};

onMounted(() => {
  fetchEvents(); 
});



    return {
      formattedMonthYear,
      daysOfWeek,
      calendarDays,
      leadingEmptyDays,
      prevMonth,
      nextMonth,
      selectedDay,
      selectDay,
      closeModal,
      showModal,
      eventTypes,
      events,
      newEvent,
      addEvent,
      showAddEventModal,
      openAddEventModal,
      closeAddEventModal,
      deleteEvent,
      updateEvent,
      showEditModal,
      editingEvent,
      closeEditModal,
      saveEditedEvent,
    };
  },
};
</script>


<style scoped>
.calendar-container {
  max-width: 700px;
  margin: 0 auto;
  font-family: 'Segoe UI', sans-serif;
  text-align: center;
  background-color: #f9f1d0b6;  
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.event-legend {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9em;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.event-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
}

.event-indicators {
  display: flex;
  justify-content: center;
  gap: 3px;
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
}

.event-list-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.add-event-section {
  margin-top: 20px;
}

.add-event-form {
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  margin-top: 10px;
}

.add-event-form input,
.add-event-form select {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

.add-event-form button {
  flex: 1;
  margin: 0 5px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: #333;
  font-weight: bold;
}

h2, h3 {
  color: #7f73bf;
  font-weight: 600;
  letter-spacing: -0.5px;
  font-family: "Sour Gummy";
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.day-header {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.9em;
  background-color: #90caf9;
  color: white;
  padding: 5px;
  border-radius: 5px;
}

.day-cell {
  border: 1px solid #ddd;
  padding: 10px;
  position: relative;
  text-align: center;
  cursor: pointer;
  background-color: #fff;
  border-radius: 8px;
  transition: transform 0.2s ease, background-color 0.2s ease;
  display: flex;
  flex-direction: column;
}

button {
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

.day-cell:hover {
  background-color: #fce4ec;
  transform: scale(1.05);
}

.day-cell.today {
  background-color: #ffc107;
  font-weight: bold;
  color: rgb(49, 126, 80);
}

.day-cell.event {
  background-color: #e8f5e9;
  border-color: #4caf50;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  text-align: left;
  position: relative;
}

.add-event-modal .form-group, .edit-event-modal .form-group {
  margin-bottom: 15px;
}

.add-event-modal label , .edit-event-modal label{
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.add-event-modal input,
.add-event-modal select,
.add-event-modal textarea,
.edit-event-modal input,
.edit-event-modal select,
.edit-event-modal textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

</style>