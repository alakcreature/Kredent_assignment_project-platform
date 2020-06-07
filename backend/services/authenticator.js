const jwt = require("jsonwebtoken");
const User = require("../schemas/users");
const JWT_KEY = "secret";

module.exports.isAuthenticated = (req, res, next) => {
  // console.log(req.headers.authorization);
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, JWT_KEY, function(err, decoded) {
    if (err) {
      res.json({
        status: false,
        message: "Invalid token"
      });
    } else {
      User.findById(decoded.userId)
        .select("-password")
        .then(result => {
          req.user = result;
          next();
        })
        .catch(err => {
          res.json({
            status: false,
            message: "Invalid token"
          });
        });
    }
  });
};
