# Katkı dokümantasyonu

Bu döküman bu koda katkıda bulunmak için izlemeniz gereken adımları ve uymanız gereken kuralları anlatır.

## İsimlendirmeler

İsimlendirmeler için kullanılacak kalıplar şu şekilde olmalıdır:

* Değişkenler, dosyalar ve klasörler: **camelCase**
* Url'ler, migrasyon ve seed dosyalları: **kebab-case**
* Environment değişkenleri, constants: **MACRO_CASE**
* Veritabanı tablo ve field, modellerin key isimleri: **snake_case**

Tablo isimler **çoğul** olmalıdır(users).
Service isimleri **tekil** olmalıdır(user).

Migrasyon ve seed dosyaları **tarih damgası** ile başlamalıdır(yyyymmddhhmmss-job-description.js).

## Katkı nasıl sağlanır?
Projeye katkı yapmak istiyorsanız lütfen ilk önce yaptığınız işin halihazırda [issue](https://github.com/mavidurak/orientation-api/issues "issue'ları görüntülemek için tıklayın") olarak bulunup buşunmadığını kontrol edin.Eğer **issue** varsa ve issue üzerinde görevlendirilmiş birisi bulunuyorsa o kişi ile iletişime geçiniz.Eğer issue yoksa geliştirmenizi **pull request** açarak proje yetkililerine iletebilirsiniz.

**Issue** oluştururken bulduğunuz bug ile ilgili detaylı bilgi yazmalısınız(gönderdiğiniz veri, gelen cevap, hata kodu, ...) ve mümkünse ekran görüntüsü eklemelisiniz.

Açtığınız **pull request**'in ismi ve açıklaması yaptığınız geliştirme ile alakalı olmalıdır..İşleyişsel değişiklikler yaptıysanız bunları açıklayıcı bir şekilde anlatmalısınız. Üzerinde hala geliştirme yapıyorsanız pull request **draft** olamalıdır ve incelenmek için hazır olduğunu düşündüğünüzde **waiting to review** etiketi ile işaretlenmelidir.
