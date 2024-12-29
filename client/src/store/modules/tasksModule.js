import axios from 'axios';

const tasksModule = {
    namespaced: true,
    state: () => ({
      tasks: [],
      allTasks: [],
      loading: false,
      error: null
    }),
  
    mutations: {
      SET_TASKS(state, tasks) {
        state.tasks = tasks;
      },
      SET_ALL_TASKS(state, tasks) {
        state.allTasks = tasks;
      },
      ADD_TASK(state, task) {
        state.tasks.push(task);
        state.allTasks.push(task);
      },
      UPDATE_TASK(state, updatedTask) {
        const index = state.tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) state.tasks[index] = updatedTask;
        
        const allIndex = state.allTasks.findIndex(task => task.id === updatedTask.id);
        if (allIndex !== -1) state.allTasks[allIndex] = updatedTask;
      },
      DELETE_TASK(state, taskId) {
        state.tasks = state.tasks.filter(task => task.id !== taskId);
        state.allTasks = state.allTasks.filter(task => task.id !== taskId);
      },
      SET_LOADING(state, status) {
        state.loading = status;
      },
      SET_ERROR(state, error) {
        state.error = error;
      }
    },
  
    actions: {
      async fetchTasks({ commit }, { userId, eventId }) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
          const response = await axios.get(`http://localhost:8000/tasks/${userId}/${eventId}`);
          if (response.data && Array.isArray(response.data.tasks)) {
            commit('SET_TASKS', response.data.tasks);
          } else {
            commit('SET_TASKS', []);
          }
        } catch (error) {
          if (error.response?.status === 404) {
            commit('SET_TASKS', []);
            return;
          }
          
          console.error('Eroare la încărcarea task-urilor:', error);
          commit('SET_ERROR', error.response?.data?.message || 'Eroare la încărcarea task-urilor');
          commit('SET_TASKS', []);
        } finally {
          commit('SET_LOADING', false);
        }
      },
  
      async fetchAllTasks({ commit }, userId) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
          const response = await axios.get(`http://localhost:8000/tasks/${userId}`);
          if (response.data && Array.isArray(response.data.tasks)) {
            commit('SET_ALL_TASKS', response.data.tasks);
          } else {
            commit('SET_ALL_TASKS', []);
          }
        } catch (error) {
          if (error.response?.status === 404) {
            commit('SET_ALL_TASKS', []);
            return;
          }
          
          console.error('Eroare la încărcarea tuturor task-urilor:', error);
          commit('SET_ERROR', error.response?.data?.message || 'Eroare la încărcarea tuturor task-urilor');
          commit('SET_ALL_TASKS', []);
        } finally {
          commit('SET_LOADING', false);
        }
      },
  
      async addTask({ commit, dispatch }, { userId, eventId, taskData }) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
          const response = await axios.post(`http://localhost:8000/addTask`, {
            userId,
            eventId,
            task: taskData
          });
          
          if (response.data && response.data.task) {
            commit('ADD_TASK', response.data.task);
            await dispatch('fetchAllTasks', userId);
            return response.data.task;
          } else {
            throw new Error('Răspuns invalid de la server');
          }
        } catch (error) {
          console.error('Eroare la adăugarea task-ului:', error);
          commit('SET_ERROR', error.response?.data?.message || 'Eroare la adăugarea task-ului');
          throw error;
        } finally {
          commit('SET_LOADING', false);
        }
      },
  
      async updateTask({ commit }, { taskId, userId, eventId, taskData }) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
          const response = await axios.put(`http://localhost:8000/updateTask`, {
            taskId,
            userId,
            eventId,
            task: taskData
          });
          
          if (response.data && response.data.task) {
            commit('UPDATE_TASK', response.data.task);
            return response.data.task;
          }
          return null;
        } catch (error) {
          console.error('Eroare la actualizarea task-ului:', error);
          commit('SET_ERROR', error.response?.data?.message || 'Eroare la actualizarea task-ului');
          throw error;
        } finally {
          commit('SET_LOADING', false);
        }
      },
  
      async deleteTask({ commit }, { taskId, userId }) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
          await axios.delete(`http://localhost:8000/deleteTask`, {
            data: { taskId, userId }
          });
          commit('DELETE_TASK', taskId);
        } catch (error) {
          console.error('Eroare la ștergerea task-ului:', error);
          commit('SET_ERROR', error.response?.data?.message || 'Eroare la ștergerea task-ului');
          throw error;
        } finally {
          commit('SET_LOADING', false);
        }
      }
    },
  
    getters: {
      eventTasks: state => state.tasks || [],
      allTasks: state => state.allTasks || [],
      hasEventTasks: state => (state.tasks && state.tasks.length > 0),
      loading: state => state.loading,
      error: state => state.error,
      taskStatus: (state) => ({
        isEmpty: !state.tasks || state.tasks.length === 0,
        isLoading: state.loading,
        hasError: !!state.error
      }),
      getTaskById: (state) => (taskId) => {
        return state.allTasks?.find(task => task.id === taskId) || null;
      }
    }
  };

  export default tasksModule;