TrackFlow: PRD (Product Requirements Document)
1. Proje Tanımı
Proje Adı: TrackFlow
Panel Adı: TrackFlow Panel
Eklenti Adı: TrackFlow Extension

Hedef: Kullanıcıların web üzerindeki etkileşimlerini izleyip, bu verileri analiz ederek bir ısı haritası ve tıklama istatistikleri sağlayan bir platform geliştirmek. Kullanıcılar, web paneli üzerinden bu verileri görebilecek ve daha anlamlı raporlar oluşturabilecekler.

2. Kullanıcı Senaryoları
Kullanıcı Girişi:

Eklenti: Kullanıcılar eklenti üzerinden giriş yapar. Giriş için JWT token ya da kullanıcı ID'si gereklidir.
Web Paneli: Admin, web paneline giriş yapar ve kullanıcı verilerini görüntüler.
Veri Toplama:

Eklenti: TrackFlow eklentisi, kullanıcının fare hareketlerini ve tıklamalarını sürekli izler.
Veri Gönderimi: Fare hareketleri ve tıklama verisi belirli aralıklarla backend API'ye iletilir.
Veri Formatı: JSON formatında gönderilir. Her veri, kullanıcının kimliği (JWT token veya user ID) ile birlikte gönderilir.
Panel: Panelde, bu veriler görselleştirilir. Fare hareketleri ve tıklamalar farklı renklerle temsil edilir.
Gerçek Zamanlı Veri Gösterimi:

Firebase Realtime Database kullanılarak, eklentiden gelen veriler anlık olarak gösterilir.
Panelde, ısı haritası tarzı bir görselleştirme ve tıklama istatistikleri yer alır.
Isı Haritası Görselleştirmesi:

Panelde tıklama ve fare hareketleri görsel olarak harita şeklinde gösterilecektir. Her etkileşim, farklı renklerle temsil edilir.
Kullanıcılar, bu ısı haritası üzerinde hangi bölgelerin daha çok etkileşim aldığını kolayca görebilirler.
Veri Güvenliği:

Veriler yalnızca doğrulama yapıldıktan sonra API üzerinden gönderilecek. JWT token veya kullanıcı ID'si ile doğrulama yapılacaktır.
Veriler, GDPR ve diğer gizlilik yasalarına uygun olarak anonimleştirilecek ve güvenli bir şekilde iletilecektir.
3. Teknolojiler ve Altyapı
Frontend (Panel):

Framework: Next.js
State Management: Redux
Grafikler ve Isı Haritası: Chart.js / D3.js
Veri Kaynağı: Firebase Realtime Database
Backend (API):

Framework: Node.js / Express.js
Veritabanı: Firebase Realtime Database
Veri Gönderimi: WebSockets veya REST API
Kimlik Doğrulama: JWT (JSON Web Token)
Tarayıcı Eklentisi (TrackFlow Extension):

Platform: Chrome Extension API
Diller: JavaScript (DOM manipülasyonu), HTML, CSS
Veri Gönderimi: Axios / Fetch API (Backend API ile veri gönderimi)
4. Veri Formatı
Eklentiden gönderilen veri formatı, her tıklama ve hareketi JSON formatında olacak ve aşağıdaki gibi yapılandırılacaktır:

json
{
  "user_id": "user_12345",
  "event_type": "click",  // ya da "mousemove"
  "timestamp": 1630472100000,
  "element": {
    "tag": "button",
    "id": "submit_button",
    "class": "btn-primary",
    "position": {
      "x": 150,
      "y": 320
    }
  },
  "page": {
    "url": "https://example.com/page1"
  }
}
5. İletişim Biçimleri
WebSocket: Eklenti ile panel arasındaki veri iletimi WebSocket ile yapılacaktır. Bu, eş zamanlı veri iletimi ve anlık güncellemeler için idealdir.
API Endpoint (REST): Alternatif olarak, eklenti veriyi düzenli aralıklarla REST API üzerinden de gönderebilir.
6. Ekran Tasarımları
Eklenti: Giriş formu, fare hareketleri ve tıklama izleyici arayüzü.
Web Paneli:
Giriş Ekranı: Kullanıcı doğrulama işlemi.
Tracking Dashboard: Isı haritası, tıklama istatistikleri, grafikler.
Veri Görselleştirme: Tıklama yoğunluğunun renklerle görselleştirilmesi.
7. Güvenlik ve Gizlilik
JWT ile Doğrulama: Kullanıcı kimliği doğrulandıktan sonra veriler gönderilir. Bu, sadece o kullanıcıya ait verilerin gösterilmesini sağlar.
GDPR Uyumu: Kullanıcı verileri anonimleştirilecek ve sadece gerekli veriler toplanacaktır.
Veri Şifreleme: Veri iletimi sırasında güvenliği sağlamak için HTTPS kullanılacaktır.
8. Proje Teslimatları ve Takvim
Proje Planı:
1. Hafta: Eklenti yapısının oluşturulması, Firebase Realtime Database ile bağlantı kurulması.
2. Hafta: Panelin tasarımının tamamlanması, tıklama verilerinin görselleştirilmesi.
3. Hafta: API entegrasyonu ve WebSocket ile gerçek zamanlı veri aktarımının tamamlanması.
4. Hafta: Güvenlik, veri doğrulama ve testler.