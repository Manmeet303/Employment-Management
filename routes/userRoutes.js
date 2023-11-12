const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
//here we are at the route of the users so no need to add /users
router
  .route("/")
  .get(usersController.getAllUsers) //read api
  .post(usersController.createNewUser) //create api or send
  .patch(usersController.updateUser) // update
  .delete(usersController.deleteUser); // delete api

module.exports = router;
