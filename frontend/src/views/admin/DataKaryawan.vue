<template>
  <div class="data-karyawan">
    <h1>Data Karyawan</h1>
    <div class="card">
      <div class="top-bar">
        <button @click="_showModal = 1" class="add-button">
          <i class="bi bi-plus-circle"></i> Tambah Data Karyawan
        </button>
        <div class="search-container">
          <div class="search-icon-container">
            <i class="bi bi-search search-icon"></i>
          </div>
          <input type="text" v-model="searchQuery" placeholder="Search..." class="search-input" />
        </div>
      </div>

      <table class="karyawan-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Jabatan</th>
            <th>Email</th>
            <th>Nomor Telepon</th>
            <th>Authority</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="karyawan in filteredKaryawan" :key="karyawan.id">
            <td>{{ karyawan.name }}</td>
            <td>{{ karyawan.JobRole?.roleName }}</td>
            <td>{{ karyawan.email }}</td>
            <td>{{ karyawan.phoneNumber }}</td>
            <td>{{ karyawan.privilege }}</td>
            <td class="actions">
              <button class="action-button edit-button" @click="editKaryawan(karyawan)">
                <i class="bi bi-pencil-square"></i> Edit
              </button>
              <button class="action-button delete-button" @click="deleteKaryawan($event, karyawan.id)">
                <i class="bi bi-trash"></i> Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="_showModal" class="modal">
        <div class="modal-content">
          <span @click="closeModal" class="close-button">&times;</span>
          <h2>{{ _showModal === 1 ? "Tambah Karyawan" : "Ubah Karyawan" }}</h2>
          <form @submit.prevent="submitForm(_showModal)">
            <div class="form-group">
              <input type="text" id="namaKaryawan" v-model="karyawanForm.name" placeholder="Nama Karyawan"/>
            </div>
            <div class="form-group">
              <input type="password" id="password" v-model="karyawanForm.password" placeholder="Password"/>
            </div>
            <div v-if="getJobOrder() && jabatanList.find((item) => item.id === karyawanForm.roleId)" class="form-group">
              <select class="form-control" v-model="karyawanForm.roleId">
                <option v-for="item in jabatanList" :value="item.id" :key="item.id">
                {{ item.roleName }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <input type="email" id="emailKaryawan" v-model="karyawanForm.email" placeholder="Email"/>
            </div>
            <div class="form-group">
              <input type="text" id="nomorTeleponKaryawan" v-model="karyawanForm.phoneNumber" placeholder="Nomor Telepon"/>
            </div>
            <div v-if="getPrivilege() && isRoot && privileges.includes(karyawanForm.privilege)" class="form-group">
              <select class="form-control" v-model="karyawanForm.privilege">
                <option v-for="item in privileges" :value="item" :key="item">
                {{ item }}
                </option>
              </select>
            </div>
            <button type="submit" class="submit-button">{{ _showModal === 1 ? "Tambah" : "Ubah" }}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from '../../services/axios.js';

export default {
  name: 'DataKaryawan',
  data() {
    return {
      searchQuery: '',
      _showModal: false,
      karyawanForm: {},
      karyawanList: [],
      jabatanList: [],
      privileges: ['ADMIN', 'MEMBER']
    };
  },
  created() {
    axios.get('/api/v1/user/users').then((res) => {
      const data = res.data.data;
      this.karyawanList = data;
    });

    axios.get('/api/v1/user/roles').then((res) => {
      const data = res.data.data;
      this.jabatanList = data;
    });
  },
  computed: {
    ...mapGetters(['isRoot', 'isAdmin']),
    filteredKaryawan() {
      return this.karyawanList.filter((item) => (this.findObjectValues(item, this.searchQuery)))
    }
  },
  methods: {
    closeModal() {
      this._showModal = 0;
      this.karyawanForm = {};
    },
    submitForm(method) {
      switch (method) {
        case 1:
          const url = this.karyawanForm.privilege === "ADMIN" ? '/api/v1/admin/register' : '/api/v1/user/register';
          axios.post(url, this.karyawanForm).then((res) => {
            const data = res.data?.data;
            data.JobRole = this.jabatanList.find((item) => item.id === data.roleId);
            this.karyawanList.push(data);
          });
          break;
        case 2:
          axios.put('/api/v1/user/' + this.karyawanForm.id, this.karyawanForm).then((res) => {
            const data = res.data?.data;
            const index = this.karyawanList.findIndex((item) => (item.id === data.id));
            this.karyawanList[index] = data;
          });
          break;
        default:
          console.error("UNKNOWN BEHAVIOUR");
          break;
      }
      this.closeModal();
    },
    editKaryawan(object) {
      this.karyawanForm = structuredClone(object);
      this._showModal = 2;
    },
    deleteKaryawan(e, id) {
      if (e.target.sleep)
        return;
      e.target.sleep = true;

      axios.delete("/api/v1/user/" + id).then((res) => {
        const index = this.karyawanList.findIndex((item) => item.id === res.data?.data?.id);
        this.karyawanList.splice(index, 1);
        
        delete e.target.sleep;
      }).catch((err) => {
        console.error(err.message);
      })
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
    getJobOrder() {
      if (!this.karyawanForm.roleId)
        this.karyawanForm.roleId = this.jabatanList.reduce((max, curr) => (max.order > curr.order ? max : curr), {}).id;

      return this.karyawanForm.roleId;
    },
    getPrivilege() {
      if (!this.karyawanForm.privilege)
        this.karyawanForm.privilege = this.privileges[this.privileges.length-1];

      return this.karyawanForm.privilege;
    }
  }
};
</script>

<style scoped>
.data-karyawan {
  font-family: 'Arial', sans-serif;
  background-color: #f0f4f7;
  padding: 20px;
  width: 76vw;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.data-karyawan h1 {
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

.karyawan-table {
  width: 100%;
  border-collapse: collapse;
}

.karyawan-table th,
.karyawan-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.karyawan-table th {
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
