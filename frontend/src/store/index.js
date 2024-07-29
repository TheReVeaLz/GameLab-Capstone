import { createStore } from 'vuex';
import axios from '../services/axios';

const store = createStore({
  state: {
    currentTime: new Date(),
    attendance: [],
    leaveApplications: [],
    userInfo: {},
    notifications: []
  },
  getters: {
    attendanceList: (state) => state.attendance,
    leaveApplications: (state) => state.leaveApplicationsm,
    userInfo: (state) => state.userInfo,
    isRoot: (state) => state.userInfo.privilege === "ROOT",
    isAdmin: (state) => ["ROOT", "ADMIN"].includes(state.userInfo.privilege)
  },
  mutations: {
    addAttendance(state, payload) {
      if (state.attendance.length && state.attendance[0].id === payload.id)
        state.attendance[0] = payload;
      else
        state.attendance.unshift(payload);
    },
    setAttendance(state, payload) {
      state.attendance = payload;
    },
    ADD_LEAVE_APPLICATION(state, application) {
      state.leaveApplications.push(application);
    },
    setUserInfo(state, payload) {
      state.userInfo = payload;
    }
  },
  actions: {
    updateTime({ commit }) {
      commit('updateTime');
    },
    addAttendance({ commit }, payload) {
      commit('addAttendance', payload);
    },
    setAttendance({ commit }, payload) {
      commit('setAttendance', payload);
    },
    submitLeaveApplication({ commit }, application) {
      commit('ADD_LEAVE_APPLICATION', application);
      commit('DECREMENT_LEAVE_BALANCE', application.days);
    },
    fetchUserInfo() {
      return axios.post("/api/v1/user/current-user").then((res) => {
        return this.state.userInfo = res.data?.data;
      }).catch((err) => {
        console.error(err.message);
        this.state.userInfo = {};
        this.$router.push("/login");
      })
    },
    fetchNotification() {
      axios.get("/api/v1/user/notifications").then((res) => {
          this.state.notifications = res.data?.data;
      }).catch((err) => {
        console.error(err.message);
      })
    },
    deleteNotification({ commit }, id) {
      axios.delete("/api/v1/user/notifications/" + id).then((res) => {
        if (res.status === 200) {
          const index = this.state.notifications.findIndex((item) => item.id === res.data?.data?.id);
          this.state.notifications.splice(index, 1);
        }
      }).catch((err) => {
        console.error(err.message);
      })
    },
    refreshUserInfo({ commit }) {
      this.dispatch('fetchUserInfo');
      this.dispatch('fetchNotification');
    },
    clearUserInfo() {
      localStorage.removeItem('token');
      this.state.userInfo = {};
      this.state.notifications.length = 0;
    },
    login({ commit }, payload) {
      return axios.post('/api/v1/user/login', payload, { headers: { 'Content-Type': 'application/json' }}).then((res) => {
        localStorage.setItem('token', res.data.data.token);
        commit('setUserInfo', res.data.data);
        this.dispatch('fetchNotification'); 
        return res;
      }).catch((err) => {
        if (err.response?.data?.status === 'FAIL')
          throw new Error(err.response?.data?.message);
      });
    }
  }
});

export default store;
