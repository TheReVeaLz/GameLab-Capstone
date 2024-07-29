<template>
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Ubah Sandi</h5>
              <form @submit.prevent="submitForm">
                <div class="mb-3">
                  <label for="password" class="form-label">Sandi Lama</label>
                  <input type="password" class="form-control" id="password" v-model="password" required>
                </div>
                <div class="mb-3">
                  <label for="newPassword" class="form-label">Sandi Baru</label>
                  <input type="password" class="form-control" id="newPassword" v-model="newPassword" required>
                </div>
                <button type="submit" class="btn btn-primary">Ubah Sandi</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from '../services/axios';
  import swal from 'sweetalert';
  
  export default {
    data() {
      return {
        password: '',
        newPassword: ''
      };
    },
    methods: {
      submitForm() {
        axios.put('api/v1/user/change-password', {
          password: this.password,
          newPassword: this.newPassword
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          console.log('Berhasil mengubah sandi:', response.data);
          // Tampilkan SweetAlert sukses
          swal('Kata Sandi berhasil dirubah', '', 'success');
  
          // Reset nilai inputan form
          this.password = '';
          this.newPassword = '';
        })
        .catch(error => {
          console.error('Gagal mengubah sandi:', error);
          // Handle error jika perlu
          // Contoh: Tampilkan pesan kesalahan, beri tahu pengguna, dll.
        });
      }
    }
  };
  </script>
  
  <style>
  /* Penyesuaian tata letak untuk menengah dan atas */
  @media (min-width: 768px) {
    .mt-5 {
      margin-top: 3rem !important;
    }
  }
  </style>
  