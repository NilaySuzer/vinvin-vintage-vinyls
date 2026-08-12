import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const tokenUret = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  const { adSoyad, email, sifre } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) return res.status(400).json({ message: 'Bu e-posta zaten kayıtlı!' });

  const user = await User.create({ adSoyad, email, sifre });
  res.status(201).json({
    _id: user._id,
    adSoyad: user.adSoyad,
    email: user.email,
    token: tokenUret(user._id)
  });
};

export const loginUser = async (req, res) => {
  const { email, sifre } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.sifreEslestir(sifre))) {
    res.json({
      _id: user._id,
      adSoyad: user.adSoyad,
      email: user.email,
      role: user.role,
      token: tokenUret(user._id)
    });
  } else {
    res.status(401).json({ message: 'E-posta veya şifre hatalı!' });
  }
};