import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    const email_exists = await User.findOne({ where: { email } });
    if(email_exists)
        return res.status(400).json({ message: 'Email already exists!' });
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ user, token: generateToken(user) });
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if(!user || !(bcrypt.compare(password, user.password))) {
        res.status(401).json({ message: 'Invalid Credentials' });
    }
    res.json({ token: generateToken(user) });
}

export const logout = (req, res) => {
  res.status(200).json({ message: 'Logged out' }); // JWT handled on client
};

export const changePassword = async (req, res) => {  
  const user = await User.findByPk(req.user.id);
  const { currentPassword, newPassword } = req.body;  
  
  if (!await bcrypt.compare(currentPassword, user.password))
    return res.status(400).json({ message: 'Incorrect current password' });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password changed successfully' });
};

export const resetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: 'Email not found' });

  const token = generateToken(user);
  user.resetToken = token;
  await user.save();

  res.json({ message: 'Reset link generated', resetToken: token });
};

export const updatePassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user || user.resetToken !== token)
      return res.status(400).json({ message: 'Invalid token' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};