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
        async logout({ dispatch }) {
            try {
                localStorage.removeItem('user_info');
                localStorage.removeItem('user_token');
                await dispatch('clearUser');
                return Promise.resolve();
            } catch (error) {
                return Promise.reject(error);
            }
        }
    },
    getters: {
        username: (state) => state.user?.username || 'Guest',
        userId: (state) => state.user?.id || null,
        isLoggedIn: (state) => !!state.user,
    },
};

export default userModule;