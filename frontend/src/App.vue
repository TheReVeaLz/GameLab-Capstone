<template>
  <div id="app">
    <component v-if="!isAuthRoute && !isAdminRegisterRoute" :is="navbarComponent" />
    <component v-if="!isAuthRoute && !isAdminRegisterRoute" :is="sidebarComponent" />
    <div :class="{'main-content': !isAuthRoute && !isAdminRegisterRoute}">
      <router-view />
    </div>
  </div>
</template>

<script>
import axios from './services/axios';

import EmployeeNavbar from './components/EmployeeNavbar.vue';
import EmployeeSidebar from './components/EmployeeSidebar.vue';
import AdminNavbar from './components/AdminNavbar.vue';
import AdminSidebar from './components/AdminSidebar.vue';
import { mapActions } from 'vuex';

export default {
  name: 'App',
  components: {
    EmployeeNavbar,
    EmployeeSidebar,
    AdminNavbar,
    AdminSidebar,
  },
  computed: {
    isAdminRoute() {
      return this.$route.path.startsWith('/admin');
    },
    isAdminRegisterRoute() {
      return this.$route.path === '/registerAdmin'; // Sesuaikan dengan path register admin Anda
    },
    isAuthRoute() {
      return this.$route.path === '/login' || this.$route.path === '/register';
    },
    isForgotPasswordRoute() {
      return this.$route.path === '/lupaSandi';
    },
    navbarComponent() {
      if (this.isAdminRegisterRoute || this.isForgotPasswordRoute) {
        return null; // Tidak ada navbar untuk halaman register admin atau forgot password
      } else {
        return this.isAdminRoute ? 'AdminNavbar' : 'EmployeeNavbar';
      }
    },
    sidebarComponent() {
      if (this.isAdminRegisterRoute || this.isForgotPasswordRoute) {
        return null; // Tidak ada sidebar untuk halaman register admin atau forgot password
      } else {
        return this.isAdminRoute ? 'AdminSidebar' : 'EmployeeSidebar';
      }
    },
  },
  methods: {
    ...mapActions(['refreshUserInfo'])
  }
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  margin-left: 250px;
  padding: 20px;
  flex: 1;
  margin-top: 60px; 
}

.sidebar {
  margin-top: 60px; 
}
</style>
