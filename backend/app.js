const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postRoutes = require("./routes/post");
const app = express();



mongoose.connect('mongodb+srv://rwdavid:ycf9jAk57srl6cm0@clusterdb-6ljgw.mongodb.net/mean?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected!');
})
.catch(() => {
  console.log('Not connected!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, PUT, GET, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts",postRoutes);


module.exports = app;
