const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ status:false, errors: errors.array() });

  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ $or: [{email}, {username}] });
    if (user) return res.status(400).json({ status:false, message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    user = new User({ username, email, password: hashed });
    await user.save();

    return res.status(201).json({ message: 'User created successfully.', user_id: user._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status:false, message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ status:false, errors: errors.array() });

  const { email, username, password } = req.body;
  try {
    const user = await User.findOne(email ? { email } : { username });
    if (!user) return res.status(401).json({ status:false, message: 'Invalid Username and password' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ status:false, message: 'Invalid Username and password' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ message: 'Login successful.', jwt_token: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status:false, message: 'Server error' });
  }
};