import { CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/contact';

/**
 * Uygulama içi gizlilik politikası. Mağaza kayıtları için aynı metin docs/gizlilik-politikasi.md
 * dosyasında da bulunur; ikisini birlikte güncelleyin.
 */
export const privacyPolicy = {
  updated: '26 Ekim 2026',
  sections: [
    {
      title: 'Özet',
      body: 'Anatomi Rehberi hesap oluşturmanızı istemez, kişisel verilerinizi toplamaz, sunucularımıza göndermez ve üçüncü taraflarla paylaşmaz. Uygulamada reklam veya analiz/izleme aracı bulunmaz.',
    },
    {
      title: 'Cihazınızda saklanan bilgiler',
      body: 'Bilgi kartı ilerlemeniz, test skorlarınız, çalışma seriniz, seçtiğiniz bölüm ve akademisyen modu tercihi yalnızca cihazınızda (uygulamanın yerel depolama alanında) saklanır. Bu bilgiler bize iletilmez. Ayarlar › İlerlemeyi sıfırla ile veya uygulamayı silerek bu bilgileri kaldırabilirsiniz.',
    },
    {
      title: 'Düzenleme talepleri ve iletişim',
      body: `“Düzenleme talep et” özelliği cihazınızdaki e-posta uygulamasını, içerik bilgisi eklenmiş bir taslakla açar. E-postayı gönderip göndermemek ve ad, unvan, kurum gibi bilgileri ekleyip eklememek tamamen sizin tercihinizdir. Gönderdiğiniz e-postalar yalnızca talebinizi değerlendirmek ve size dönüş yapmak amacıyla kullanılır; 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamındaki haklarınız için ${CONTACT_EMAIL} adresine yazabilirsiniz.`,
    },
    {
      title: 'İzinler',
      body: 'Uygulama kamera, konum, rehber, mikrofon gibi izinler istemez. İnternet bağlantısı olmadan da çalışır.',
    },
    {
      title: 'Çocukların gizliliği',
      body: 'Uygulama üniversite öğrencilerine ve öğretim üyelerine yöneliktir; çocuklardan bilerek veri toplanmaz.',
    },
    {
      title: 'Değişiklikler',
      body: 'Bu politika güncellenirse yeni sürüm uygulama içinde ve mağaza sayfasında yayımlanır.',
    },
    {
      title: 'İletişim',
      body: `E-posta: ${CONTACT_EMAIL}\nTelefon: ${CONTACT_PHONE}`,
    },
  ],
};
