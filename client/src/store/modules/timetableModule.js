import axios from 'axios';

const timetableModule = {
    namespaced: true,
    state: () => ({
        schedule: null,
        timeConfig: {
            startTime: 8,
            hourDuration: 50,
            breakDuration: 10
        },
    }),

    mutations: {
        SET_SCHEDULE(state, schedule) {
            state.schedule = schedule;
        },
        SET_TIME_CONFIG(state, config) {
            state.timeConfig = config;
        },
        DELETE_SUBJECT(state, { day, index }) {
            if (state.schedule) {
                state.schedule[day][index] = '';
            }
        },
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
                console.log(" Error saving timetable:", error);
                throw error;
            }
        },

        async deleteSubject({ commit }, { userId, day, index }) {
            console.log(userId,day,index)
            try {
                await axios.delete(`http://localhost:8000/deleteSubject/${userId}/${day}/${index}`);
                commit('DELETE_SUBJECT', { day, index });
            } catch (error) {
                console.error('Error deleting subject:', error);
                throw error;
            }
        },
    },

    getters: {
        schedule: state => state.schedule,
        timeConfig: state => state.timeConfig
    }
};

export default timetableModule;