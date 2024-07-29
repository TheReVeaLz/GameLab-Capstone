<template>
  <div class="lemburcuti-page">
    <h1>Daftar Lembur dan Cuti</h1>
    <div class="card">
      <div class="top-bar">
        <div class="search-container">
          <div class="search-icon-container">
            <i class="bi bi-search search-icon"></i>
          </div>
          <input type="text" v-model="searchQuery" placeholder="Search..." class="search-input" />
        </div>
      </div>
      <table class="lemburcuti-table">
        <thead>
          <tr>
            <th>Nama Karyawan</th>
            <th>Tanggal Request</th>
            <th>Mulai</th>
            <th>Sampai</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in filteredRecords" :key="record.id">
            <td>{{ record.User?.name }}</td>
            <td>{{ new Date(record.requestDate).toLocaleString() }}</td>
            <td>{{ new Date(record.startDate).toLocaleDateString() }}</td>
            <td>{{ new Date(record.endDate).toLocaleDateString() }}</td>
            <td :class="'fw-bold ' + getStatusColor(record.status)">{{ record.status }}</td>
            <td>
              <div v-if="record.status === 'PENDING'">
                <button class="action-button accept-button" @click="confirmLeaveReq($event, record.id, true)">Terima</button>
                <button class="action-button reject-button" @click="confirmLeaveReq($event, record.id, false)">Tolak</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from '../../services/axios.js';

export default {
  name: 'LemburCuti',
  data() {
    return {
      searchQuery: '',
      records: []
    };
  },
  computed: {
    filteredRecords() {
      return this.records.filter((item) => (this.findObjectValues(item, this.searchQuery)))
    }
  },
  methods: {
    confirmLeaveReq(e, id, res) {
      if (e.target.sleep)
        return;
      e.target.sleep = true;

      try {
        const status = res ? 'ACCEPTED' : 'REJECTED';
        axios.post('/api/v1/admin/leaves/' + id, { status }).then((res) => {
          const data = res.data?.data;
          const index = this.records.findIndex((item) => (item.id === data.id));
  
          this.records[index].status = data.status;
        });
      } catch (err) {
        console.error(err);
        alert(err.message);
      }

      delete e.target.sleep;
    },
    getStatusColor(status) {
      switch (status) {
        case 'ACCEPTED':
          return 'text-success';
        case 'REJECTED':
          return 'text-danger';
        default:
          return undefined;
      }
    },
    findObjectValues(object, value) {
      for (const _values of Object.values(object)) {
        if (!_values)
          continue;
        
        if (typeof(_values) === 'object' && _values.constructor.name === 'Object')
          if (this.findObjectValues(_values, value))
            return true;

        if (String(_values).toLowerCase().includes(value.toLocaleLowerCase()))
          return true;
      }
      
      return false;
    }
  },
  created() {
    axios.get('/api/v1/admin/leaves').then((res) => {
      const data = res.data.data;
      this.records = data;
    });
  },
};
</script>

<style scoped>
.lemburcuti-page {
  font-family: 'Arial', sans-serif;
  background-color: #f0f4f7;
  padding: 20px;
  width: 76vw;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2em;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
}

.top-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  align-items: center;
  position: relative;
}

.search-icon-container {
  background-color: #f2f2f2;
  padding: 10px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.search-icon {
  font-size: 18px;
  color: #888;
}

.search-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-left: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  outline: none;
  transition: border 0.3s ease;
}

.search-input:focus {
  border-color: #4CAF50;
}

.lemburcuti-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
}

.lemburcuti-table th,
.lemburcuti-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}

.lemburcuti-table th {
  background-color: #4CAF50;
  color: white;
}

.lemburcuti-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.action-button {
  padding: 5px 10px;
  margin: 2px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.accept-button {
  background-color: #4CAF50;
  color: white;
}

.reject-button {
  background-color: #f44336;
  color: white;
}
</style>
