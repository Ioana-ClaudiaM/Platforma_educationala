<template>
  <div class="task-manager-container">
    <div class="header-section">
      <h2>📋 Task Manager</h2>
      <div class="event-selection-container">
        <div class="select-wrapper">
          <select v-model="selectedEventId" class="event-select">
            <option value="">Selectează un eveniment</option>
            <option v-for="event in events" :key="event.id" :value="event.id">
              {{ event.title }} ({{ formatDate(event.date) }})
            </option>
          </select>
        </div>

        <button v-show="selectedEventId" class="add-task-btn" @click="showModal = true">➕ Adaugă Task Nou</button>
      </div>
    </div>

    <div v-if="selectedEventId && eventTasks.length > 0" class="progress-section">
      <div class="progress-info">
        <span>Progres eveniment: {{ calculateProgress() }}%</span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: calculateProgress() + '%' }"></div>
        </div>
      </div>
    </div>

    <div v-else-if="selectedEventId && eventTasks.length === 0" class="no-tasks-message">
      <div class="empty-state">
        <span class="empty-icon">📝</span>
        <h3>Nu există task-uri disponibile</h3>
        <p>Apasă pe butonul "Adaugă Task Nou" pentru a începe.</p>
      </div>
    </div>

    <Dashboard :selectedEventId="selectedEventId" />

    <div v-if="selectedEventId" class="task-preview">
      <div class="task-grid">
        <div v-for="task in eventTasks" :key="task.id" class="task-card">
          <div class="task-header">
            <h4>{{ task.title }}</h4>
            <div class="task-actions">
              <div class="status-dropdown">
                <select v-model="task.status" class="status-select" @change="handleStatusChange(task)">
                  <option value="Pending">În așteptare</option>
                  <option value="In Progress">În desfășurare</option>
                  <option value="Completed">Finalizat</option>
                </select>
              </div>
              <button @click="updateTask(task)" class="edit-btn">✏️</button>
              <button @click="deleteTask(task.id)">❌</button>
            </div>
          </div>
          <p class="task-description">{{ task.description }}</p>
          <div class="task-meta">
            <div class="task-dates">
              <span class="due-date">
                <span class="date-icon">📅</span>
                Scadent: {{ formatDate(task.dueDate) }}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>

    <Modal :isOpen="showModal" :title="isEditing ? 'Editează task' : 'Adaugă task'" :fields="modalFields"
      :initialData="initialTaskData" @submit="handleSubmit" @close="closeModal" />

  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import Dashboard from './Dashboard.vue';
import Modal from './Modal.vue';
import { useToast } from 'vue-toastification';

export default {
  name: 'Task-Manager',
  components: {
    Dashboard,
    Modal
  },
  setup() {
    const store = useStore();
    const toast = useToast();
    const selectedEventId = ref("");
    const showModal = ref(false);
    const isEditing = ref(false);
    const editingTaskId = ref(null);

    const userId = computed(() => store.getters['user/userId']);
    const events = computed(() => store.getters['events/allEvents']);
    const eventTasks = computed(() => store.getters['tasks/eventTasks']) || [];

    const initialTaskData = ref({
      title: '',
      description: '',
      dueDate: '',
      status: 'Pending',
    });

    const modalFields = computed(() => [
      {
        id: 'title',
        type: 'text',
        label: 'Titlu:',
        required: true
      },
      {
        id: 'description',
        label: 'Descriere:',
        type: 'textarea',
        required: true,
      },
      {
        id: 'dueDate',
        label: 'Dată scadentă:',
        type: 'date',
        required: true
      },
      {
        id: 'status',
        label: 'Status:',
        type: 'select',
        options: [
          { value: 'Pending', label: 'În așteptare' },
          { value: 'In Progress', label: 'În desfășurare' },
          { value: 'Completed', label: 'Finalizat' }
        ],
        required: true
      }
    ]);

    const formatDate = (date) => new Date(date).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const calculateProgress = () => {
      if (eventTasks.value.length === 0) return 0;
      console.log(eventTasks.value.length)
      const completedTasks = eventTasks.value.filter(task => task.status === 'Completed').length;
      return Math.round((completedTasks / eventTasks.value.length) * 100);
    };

    const getStatusClass = (status) => {
      const statusMap = {
        'Pending': 'status-pending',
        'In Progress': 'status-in-progress',
        'Completed': 'status-completed'
      };
      return statusMap[status] || '';
    };

    const closeModal = () => {
      showModal.value = false;
      isEditing.value = false;
      editingTaskId.value = null;
    };

    async function loadEventTasks() {
      if (!selectedEventId.value) return;
      try {
        await store.dispatch('tasks/fetchEventTasks', {
          userId: userId.value,
          eventId: selectedEventId.value
        });
      }
      catch (error) {
        toast.error('Nu s-au putut încărca task-urile evenimentului');
      }
    }

    async function addTask(taskData) {
      if (!userId.value || !selectedEventId.value) return;

      try {
        await store.dispatch('tasks/addTask', {
          userId: userId.value,
          eventId: selectedEventId.value,
          taskData
        });
        toast.success('Task-ul a fost adăugat cu succes');
        closeModal();
      }
      catch (error) {
        const errors = error.response.data.errors;
        for(const err of errors) {
          toast.error(err.msg);
        }
      }
    }

    function updateTask(task) {
      isEditing.value = true;
      editingTaskId.value = task.id;
      initialTaskData.value = { ...task };
      showModal.value = true;
    }

    const updateExistingTask = async (taskData) => {
      try {
        await store.dispatch('tasks/updateTask', {
          taskId: editingTaskId.value,
          userId: userId.value,
          taskData: taskData,
          eventId: selectedEventId.value,
        });
        toast.success('Task-ul a fost actualizat cu succes');
        closeModal();
      }catch (error) {
        const errors = error.response.data.errors;
        for(const err of errors) {
          toast.error(err.msg);
        }
      }
    };

    const handleStatusChange = async (task) => {
  try {
    await store.dispatch('tasks/updateTask', {
      taskId: task.id,
      userId: userId.value,
      taskData: {
        ...task,
        status: task.status
      },
      eventId: selectedEventId.value,
    });
    toast.success('Status actualizat cu succes');
  } catch (error) {
    console.error('Error updating task status:', error);
    toast.error('Nu s-a putut actualiza statusul');
  }
};

    const handleSubmit = async (taskData) => {
      if (isEditing.value) {
        updateExistingTask(taskData);
      } else {
        addTask(taskData);
      }
    };

    async function deleteTask(taskId) {
      console.log(taskId)
      if (!confirm('Ești sigur că vrei să ștergi acest task?')) return;
      try {
        await store.dispatch('tasks/deleteTask', {
          userId: userId.value,
          taskId: taskId,
          eventId: selectedEventId.value,
        });
        toast.success('Task-ul a fost șters cu succes');
      } catch (error) {
        toast.error('Nu s-a putut șterge task-ul');
      }
    }

    watch(selectedEventId, async (newId) => {
      if (newId) {
        await loadEventTasks();
      }
    });

    onMounted(async () => {
      if (userId.value) {
        await store.dispatch('events/fetchEvents', userId.value);
        await loadEventTasks();
      }
    });

    return {
      events,
      selectedEventId,
      formatDate,
      calculateProgress,
      addTask,
      loadEventTasks,
      getStatusClass,
      closeModal,
      initialTaskData,
      modalFields,
      updateTask,
      isEditing,
      Modal,
      handleSubmit,
      showModal,
      eventTasks,
      deleteTask,
      handleStatusChange
    };
  }
};
</script>

<style scoped>
.task-manager-container {
  padding: 2rem;
  margin: 0 auto;
  background-color: #fffefece;
  border-radius: 12px;
  max-width: 1200px;
  width: 100%;
}

.header-section {
  margin: 0;
  padding: 0;
}

.event-selection-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
}

.event-select {
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  border: 2px solid #e8e8e8;
  background: white;
  font-size: 1rem;
  min-width: 250px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Sour Gummy";
  text-align: center;
}

.progress-section {
  margin: 2rem 0;
  padding: 1rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 50%;
  margin-left: 22%;
  font-family: "Playwrite HR Lijeva", sans-serif;

}

.progress-info {
  text-align: center;
}

.progress-bar {
  height: 10px;
  background-color: #e8e8e8;
  border-radius: 5px;
  margin-top: 0.5rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #7f73bf;
  transition: width 0.3s ease;
}

.task-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-height: 500px;
  overflow-y: scroll;
  width: 700px;
  margin-left: 15%;
  padding: 20px;
  background-color: #e4e4e4;
  padding: 50px;
}


.task-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid #e8e8e8;
  font-family: "Sour Gummy";
  text-align: center;
  color: #5f71a3;
}

.task-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, #7f73bf, #9f97c9);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.task-card:hover::before {
  opacity: 1;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
}

.edit-icon {
  font-size: 1.2rem;
}


.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.task-dates {
  display: flex;
  gap: 1rem;
  align-items: center;
  color: #4d4c4c;
  font-size: 0.9rem;
}

.date-icon {
  margin-right: 0.3rem;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #888;
  font-size: 0.9rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-large {
  max-width: 800px;
  text-align: center;
  font-family: "Playwrite HR Lijeva", sans-serif;
  color: #7f73bf;
  text-align: center;
  font-size: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 0.5rem;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.status-select {
  padding: 0.5rem;
  border-radius: 15px;
  border: 1px solid #e8e8e8;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.status-select:hover {
  border-color: #7f73bf;
}

.all-tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.due-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #888;
  font-size: 0.9rem;
}

.no-tasks-message {
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 12%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  font-size: 3rem;
}

.empty-state h3 {
  margin: 0;
  color: #333;
}

.empty-state p {
  margin: 0;
  color: #666;
}


</style>