<template>
  <div class="laporan">
    <h1>Laporan dan Analisis Karyawan</h1>
    <div class="card">
      <div class="top-bar">
        <div class="left-controls">
          <button @click="generateReport('pdf')" class="export-button">Export PDF</button>
          <button @click="generateReport('csv')" class="export-button csv">Export CSV</button>
        </div>
        <div class="search-container">
          <div class="search-icon-container">
            <i class="bi bi-search search-icon"></i>
          </div>
          <input type="text" v-model="searchQuery" placeholder="Search..." class="search-input" />
        </div>
      </div>
      <!-- Report sections -->
      <div class="report-section">
        <table class="laporan-table">
          <thead>
            <tr>
              <th colspan="6" class="table-keterangan text-center">Rekapitulasi Kehadiran Karyawan</th>
            </tr>
            <tr>
              <th v-for="header in headers.attendance">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filteredAttendanceRecords">
              <td>{{ record.name }}</td>
              <td>{{ record.presenceDate }}</td>
              <td>{{ record.checkIn }}</td>
              <td>{{ record.checkOut }}</td>
              <td>{{ record.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="report-section">
        <table class="laporan-table">
          <thead>
            <tr>
              <th colspan="4" class="table-keterangan text-center">Rekapitulasi Lembur</th>
            </tr>
            <tr>
              <th v-for="header in headers.overtime">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filteredOvertimeRecords">
              <td>{{ record.name }}</td>
              <td>{{ record.presenceDate }}</td>
              <td>{{ record.overtime }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="report-section">
        <table class="laporan-table">
          <thead>
            <tr>
              <th colspan="5" class="table-keterangan text-center">Rekapitulasi Cuti</th>
            </tr>
            <tr>
              <th v-for="header in headers.leave">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filteredLeaveRecords">
              <td>{{ record.name }}</td>
              <td>{{ record.requestDate }}</td>
              <td>{{ record.startDate }}</td>
              <td>{{ record.endDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="report-section">
        <table class="laporan-table">
          <thead>
            <tr>
              <th colspan="6" class="table-keterangan text-center">Rekapitulasi Penggajian</th>
            </tr>
            <tr>
              <th v-for="header in headers.payment">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filteredSalaryRecords">
              <td>{{ record.name }}</td>
              <td>{{ record.period }}</td>
              <td>{{ record.salary }}</td>
              <td>{{ record.deduction }}</td>
              <td>{{ record.netWorth }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../services/axios.js';
import { ref, computed } from 'vue';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default {
  name: 'Laporan',
  setup() {
    const headers = ref({
      attendance: ['Nama Karyawan', 'Tanggal', 'Jam Masuk', 'Jam Keluar', 'Status'],
      overtime: ['Nama Karyawan', 'Periode', 'Jumlah Jam'],
      leave: ['Nama Karyawan', 'Tanggal Pengajuan', 'Tanggal Mulai', 'Tanggal Selesai'],
      payment: ['Nama Karyawan', 'Periode', 'Gaji Pokok', 'Potongan', 'Total Gaji']
    });
    const searchQuery = ref('');
    const attendanceRecords = ref([]);
    const overtimeRecords = ref([]);
    const leaveRecords = ref([]);
    const salaryRecords = ref([]);

    // Presence info (used for attendance and overtime data)
    axios.get('/api/v1/admin/presenceAll').then((res) => {
      const data = res.data?.data;

      for (const _value of Object.values(data)) {
        attendanceRecords.value.push(
          {
            name: _value.User?.name,
            presenceDate: new Date(_value.presenceDate).toLocaleDateString(),
            checkIn: new Date(_value.checkIn).toLocaleTimeString(),
            checkOut: new Date(_value.checkOut).toLocaleTimeString(),
            status: _value.status
          }
        )

        if (_value.overtime)
          overtimeRecords.value.push(
            {
              name: _value.User?.name,
              presenceDate: new Date(_value.presenceDate).toLocaleDateString(),
              overtime: _value.overtime
            }
          )
      }
    }).catch((err) => {
      console.error(err);
    })

    // Leave info
    axios.get('/api/v1/admin/leaves').then((res) => {
      const data = res.data.data;

      for (const _value of Object.values(data)) {
        if (_value.status === 'ACCEPTED')
          leaveRecords.value.push({
            name: _value.User?.name,
            requestDate: new Date(_value.requestDate).toLocaleString(),
            startDate: new Date(_value.startDate).toLocaleDateString(),
            endDate: new Date(_value.endDate).toLocaleDateString()
          });
      }
    });

    // Payment info
    axios.get('/api/v1/admin/payslips').then((res) => {
      const data = res.data.data;
      
      for (const _value of Object.values(data)) {
        salaryRecords.value.push({
          name: _value.User?.name,
          period: new Date(_value.periodStart).toLocaleDateString() + " - " + new Date(_value.periodEnd).toLocaleDateString(),
          salary: formatCurrency(_value.salary),
          deduction: formatCurrency(_value.deduction),
          netWorth: formatCurrency(_value.netWorth)
        })}
    });
    
    function findObjectValues(object, value) {
      for (const _values of Object.values(object)) {
        if (!_values)
          continue;
        
        if (typeof(_values) === 'object')
          if (_values.constructor.name === 'Object') {
            if (findObjectValues(_values, value))
              return true;
          } else if (_values.constructor.name === 'RefImpl') {
            if (findObjectValues(_values.value, value))
              return true;
          }

        if (String(_values).toLowerCase().includes(value.toLocaleLowerCase()))
          return true;
      }
      
      return false;
    }

    const filteredAttendanceRecords = computed(() => {
      return attendanceRecords.value.filter((item) => (findObjectValues(item, searchQuery.value)));
    });

    const filteredOvertimeRecords = computed(() => {
      return overtimeRecords.value.filter((item) => (findObjectValues(item, searchQuery.value)));
    });

    const filteredLeaveRecords = computed(() => {
      return leaveRecords.value.filter((item) => (findObjectValues(item, searchQuery.value)));
    });

    const filteredSalaryRecords = computed(() => {
      return salaryRecords.value.filter((item) => (findObjectValues(item, searchQuery.value)));
    });

    function formatCurrency(value) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    };

    function generateReport(format) {
      if (format === 'pdf') {
        const doc = new jsPDF();

        doc.text('Laporan dan Analisis Karyawan', 10, 10);

        function addTableWithHeader(headerText, columns, data, startY) {
          doc.autoTable({
            head: [[headerText]],
            body: [[]],
            startY: startY,
            theme: 'plain',
            headStyles: { halign: 'center', fillColor: [255, 255, 255] },
            columnStyles: { 0: { halign: 'center' } },
          });

          doc.autoTable({
            head: [columns],
            body: data,
            startY: doc.lastAutoTable.finalY + 5,
            theme: 'striped',
          });
        };

        const attendanceData = filteredAttendanceRecords.value.map((item) => Object.values(item));
        addTableWithHeader('Keterangan Kehadiran', headers.value.attendance, attendanceData, doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 20);

        const overtimeData = filteredOvertimeRecords.value.map((item) => Object.values(item));
        addTableWithHeader('Keterangan Lembur', headers.value.overtime, overtimeData, doc.lastAutoTable.finalY + 15);

        const leaveData = filteredLeaveRecords.value.map((item) => Object.values(item));
        addTableWithHeader('Keterangan Cuti', headers.value.leave, leaveData, doc.lastAutoTable.finalY + 15);

        const salaryData = filteredSalaryRecords.value.map((item) => Object.values(item));
        addTableWithHeader('Keterangan Penggajian', headers.value.payment, salaryData, doc.lastAutoTable.finalY + 15);

        doc.save('laporan_karyawan.pdf');
      } else if (format === 'csv') {
        const downloadCSV = (header, data, filename) => {
          let csvContent = "data:text/csv;charset=utf-8,";
          csvContent += header.join(";") + "\n";
          csvContent += data.map(e => Object.values(e).join(";")).join("\n");
          
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        downloadCSV(headers.value.attendance, filteredAttendanceRecords.value, "attendance_records.csv");
        downloadCSV(headers.value.overtime, filteredOvertimeRecords.value, "overtime_records.csv");
        downloadCSV(headers.value.leave, filteredLeaveRecords.value, "leave_records.csv");
        downloadCSV(headers.value.payment, filteredSalaryRecords.value, "salary_records.csv");
      }
    };

    return {
      headers,
      searchQuery,
      filteredAttendanceRecords,
      filteredOvertimeRecords,
      filteredLeaveRecords,
      filteredSalaryRecords,
      formatCurrency,
      generateReport,
    };
  },
};
</script>

<style>
.laporan {
  font-family: 'Arial', sans-serif;
  background-color: #f0f4f7;
  padding: 20px;
  width: 76vw;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.laporan h1 {
  font-size: 2em;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold
}

.card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2em; 
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.left-controls {
  display: flex;
  align-items: center;
}

.export-button {
  background-color: #ff0000;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 20px;
}

.export-button.csv {
  white-space: nowrap;
  background-color: #09750d;
}

.export-button:hover {
  background-color: #d04a4a;
}

.export-button.csv:hover {
  background-color: #45a049;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f1f1;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  padding: 10px;
}

.search-icon {
  font-size: 18px;
  color: #888;
}

.search-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-left: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.report-section {
  margin-top: 20px;
}

.report-section h4 {
  margin-bottom: 10px;
}

.laporan-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.laporan-table th,
.laporan-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.laporan-table th {
  background-color: #4CAF50;
  color: #fff;
}

.laporan-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

@media (max-width: 768px) {
  .chart {
    width: 100%;
  }
}
</style>
