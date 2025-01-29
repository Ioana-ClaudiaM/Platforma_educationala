import { createStore } from 'vuex';
import userModule from './modules/userModule';
import timetableModule from './modules/timetableModule';
import tasksModule from './modules/tasksModule';
import libraryModule from './modules/libraryModule';
import eventsModule from './modules/eventsModule';
import gradesModule from './modules/gradesModule';

const store = createStore({
  modules: {
    user: userModule,
    tasks: tasksModule,
    events: eventsModule,
    timetable: timetableModule,
    library:libraryModule,
    grades:gradesModule,
  },
});

export default store;
