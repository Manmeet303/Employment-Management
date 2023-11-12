const User = require("../models/user");
const Note = require("../models/Note");
//Here we are using the asyncHandlers to get rid off from the try and catch code
const asyncHandler = require('express-async-handler');
const bcrypt = require("bcrypt");


// <---------------------------GET USERS-------------->
//@desc Get All Users
//@route Get /users
//@access Private

const getAllUsers = asyncHandler(async (req, res) => {
  // now we will add the logic inside this controller
  //select method is used for what to include or exlude and the '-' represents to exclude something
  // and majorly users password need not to be import or retrive from the database
  //Lean method will onlu send the data in the form of json and will not send the mongoose documents
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    // if the user didnt match than, we will change the json manually and will send the msg that users not found
    return res.status(400).json({ message: "No user was found" });
  }
  res.json(users);
});

// <------------------ CREATE USER ---------------->
//@desc Create a new user
//@route POST /users
//@access Private
const createNewUser = asyncHandler(async (req, res) => {
  // while creating the users, we need few details from the frontend side so we need to do structuring
  const { username, password, roles } = req.body;

  // Confirm the data from the users
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Now will check the duplicate entries that exist in the database or not

  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Username already exists!" });
    // status 409 stands for the conflicts
  }

  // Hash the password in 10 salts rounds that we have already received from the user while registering
  const hashedPWD = await bcrypt.hash(password, 10);

  // Now will do destructuring
  const userObject = { username, password: hashedPWD, roles };

  // now lets create and store the user into the database
  const user = await User.create(userObject);
  if (user) {
    res
      .status(201)
      .json({ message: `New user ${username} created Successfully !` });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

//<----------------------- UPDATE USER ---------------->
//@desc Update the user
//@route PATCH /users
//@access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, roles } = req.body;

  // Confirm the data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== Boolean
  ) {
    res.status(409).json({ message: "ALl fields are required " });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for the duplicates

  const duplicate = await User.findOne({ username }).lean().exec();
  // Allow Updates thorugh the origin users only

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: " Duplicate username" });
  }


  //  Properties must be same as that of in the mongoose else it will through out the error
  user.username = username
  user.roles = roles
  user.active = active

  if(password)
  {
    // Hash Password
    user.password = await bcrypt.hash(password, 10) // salt rounds 

  }

  const updatedUser = await User.save()
  res.json({message : `${updatedUser.username} Updated Successfully`})
});

//<---------------------- DELETE USER ---------------->

//@desc Delete the user
//@route DELETE /users
//@access Private
const deleteUser = asyncHandler(async (req, res) => {

  const { id } = req.body

   if(!id) {
    return res.status(400).json({message : `User ID Required`})
   }

   const notes = await Note.findOne({ user:id }).lean().exec()
   if(notes?.length){
    return res.status(403).json({message:`Cannot Delete The User Because It Has Notes Associated With Him/Her.`})
   }

   const user = await User.findById(id).exec()

   if(!user){
    return   res.status(422).send("Invalid Id")
   }

   const result = await user.deleteOne()
   res.json({message : `Username ${result.username} with the id ${result._id} is deleted successfully `})
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
