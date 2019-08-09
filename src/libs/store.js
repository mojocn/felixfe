import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export default new Vuex.Store({
    msgs: [],
    state: {
        idWidth: 120,
        user: JSON.parse(localStorage.getItem('user')) || {}
    },
    mutations: {
        setUser(state, obj) {
            state.user = obj;
            localStorage.setItem('user', JSON.stringify(obj));
        },
        setMsgs(state, msgs) {
            state.msgs = msgs
        },
        prependMsgs(state, msg) {
            state.msgs = state.msgs.unshift(msg)
        }
    },
    getters: {
        jwt() {
            return localStorage.getItem("token") || '';
        },
        userName(state) {
            return state.user.real_name || state.user.name || "";
        },
        userEmail(state) {
            return state.user.email || "";
        },
        userIsAdmin(state) {
            return state.user.role === 2 || false;
        },
        userId(state) {
            return state.user.id || 0;
        }
    }
});
