<template>
  <div class="container mt-5">
    <!-- Baris untuk card Profil Karyawan dan Waktu -->
    <div class="row mb-4">
      <div class="col-lg-6 col-md-12 mb-3">
        <div class="card h-100">
          <div class="card-body text-center">
            <h5 class="card-title">Profil Karyawan</h5>
            <img :src="userInfo.image" class="rounded-circle mb-3" alt="Profil Karyawan">
            <p class="card-text">{{userInfo.name ? userInfo.name : "-"}}</p>
            <p class="card-text">{{typeof(userInfo.JobRole?.roleName) === "string" ? userInfo.JobRole?.roleName : "-" }}</p>
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-md-12 mb-3">
        <div class="card h-100">
          <div class="card-body text-center">
            <h5 class="card-title">Waktu</h5>
            <p class="card-text">{{ currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
            <p class="card-text">{{ currentTime.toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }}</p>
            <button class="btn btn-primary w-100" @click="toggleAttendance">{{ buttonText }}</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Baris untuk card Riwayat Kehadiran Terbaru -->
    <div class="row mb-4">
      <div class="col-12 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Riwayat Kehadiran Terbaru</h5>
            <table class="table table-responsive">
              <thead>
                <tr>
                  <th scope="col">Hari/Tanggal</th>
                  <th scope="col">Check In</th>
                  <th scope="col">Check Out</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(entry, index) in attendanceList" :key="index">
                  <td>{{ entry.presenceDate ? new Date(entry.presenceDate).toLocaleDateString() : "-" }}</td>
                  <td>{{ entry.checkIn ? new Date(entry.checkIn).toLocaleTimeString() : "-" }}</td>
                  <td>{{ entry.checkOut ? new Date(entry.checkOut).toLocaleTimeString() : "-" }}</td>
                  <td>{{ entry.status || "-" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from '../../services/axios.js';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'Attendance',
  data() {
    return {
      currentTime: new Date(),
      timerIds: []
    };
  },
  computed: {
    ...mapState(['attendance', 'userInfo']),
    ...mapGetters(['attendanceList']),
    buttonText() {
      return "Check-in/Check-out";
    }
  },
  methods: {
    ...mapActions(['addAttendance', 'setAttendance']),
    async toggleAttendance() {
      if (this.toggleAttendance.instance)
        return;
      this.toggleAttendance.instance = true;

      try {
        const res = (await axios.post("/api/v1/user/presence")).data;

        if (res.data)
          this.addAttendance(res.data);
      } catch (err) {
        console.error(err.message);
      } finally {
        this.toggleAttendance.instance = false;
      }
    },
    async fetchPresence() {
      try {
        const data = (await axios.get("/api/v1/user/presences")).data;
        
        this.setAttendance(data.data);
      } catch (err) {
        console.error(err.message);
      }
    },
    async updateTime() {
      this.currentTime = new Date();
    }
  },
  created() {
    this.fetchPresence();
    this.timerIds.push(setInterval(this.updateTime, 1000));
  },
  unmounted() {
    this.timerIds.forEach(id => clearInterval(id));
  }
};
</script>
<style scoped>
@import "./DashboardStyles.css";
</style>