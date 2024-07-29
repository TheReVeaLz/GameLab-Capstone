<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <img src="/img/logo.png" alt="Admin Logo" class="sidebar-logo" />
      <h2 class="sidebar-title">Admin Panel</h2>
    </div>
    <ul class="sidebar-menu">
      <li :class="{ active: activeItem === 'Dashboard' }" @click="setActive('Dashboard')">
        <router-link to="/admin" class="sidebar-link"><i class="bi bi-house-door-fill"></i>Dashboard</router-link>
      </li>
      <li :class="{ active: activeItem === 'Karyawan' }" @click="toggleSubmenu('Karyawan')">
        <a class="sidebar-link">
          <div class="menu-content">
            <i class="bi bi-people-fill"></i>
            <span class="menu-text">Karyawan</span>
          </div>
          <i :class="{'bi-chevron-left': true, 'rotated': activeSubmenu === 'Karyawan'}" class="submenu-icon"></i>
        </a>
        <ul v-if="activeSubmenu === 'Karyawan'" class="sidebar-submenu">
          <li v-if="isRoot" :class="{ active: activeItem === 'Data Jabatan' }" @click="setActive('Data Jabatan')">
            <router-link to="/admin/karyawan/datajabatan" class="sidebar-link">Data Jabatan</router-link>
          </li>
          <li :class="{ active: activeItem === 'Data Karyawan' }" @click="setActive('Data Karyawan')">
            <router-link to="/admin/karyawan/datakaryawan" class="sidebar-link">Data Karyawan</router-link>
          </li>
        </ul>
      </li>
      <li :class="{ active: activeItem === 'Data Kehadiran' }" @click="setActive('Data Kehadiran')">
        <router-link to="/admin/kehadiran" class="sidebar-link"><i class="bi bi-clipboard2-fill"></i>Data Kehadiran</router-link>
      </li>
      <li :class="{ active: activeItem === 'Lembur dan Cuti' }" @click="setActive('Lembur dan Cuti')">
        <router-link to="/admin/lemburcuti" class="sidebar-link"><i class="bi bi-calendar2-fill"></i>Lembur dan Cuti</router-link>
      </li>
      <li :class="{ active: activeItem === 'Gaji' }" @click="setActive('Gaji')">
        <router-link to="/admin/gaji" class="sidebar-link"><i class="bi bi-wallet"></i>Gaji</router-link>
      </li>
      <li :class="{ active: activeItem === 'Laporan' }" @click="setActive('Laporan')">
        <router-link to="/admin/laporan" class="sidebar-link"><i class="bi bi-card-text"></i>Laporan</router-link>
      </li>
      <li :class="{ active: activeItem === 'Pengaturan' }" @click="setActive('Pengaturan')">
        <router-link to="/admin/pengaturan" class="sidebar-link"><i class="bi bi-gear-fill"></i>Pengaturan</router-link>
      </li>
      <!-- Add more admin sidebar links here -->
    </ul>
    <div class="sidebar-footer">
      <a class="sidebar-link logout-link" @click="logout">
        <i class="bi bi-box-arrow-right"></i>Logout
      </a>
    </div>
  </aside>
</template>

<script>
import swal from 'sweetalert';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'AdminSidebar',
  data() {
    return {
      activeItem: '',
      activeSubmenu: ''
    };
  },
  computed: {
    ...mapGetters(['isRoot'])
  },
  methods: {
    ...mapActions(['clearUserInfo']),
    setActive(item) {
      this.activeItem = item;
    },
    toggleSubmenu(item) {
      this.activeSubmenu = this.activeSubmenu === item ? '' : item;
    },
    logout() {
      swal({
        title: "Apakah Anda yakin?",
        text: "Anda akan keluar dari panel admin.",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Batal",
            value: null,
            visible: true,
            className: "swal-button--cancel",
            closeModal: true,
          },
          confirm: {
            text: "Ya, keluar",
            value: true,
            visible: true,
            className: "swal-button--confirm",
            closeModal: true,
          }
        },
        dangerMode: true,
      }).then((willLogout) => {
        if (willLogout) {
          this.clearUserInfo();
          this.$router.push('/login');
        }
      });
    }
  }
};
</script>

<style scoped>
.admin-sidebar {
  width: 250px;
  background-color: #3a4d60;
  color: #ecf0f1;
  padding: 20px;
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sidebar-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.sidebar-logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.sidebar-title {
  font-size: 1.5rem;
  color: #ecf0f1;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 15px;
}

.sidebar-link {
  text-decoration: none;
  color: #ecf0f1;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.menu-content {
  display: flex;
  align-items: center;
}

.menu-text {
  text-align: start;
  margin-left: 10px;
}

.sidebar-link i {
  margin-right: 10px;
}

.submenu-icon {
  transition: transform 0.3s ease;
  margin-left: auto;
}

.rotated {
  transform: rotate(-90deg);
}

.sidebar-link:hover {
  background-color: #34495e;
}

.active .sidebar-link {
  background-color: #1abc9c;
  color: #ffffff;
}

.sidebar-submenu {
  list-style: none;
  padding-left: 20px;
  margin-top: 10px;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #ecf0f1;
}

.logout-link {
  cursor: pointer;
}

.swal-button--confirm {
  background-color: #1abc9c;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
}

.swal-button--cancel {
  background-color: #e74c3c;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
}

.swal-modal {
  border-radius: 10px;
}

.swal-title {
  color: #333;
  font-size: 1.5rem;
}

.swal-text {
  color: #555;
  font-size: 1rem;
}

.swal-footer {
  text-align: center;
}

.swal-footer .swal-button-container {
  display: inline-block;
  margin: 0 5px;
}
</style>
