<template>
  <div class="data-jabatan">
    <h1>Data Jabatan</h1>
    <div class="card">
      <div class="top-bar">
        <button @click="_showModal=1;jabatanForm.order = jabatanList.reduce((max, curr) => (max > curr.order ? max : curr.order), 1) + 1;" class="add-button">
          <i class="bi bi-plus-circle"></i> Tambah Data Jabatan
        </button>
        <div class="search-container">
          <div class="search-icon-container">
            <i class="bi bi-search search-icon"></i>
          </div>
          <input type="text" v-model="searchQuery" placeholder="Search..." class="search-input" />
        </div>
      </div>

      <table class="jabatan-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Nama Jabatan</th>
            <th>Gaji</th>
            <th>Bonus Lembur</th>
            <th>Potongan Absen</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="jabatan in filteredJabatan" :key="jabatan.id">
            <td>{{ jabatan.order }}</td>
            <td>{{ jabatan.roleName }}</td>
            <td>{{ formatCurrency(jabatan.salary) }}</td>
            <td>{{ formatCurrency(jabatan.overtimeBonus) }}</td>
            <td>{{ formatCurrency(jabatan.absenceDeduction) }}</td>
            <td class="actions">
              <button class="edit-button" @click="editJabatan(jabatan)">
                <i class="bi bi-pencil-square"></i> Edit
              </button>
              <button class="delete-button" @click="deleteJabatan($event, jabatan.id)">
                <i class="bi bi-trash"></i> Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="_showModal" class="modal">
        <div class="modal-content">
          <span @click="closeModal" class="close-button">&times;</span>
          <h2>{{ _showModal === 1 ? "Tambah Jabatan" : "Ubah Jabatan" }}</h2>
          <form @submit.prevent="submitForm(_showModal)">
            <div class="form-group">
              <label for="namaJabatan">Nama Jabatan:</label>
              <input type="text" id="namaJabatan" v-model="jabatanForm.roleName" required />
              <label for="gaji">Gaji:</label>
              <input type="text" id="gaji" v-model="jabatanForm.salary" required />
              <label for="bonusOT">Bonus Lembur:</label>
              <input type="text" id="bonusOT" v-model="jabatanForm.overtimeBonus" required />
              <label for="absenceDeduction">Potongan Absen:</label>
              <input type="text" id="absenceDeduction" v-model="jabatanForm.absenceDeduction" required />
              <label for="order">Order:</label>
              <input type="text" id="order" v-model="jabatanForm.order" required />
            </div>
            <button type="submit" class="submit-button">{{ _showModal === 1 ? "Tambah" : "Ubah" }}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../services/axios.js';

export default {
  name: 'DataJabatan',
  data() {
    return {
      searchQuery: '',
      _showModal: 0,
      jabatanForm: {},
      jabatanList: []
    };
  },
  computed: {
    filteredJabatan() {
      this.jabatanList.sort((a, b) => (a.order - b.order));
      return this.jabatanList.filter((item) => (this.findObjectValues(item, this.searchQuery)))
    }
  },
  created() {
    axios.get('/api/v1/user/roles').then((res) => {
      const data = res.data.data;
      const len = data.length;

      for (let i = 0; i < len; i++) {
        this.deleteNotNeededData(data[i]);
      }

      this.jabatanList = data;
    });
  },
  methods: {
    closeModal() {
      this._showModal = 0;
      this.jabatanForm = {};
    },
    submitForm(method) {
      switch (method) {
        case 1:
          axios.post('/api/v1/user/roles/create', this.jabatanForm).then((res) => {
            const data = res.data?.data;
            this.deleteNotNeededData(data);
            this.jabatanList.push(data);
          });
          break;
        case 2:
          axios.put('/api/v1/user/roles/' + this.jabatanForm.id, this.jabatanForm).then((res) => {
            const data = res.data?.data;
            this.deleteNotNeededData(data);

            const index = this.jabatanList.findIndex((item) => (item.id === data.id));
            this.jabatanList[index] = data;
          });
          break;
        default:
          console.error("UNKNOWN BEHAVIOUR");
          break;
      }
      this.closeModal();
    },
    editJabatan(object) {
      this.jabatanForm = structuredClone(object);
      this._showModal = 2;
    },
    deleteJabatan(e, id) {
      if (e.target.sleep)
        return;
      e.target.sleep = true;

      axios.delete("/api/v1/user/roles/" + id).then((res) => {
        const index = this.jabatanList.findIndex((item) => item.id === res.data?.data?.id);
        this.jabatanList.splice(index, 1);

        delete e.target.sleep;
      }).catch((err) => {
        console.error(err.message);
      });
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
    },
    deleteNotNeededData(object) {
      delete object.createdAt;
      delete object.updatedAt;
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    }
  }
};
</script>

<style scoped>
.data-jabatan {
  font-family: 'Arial', sans-serif;
  background-color: #f0f4f7;
  padding: 20px;
  width: 76vw;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.data-jabatan h1 {
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
  align-items: center;
  margin-bottom: 20px;
}

.add-button {
  background-color: #4CAF50;
  color: white;
  padding: 8px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background-color 0.3s ease;
  max-width: 240px;
}

.add-button:hover {
  background-color: #45a049;
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

.jabatan-table {
  width: 100%;
  border-collapse: collapse;
}

.jabatan-table th,
.jabatan-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.jabatan-table th {
  background-color: #f2f2f2;
  color: #333;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center; /* Center align items horizontally */
}

.edit-button,
.delete-button {
  padding: 8px 15px; /* Adjust padding as needed for your design */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  display: inline-flex; /* Change to inline-flex to make width fit-content work */
  align-items: center;
  width: 130px; /* Set a fixed width for both buttons */
  justify-content: center; /* Center the text and icon horizontally */
  text-align: center; /* Center align text */
}

.edit-button i,
.delete-button i {
  margin-right: 5px;
}

.edit-button {
  background-color: #2196F3;
  color: white;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.edit-button i,
.delete-button i {
  margin-right: 5px;
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
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  padding: 20px;
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
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
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
  margin-top: 10px;
  width: 100%;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>
