import axios from 'axios';

const libraryModule = {
    namespaced: true,

    state: () => ({
        resources: [],
        resourceTypes: {
            'Notă': '📝',
            'Carte': '📖',
            'Articol': '📄',
            'Exerciții': '✏️',
            'Video': '🎥',
            'Prezentare': '📊',
            'Podcast': '🎧'
        },
        selectedCategory: null
    }),

    mutations: {
        SET_RESOURCES(state, resources) {
            state.resources = resources;
        },
        SET_SELECTED_CATEGORY(state, category) {
            state.selectedCategory = category;
        },
        ADD_RESOURCE(state, resource) {
            const index = state.resources.findIndex(r => r.title === resource.title && r.category === resource.category && r.type === resource.type
            && r.description === resource.description); 
            if (index === -1) {
                state.resources.push(resource);
            }
            else{
                throw new Error('Resursa există deja');
            }
        },
        DELETE_RESOURCE(state, resourceId) {
            if (state.resources) {
                state.resources = state.resources.filter(r => r.id !== resourceId);
            }
        },
        UPDATE_RESOURCE(state, { resourceId, resourceData }) {
            const index = state.resources.findIndex(r => r.id === resourceId);
            if (index !== -1) {
              state.resources[index] = { ...state.resources[index], ...resourceData };
            }
        }
    },

    actions: {
        async loadResources({ commit }, userId) {
            try {
                const response = await axios.get(`http://localhost:8000/getUserResources/${userId}`);
                commit('SET_RESOURCES', response.data);
            } catch (error) {
                console.error('Eroare la încărcarea resurselor:', error);
                throw error;
            }
        },

        async addResource({ commit }, { userId, resource }) {
            try {
                const response = await axios.post(
                    'http://localhost:8000/addResource',
                    { userId, ...resource },
                );
                commit('ADD_RESOURCE', response.data.resource);
            } catch (error) {
                console.error('Eroare la adăugarea resursei:', error);
                throw error;
            }
        },

        async deleteResource({ commit }, { resourceId, userId}) {
            try {
                await axios.delete(`http://localhost:8000/deleteResource/${userId}/${resourceId}`);
                commit('DELETE_RESOURCE', resourceId);
            } catch (error) {
                console.error('Eroare la ștergerea resursei:', error);
                throw error;
            }
        },

        async updateResource({ commit }, { userId, resourceId, resourceData }) {
            try {
              const response = await axios.put('http://localhost:8000/updateResource', {
                userId,
                resourceId,
                ...resourceData
              });
                commit('UPDATE_RESOURCE', { id: resourceId, updatedData: response.data });
            } catch (error) {
                console.error('Eroare la actualizarea resursei:', error);
                throw error;
            }
        },

        setSelectedCategory({ commit }, category) {
            commit('SET_SELECTED_CATEGORY', category);
        }
    },

    getters: {
        resources: state => state.resources,
        resourceTypes: state => state.resourceTypes,
        selectedCategory: state => state.selectedCategory,
        filteredResources: state => {
            if (!state.resources || !state.selectedCategory) return [];
            return state.resources.filter(resource =>
                resource.category === state.selectedCategory
            );
        }
    }
};

export default libraryModule;