<template>
  <nav class="sidebar">
    <ul>
      <li>
        <router-link to="/" active-class="active-link">
          <i class="bi bi-house-door"></i> Dashboard
        </router-link>
      </li>
      <li>
        <router-link to="/leave" active-class="active-link">
          <i class="bi bi-calendar"></i> Cuti
        </router-link>
      </li>
      <li>
        <router-link to="/payroll" active-class="active-link">
          <i class="bi bi-cash-stack"></i> Penggajian
        </router-link>
      </li>
      <li>
        <router-link to="/profile" active-class="active-link">
          <i class="bi bi-person"></i> Profil
        </router-link>
      </li>
    </ul>
    <div class="logout">
      <a href="#" @click="confirmLogout">
        <i class="bi bi-box-arrow-right"></i> Logout
      </a>
    </div>
  </nav>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'EmployeeSidebar',
  methods: {
    ...mapActions(['clearUserInfo']),
    confirmLogout() {
      swal({
        title: "Ingin keluar dari halaman presensi anda?",
        icon: "warning",
        buttons: {
          cancel: "No, stay",
          confirm: {
            text: "Yes, logout",
            value: true,
            visible: true,
            className: "",
            closeModal: true
          }
        }
      }).then((willLogout) => {
        if (willLogout) {
          this.clearUserInfo();
          this.$router.push('/login');  // Redirect to the login page
        }
      });
    }
  }
};
</script>

<style scoped>
@import "./EmployeeSidebarStyles.css";
</style>
