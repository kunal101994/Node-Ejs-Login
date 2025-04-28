const multer = require("multer");
const path = require("path");
const crypto = require("crypto");


// disk storange
const storage = multer.diskStorage({
  // fil folder setup
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    // file name setup
    crypto.randomBytes(12, function (err, name){
      const fn = name.toString("hex")+path.extname(file.originalname);
    cb(null, fn);
    })
  }
})

// upload variable
const upload = multer({ storage: storage })

module.exports = upload;
