require("dotenv").config();
const bcrypt = require("bcrypt");

const saltRounds = 10;

module.exports = function (app, conn) {
  app.post("/login", function (req, res) {
    const { username, password } = req.body;

    // console.log(username);

    let sql = `SELECT * FROM users WHERE username='${username}'`;
    conn.query(sql, (err, result) => {
      if (result == 0)
        return res.status(400).json({
          success: false,
          errorType: "username",
          message: "Username inexistent.",
        });
      else {
        let user = result[0];
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) res.status(200).json({ success: true });
          else
            return res.status(400).json({
              success: false,
              errorType: "pass",
              message: "Parolă incorectă.",
            });
        });
      }
    });
  });
};
