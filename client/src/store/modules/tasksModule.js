import axios from 'axios';

const tasksModule = {
  namespaced: true,
  state: () => ({
    eventTasks: [],
    allTasks: [],
    loading: false,
    error: null
  }),

  mutations: {
    SET_EVENT_TASKS(state, tasks) {
      state.eventTasks = tasks;
    },
    SET_ALL_TASKS(state, tasks) {
      state.allTasks = tasks;
    },
    ADD_TASK(state, task) {
      state.eventTasks.push(task);
      state.allTasks.push(task);
    },
    UPDATE_TASK(state, updatedTask) {
      const index = state.eventTasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) state.eventTasks[index] = updatedTask;

      const allIndex = state.allTasks.findIndex(task => task.id === updatedTask.id);
      if (allIndex !== -1) state.allTasks[allIndex] = updatedTask;
    },
    DELETE_TASK(state, taskId) {
      state.eventTasks = state.eventTasks.filter(task => task.id !== taskId);
      state.allTasks = state.allTasks.filter(task => task.id !== taskId);
    },
  },

  actions: {
    async fetchEventTasks({ commit }, { userId, eventId }) {
      try {
        const response = await axios.get(`http://localhost:8000/tasks/${userId}/${eventId}`);
        commit('SET_EVENT_TASKS', response.data.tasks);
      } catch (error) {
        console.error('Eroare la încărcarea task-urilor:', error);
      }
    },

    async fetchAllTasks({ commit }, userId) {
      try {
        const response = await axios.get(`http://localhost:8000/tasks/${userId}`);
        commit('SET_ALL_TASKS', response.data.tasks);
      } catch (error) {
        console.error('Eroare la încărcarea tuturor task-urilor:', error);
      }
    },

    async addTask({ commit }, { userId, eventId, taskData }) {
      try {
        const response = await axios.post(`http://localhost:8000/addTask`, {
          userId,
          eventId,
          task: taskData
        });
        commit('ADD_TASK', response.data.task);
      } catch (error) {
        console.error('Eroare la adăugarea task-ului:', error);
      }
    },

    async updateTask({ commit }, { taskId, userId, eventId, taskData }) {
      try {
        const response = await axios.put(`http://localhost:8000/updateTask`, {
          taskId,
          userId,
          eventId,
          task: taskData
        });
        commit('UPDATE_TASK', response.data.task);
      } catch (error) {
        console.error('Eroare la actualizarea task-ului:', error);
      }
    },

    async deleteTask({ commit }, { taskId, userId,eventId }) {
      try {
        await axios.delete(`http://localhost:8000/deleteTask/${userId}/${eventId}/${taskId}`);
        commit('DELETE_TASK', taskId);
      } catch (error) {
        console.error('Eroare la ștergerea task-ului:', error);
      }
    },
  },

    getters: {
      eventTasks: state => state.eventTasks || [],
      allTasks: state => state.allTasks || [],
    }
  };

  export default tasksModule;