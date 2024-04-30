### Bağımlılıkların yüklenmesi için
- `npm install` ya da `npm i`

### Build almak için
- `npm run build`

### Projeyi çalıştırmak içim
- `npm start`

# DOKUMAN EKLE
Ping Pong Web Uygulaması

Ping Pong Web Uygulaması, tam yığın geliştirme (full stack) prensiplerine dayanan ve ping pong oyununun basit bir örneğini içeren bir web sitesidir. Proje, bir ekip tarafından geliştirilmiştir ve aşağıdaki teknolojileri kullanmaktadır:

- Backend:
  - PostgreSQL veritabanı kullanılarak veri depolanması sağlanmıştır.
  - Django web framework kullanılmıştır.

- Frontend:
  - Pure vanilla JavaScript ve Bootstrap kullanılarak kullanıcı arayüzü oluşturulmuştur.
  - Webpack kullanılarak modüler bir yapı sağlanmıştır.

Özellikler:

- Kullanıcı Yönetimi:
  - Kullanıcılar, profilleri ile alakalı birçok işlemi gerçekleştirebilirler.
  - Arkadaşlarını ekleyebilir ve onların profillerini görüntüleyebilirler.

- Giriş Yöntemleri:
  - JWT token kullanılarak kimlik doğrulaması sağlanmıştır.
  - Gmail OAuth mekanizması entegre edilmiştir.
  - Ecole 42 APIs'i kullanılarak uzak doğrulama yöntemi eklenmiştir.

- Güvenlik:
  - HTTPS katmanı eklenerek iletişim güvenliği sağlanmıştır.

Kurulum:

1. Projeyi klonlayın:

   git clone <repo_url>

2. Backend için gerekli bağımlılıkları yükleyin ve sunucuyu başlatın:

   cd backend
   pip install -r requirements.txt
   python manage.py runserver

3. Frontend için gerekli bağımlılıkları yükleyin ve sunucuyu başlatın:

   cd frontend
   npm install
   npm start

Katkıda Bulunma:

1. Bu deposu (<repo_url>) forklayın.
2. Yeni özellikler eklemek veya hataları düzeltmek için değişiklikler yapın.
3. Değişikliklerinizi commitleyin (git commit -am 'Yeni özellik ekle').
4. Deponuza pushlayın (git push origin main).
5. Bir pull isteği (pull request) gönderin.
