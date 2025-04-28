require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const userModel = require("./models/user.js");
const postModel = require("./models/post.js");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectDB = require("./database/db.js");
const isLoggedIn = require("./middlewares/isLoggedIn.js")
const crypto = require("crypto");
const path = require("path");
const upload = require("./config/multerconfig.js");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser());



app.get("/", (req, res) => {
  // console.log("Satya bhai ki jai Ho...");
  // res.send('Hello World');
  res.render("index");
});

app.get("/profile/upload", (req, res) => {
  res.render("profileupload");
});

app.post("/upload", isLoggedIn ,upload.single("image"),  async(req, res) => {
  let user = await userModel.findOne({email: req.body.email});
  user.profilepic = req.file.filename;
  await user.save();
  res.redirect("/profile");
});




app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/profile", isLoggedIn, async (req, res) => {
  console.log("/profile")
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");
  // user.populate("posts");
  res.render("profile", { user });
});

app.get("/like/:id", isLoggedIn, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.id }).populate("user");
  if (post.likes.indexOf(req.user.userid) === -1) {
    post.likes.push(req.user.userid);
  } else {
    post.likes.splice(post.likes.indexOf(req.user.userid), 1);
  }
  await post.save();
  res.redirect("/profile");
});

app.get("/edit/:id", isLoggedIn, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.id }).populate("user");
  res.render("edit", { post });
});

app.post("/update/:id", isLoggedIn, async (req, res) => {
  let post = await postModel.findOneAndUpdate(
    { _id: req.params.id },
    { content: req.body.content }
  );
  res.redirect("/profile");
});

app.post("/post", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  let { content } = req.body;
  let post = await postModel.create({
    user: user._id,
    content,
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

app.post("/register", async (req, res) => {
  // destructuring request
  let { email, password, username, name, age } = req.body;
  let user = await userModel.findOne({ email });
  //user hai
  if (user) return res.status(500).send({ message: "User already exists" });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await userModel.create({
        username,
        email,
        age,
        name,
        password: hash,
      });

      let token = jwt.sign({ email: email, userid: user._id }, "hghdhdhd");
      res.cookie("token", token);
      res.send("registered");
    });
  });
});

app.post("/login", async (req, res) => {
  // destructuring request
  let { email, password } = req.body;
  let user = await userModel.findOne({ email });
  //user hai
  if (!user) return res.status(500).send({ message: "User not found" });

  // password Compare
  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      let token = jwt.sign({ email: email, userid: user._id }, "hghdhdhd");
      res.cookie("token", token);
      // res.status(200).send({message: "You can login"});
      res.status(200).redirect("/profile");
    } else res.redirect("/login");
  });
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
