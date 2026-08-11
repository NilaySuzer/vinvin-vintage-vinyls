import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password -sifre');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Yetkisiz erişim, token geçersiz!' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Yetkisiz erişim, token bulunamadı!' });
  }
};

// ADMIN KONTROLÜ
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Bu alana sadece yönetici erişebilir!' });
  }
};