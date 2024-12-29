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
              <h3 class="task-title" @click="seeTask(task)">{{ task.title }}</h3>
              <span class="status-badge" :class="getStatusClass(task.status)">
                {{ getStatusText(task.status) }}
              </span>
            </div>
            <p class="task-description">{{ task.description }}</p>
            <div class="task-footer">
              <span class="due-date">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {{ formatDate(task.dueDate) }}
              </span>
            </div>
          </div>
        </li>
      </ul>

      <div v-else class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
        <p>Nu există task-uri momentan</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'

export default {
  name: 'EducationCard',
  setup() {
    const store = useStore();
    const router = useRouter();

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('ro-RO');
    };

    const educationalTasks = computed(() => store.getters['tasks/allTasks']).value.filter(task => formatDate(task.dueDate) > formatDate(Date.now()));

    onMounted(() => {
      const userId = store.getters['user/userId'];
      if (userId) {
        store.dispatch('tasks/fetchAllTasks', userId);
      }
    });

    const seeTask = async (task) => {
      await router.push({
                path: '/education',
                query: { component:'Task-Manager',id: task.id } 
              });
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
      seeTask
    };
  },
};
</script>

<style scoped>
.card-education {
  background-color: #ffffff;
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

.empty-state svg {
  color: #9ca3af;
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