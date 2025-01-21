<template>
  <div class="task-manager-container">
    <div class="header-section">
      <h2>📋 Task Manager</h2>
      <div class="event-selection-container">
        <div class="select-wrapper">
          <select v-model="selectedEventId" @change="loadEventTasks" class="event-select">
            <option value="">Selectează un eveniment</option>
            <option v-for="event in events" :key="event.id" :value="event.id">
              {{ event.title }} ({{ formatDate(event.date) }})
            </option>
          </select>
        </div>

        <button v-if="selectedEventId" @click="openAddModal" class="add-task-btn">
          <span class="btn-icon">➕</span> Adaugă Task Nou
        </button>
      </div>
    </div>

    <div v-if="selectedEventId && tasks.length > 0" class="progress-section">
      <div class="progress-info">
        <span>Progres eveniment: {{ calculateProgress() }}%</span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: calculateProgress() + '%' }"></div>
        </div>
      </div>
    </div>
    <div v-else-if="selectedEventId && tasks.length === 0" class="no-tasks-message">
      <div class="empty-state">
        <span class="empty-icon">📝</span>
        <h3>Nu există task-uri disponibile</h3>
        <p>Apasă pe butonul "Adaugă Task Nou" pentru a începe.</p>
      </div>
    </div>
     
    <div v-if="!selectedEventId" class="dashboard-view">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <h3>Total Evenimente</h3>
            <p class="stat-value">{{ events.length }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>Task-uri Finalizate</h3>
            <p class="stat-value">{{ completedTasksCount }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <h3>Task-uri în Desfășurare</h3>
            <p class="stat-value">{{ inProgressTasksCount }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <h3>Rata de Finalizare</h3>
            <p class="stat-value">{{ completionRate }}%</p>
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <h3>Distribuția Task-urilor</h3>
          <div ref="pieChartRef" class="chart-container"></div>
        </div>

        <div class="chart-card">
          <h3>Evenimente pe Lună</h3>
          <div ref="barChartRef" class="chart-container"></div>
        </div>
      </div>

      <div class="upcoming-events">
        <h3>Evenimente Apropiate</h3>
        <div class="events-list">
          <div v-for="event in upcomingEvents" :key="event.id" class="event-card">
            <div class="event-date">{{ formatDate(event.date) }}</div>
            <div class="event-details">
              <h4>{{ event.title }}</h4>
              <div class="event-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: getEventProgress(event) + '%' }"></div>
                </div>
                <span>{{ getEventProgress(event) }}% completat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedEventId" class="task-preview">
      <div class="task-grid">
        <div v-for="task in previewTasks" :key="task.id" class="task-card">
          <div class="task-header">
            <h4>{{ task.title }}</h4>
            <div class="task-actions">
              <div class="status-dropdown">
                <select v-model="task.status" @change="() => updateTaskStatus(task)" class="status-select">
                  <option value="Pending">În așteptare</option>
                  <option value="In Progress">În desfășurare</option>
                  <option value="Completed">Finalizat</option>
                </select>
              </div>
              <button @click="openEditModal(task)" class="edit-btn">
                <span class="edit-icon">✏️</span>
              </button>
            </div>
          </div>
          <p class="task-description">{{ truncateText(task.description, 100) }}</p>
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

      <button v-if="tasks.length > 3" @click="openViewAllModal" class="view-all-btn">
        Vezi toate task-urile ({{ tasks.length }})
      </button>
    </div>

    <div v-if="isAddModalOpen" class="modal-overlay" @click.self="closeAddModal">
      <div class="modal-content">
        <h3>Adaugă Task Nou</h3>
        <form @submit.prevent="addTask">
          <div class="form-group">
            <label for="taskTitle">Titlu:</label>
            <input type="text" v-model="newTask.title" id="taskTitle" required class="form-input" />
          </div>

          <div class="form-group">
            <label for="taskDescription">Descriere:</label>
            <textarea v-model="newTask.description" id="taskDescription" required class="form-textarea"></textarea>
          </div>

          <div class="form-group">
            <label for="dueDate">Dată scadentă:</label>
            <input type="date" v-model="newTask.dueDate" id="dueDate" required class="form-input" />
          </div>

          <div class="form-group">
            <label for="taskStatus">Status:</label>
            <select v-model="newTask.status" id="taskStatus" required class="form-select">
              <option value="Pending">În așteptare</option>
              <option value="In Progress">În desfășurare</option>
              <option value="Completed">Finalizat</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="submit" class="submit-btn">Adaugă</button>
            <button type="button" @click="closeAddModal" class="cancel-btn">Anulează</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="isEditModalOpen" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content">
        <h3>Editează Task</h3>
        <form @submit.prevent="updateTask">
          <div class="form-group">
            <label for="editTaskTitle">Titlu:</label>
            <input type="text" v-model="editingTask.title" id="editTaskTitle" required class="form-input" />
          </div>

          <div class="form-group">
            <label for="editTaskDescription">Descriere:</label>
            <textarea v-model="editingTask.description" id="editTaskDescription" required
              class="form-textarea"></textarea>
          </div>

          <div class="form-group">
            <label for="editDueDate">Dată scadentă:</label>
            <input type="date" v-model="editingTask.dueDate" id="editDueDate" required class="form-input" />
          </div>

          <div class="form-group">
            <label for="editTaskStatus">Status:</label>
            <select v-model="editingTask.status" id="editTaskStatus" required class="form-select">
              <option value="Pending">În așteptare</option>
              <option value="In Progress">În desfășurare</option>
              <option value="Completed">Finalizat</option>
            </select>
          </div>

          <div class="form-group">
            <label for="editTaskPriority">Prioritate:</label>
            <select v-model="editingTask.priority" id="editTaskPriority" class="form-select">
              <option value="Low">Scăzută</option>
              <option value="Medium">Medie</option>
              <option value="High">Ridicată</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="submit" class="submit-btn">Salvează</button>
            <button type="button" @click="closeEditModal" class="cancel-btn">Anulează</button>
          </div>
        </form>
      </div>
    </div>


    <div v-if="isViewAllModalOpen" class="modal-overlay" @click.self="closeViewAllModal">
      <div class="modal-content modal-large">
        <h3>Toate Task-urile</h3>
        <div class="all-tasks-grid">
          <div v-for="task in tasks" :key="task.id" class="task-card">
            <div class="task-header">
              <h4>{{ task.title }}</h4>
              <div class="status-dropdown">
                <select v-model="task.status" @change="() => updateTaskStatus(task)" class="status-select">
                  <option value="Pending">În așteptare</option>
                  <option value="In Progress">În desfășurare</option>
                  <option value="Completed">Finalizat</option>
                </select>
              </div>
            </div>
            <p class="task-description">{{ task.description }}</p>
            <div class="task-footer">
              <span class="due-date">Scadent: {{ formatDate(task.dueDate) }}</span>
            </div>
          </div>
        </div>
        <button @click="closeViewAllModal" class="close-modal-btn">Închide</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import * as echarts from 'echarts';

export default {
  name: 'Task-Manager',
  setup() {
    const store = useStore();
    const selectedEventId = ref("");
    const isAddModalOpen = ref(false);
    const isViewAllModalOpen = ref(false);
    const pieChartRef = ref(null);
    const barChartRef = ref(null);
    let pieChart = null;
    let barChart = null;
    const newTask = ref({
      title: '',
      description: '',
      dueDate: '',
      status: 'Pending'
    });
    const isEditModalOpen = ref(false);
    const editingTask = ref({
      id: null,
      title: '',
      description: '',
      dueDate: '',
      status: 'Pending',
      priority: 'Medium'
    });

    const events = computed(() => store.getters['events/allEvents'] ? store.getters['events/allEvents'] : []);
    const tasks = computed(() => store.getters['tasks/eventTasks'] ? store.getters['tasks/eventTasks'] : []);
    const allTasks = computed(() => store.getters['tasks/allTasks']);

    const completedTasksCount = computed(() =>
      allTasks.value.filter(task => task.status === 'Completed').length
    );

    const inProgressTasksCount = computed(() =>
      allTasks.value.filter(task => task.status === 'In Progress').length
    );

    const completionRate = computed(() => {
      if (allTasks.value.length === 0) return 0;
      return Math.round((completedTasksCount.value / allTasks.value.length) * 100);
    });

    const upcomingEvents = computed(() => {
      const today = new Date();
      return events.value
        .filter(event => new Date(event.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    });

    const previewTasks = computed(() => tasks.value.slice(0, 3));

    const initializeCharts = () => {
      if (pieChartRef.value) {
        pieChart = echarts.init(pieChartRef.value);
        updatePieChart();
      }

      if (barChartRef.value) {
        barChart = echarts.init(barChartRef.value);
        updateBarChart();
      }
    };

    const updatePieChart = () => {
      const option = {
        tooltip: { trigger: 'item' },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [{
          type: 'pie',
          radius: '70%',
          data: [
            { value: completedTasksCount.value, name: 'Finalizate', itemStyle: { color: '#7f73bf' } },
            { value: inProgressTasksCount.value, name: 'În Desfășurare', itemStyle: { color: '#9f97c9' } },
            {
              value: allTasks.value.length - completedTasksCount.value - inProgressTasksCount.value,
              name: 'În Așteptare',
              itemStyle: { color: '#bfb8d9' }
            }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      pieChart?.setOption(option);
    };

    const updateBarChart = () => {
      const monthlyData = getMonthlyEventDistribution();
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: monthlyData.map(item => item.month)
        },
        yAxis: { type: 'value' },
        series: [{
          data: monthlyData.map(item => item.count),
          type: 'bar',
          itemStyle: { color: '#7f73bf' }
        }]
      };
      barChart?.setOption(option);
    };

    const getMonthlyEventDistribution = () => {
      const monthCounts = {};
      events.value.forEach(event => {
        const month = new Date(event.date).toLocaleDateString('ro-RO', { month: 'short' });
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      });
      return Object.entries(monthCounts).map(([month, count]) => ({ month, count }));
    };

    const getEventProgress = (event) => {
      const eventTasks = allTasks.value.filter(task => task.eventId === event.id);
      if (eventTasks.length === 0) return 0;
      const completed = eventTasks.filter(task => task.status === 'Completed').length;
      return Math.round((completed / eventTasks.length) * 100);
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('ro-RO');

    const truncateText = (text, length) => {
      if (text.length <= length) return text;
      return text.substring(0, length) + '...';
    };

    const calculateProgress = () => {
      if (tasks.value.length === 0) return 0;
      const completedTasks = tasks.value.filter(task => task.status === 'Completed').length;
      return Math.round((completedTasks / tasks.value.length) * 100);
    };

    const loadEventTasks = async () => {
      if (!selectedEventId.value) return;
      const userId = store.getters['user/userId'];
      await store.dispatch('tasks/fetchTasks', {
        userId,
        eventId: selectedEventId.value
      });
    };

    const updateTaskStatus = async (task) => {
      const userId = store.getters['user/userId'];
      await store.dispatch('tasks/updateTask', {
        taskId: task.id,
        userId,
        eventId: selectedEventId.value,
        task: { ...task }
      });
      await loadEventTasks();
    };

    const addTask = async () => {
      const userId = store.getters['user/userId'];
      if (!userId || !selectedEventId.value) return;

      const taskData = {
        title: newTask.value.title,
        description: newTask.value.description,
        dueDate: newTask.value.dueDate,
        status: newTask.value.status || 'Pending'
      };

      await store.dispatch('tasks/addTask', {
        userId,
        eventId: selectedEventId.value,
       taskData
      });
      await loadEventTasks();
      closeAddModal();
    };

    const updateTask = async () => {
      const userId = store.getters['user/userId'];
      await store.dispatch('tasks/updateTask', {
        taskId: editingTask.value.id,
        userId,
        eventId: selectedEventId.value,
        task: editingTask.value
      });
      await loadEventTasks();
      closeEditModal();
    };

    const openAddModal = () => isAddModalOpen.value = true;
    const closeAddModal = () => {
      isAddModalOpen.value = false;
      newTask.value = { title: '', description: '', dueDate: '', status: 'Pending' };
    };
    const openViewAllModal = () => isViewAllModalOpen.value = true;
    const closeViewAllModal = () => isViewAllModalOpen.value = false;
    const openEditModal = (task) => {
      editingTask.value = { ...task };
      isEditModalOpen.value = true;
    };
    const closeEditModal = () => {
      isEditModalOpen.value = false;
      editingTask.value = { id: null, title: '', description: '', dueDate: '', status: 'Pending', priority: 'Medium' };
    };

    const getStatusClass = (status) => {
      const statusMap = {
        'Pending': 'status-pending',
        'In Progress': 'status-in-progress',
        'Completed': 'status-completed'
      };
      return statusMap[status] || '';
    };

    watch(selectedEventId, () => {
      if (!selectedEventId.value) {
        setTimeout(initializeCharts, 100);
      }
    });

    onMounted(async () => {
      const userId = store.getters['user/userId'];
      await store.dispatch('events/fetchEvents', userId);
      await store.dispatch('tasks/fetchAllTasks', userId);
      initializeCharts();
      window.addEventListener('resize', () => {
        pieChart?.resize();
        barChart?.resize();
      });
    });

    return {
      events,
      tasks,
      selectedEventId,
      isAddModalOpen,
      isViewAllModalOpen,
      newTask,
      previewTasks,
      formatDate,
      truncateText,
      calculateProgress,
      openAddModal,
      closeAddModal,
      openViewAllModal,
      closeViewAllModal,
      addTask,
      loadEventTasks,
      completedTasksCount,
      inProgressTasksCount,
      completionRate,
      upcomingEvents,
      pieChartRef,
      barChartRef,
      getEventProgress,
      isEditModalOpen,
      editingTask,
      getStatusClass,
      openEditModal,
      closeEditModal,
      updateTask,
      updateTaskStatus
    };
  }
};
</script>

<style scoped>
.task-manager-container {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  background-color: #f9f1d0b6;
  border-radius: 12px;
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
  flex-wrap: nowrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
}


.task-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid #e8e8e8;
  position: relative;
  overflow: hidden;
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
  width: 90%;
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

.dashboard-view {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: calc(100vh - 250px);
  overflow-y: auto;
}


.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: "Sour Gummy", sans-serif;
}

.stat-icon {
  font-size: 2rem;
}

.stat-content h3 {
  font-size: 1rem;
  color: #525151;
  margin: 0;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #7f73bf;
  margin: 0.5rem 0 0 0;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  flex: 1;
  margin-bottom: 50px;
}

.chart-card {
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: "Playwrite HR Lijeva", sans-serif;

}

.chart-card h3 {
  margin: 0 0 1rem 0;
  color: #3b9eba;
}

.chart-container {
  height: 350px;
  width: 100%;
}

.upcoming-events {
  text-align: center;
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  font-family: "Sour Gummy";
}

.events-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  width: 100%;
}

.event-card {
  flex: 1 1 calc(33.33% - 1rem);
  box-sizing: border-box;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  font-size: 0.8rem;
  align-items: center;
  font-family: "Playwrite HR Lijeva", sans-serif;
}

.event-date {
  font-weight: bold;
  color: #7f73bf;
  min-width: 100px;
}

.event-details h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.no-tasks-message {
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 1rem 0;
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

.add-task-btn{
  background-color: #c4e7ff;
  color: rgb(0, 0, 0);
  font-family: 'Sour Gummy';
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .events-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-view {
    height: auto;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .events-list {
    grid-template-columns: 1fr;
  }

  .chart-container {
    min-height: 250px;
  }
}

@media (max-width: 768px) {
  .task-manager-container {
    padding: 1rem;
  }

  .event-selection-container {
    flex-direction: column;
    align-items: center;
  }

  .event-select,
  .add-task-btn {
    width: 100%;
    max-width: 300px;
  }

  .task-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 1.5rem;
    width: 95%;
  }

  .all-tasks-grid {
    grid-template-columns: 1fr;
  }
}
</style>