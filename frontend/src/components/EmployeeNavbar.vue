<template>
  <nav class="navbar fixed-top">
    <div class="container-fluid">
      <img src="/img/Logo_Appsensi.png" alt="Logo" class="navbar-brand" style="height: 40px; width: 100px;">
      <div class="profile d-flex align-items-center">
        <p class="mb-0 me-3" @click="goToProfile" style="cursor: pointer;">{{userInfo.name ? userInfo.name : "NO NAME"}}</p>
        <div class="notifikasi position-relative" @click="goToNotification" style="cursor: pointer;">
          <i class="bi bi-bell" style="font-size: 1.5rem; color: white;"></i>
          <span class="badge" v-if="notifications.length">{{notifications.length > 99 ? "99+" : notifications.length}}</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['userInfo', 'notifications'])
  },
  name: 'Navbar',
  methods: {
    goToProfile() {
      this.$router.push('/profile');
    },
    goToNotification() {
      this.$router.push('/notification');
    }
  }
};
</script>

<style scoped>
@import "./EmployeeNavbarStyles.css";
</style>
