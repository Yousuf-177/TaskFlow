const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate jwt Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc Register a new User (before registering use bcryptjs to hash password )
// @route POST /api/auth/register
// @access PUBLIC
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profilePic, adminInviteToken } = req.body;
    // adminInviteToken if correct present then put role = admin
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All Fields are required",
      });
    }

    // check if user already exists

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        message: "User Already Exist",
      });
    }

    //Determine User Role : admin if adminInviteToken is Correct Otherwise Member

    if (
      adminInviteToken &&
      adminInviteToken === process.env.ADMIN_INVITE_TOKEN
    ) {
      role = "admin";
    } else {
      role = "member";
    }

    // hash Password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new User

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePic,
      role,
    });

    // Return User Data with JWT
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      profilePic: user.profilePic,
      message: "User Registered Successfully",
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc Login a User
// @route POST /api/auth/login
// @access PUBLIC

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check for all fields
    if (!email || !password) {
      return res.status(403).json({ message: "All Fields Are Required" });
    }

    // Check if User Exist or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({ message: "User Not Registered" });
    }

    // Validate Password
    const isMatched = bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(402).json({ message: "Password is Incorrect" });
    }

    res.status(201).json({
      message: "Successfully Logged In",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc Get User Profile
// @route GET /api/auth/profile
// @access PRIVATE (requires JWT)

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(403).json({ message: "User Not Found" });
    }
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc Update User Profile
// @route PUT /api/auth/profile
// @access PRIVATE (requires JWT)

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(403).json({ message: "User Not Found" });
    }
    user.name = req.user.name || user.name;
    user.email = req.user.email || user.email;
    if (req.user.password) {
      const salt = bcrypt.genSalt(10);
      user.password = bcrypt.hash(req.user.password, salt);
    }
    const updatedPassword = await user.save()

    res.status(200).json({
      message: "Successfully Profile Updated",
      _id: updatedPassword._id,
      name: updatedPassword.name,
      email: updatedPassword.email,
      role: updatedPassword.role,
      token: generateToken(updatedPassword._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { registerUser, loginUser, updateUserProfile, getUserProfile };
