import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "DealFinder gizlilik politikası: kişisel verileriniz nasıl koruma altına alırsınız ve nasıl kullanılır?",
};

export default function PrivacyPage() {
  return (
    <div className="container-shell py-12 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Yasal</p>
        <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">
          Gizlilik Politikası.
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted">
          DealFinder, kullanıcılarına hizmet sağlarken kişisel verilerinizi gizlilik ilkesi çerçevesinde ele alır. Bu sayfa, veri toplama, kullanım ve koruma ilkelerimizi açıklamaktadır.
        </p>

        <div className="mt-10 space-y-8 rounded-2xl border border-ink/10 bg-white p-8">
          <section>
            <h2 className="font-display text-xl tracking-tight">Veri toplama</h2>
            <p className="mt-3 text-muted leading-7">
              DealFinder, hizmetini sunmak için gereken ölçüde kişisel veri toplamakta ve işlemektedir. Topladığımız veriler şunları içerebilir:
            </p>
            <ul className="mt-3 space-y-2 text-muted list-inside list-disc">
              <li>Form gönderimleri sırasında sağlanan bilgiler (isim, e-posta, içerik vb.)</li>
              <li>Çerezler ve benzer teknik yöntemlerle toplanan kullanım verileri</li>
              <li>Cihaz ve tarayıcı ayarları</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight">Veri kullanımı</h2>
            <p className="mt-3 text-muted leading-7">
              Topladığımız kişisel veriler, hizmet sağlama, iletişim kurma, hizmet iyileştirme ve yasal yükümlülükleri fulfill etmek amacıyla kullanılır. Veriler, profil oluşturma veya reklam hedefleme gibi amaçlarda üçüncü taraflarla paylaşılmaz.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight">Veri korunması</h2>
            <p className="mt-3 text-muted leading-7">
              DealFinder, verileri yetkili kişiler tarafından erişim kontrollü sistemlerde saklar ve uygun güvenlik önlemleri alır. Verilerin yetkisiz erişim, kaybolma veya değiştirilme riski minimized edilmeye çalışılır.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight">Çerezler ve benzer teknolojiler</h2>
            <p className="mt-3 text-muted leading-7">
              DealFinder, siteyi işliroutomatik olarak kullanmak, oturum yönetmek ve kullanıcı deneyimini iyileştirmek için çerezler ve benzer teknik yöntemler kullanabilir. Tarayıcı ayarlarınızı değiştirerek çerez kullanımını kısıtlayabilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight">Haklarınız</h2>
            <p className="mt-3 text-muted leading-7">
              Kişisel verileriniz hakkında erişim, düzeltme, silme veya sınırlama talebinde bulunma hakkınız vardır. Bu tür talepler için bize ulaşabilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight">Değişiklikler</h2>
            <p className="mt-3 text-muted leading-7">
              Gizlilik politikamız zaman zaman güncellenebilir. Değişiklikleri bu sayfada yayınlayarak bildiririz.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
