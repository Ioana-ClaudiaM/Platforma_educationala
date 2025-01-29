<template>
  <div class="card card-education">
    <div class="education-header">
      <h2 class="card-title">Task-uri</h2>
    </div>

    <div class="tasks-container">
      <ul class="tasks-list" v-if="educationalTasks.length > 0">
        <li v-for="task in educationalTasks" :key="task.id" class="task-item" :class="getStatusClass(task.status)">
          <div class="task-content">
            <div class="task-header">
              <h3 class="task-title">{{ task.title }}</h3>
              <span class="status-badge" :class="getStatusClass(task.status)">
                {{ getStatusText(task.status) }}
              </span>
            </div>
            <p class="task-description">{{ task.description }}</p>
            <div class="task-footer">
              <span class="due-date">
                {{ new Date(task.dueDate).toLocaleDateString('ro-RO') }}
              </span>
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="empty-state">
        <p>Nu există task-uri momentan</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'CardTasks',
  setup() {
    const store = useStore();

    const educationalTasks = computed(() => {
      const allTasks = store.getters['tasks/allTasks'];
      const now = new Date();
      return allTasks
      .filter(task => task && task.dueDate && new Date(task.dueDate) >= now)
      .sort((a, b) => new Date(a.dueDate)-new Date(b.dueDate));
    });

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

    onMounted(() => {
      const userId = computed(() => store.getters['user/userId']);
      if (userId.value) {
        store.dispatch('tasks/fetchAllTasks', userId.value);
      }
    });

    return {
      educationalTasks,
      getStatusClass,
      getStatusText,
    };
  },
};
</script>

<style scoped>
.card-education {
  background-color: #ffffffd5;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 700px;
}

.education-header {
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.025em;
}

.tasks-container {
  position: relative;
  max-height: 400px;
  overflow-y: scroll;
}

.tasks-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  background: #f9fafb;
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.2s ease;
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.task-title {
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
}

.task-description {
  color: #4b5563;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0.5rem 0;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
}

.due-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-in-progress {
  background-color: #e0e7ff;
  color: #3730a3;
}

.status-completed {
  background-color: #d1fae5;
  color: #065f46;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #6b7280;
  text-align: center;
  gap: 1rem;
}

.empty-state p {
  margin: 0;
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .card-education {
    padding: 1rem;
  }

  .task-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .status-badge {
    align-self: flex-start;
  }
}
</style>