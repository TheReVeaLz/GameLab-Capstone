import { createRouter, createWebHistory } from 'vue-router';
import store from '../store/index';
import Dashboard from '../views/employees/Dashboard.vue';
import Leave from '../views/employees/Leave.vue';
import Payroll from '../views/employees/Payroll.vue';
import AdminDashboard from '../views/admin/AdminDashboard.vue';
import DataJabatan from '../views/admin/DataJabatan.vue';
import DataKaryawan from '../views/admin/DataKaryawan.vue';
import Kehadiran from '../views/admin/Kehadiran.vue';
import LemburCuti from '../views/admin/LemburCuti.vue';
import Gaji from '../views/admin/Gaji.vue';
import Laporan from '../views/admin/Laporan.vue';
import Pengaturan from '../views/admin/Pengaturan.vue';
import Login from '../components/Login.vue';
import LupaSandi from '../components/LupaSandi.vue';
import Register from '../components/Register.vue';
import RegisterAdmin from '../components/RegisterAdmin.vue';
import EmployeeProfile from "../views/employees/EmployeeProfile.vue"
import Notification from '../views/employees/Notification.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/leave',
    name: 'Leave',
    component: Leave,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/payroll',
    name: 'Payroll',
    component: Payroll,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: EmployeeProfile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/notification',
    name: 'Notification',
    component: Notification,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: {
      requiresAuth: true,
      requirePrivilege: ['ROOT', 'ADMIN']
    }
  },
  {
    path: '/admin/karyawan/datajabatan',
    name: 'DataJabatan',
    component: DataJabatan,
    meta: {
      requiresAuth: true,
      requirePrivilege: ['ROOT', 'ADMIN']
    }
  },
  {
    path: '/admin/karyawan/datakaryawan',
    name: 'DataKaryawan',
    component: DataKaryawan,
    meta: {
      requiresAuth: true,
      requirePrivilege: ['ROOT', 'ADMIN']
    }
  },
  {
    path: '/admin/kehadiran',
    name: 'Kehadiran',
    component: Kehadiran,
    meta: {
      requiresAuth: true,
      requirePrivilege: ['ROOT', 'ADMIN']
    }
  },
  {
    path: '/admin/lemburcuti',
    name: 'Lembur dan Cuti',
    component: LemburCuti,
    meta: {
      requiresAuth: true,
      requirePrivilege: ['ROOT', 'ADMIN']
    }
  },
  {
    path: '/admin/gaji',
    name: 'Gaji',
    component: Gaji,
    meta: {
      requiresAuth: true,
      requirePrivilege: ['ROOT', 'ADMIN']
    }
  },
  {
    path: '/admin/laporan',
    name: 'Laporan',
    component: Laporan,
    meta: {
      requiresAuth: true,
      requirePrivilege: ['ROOT', 'ADMIN']
    }
  },
  {
    path: '/admin/pengaturan',
    name: 'Pengaturan',
    component: Pengaturan,
    meta: {
      requiresAuth: true,
      requirePrivilege: ['ROOT', 'ADMIN']
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/lupasandi',
    name: 'LupaSandi',
    component: LupaSandi,
  },
  {
    path: '/register', 
    name: 'Register',
    component: Register,
  },
  {
    path: '/registerAdmin', 
    name: 'RegisterAdmin',
    component: RegisterAdmin,
    meta: {
      requiresAuth: true
    }
  },
  // Additional admin routes can go here
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token');
    if (!token)
      return next("/login");

    if (!Object.keys(store.getters.userInfo).length)
      await store.dispatch('fetchUserInfo');
    
    if (to.meta.requirePrivilege && !to.meta.requirePrivilege.includes(store.getters.userInfo.privilege))
      return next("/");
  }
  return next();
})

export default router;
