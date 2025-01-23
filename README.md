# TrackFlow

TrackFlow, web sitesi kullanıcı davranışlarını izlemek ve analiz etmek için geliştirilmiş kapsamlı bir analitik çözümüdür. Proje üç ana bileşenden oluşmaktadır:

## 🔍 Proje Bileşenleri

### 1. Chrome Uzantısı (Extension)
- Kullanıcı tıklama ve etkileşimlerini takip eder
- Sayfa görüntüleme sürelerini ölçer
- Gerçek zamanlı veri toplama
- Minimal performans etkisi

### 2. Yönetim Paneli (Panel)
- Next.js ile geliştirilmiş modern arayüz
- Gerçek zamanlı analitik görüntüleme
- Isı haritaları ve tıklama istatistikleri
- Özelleştirilebilir filtreler ve raporlar

### 3. Backend API
- Express.js tabanlı RESTful API
- Firebase entegrasyonu
- Güvenli veri depolama
- Ölçeklenebilir mimari

## 🚀 Başlangıç

Her bir bileşen için kurulum talimatları:

### Extension Kurulumu
```bash
cd extension
npm install
npm run build
```

### Panel Kurulumu
```bash
cd panel
npm install
npm run dev
```

### Backend Kurulumu
```bash
cd backend
npm install
npm run dev
```

## 🔧 Gereksinimler

- Node.js >= 16.x
- npm >= 8.x
- Firebase hesabı
- Chrome tarayıcısı (uzantı için)

## 📝 Ortam Değişkenleri

Her bir bileşen için gerekli .env dosyaları oluşturulmalıdır. Örnek .env dosyaları:

### Backend (.env)
```
PORT=3001
FIREBASE_PROJECT_ID=your-project-id
```

### Panel (.env.local)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

## 📚 Dokümantasyon

Detaylı dokümantasyon için `docs` klasörüne bakınız.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. 