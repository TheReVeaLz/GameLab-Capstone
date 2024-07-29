<template>
  <nav class="admin-navbar">
    <div class="container">
      <router-link to="/admin" class="brand">Admin Panel</router-link>
      <ul>
        <!-- Add more admin links here -->
      </ul>
      <router-link to="/admin/pengaturan" class="profile-link">
        <img src="/img/profil.png" alt="Profile Picture" class="profile-picture">
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AdminNavbar',
};
</script>

<style scoped>
.admin-navbar {
  background-color: #2c3e50;
  color: #ffffff;
  padding: 10px 0;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.brand {
  font-size: 1.0rem;
  text-decoration: none;
  color: #ffffff;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
}

li {
  margin-left: 20px;
}

a {
  text-decoration: none;
  color: #ffffff;
}

.profile-picture {
  border-radius: 50%; 
  width: 40px; 
  height: 40px; 
}
</style>
