import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null // null: Tüm kullanıcılara gönderilen genel duyuru
  },
  baslik: { 
    type: String, 
    required: true 
  },
  mesaj: { 
    type: String, 
    required: true 
  },
  tur: { 
    type: String, 
    enum: ['stok', 'genel', 'siparis', 'kampanya'], 
    default: 'genel' 
  },
  plakId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    default: null 
  },
  okundu: { 
    type: Boolean, 
    default: false 
  },
  okuyanKullanicilar: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }]
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;