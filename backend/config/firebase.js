const admin = require('firebase-admin');
const path = require('path');

// Service account dosyasının yolunu düzelt
const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));

const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
};

// Firebase'i sadece bir kere initialize et
const app = admin.initializeApp(firebaseConfig);

console.log('✅ Firebase başarıyla başlatıldı');

module.exports = app.database();