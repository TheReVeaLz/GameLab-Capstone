<template>
  <div class="leave-management">
    <!-- Form Pengajuan Cuti -->
    <div class="leave-application">
      <h2>Ajukan Cuti</h2>
      <form @submit.prevent="submitLeave">
        <div class="form-group">
          <div class="date-inputs">
            <div>
              <label for="start_date">Tanggal Mulai</label>
              <input type="date" v-model="form.startDate" required />
            </div>
            <div>
              <label for="end_date">Tanggal Berakhir</label>
              <input type="date" v-model="form.endDate" required />
            </div>
          </div>
        </div>
        <button class="w-100" type="submit">Ajukan</button>
      </form>
    </div>

    <!-- Tabel Riwayat Cuti -->
    <div class="leave-history">
      <h2>Riwayat Cuti</h2>
      <table>
        <thead>
          <tr>
            <th>Tanggal Mengajukan</th>
            <th>Durasi Cuti</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="history in leaveHistory" :key="history.leave_id">
            <td>{{ formatDate(history.requestDate) }}</td>
            <td>{{ formatDate(history.startDate) }} s/d {{ formatDate(history.endDate) }}</td>
            <td>{{ history.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import axios from '../../services/axios.js';

export default {
  data() {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];
    return {
      sleep: false,
      form: {
        startDate: todayString,
        endDate: todayString
      },
      leaveHistory: []
    };
  },
  created() {
    this.fetchLeaveHistory();
  },
  methods: {
    async submitLeave() {
      if (this.sleep)
        return;

      this.sleep = true;
      try {
        const res = await axios.post("/api/v1/user/leaves", this.form);
        this.leaveHistory.push(res.data?.data);
        this.resetForm();
      } catch (err) {
        console.error(err.message);
      } finally {
        this.sleep = false;
      }
    },
    resetForm() {
      this.form.startDate = '';
      this.form.endDate = '';
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    },
    fetchLeaveHistory() {
      axios.get('/api/v1/user/leaves')
        .then(response => {
          const data = response.data?.data;
          this.leaveHistory = data;
        })
        .catch(error => {
          console.error('Error fetching leave history:', error);
        });
    },
  },
};
</script>


<style scoped>
.leave-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2em;
}

.leave-application, .leave-history {
  margin-bottom: 2em;
}

.leave-application h2, .leave-history h2 {
  text-align: center;
}

.form-group {
  margin-bottom: 1.5em;
}

label {
  display: block;
  margin-bottom: 0.5em;
}

input, select, textarea {
  width: 100%;
  padding: 0.75em;
  margin-top: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  display: block;
  width: 100%;
  padding: 0.75em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1em;
}

button:hover {
  background-color: #0056b3;
}

.leave-history table {
  width: 100%;
  border-collapse: collapse;
}

.leave-history th, .leave-history td {
  padding: 0.75em;
  text-align: left;
  border-bottom: 1px solid #ccc;
}

.leave-history th {
  background-color: #f2f2f2;
}

.date-inputs {
  display: flex;
  justify-content: space-between;
}

.date-inputs > div {
  width: calc(50% - 0.5em); /* Jarak 0.5em antara input */
}
</style>
