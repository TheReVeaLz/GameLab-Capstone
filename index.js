const express = require('express');
const app = express();
const cors = require('cors')
// const { router: productsRouter } = require('./routes/products');
// const { router: usersRouter } = require('./routes/users');
const adminRouter = require("./routes/v1/user.routes")
const prenseceRouter = require("./routes/v1/presence.routes")

const { User } = require("./app/models")

// Middleware untuk menyajikan berkas statis
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Endpoint root
// app.get("/", (req, res) => {
//   res.json({ message: "Ping successfully" });
// });

app.get("/", async (req, res) => {
  res.json(await User.findAll());
});

app.use("/api/v1/user", adminRouter);
app.use("/api/v1/user", prenseceRouter);

// Menggunakan router untuk endpoint /products
// app.use('/admin', productsRouter);
// app.use('/user', usersRouter);
// app.use('/transactions', transactionsRouter);

// Menjalankan server pada port 3000
app.listen(3000, () => {
  console.log('Server berjalan pada http://localhost:3000');
});
