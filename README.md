
# 🏢 Personel Takip Sistemi (Personnel Tracking System)

Bu proje, şirket içindeki personelin giriş-çıkış saatlerini, departman bilgilerini, verilen bonusları ve cihaz zimmetlerini etkin bir şekilde takip etmek amacıyla geliştirilmiş hibrit bir personel takip sistemidir. 

Sistem; hem mobil uygulama (`React Native`) hem de web tabanlı bir yönetim paneli (`PHP`) içermekte olup, tüm veriler **Firebase Realtime Database** üzerinden anlık olarak senkronize edilmektedir.

---

## 🚀 Projenin Amacı

Şirket içi operasyonel süreçleri dijitalleştirmek, çalışan hareketlerini (giriş-çıkış) gerçek zamanlı takip etmek ve yönetimsel raporlama süreçlerini hızlandırmak amacıyla tasarlanmıştır.

---

## 🛠️ Kullanılan Teknolojiler ve Mimari

### 📱 Mobil Uygulama (`React Native`)
* **Framework / Araçlar:** React Native, Expo, TypeScript
* **Veritabanı / Backend:** Firebase Realtime Database & Firebase Auth
* **Özellikler:**
  * Kullanıcı girişi ve yetkilendirme
  * Çalışan listesi ve detay görüntüleme
  * Zaman kayıtları (Giriş-Çıkış) takibi
  * Bonus ve zimmet bilgisi yönetimi
  * Anlık internet bağlantısı kontrolü

### 💻 Web Uygulama (`PHP` Admin Paneli)
* **Dil / Kütüphaneler:** PHP, Firebase PHP SDK, Axios
* **Arayüz:** HTML5, Bootstrap
* **Özellikler:**
  * Kapsamlı admin paneli ile kullanıcı ve veri yönetimi
  * Firebase verilerinin REST API aracılığıyla doğrudan PHP tarafından yönetilmesi

---

## 🔒 Güvenlik

* **Yetkilendirme:** `Firebase Realtime Database Rules` kullanılarak rol ve yetki bazlı erişim güvenliği sağlanır.
* **Kimlik Doğrulama:** Şifreler `Firebase Auth` veya özel entegre login sistemleriyle güvenli bir şekilde kontrol edilir.
* **İletişim Güvenliği:** Web tarafında HTTPS protokolü zorunludur.

---

## 📦 Dağıtım (Deployment)

* **Mobil Platformlar:**
  * **Android:** APK dağıtımı veya Google Play Store
  * **iOS:** TestFlight veya Apple App Store
* **Web Platformu:**
  * Apache veya Nginx destekli modern bir sunucu üzerinde barındırma (Hosting)

---

## 📊 Geliştirme Sonrası Raporlama

* Firebase üzerinde tutulan veriler periyodik (günlük) olarak dışa aktarılarak (Export) **MySQL** veritabanında yedeklenebilir ve saklanabilir.
* İhtiyaca yönelik **Excel, PDF veya grafiksel raporlar** üretilebilir.

---

## 🎯 Sonuç

Bu sistem, Firebase'in güçlü altyapısı sayesinde sağladığı **gerçek zamanlı veri senkronizasyonu** ile hem mobil hem de web platformlarında kusursuz uyum çalışarak şirketler için sürdürülebilir ve modern bir personel yönetimi çözümü sunmaktadır.
