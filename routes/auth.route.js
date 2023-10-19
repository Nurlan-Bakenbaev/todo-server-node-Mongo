const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
router.post(
  "/registration",
  [
    check("email", "Invalid Email").isEmail(),
    check("password", "Incorrect password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid email or password",
        });
      }
      const { email, password } = req.body;
  
      const isUsed = await User.findOne({ email });
      if (isUsed) {
        return res.status(400).json({
          message: "This email is already in use",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
   
      const user = new User({
        email,
        password: hashedPassword,
      });

   
      await user.save();

      res.status(201).json({ message: "User has been created" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  }
);
router.post(
  "/login",
  [
    check("email", "Invalid Email").isEmail(),
    check("password", "Incorrect password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid email or password",
        });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      const isMatch = bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Password error" });
      }
      const jwtSecret = "123";
      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: "30d",
      });
      res.json({ token, userId: user.id, email: user.email });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  }
);

module.exports = router;
