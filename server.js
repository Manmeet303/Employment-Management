require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const PORT = process.env.PORT || 8000;
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser')

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

console.log(process.env.NODE_ENV);



//Where the static files are located in this project such as html or css
const publicpath = path.join(__dirname, "public");
app.use("/", express.static(publicpath));

app.use("/", require("./routes/root"));
//now for the users as an end point to the url
app.use("/users", require("./routes/userRoutes"));

app.use(errorHandler)
app.use(logger)


app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'public', '404page.html'))
  } else if (req.accepts('json')) {
      res.json({ message: '404 Not Found' })
  } else {
      res.type('txt').send('404 Not Found')
  }
})

// const mongoURI = "mongodb://127.0.0.1/fullstackDB";
// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

connectDB();
// const db = mongoose.connection;
mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB successfully 🚀🚀🚀");
  app.listen(PORT, () =>
    console.log(`Server started at: ${PORT}`)
  );
});

mongoose.connection.on("error", (err) => {
  console.log("error", err);
});
