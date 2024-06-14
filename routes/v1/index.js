const app = require('express')();
const adminRouter = require("./user.routes");
const prenseceRouter = require("./presence.routes");
const payslipRouter = require("./payslip.routes");

app.use("/", adminRouter);
app.use("/", prenseceRouter);
app.use("/", payslipRouter);

module.exports = app;