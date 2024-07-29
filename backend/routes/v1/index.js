const app = require('express')();
const adminRouter = require("./user.routes");
const prenseceRouter = require("./presence.routes");
const payslipRouter = require("./payslip.routes");
const leaveReqRouter = require("./leave.routes");

app.use("/", adminRouter);
app.use("/", prenseceRouter);
app.use("/", payslipRouter);
app.use("/", leaveReqRouter);

module.exports = app;