const express = require("express");
const fs = require("fs");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 5000;

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "elysian",
});

conn.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

app.use(express.json());
app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  let sql = "SELECT * FROM users";
  conn.query(sql, (err, result) => {
    console.log(result);
    res.json({ status: "ok", users: result });
  });
});

fs.readdirSync("routes").forEach((file) => {
  require(`./routes/${file}`)(app, conn);
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
