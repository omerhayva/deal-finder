import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DealFinder İletişim",
  description: "DealFinder ile iletişime geçmek için buradayız. Sorular, fırsat gönderimleri ve işbirliği talepleriniz için bize ulaşın.",
};

export default function ContactPage() {
  return (
    <div className="container-shell py-12 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">İletişim</p>
        <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">
          Bize Ulaşın.
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted">
          Sorularınız, fırsat gönderileriniz veya işbirliği ile ilgili görüşleriniz için aşağıdaki konularda bize ulaşabilirsiniz.
        </p>

        <div className="mt-12 space-y-8 rounded-2xl border border-ink/10 bg-white p-8">
          <div>
            <h2 className="font-display text-xl tracking-tight">Fırsat göndermek için</h2>
            <p className="mt-3 text-muted leading-7">
              Etsy mağazanızdaki indirimli bir ürün veya aktif bir kupon kodunu DealFinder kataloğunda yer almasını istiyorsanız,{" "}
              <Link href="/submit" className="font-semibold text-coral hover:text-ink">fırsat gönder</Link> sayfamızdan gönderim yapabilirsiniz.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl tracking-tight">Genel sorular</h2>
            <p className="mt-3 text-muted leading-7">
              Platform nasıl çalışır, fırsatlar nasıl incelenir veya diğer genel konularda sorularınız varsa{" "}
              <Link href="/faq" className="font-semibold text-coral hover:text-ink">SSS</Link> sayfamızı inceleyebilirsiniz.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl tracking-tight">Yanlış bilgi bildirimi</h2>
            <p className="mt-3 text-muted leading-7">
              DealFinder'da yer alan bir fırsatın fiyatı, kuponu veya başka bir bilgisi konusunda sorun tespit ederseniz, lütfen bize ulaşın. Bilgileri güncellemeye çalışırız.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl tracking-tight">İşbirliği ve partnerlik</h2>
            <p className="mt-3 text-muted leading-7">
              DealFinder ile işbirliği, içerik ortaklığı veya diğer iş ilişkileri hakkında görüşleriniz için bize yazabilirsiniz. Her çağrıya birebir dikkat ederiz.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-ink/10 bg-white p-8">
          <p className="font-semibold text-ink">İletişim tercihı</p>
          <p className="mt-2 text-muted leading-7">
            Şu an için doğrudan e-posta veya mesaj kanalı aktif değildir. Lütfen yukarıdaki sayfaları kullanarak veya ilgili formu doldurarak iletişime geçiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
