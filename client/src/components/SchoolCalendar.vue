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
      <div class="day-cell" v-for="day in calendarDays" :key="day.date"
        :class="{ today: day.isToday, event: day.hasEvents }" @click="showEventsModal(day)">
        <span class="day-number">{{ day.date.getDate() }}<span v-if="day.isToday">⭐</span></span>
        <div v-if="day.hasEvents" class="event-indicators">
          <span v-for="eventType in day.eventTypes" :key="eventType" class="event-dot"
            :style="{ backgroundColor: eventTypes[eventType] }"></span>
        </div>
      </div>
    </div>

    <button @click="showModal = true">➕ Adaugă eveniment</button>

    <Modal :isOpen="showModal" :title="isEditing ? 'Editează evenimentul' : 'Adaugă eveniment'" :fields="modalFields"
      :initialData="initialEventData" @submit="handleSubmit" @close="closeModal" />

    <div v-show="eventsModal" class="eventsModal">
      <div class="eventsContainer">
        <ul v-if="selectedDay && selectedDay.events.length">
          <li v-for="event in selectedDay.events" :key="event.id" class="event-list-item">
            <strong>{{ event.title }}</strong> - {{ event.description }}
            <div class="event-actions">
              <button @click="updateEvent(event)">✏️</button>
              <button @click="deleteEvent(event.id)">❌</button>
            </div>
          </li>
        </ul>
        <p v-else>Niciun eveniment pentru această zi.</p>
        <button @click="eventsModal = false">Închide</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Modal from './Modal.vue';
import { useToast } from 'vue-toastification';

export default {
  name: 'CalendarPage',
  components: {
    Modal
  },
  setup() {
    const store = useStore();
    const toast = useToast();
    const currentDate = ref(new Date());
    const selectedDay = ref(null);
    const showModal = ref(false);
    const isEditing = ref(false);
    const editingEventId = ref(null);
    const eventsModal = ref(false);

    const userId = computed(() => store.getters['user/userId']);
    const events = computed(() => store.getters['events/allEvents']);
    const eventTypes = computed(() => store.getters['events/eventTypes']);
    const daysOfWeek = computed(() => store.getters['events/daysOfWeek']);

    const initialEventData = ref({
      title: '',
      date: '',
      type: '',
      description: ''
    });

    const modalFields = computed(() => [
      {
        id: 'title',
        type: 'text',
        label: 'Titlu Eveniment',
        required: true,
        min: 3,
        max: 50
      },
      {
        id: 'date',
        label: 'Data Evenimentului',
        type: 'date',
        required: true,
      },
      {
        id: 'type',
        label: 'Tip Eveniment',
        type: 'select',
        options: Object.keys(store.getters['events/eventTypes']).map(eventType => ({
          value: eventType,
          label: eventType
        })),
        required: true
      },
      {
        id: 'description',
        label: 'Descriere Eveniment',
        type: 'textarea',
        placeholder: 'Adaugă detalii suplimentare (opțional)',
        required: true,
        min: 3,
        max: 200
      }
    ]);

    const prevMonth = () => {
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() - 1,
        1
      );
    };

    const nextMonth = () => {
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1,
        1
      );
    }


    const formattedMonthYear = computed(() => {
      return currentDate.value.toLocaleDateString('ro-RO', {
        month: 'long',
        year: 'numeric'
      });
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

        const dayEvents = events.value?.filter((event) => {
          if (!event?.date) return false;
          const eventDate = new Date(event.date);
          return eventDate.toDateString() === date.toDateString();
        }) || [];

        const eventTypesForDay = dayEvents.map(event => event.type);

        days.push({
          date,
          isToday,
          hasEvents: dayEvents.length > 0,
          events: dayEvents,
          eventTypes: eventTypesForDay
        });
      }

      return days;
    });

    function showEventsModal(day) {
      selectedDay.value = day;
      eventsModal.value = true;
    }

    const closeModal = () => {
      showModal.value = false;
      isEditing.value = false;
      editingEventId.value = null;
      initialEventData.value = {
        title: '',
        date: '',
        type: '',
        description: ''
      };
    };

    async function loadEvents() {
      if (!userId.value) return;
      try {
        await store.dispatch('events/fetchEvents', userId.value);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    }

    async function saveEvent(eventData) {
      eventData.date = new Date(eventData.date).toISOString().split('T')[0];
      try {
        await store.dispatch('events/addEvent', {
          userId: userId.value,
          event: {
            ...eventData,
            createdAt: new Date().toISOString()
          }
        });

        toast.success('Evenimentul a fost adăugat cu succes!');
        closeModal();
      } catch (error) {
        if (error.response?.data?.errors) {
          error.response.data.errors.forEach(err => toast.error(err.msg));
        } else {
          toast.error('A apărut o eroare la adăugarea evenimentului.');
        }
      }
    }


    function updateEvent(event) {
      isEditing.value = true;
      initialEventData.value = { ...event };
      showModal.value = true;
      eventsModal.value = false;
    }

    async function updateExistingEvent(eventId, eventData) {
      eventData.date = new Date(eventData.date).toISOString().split('T')[0];
      try {
        await store.dispatch('events/updateEvent', {
          userId: userId.value,
          eventId: eventId,
          eventData: eventData
        });
        toast.success('Evenimentul a fost actualizat cu succes!');
        await loadEvents();
        closeModal();
      } catch (error) {
        const errors = error.response?.data?.errors;
        for(let err of errors) {
          toast.error(err.msg);
        }
      }
    }

    const handleSubmit = (eventData) => {
      if (isEditing.value) {
        updateExistingEvent(eventData.id, eventData);
      } else {
        saveEvent(eventData);
      }
    };

    async function deleteEvent(eventId) {
      if (!confirm('Ești sigur că vrei să ștergi acest eveniment?')) return;
      try {
        await store.dispatch('events/deleteEvent', {
          userId: userId.value,
          eventId
        });
        toast.success('Evenimentul a fost șters cu succes!');
        eventsModal.value = false;
      } catch (error) {
        toast.error('A apărut o eroare la ștergerea evenimentului.');
      }
    }

    onMounted(async () => {
      if (userId.value)
        await loadEvents();
    });

    return {
      formattedMonthYear,
      daysOfWeek,
      calendarDays,
      leadingEmptyDays,
      prevMonth,
      nextMonth,
      selectedDay,
      showModal,
      closeModal,
      Modal,
      eventTypes,
      events,
      initialEventData,
      modalFields,
      handleSubmit,
      saveEvent,
      updateEvent,
      updateExistingEvent,
      deleteEvent,
      loadEvents,
      isEditing,
      showEventsModal,
      eventsModal,
    };
  },
};
</script>

<style scoped>
.calendar-container {
  width: 95%;
  max-width: 1000px;
  min-height: 500px;
  margin: 20px auto;
  font-family: 'Segoe UI', sans-serif;
  text-align: center;
  background-color: #fffefece;
  border-radius: 10px;
  padding: 50px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.event-legend {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
  background-color: #fff;
  font-family: "Sour Gummy";
  padding: 10px;
  border-radius: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9em;
  margin: 5px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.event-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
  flex-shrink: 0;
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

.add-event-section {
  margin-top: 20px;
  width: 100%;
}

.add-event-form {
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 15px;
  margin-top: 10px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: #333;
  font-weight: bold;
  padding: 0 10px;
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
  background-color: #fac9ff;
  color: rgb(0, 0, 0);
  padding: 5px;
  border-radius: 5px;
}

.day-cell {
  border: 1px solid #ddd;
  padding: 8px 5px;
  position: relative;
  text-align: center;
  cursor: pointer;
  background-color: #fff;
  border-radius: 8px;
  transition: transform 0.2s ease, background-color 0.2s ease;
  display: flex;
  flex-direction: column;
}

.day-cell:hover {
  background-color: #fce4ec;
  transform: scale(1.05);
}

.day-cell.today {
  background-color: #c097dd;
  font-weight: bold;
  color: rgb(255, 255, 255);
}

.day-cell.event {
  background-color: #ebffe2;
}

.eventsModal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 15px;
}

.eventsContainer {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.eventsContainer ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.event-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
  padding: 8px;
  flex-wrap: wrap;
  gap: 10px;
}

.event-actions {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

@media screen and (max-width: 768px) {
  .calendar-container {
    padding: 10px;
    margin: 10px auto;
  }

  .calendar-grid {
    gap: 3px;
  }

  .day-cell {
    padding: 5px 2px;
    font-size: 0.9em;
  }

  .day-header {
    font-size: 0.8em;
    padding: 3px;
  }

  .event-legend {
    padding: 5px;
  }

  .event-indicators {
    gap: 2px;
  }
}

@media screen and (max-width: 480px) {
  .calendar-container {
    width: 98%;
    padding: 5px;
  }

  .calendar-header {
    flex-direction: column;
    gap: 10px;
  }

  .day-cell {
    font-size: 0.8em;
  }

  .event-legend {
    font-size: 0.8em;
  }

  .eventsContainer {
    padding: 15px;
    width: 95%;
  }

  .event-list-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .event-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

@media screen and (max-width: 360px) {
  .day-header {
    font-size: 0.7em;
  }

  .day-cell {
    font-size: 0.7em;
    padding: 3px 1px;
  }
}
</style>