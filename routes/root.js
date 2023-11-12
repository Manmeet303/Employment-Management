const express = require("express");
const router = express.Router();

const path = require("path");

//Express and routes can recognize reg X so lets use it like there could be slah(/)
//at the beginning(^) or at the end($) and along with that as an OR operation if they had used index file or not irrespect of html file or a js file
router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});


module.exports = router;
