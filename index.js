require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { dbConn } = require("./db/config");

const app = express();

// db
dbConn();

// cors
app.use(cors());

// public
app.use(express.static("public"));

// reding req
app.use(express.json());

// rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

app.listen(process.env.PORT, () => {
  console.log(`Servidor en puerto ${process.env.PORT}`);
});
