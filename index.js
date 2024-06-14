const express = require('express');
const app = express();
const cors = require('cors');
const apiV1 = require("./routes/v1");
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./DOCS/openapi.json')

const { User } = require("./app/models")

// Middleware untuk menyajikan berkas statis
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Endpoint root
app.get("/", (req, res) => {
  res.json({ message: "Ping successfully" });
});

app.use("/api/v1", apiV1);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Menjalankan server pada port 3000
app.listen(3000, () => {
  console.log('Server berjalan pada http://localhost:3000');
});
