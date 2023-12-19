require("dotenv").config();
const bcrypt = require("bcrypt");

const saltRounds = 10;

module.exports = function (app, conn) {
  app.post("/register", function (req, res) {
    const { username, email, password } = req.body;

    if (password.length < 6)
      return res.status(400).json({
        success: false,
        errorType: "pass",
        message: "Minim 6 caractere.",
      });

    let sql = `SELECT * FROM users WHERE username='${username}'`;
    conn.query(sql, (err, result) => {
      if (result.length != 0)
        return res.status(400).json({
          success: false,
          errorType: "username",
          message: "Username-ul este luat.",
        });
      else {
        sql = `SELECT * FROM users WHERE email='${email}'`;
        conn.query(sql, (err, result) => {
          if (result.length != 0) {
            return res.status(400).json({
              success: false,
              errorType: "email",
              message: "Email-ul este deja folosit.",
            });
          } else {
            bcrypt.hash(password, saltRounds, (err, hash) => {
              sql = `INSERT INTO users(username, email, password)
                     VALUES('${username}', '${email}', '${hash}')`;
              conn.query(sql, (err, result) => {
                return res.status(200).json({
                  success: true,
                });
              });
            });
          }
        });
      }
    });
  });
};
