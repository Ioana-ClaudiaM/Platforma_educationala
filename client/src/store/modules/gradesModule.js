import axios from 'axios';

const gradesModule = {
    namespaced: true,
    state: () => ({
        savedGrades: [],
    }),
    mutations: {
        SET_SAVED_SUBJECTS(state, subjects) {
            state.savedGrades = subjects;
        },
        ADD_SUBJECT_GRADE(state, subject) {
            state.savedGrades.push(subject);
        },
        UPDATE_SUBJECT_GRADE(state, { subject }) {
            const existingIndex = state.savedGrades.findIndex(
                s => s.name === subject.name
            );
            if (existingIndex !== -1) {
                state.savedGrades[existingIndex] = subject;
            }
        },
        DELETE_SUBJECT_GRADE(state, subjectName) {
            const index = state.savedGrades.findIndex(
                subject => subject.name === subjectName
            );
            if (index !== -1) {
                state.savedGrades.splice(index, 1);
            }
        },
    },
    actions: {
        async loadGrades({ commit }, userId) {
            try {
                const response = await axios.get(`http://localhost:8000/loadGrades/${userId}`);
                commit('SET_SAVED_SUBJECTS', response.data);
                return response.data;
            } catch (error) {
                console.error('Error loading grades:', error);
                throw error;
            }
        },
        async saveSubjectGrades({ commit }, { userId, gradeData }) {
            try {
                const response = await axios.post('http://localhost:8000/saveSubjectGrades', {
                    userId,
                    ...gradeData
                });
                commit('UPDATE_SUBJECT_GRADE', { subject: gradeData });
                return response.data;
            } catch (error) {
                console.error('Error saving subject grades:', error);
                throw error;
            }
        },
        
        async deleteSubjectGrade({ commit }, { userId, subjectName }) {
            try {
                await axios.delete(`http://localhost:8000/deleteSubjectGrade/${userId}/${subjectName}`);
               
                commit('DELETE_SUBJECT_GRADE', subjectName);
            } catch (error) {
                console.error('Error deleting subject grade:', error);
                throw error;
            }
        },
        async updateSubjectGrades({ commit }, { userId, gradeData }) {
            try {
              const response = await axios.put('http://localhost:8000/updateSubjectGrades', {
                userId,
                ...gradeData
              });
              
              commit('UPDATE_SUBJECT_GRADE', { subject: gradeData });
              return response.data;
            } catch (error) {
              console.error('Error updating subject grades:', error);
              throw error;
            }
          },
    },
    getters: {
        savedGrades: state => state.savedGrades,
    }
};
export default gradesModule;