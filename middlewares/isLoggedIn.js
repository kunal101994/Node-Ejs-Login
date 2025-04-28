const jsonwebtoken = require('jsonwebtoken');

// middleware
function isLoggedIn(req, res, next) {
  if (req.cookies.token === "") res.redirect("/login");
  else {
    let data = jwt.verify(req.cookies.token, "hghdhdhd");
    req.user = data;
    next();
  }
}


module.exports = isLoggedIn;