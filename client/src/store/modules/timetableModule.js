import axios from 'axios';

const timetableModule = {
    namespaced: true,
    state: () => ({
      schedule: null,
      timeConfig: {
        startTime: 8,
        hourDuration: 50,
        breakDuration: 10
      }
    }),
    
    mutations: {
      SET_SCHEDULE(state, schedule) {
        state.schedule = schedule;
      },
      SET_TIME_CONFIG(state, config) {
        state.timeConfig = config;
      },
      ADD_SUBJECT(state, { day, index, subject }) {
        if (state.schedule) {
          state.schedule[day][index] = subject;
        }
      },
      UPDATE_SUBJECT(state, { day, index, value }) {
        if (state.schedule) {
          state.schedule[day][index] = value;
        }
      },
      DELETE_SUBJECT(state, { day, index }) {
        if (state.schedule) {
          state.schedule[day][index] = '';
        }
      }
    },
    
    actions: {
      async loadTimetable({ commit }, userId) {
        try {
          const response = await axios.get(`http://localhost:8000/loadTimetable/${userId}`);
          if (response.data.timeConfig) {
            commit('SET_TIME_CONFIG', response.data.timeConfig);
          }
          if (response.data.schedule) {
            commit('SET_SCHEDULE', response.data.schedule);
          }
          return response.data;
        } catch (error) {
          console.error('Error loading timetable:', error);
          throw error;
        }
      },
      
      async saveTimetable({ commit }, { userId, scheduleData }) {
        try {
          await axios.post('http://localhost:8000/saveTimetable', {
            userId,
            ...scheduleData
          });
          commit('SET_SCHEDULE', scheduleData.schedule);
          commit('SET_TIME_CONFIG', {
            startTime: scheduleData.startTime,
            hourDuration: scheduleData.hourDuration,
            breakDuration: scheduleData.breakDuration
          });
        } catch (error) {
          console.error('Error saving timetable:', error);
          throw error;
        }
      },
      
      async addSubject({ commit }, { userId, day, index, subject }) {
        try {
          await axios.post('http://localhost:8000/addSubject', {
            userId,
            day,
            index,
            subject
          });
          commit('ADD_SUBJECT', { day, index, subject });
        } catch (error) {
          console.error('Error adding subject:', error);
          throw error;
        }
      },
      
      async updateTimetableSubject({ commit }, { userId, day, index, value }) {
        try {
          await axios.post('http://localhost:8000/updateSubject', {
            userId,
            day,
            index,
            value
          });
          commit('UPDATE_SUBJECT', { day, index, value });
        } catch (error) {
          console.error('Error updating subject:', error);
          throw error;
        }
      },
      
      async deleteSubject({ commit }, { userId, day, index }) {
        try {
          await axios.post('http://localhost:8000/deleteSubject', {
            userId,
            day,
            index
          });
          commit('DELETE_SUBJECT', { day, index });
        } catch (error) {
          console.error('Error deleting subject:', error);
          throw error;
        }
      }
    },
    
    getters: {
      schedule: state => state.schedule,
      timeConfig: state => state.timeConfig
    }
  };

  export default timetableModule;