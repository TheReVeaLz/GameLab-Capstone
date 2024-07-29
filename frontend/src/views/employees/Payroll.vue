<template>
  <div class="container mt-5">
    <!-- Baris untuk Slip Gaji Terbaru -->
    <div class="row mb-4">
      <div class="col-12 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Slip Gaji Terbaru</h5>
            <div class="pay-slip">
              <p><strong>Periode :</strong> {{ latestPaySlip.period }}</p>
              <p><strong>Gaji Pokok :</strong> {{ latestPaySlip.salary }}</p>
              <p><strong>Bonus Lembur :</strong> {{ latestPaySlip.overtimeBonus }}</p>
              <p><strong>Pengurangan :</strong> {{ latestPaySlip.deduction }}</p>
              <p><strong>Total :</strong> {{ latestPaySlip.netWorth }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Baris untuk Ringkasan Gaji -->
    <div class="row mb-4">
      <div class="col-12 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Ringkasan Gaji</h5>
            <table class="table table-responsive">
              <thead>
                <tr>
                  <th scope="col">Bulan</th>
                  <th scope="col">Gaji Pokok</th>
                  <th scope="col">Tunjangan</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(summary, index) in salarySummary" :key="index">
                  <td>{{ summary.month }}</td>
                  <td>{{ summary.basicSalary }}</td>
                  <td>{{ summary.allowance }}</td>
                  <td>{{ summary.total }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../services/axios.js';

export default {
  name: 'Payroll',
  data() {
    return {
      latestPaySlip: {
        period: '',
        salary: '',
        overtimeBonus: '',
        deduction: '',
        netWorth: ''
      },
    };
  },
  created() {
    this.fetchLatestPaySlip();
  },
  methods: {
    fetchLatestPaySlip() {
      axios.get('/api/v1/user/payslips')
        .then(response => {
          const data = response.data.data;
          if (!data.length)
            return;
          
          const latestPaySlip = data[0];
          this.latestPaySlip.period = `${new Date(latestPaySlip.periodStart).toLocaleDateString()} s/d ${new Date(latestPaySlip.periodEnd).toLocaleDateString()}`
          this.latestPaySlip.salary = latestPaySlip.salary;
          this.latestPaySlip.overtimeBonus = latestPaySlip.overtimeBonus;
          this.latestPaySlip.deduction = latestPaySlip.deduction;
          this.latestPaySlip.netWorth = latestPaySlip.netWorth;
        })
        .catch(error => {
          console.error('Error fetching latest pay slip:', error);
        });
    },
  },
};
</script>

<style scoped>
.card-title {
  font-size: 1.25rem;
  font-weight: 500;
}

.card-text, .pay-slip p {
  font-size: 1rem;
}

.pay-slip {
  margin-top: 20px;
}

.table-responsive {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .pay-slip p {
    font-size: 0.9rem;
  }
  .table-responsive {
    font-size: 0.9rem;
  }
}
</style>
