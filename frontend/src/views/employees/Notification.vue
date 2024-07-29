<template>
    <div class="container mt-5">
      <div class="row">
        <div class="col-lg-12 mb-3">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Notifikasi</h5>
              <ul class="list-group list-group-flush">
                <li class="list-group-item" v-for="(notification, index) in notifications.slice(0, 10)" :key="index">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="mb-0">{{ notification.title }}</h6>
                      <small class="text-muted">{{ notification.createdAt ? new Date(notification.createdAt).toLocaleString() : "" }}</small>
                    </div>
                  </div>
                  <p class="ms-auto mb-0">{{ notification.message }}</p>
                  <button class="btn btn-link text-danger" @click="removeNotification($event, notification.id)">
                    <i class="bi bi-trash m-0"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'Notification',
    computed: {
      ...mapState(['notifications'])
    },
    created() {
      this.fetchNotification();
    },
    methods: {
      ...mapActions(['fetchNotification', 'deleteNotification']),
      async removeNotification(e, id) {
        if (e.target.sleep)
          return;
        e.target.sleep = true;

        await this.deleteNotification(id);

        delete e.target.sleep;
      },
    },
  };
  </script>
  
  <style scoped>
  .card-title {
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .list-group-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .list-group-item h6 {
    margin-bottom: 0.5rem;
  }
  
  .list-group-item small {
    font-size: 0.75rem;
  }
  
  .list-group-item p {
    margin-bottom: 0;
  }
  
  .btn-link {
    font-size: 1.25rem;
    color: #dc3545;
    text-decoration: none;
  }
  
  .btn-link:hover {
    color: #c82333;
  }
  </style>
  