const express = require('express');
const app = express();
const cors = require('cors');
const adminRouter = require("./routes/v1/user.routes");
const prenseceRouter = require("./routes/v1/presence.routes");
const payslipRouter = require("./routes/v1/payslip.routes");

const { User } = require("./app/models")

// Middleware untuk menyajikan berkas statis
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Endpoint root
app.get("/", (req, res) => {
  res.json({ message: "Ping successfully" });
});

app.use("/api/v1", adminRouter);
app.use("/api/v1", prenseceRouter);
app.use("/api/v1", payslipRouter);

// Menjalankan server pada port 3000
app.listen(3000, () => {
  console.log('Server berjalan pada http://localhost:3000');
});
