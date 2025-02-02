import axios from 'axios';

const tasksModule = {
  namespaced: true,
  state: () => ({
    eventTasks: [],
    allTasks: [],
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
      if (index !== -1) {
        state.eventTasks[index] = updatedTask;
      }
      
      const allIndex = state.allTasks.findIndex(task => task.id === updatedTask.id);
      if (allIndex !== -1) {
        state.allTasks[allIndex] = updatedTask;
      }
    },
    DELETE_TASK(state, taskId) {
      state.eventTasks = state.eventTasks.filter(task => task.id !== taskId);
      state.allTasks = state.allTasks.filter(task => task.id !== taskId);  
    },
    CLEAR_EVENT_TASKS(state) {
      state.eventTasks = [];
    }
  },
  actions: {
    async fetchEventTasks({ commit }, { userId, eventId }) {
      try {
        commit('CLEAR_EVENT_TASKS');
        const response = await axios.get(`http://localhost:8000/tasks/${userId}/${eventId}`);
        commit('SET_EVENT_TASKS', response.data.tasks);
      } catch (error) {
        console.error('Eroare la încărcarea taskurilor:', error);
      }
    },
    
    async fetchAllTasks({ commit }, userId) {
      try {
        const response = await axios.get(`http://localhost:8000/tasks/${userId}`);
        commit('SET_ALL_TASKS', response.data.tasks);
      } catch (error) {
        console.error('Eroare la încărcarea tuturor taskurilor:', error);
      }
    },
    
    async addTask({ commit, dispatch }, { userId, eventId, taskData }) {
      try {
        const response = await axios.post(`http://localhost:8000/addTask`, {
          userId,
          eventId,
          ...taskData
        });
        commit('ADD_TASK', response.data.task);
        await dispatch('fetchAllTasks', userId);
      } catch (error) {
        console.error('Eroare la adăugarea taskului:', error);
        throw error;
      }
    },
    
    async updateTask({ commit, dispatch }, { taskId, userId, eventId, taskData }) {
      try {
        const response = await axios.put(`http://localhost:8000/updateTask`, {
          taskId,
          userId,
          eventId,
          ...taskData
        });
        commit('UPDATE_TASK', response.data.task);
        await dispatch('fetchAllTasks', userId);
      } catch (error) {
        console.error('Eroare la actualizarea taskului:', error);
        throw error;
      }
    },
    
    async deleteTask({ commit, dispatch }, { taskId, userId, eventId }) {
      try {
        await axios.delete(`http://localhost:8000/deleteTask/${userId}/${eventId}/${taskId}`);
        commit('DELETE_TASK', taskId);
        await dispatch('fetchAllTasks', userId);
      } catch (error) {
        console.error('Eroare la ștergerea taskului:', error);
      }
    }
  },
  getters: {
    eventTasks: state => state.eventTasks,
    allTasks: state => state.allTasks
  }
};

export default tasksModule;