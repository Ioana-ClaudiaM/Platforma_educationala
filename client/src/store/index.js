import { createStore } from 'vuex';
import axios from 'axios';
const userModule = {
  namespaced: true,
  state: () => ({
    user: JSON.parse(localStorage.getItem('user_info')) || null, 
  }),
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
  },
  actions: {
    setUser({ commit }, user) {
      commit('SET_USER', user);
    },
    clearUser({ commit }) {
      commit('SET_USER', null);
    },
  },
  getters: {
    username: (state) => state.user?.username || 'Guest',
    userId: (state) => state.user?.id || null,  
    isLoggedIn: (state) => !!state.user,
  },
};

const tasksModule = {
  namespaced: true,
  state: () => ({
    tasks: [],
  }),
  mutations: {
    SET_TASKS(state, tasks) {
      state.tasks = tasks;
    },
    ADD_TASK(state, task) {
      state.tasks.push(task);
    },
    UPDATE_TASK(state, updatedTask) {
      const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
      if (index !== -1) {
        state.tasks.splice(index, 1, updatedTask);
      }
    },
    REMOVE_TASK(state, taskId) {
      state.tasks = state.tasks.filter((task) => task.id !== taskId);
    },
  },
  actions: {
    async fetchTasks({ commit }, userId) {
      try {
        const response = await axios.get(`http://localhost:8000/tasks/${userId}`);
        commit('SET_TASKS', response.data.tasks);
      } catch (error) {
        console.error('Eroare la preluarea task-urilor:', error);
      }
    },
    addTask({ commit }, task) {
      commit('ADD_TASK', task);
    },
    updateTask({ commit }, updatedTask) {
      commit('UPDATE_TASK', updatedTask);
    },
    removeTask({ commit }, taskId) {
      commit('REMOVE_TASK', taskId);
    },
  },
  getters: {
    educationalTasks: (state) => state.tasks,
  },
};

export default createStore({
  modules: {
    user: userModule,
    tasks: tasksModule,
  },
});
