// Global flag to prevent multiple initializations
window.TrackFlowInitialized = true;

let trackingData = [];
const BATCH_SIZE = 5;
const SEND_INTERVAL = 3000;

// WebSocket bağlantısı
let ws = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000;

function initializeWebSocket() {
  if (ws) {
    ws.close();
  }

  ws = new WebSocket('ws://localhost:3001');

  ws.onopen = () => {
    console.log('🟢 WebSocket bağlantısı başarılı');
    reconnectAttempts = 0;
  };

  ws.onerror = (error) => {
    console.error('🔴 WebSocket hatası:', error);
  };

  ws.onclose = () => {
    console.log('🟡 WebSocket bağlantısı kapandı');
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      console.log(`🔄 Yeniden bağlanma denemesi ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
      setTimeout(initializeWebSocket, RECONNECT_DELAY);
    }
  };
}

initializeWebSocket();

// Fare hareketlerini izleme
function trackMouseMove(e) {
  const data = {
    event_type: 'mousemove',
    timestamp: Date.now(),
    element: {
      tag: e.target.tagName.toLowerCase(),
      id: e.target.id,
      class: e.target.className,
      position: {
        x: e.clientX,
        y: e.clientY
      }
    },
    page: {
      url: window.location.href,
      title: document.title,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  };
  
  trackingData.push(data);
  
  if (trackingData.length >= BATCH_SIZE) {
    sendTrackingData();
  }
}

// Tıklama olaylarını izleme
function trackClick(e) {
  const data = {
    event_type: 'click',
    timestamp: Date.now(),
    element: {
      tag: e.target.tagName.toLowerCase(),
      id: e.target.id,
      class: e.target.className,
      position: {
        x: e.clientX,
        y: e.clientY
      }
    },
    page: {
      url: window.location.href,
      title: document.title,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  };
  
  trackingData.push(data);
  sendTrackingData();
}

// Verileri gönderme fonksiyonu
function sendTrackingData() {
  if (trackingData.length === 0) return;
  
  try {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log('📤 WebSocket üzerinden gönderilen veri:', {
        eventCount: trackingData.length,
        url: window.location.href
      });
      ws.send(JSON.stringify(trackingData));
      trackingData = [];
    } else {
      // WebSocket bağlantısı yoksa HTTP API'yi kullan
      chrome.storage.local.get(['jwt_token'], function(result) {
        if (!result.jwt_token) {
          console.error('🔴 JWT token bulunamadı');
          return;
        }
        
        console.log('📤 HTTP API üzerinden veri gönderiliyor...', {
          eventCount: trackingData.length,
          url: window.location.href
        });
        
        fetch('http://localhost:3001/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${result.jwt_token}`
          },
          body: JSON.stringify(trackingData)
        })
        .then(response => {
          if (!response.ok) throw new Error('API yanıt hatası');
          console.log('✅ Veri başarıyla gönderildi');
          trackingData = [];
        })
        .catch(error => {
          console.error('🔴 Veri gönderme hatası:', error);
        });
      });
    }
  } catch (error) {
    console.error('🔴 Beklenmeyen hata:', error);
  }
}

// Event listener'ları ekle
document.addEventListener('mousemove', trackMouseMove);
document.addEventListener('click', trackClick);

// Sayfa kapatılırken son verileri gönder
window.addEventListener('beforeunload', () => {
  if (trackingData.length > 0) {
    sendTrackingData();
  }
});

// Periyodik veri gönderimi
setInterval(sendTrackingData, SEND_INTERVAL);

// Tab görünürlüğünü izle
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Sekme arka planda ise son verileri gönder
    if (trackingData.length > 0) {
      sendTrackingData();
    }
  }
}); 