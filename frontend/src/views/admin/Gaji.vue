<template>
  <div class="gaji">
    <h1>Daftar Gaji Karyawan</h1>
    <div class="card">
      <div class="top-bar">
        <button @click="_showModal = true" class="add-button">
          <i class="bi bi-plus-circle"></i> Generate Gaji
        </button>
        <div class="search-container">
          <div class="search-icon-container">
            <i class="bi bi-search search-icon"></i>
          </div>
          <input type="text" v-model="searchQuery" placeholder="Search..." class="search-input" />
        </div>
      </div>
      <table class="gaji-table">
        <thead>
          <tr>
            <th>Nama Karyawan</th>
            <th>Periode</th>
            <th>Gaji Pokok</th>
            <th>Bonus Lembur</th>
            <th>Potongan</th>
            <th>Total Gaji</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in filteredRecords" :key="record.id">
            <td>{{ record.User?.name }}</td>
            <td>{{ new Date(record.periodStart).toLocaleDateString() + " - " + new Date(record.periodEnd).toLocaleDateString() }}</td>
            <td>{{ formatCurrency(record.salary) }}</td>
            <td>{{ formatCurrency(record.overtimeBonus) }}</td>
            <td>{{ formatCurrency(record.deduction) }}</td>
            <td>{{ formatCurrency(record.netWorth) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="_showModal" class="modal">
        <div class="modal-content">
          <span @click="resetForm" class="close-button">&times;</span>
          <h2>Generate Gaji</h2>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="periodStart">Periode Mulai:</label>
              <input type="month" v-model="newRecord.periodStart" id="periodStart" required />
            </div>
            <div class="form-group">
              <label for="periodEnd">Periode Akhir:</label>
              <input type="month" v-model="newRecord.periodEnd" id="periodEnd" required />
            </div>
            <button type="submit" class="submit-button">Tambah</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../services/axios';

export default {
  name: 'Gaji',
  data() {
    return {
      searchQuery: '',
      _showModal: false,
      newRecord: {},
      records: []
    };
  },
  created() {
    this.resetForm();
    this.fetchData();
  },
  computed: {
    filteredRecords() {
      return this.records.filter((item) => (this.findObjectValues(item, this.searchQuery)));
    },
    calculatedTotalGaji() {
      return this.newRecord.gajiPokok + this.newRecord.tunjangan - this.newRecord.potongan;
    }
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    },
    submitForm() {
      if (this.submitForm.sleep)
        return;
      this.submitForm.sleep = true;

      axios.post('/api/v1/admin/payslips/generate', this.newRecord).finally(() => {
        this.fetchData();
        delete this.submitForm.sleep;
      })
      
      this.resetForm();
    },
    fetchData() {
      axios.get('/api/v1/admin/payslips').then((res) => {
        const data = res.data.data;
        this.records = data;
      });
    },
    resetForm() {
      this._showModal = false;
      const d = new Date();
      const periodEnd = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}`
      d.setMonth(d.getMonth()-1);
      const periodStart = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}`

      this.newRecord = {
        periodStart,
        periodEnd
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
  }
};
</script>

<style scoped>
.gaji {
  font-family: 'Arial', sans-serif;
  background-color: #f0f4f7;
  padding: 20px;
  width: 76vw;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.gaji h1 {
  font-size: 2em;
  margin-bottom: 20px;
  color: #333;
}

h1 {
  font-size: 2em;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
}

.card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.top-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.add-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  align-items: center;
}

.add-button i {
  margin-right: 5px;
}

.search-container {
  display: flex;
  align-items: center;
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
}

.gaji-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
}

.gaji-table th,
.gaji-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.gaji-table th {
  background-color: #4CAF50;
  color: white;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(255, 255, 255, 0.5);
}

.modal-content {
  background-color: #fff;
  padding: 40px;
  border: 1px solid #888;
  width: 400px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close-button:hover,
.close-button:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.form-group {
  margin-bottom: 10px;
}

.form-group input {
  width: 100%;
  padding: 6px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
  border-radius: 5px;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>
