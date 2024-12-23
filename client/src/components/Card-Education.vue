<template>
  <div class="card card-education">
    <div class="education-header">
      <h2 class="card-title">
        📘 Educație
      </h2>
    </div>
    <ul class="tasks-list">
      <li v-for="task in educationalTasks" :key="task.id" 
          :class="getStatusClass(task.status)">
        <div class="task-content">
          <strong>📘 {{ task.title }}</strong>
          <p>{{ task.description }}</p>
          <div class="task-meta">
            <span class="due-date">Scadent: {{ formatDate(task.dueDate) }}</span>
            <span class="status">{{ getStatusText(task.status) }}</span>
          </div>
        </div>
      </li>
    </ul>
    <p v-if="educationalTasks.length === 0" class="no-tasks-message">
      ✨ Nu există task-uri educaționale momentan! 🎉
    </p>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'EducationCard',
  setup() {
    const store = useStore();

    const educationalTasks = computed(() => store.getters['tasks/educationalTasks']);

    onMounted(() => {
      const userId = store.getters['user/userId'];
      if (userId) {
        store.dispatch('tasks/fetchTasks', userId);
      }
    });

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('ro-RO');
    };

    const getStatusClass = (status) => {
      return {
        'status-pending': status === 'Pending',
        'status-in-progress': status === 'In Progress',
        'status-completed': status === 'Completed'
      };
    };

    const getStatusText = (status) => {
      const statusMap = {
        'Pending': 'În așteptare',
        'In Progress': 'În desfășurare',
        'Completed': 'Finalizat'
      };
      return statusMap[status] || status;
    };

    return {
      educationalTasks,
      formatDate,
      getStatusClass,
      getStatusText,
    };
  },
};
</script>

<style scoped>
.card-education {
  background-color: #FFE1CB;
  border: 10px solid #f5c9aa;
  padding: 20px;
  border-radius: 12px;
}

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tasks-list {
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 8px;
}

.tasks-list li {
  font-size: 0.8rem;
  color: #3a3939;
  margin-bottom: 12px;
  padding: 5px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.tasks-list li:hover {
  transform: scale(1.02);
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
  margin-top: 8px;
}

.status-pending {
  border-left: 4px solid #ffd700;
}

.status-in-progress {
  border-left: 4px solid #4a90e2;
}

.status-completed {
  border-left: 4px solid #2ecc71;
}

.no-tasks-message {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}

.due-date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #f0f0f0;
  font-weight: 500;
}
</style>