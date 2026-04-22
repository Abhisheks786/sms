const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    if (error.name === 'MongooseServerSelectionError' || error.message.includes('ECONNREFUSED')) {
       return res.status(500).json({ message: 'Database offline. Please start MongoDB locally.' });
    }
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@sms.com' });
    if (!adminExists) {
      await User.create({
        name: 'System Admin',
        email: 'admin@sms.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('Default admin seeded: admin@sms.com / password123');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

module.exports = { loginUser, seedAdmin };
