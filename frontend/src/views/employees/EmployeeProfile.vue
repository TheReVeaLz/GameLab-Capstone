<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-lg-12 mb-3">
        <div class="card h-100">
          <div class="card-body text-center">
            <h5 class="card-title">Profil Karyawan</h5>
            <img :src="userInfo.image" class="rounded-circle mb-3" alt="Profil Karyawan">
            <p class="card-text">Nama: {{ userInfo.name }}</p>
            <p class="card-text">Posisi: {{ typeof(userInfo.JobRole?.roleName) === "string" ? userInfo.JobRole?.roleName : "-" }}</p>
            <p class="card-text">Email: {{ userInfo.email }}</p>
            <p class="card-text">Telepon: {{ userInfo.phoneNumber }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import state from '../../store/index';

export default {
  name: 'Profile',
  computed: {
    ...mapState(['userInfo'])
  },
  async created() {
    state.dispatch('fetchUserInfo');
  }
};
</script>

<style scoped>
.card-title {
  font-size: 1.25rem;
  font-weight: 500;
}

.card-text {
  font-size: 1rem;
}

.img-container {
  display: flex;
  justify-content: center;
}

.img-container img {
  border-radius: 50%;
  width: 150px;
  height: 150px;
}
</style>
