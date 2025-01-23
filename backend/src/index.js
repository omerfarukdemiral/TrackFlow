require('dotenv').config();
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const db = require('../config/firebase'); // Direkt database referansını alıyoruz

const app = express();
const port = process.env.PORT || 3001;

// Logger fonksiyonu
const logger = {
  info: (message, data = '') => {
    console.log(`ℹ️ [${new Date().toISOString()}] ${message}`, data);
  },
  error: (message, error) => {
    console.error(`❌ [${new Date().toISOString()}] ${message}:`, error);
  },
  success: (message, data = '') => {
    console.log(`✅ [${new Date().toISOString()}] ${message}`, data);
  }
};

app.use(cors());
app.use(express.json());

// WebSocket sunucusu
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  logger.info('Yeni WebSocket bağlantısı kuruldu');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      logger.info('WebSocket üzerinden veri alındı:', {
        eventCount: Array.isArray(data) ? data.length : 1
      });

      await db.ref('tracking-data').push(data);
      logger.success('Veri Firebase\'e kaydedildi');
    } catch (error) {
      logger.error('WebSocket veri işleme hatası', error);
    }
  });

  ws.on('close', () => {
    logger.info('WebSocket bağlantısı kapandı');
  });
});

// JWT doğrulama middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token gerekli' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Geçersiz token' });
    }
    req.user = user;
    next();
  });
};

// API rotaları
app.post('/api/track', authenticateToken, async (req, res) => {
  try {
    const trackingData = req.body;
    logger.info('HTTP API üzerinden veri alındı');
    
    await db.ref('tracking-data').push(trackingData);
    logger.success('Veri Firebase\'e kaydedildi');
    res.status(200).json({ message: 'Veri başarıyla kaydedildi' });
  } catch (error) {
    logger.error('API hatası', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Veri temizleme endpoint'i
app.delete('/api/tracking-data', authenticateToken, async (req, res) => {
  try {
    logger.info('Veri temizleme isteği alındı');
    
    await db.ref('tracking-data').remove();
    logger.success('Tüm veriler başarıyla temizlendi');
    
    // WebSocket bağlantılarına veri temizleme bildirimi gönder
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'data_cleared' }));
      }
    });
    
    res.status(200).json({ message: 'Tüm veriler başarıyla temizlendi' });
  } catch (error) {
    logger.error('Veri temizleme hatası', error);
    res.status(500).json({ error: 'Veri temizleme sırasında bir hata oluştu' });
  }
});

const server = app.listen(port, () => {
  logger.success(`Server ${port} portunda çalışıyor`);
});

// WebSocket'i HTTP sunucusuna bağlama
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
}); 