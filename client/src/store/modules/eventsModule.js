import axios from 'axios';

const eventsModule = {
    namespaced: true,
    state: () => ({
      events: [],
      eventTypes : {
        'Examen final': '#FF6B6B',
        'Test de seminar': '#FF9800',
        'Test parțial': '#FFC107',
        'Colocviu': '#FF5722',
        'Deadline proiect': '#4CAF50',
        'Prezentare proiect': '#8BC34A',
        'Vizită secretariat': '#E91E63',
        'Depunere cereri': '#F44336',
        'Întâlnire de grup': '#795548',
        'Workshop': '#607D8B',
        'Career fair': '#3F51B5',
        'Concurs academic': '#FFEB3B',
        'Voluntariat': '#4CAF50',
        'Eveniment sportiv': '#9E9E9E'
      },
      daysOfWeek : ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'],
    }),
    mutations: {
      SET_EVENTS(state, events) {
        state.events = events;
      },
      ADD_EVENT(state, event) {
        state.events.push(event);
      },
      UPDATE_EVENT(state, { eventId, eventData }) {
        if (state.resources) {
            const index = state.allEvents.findIndex(e => e.id === eventId);
            if (index !== -1) {
                state.events[index] = { ...state.events[index], ...eventData };
            }
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
      async addEvent({ commit }, { event, userId }) {
        try {      
          await axios.post('http://localhost:8000/addEvent', {
            userId,
            event: event
          });
      
          commit('ADD_EVENT', event);
        } catch (error) {
          console.error('Eroare la adăugarea evenimentului:', error);
        }
      },      
      async updateEvent({ commit }, {userId,eventId,eventData}) {
        console.log(eventData,userId,eventId);
        try {
          await axios.put('http://localhost:8000/updateEvent', {
            userId,
            eventId,
            eventData
          });
          commit('UPDATE_EVENT', {eventId,eventData});
        } catch (error) {
          console.error(error);
        }
      },
      async deleteEvent({ commit }, {eventId,userId}) {
        try {
          await axios.delete(`http://localhost:8000/deleteEvent/${eventId}/${userId}`);
          commit('DELETE_EVENT', eventId);
        } catch (error) {
          console.error(error);
        }
      }
    },
    getters: {
      allEvents: state => state.events,
      eventTypes: state => state.eventTypes,
      daysOfWeek: state => state.daysOfWeek
    }
  };

  export default eventsModule;