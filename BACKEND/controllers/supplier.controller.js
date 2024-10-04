const jwt = require("jsonwebtoken"); // Change from import to require
const Supplier = require("../models/supplierMan"); // Change from import to require

exports.Ssignup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password || username === "" || email === "" || password === "") {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newUser = new Supplier({ username, email, password });

  try {
    await newUser.save();
    res.json("Signup success");
  } catch (error) {
    next(error);
  }
};

exports.Ssigngin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const validUser = await Supplier.findOne({ email });
    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res.status(200).cookie("access_token", token, { httponly: true }).json(rest);
  } catch (error) {
    next(error);
  }
};
