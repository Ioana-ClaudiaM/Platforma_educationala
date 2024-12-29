import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const eventsModule = {
    namespaced: true,
    state: () => ({
      events: []
    }),
    mutations: {
      SET_EVENTS(state, events) {
        state.events = events;
      },
      ADD_EVENT(state, event) {
        state.events.push(event);
      },
      UPDATE_EVENT(state, updatedEvent) {
        const index = state.events.findIndex(event => event.id === updatedEvent.id);
        if (index !== -1) {
          state.events.splice(index, 1, updatedEvent);
        }
      },
      DELETE_EVENT(state, eventId) {
        state.events = state.events.filter(event => event.id !== eventId);
      }
    },
    actions: {
      async fetchEvents({ commit }, userId) {
        try {
          const response = await axios.get(`http://localhost:8000/events/${userId}`);
          commit('SET_EVENTS', response.data.events);
        } catch (error) {
          console.error('Eroare la preluarea evenimentelor:', error);
        }
      },
      async addEvent({ commit, rootState }, eventData) {
        try {
          const response = await axios.post('http://localhost:8000/events', {
            userId: rootState.user.user.id,
            event: eventData
          });
          commit('ADD_EVENT', response.data.event);
          toast.success('Eveniment adăugat cu succes!');
        } catch (error) {
          toast.error('Eroare la adăugarea evenimentului!');
          console.error(error);
        }
      },
      async updateEvent({ commit, rootState }, eventData) {
        try {
          await axios.put('http://localhost:8000/events', {
            userId: rootState.user.user.id,
            event: eventData
          });
          commit('UPDATE_EVENT', eventData);
          toast.success('Eveniment actualizat cu succes!');
        } catch (error) {
          toast.error('Eroare la actualizarea evenimentului!');
          console.error(error);
        }
      },
      async deleteEvent({ commit, rootState }, eventId) {
        try {
          await axios.delete(`http://localhost:8000/events`, {
            data: { eventId, userId: rootState.user.user.id }
          });
          commit('DELETE_EVENT', eventId);
          toast.success('Eveniment șters cu succes!');
        } catch (error) {
          toast.error('Eroare la ștergerea evenimentului!');
          console.error(error);
        }
      }
    },
    getters: {
      allEvents: state => state.events
    }
  };

  export default eventsModule;