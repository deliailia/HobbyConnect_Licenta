const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const User = require('../models/User');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const mailUser = process.env.MAIL_USER;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: mailUser,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const signup = async (req, res) => {
  try {
    const { username, email, password, secretCode } = req.body;

    console.log("Signup attempt:", { username, email, password,  secretCode });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists in MongoDB");
      return res.status(400).json({ message: "Email already in use" });
    }
    const ADMIN_SECRET_CODE = "mySecretAdminCode123";
    console.log("Admin secret code:", ADMIN_SECRET_CODE);
    let role= "user"; 
    if (secretCode && secretCode === ADMIN_SECRET_CODE) {
      console.log("Admin secret code matched. Setting role to admin_master.");
      role = "admin_master";
    } else {
      console.log("No valid secret code provided. Setting role to user.");
    }
    console.log("Role being saved:", role);
    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });
    console.log(`Firebase user created: ${firebaseUser.uid}`);
    console.log("Role being saved:", role);
    const verifyLink = await admin.auth().generateEmailVerificationLink(email);
    console.log(`Verification link generated: ${verifyLink}`);

    const mailOptions = {
      from: mailUser,
      to: email,
      subject: "Verify Your Email - HobbyConnect",
      html: `<p>Click the link below to verify your email:</p>
             <a href="${verifyLink}">${verifyLink}</a>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    const newUser = new User({
      username,
      email,
      password,
      role: role,
    });

    await newUser.save();
    console.log(`User created in MongoDB: ${newUser.username} with email: ${newUser.email}`);

    res.status(201).json({
      message: "User created successfully. Please verify your email.",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`Login attempt for email: ${email}`);

    let firebaseUser;
    try {
      firebaseUser = await admin.auth().getUserByEmail(email);
      console.log(`Firebase user found: ${firebaseUser.uid}`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log("Firebase user not found");
        return res.status(400).json({ message: 'Invalid email or user does not exist' });
      }
      throw error; 
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found in MongoDB");
      return res.status(400).json({ message: "Invalid email or user does not exist" });
    }
    console.log(`MongoDB user found: ${user._id}`);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password match:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  signup,
  login,
};