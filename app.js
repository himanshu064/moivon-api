const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
const port = process.env.PORT || 5000;
const _URI = process.env.MONGODB_URI;

const path = require("path");
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const userRouter = require("./router/user");
const eventRouter = require("./router/event");
const genreRouter = require("./router/genre");
const heroImageRouter = require("./router/heroImageDetails");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.use((req, res, next) => {
  path.join(__dirname, "public", "image");
  if (fs.existsSync(path.join(__dirname, "public", "image"))) {
    console.log("exist");
  } else {
    console.log("!exist");
    if (fs.existsSync(path.join(__dirname, "public"))) {
      fs.mkdirSync(path.join(__dirname, "public", "image"));
    } else {
      fs.mkdirSync(path.join(__dirname, "public"));
      fs.mkdirSync(path.join(__dirname, "public", "image"));
    }
  }
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/image");
  },
  filename: (req, file, cb) => {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, uuidv4() + "." + extension);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    //  console.log("Only .png, .jpg and .jpeg format allowed!");
  }
};
app.use("/public", express.static(path.join(__dirname, "public")));
// app.use('/public',express.static('public'))
app.use(
  multer({ storage: storage, fileFilter }).fields([
    { name: "image", maxCount: 10 },
  ])
);

app.use("/", userRouter);
app.use("/events", eventRouter);
app.use("/genres", genreRouter);
app.use("/heroimage", heroImageRouter);
app.use((err, req, res, next) => {
  console.log(err, "error here!");
  res.status(404).send({
    status: "failed",
    statusCode: 404,
    error: "wrong URL please check your URL and http method",
  });
});

mongoose
  .connect(_URI, { ignoreUndefined: true })
  .then((result) => {
    //  console.log(result)

    app.listen(port, () => {
      console.log(`listen on ${port}`);
    });
  })
  .catch((err) => console.log(err));
