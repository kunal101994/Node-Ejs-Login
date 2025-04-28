// const mongoose = require('mongoose');
// mongoose.connect("mongodb://127.0.0.1:27017/miniproject");
// // mongoose.connect("mongodb://127.0.0.1:27017/miniproject", { useNewUrlParser: true, useUnifiedTopology: true })
// //   .then(() => console.log('Connected to MongoDB'))
// //   .catch(err => console.error('Failed to connect to MongoDB', err));
// // mongoose.connect("mongodb://127.0.0.1:27017/miniproject", {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// // })
// //   .then(() => console.log("Connected to MongoDB"))
// //   .catch((err) => console.error("MongoDB connection error:", err));

const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });


const userSchema = mongoose.Schema({
  username: String,
  name: String,
  age: Number,
  email: String,
  password: String,
  profilepic: {
    type: String,
    default: "default.jpg"
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post"
    }
  ],
})

module.exports = mongoose.model('User', userSchema);