import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  description: "DealFinder kullanım koşulları: platformu kullanarak kabul ettiğiniz kurallar ve sorumluluklar.",
};

export default function TermsPage() {
  return (
    <div className="container-shell py-12 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Yasal</p>
        <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">
          Kullanım Koşulları.
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted">
          DealFinder'ı kullanarak, aşağıdaki kullanım koşullarını kabul etmiş olursunuz. Bu koşullar, platformu kullanma hakkınızın kapsamını ve sorumluluklarınızı tanımlar.
        </p>

        <div className="mt-10 space-y-8 rounded-2xl border border-ink/10 bg-white p-8">
          <section>
            <h2 className="font-display text-xl tracking-tight">Kullanım hakkı</h2>
            <p className="mt-3 text-muted leading-7">
              DealFinder'ı kişisel, öngörülen yasal amaçlar için ücretsiz olarak kullanabilirsiniz. Platformun kullanımı, burada belirtilen koşullara ve uygulanabilir yasalara tabidir.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight">Kullanıcı sorumlulukları</h2>
            <p className="mt-3 text-muted leading-7">
              DealFinder'ı kullanırken, hizmeti iyi niyetle kullanma sorumluluğunuz vardır. Platformu, yasa dışı faaliyetler, başkalarının hakkına aykırı davranışlar veya hizmeti bozma amaçlı kullanamazsınız.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight">İçerik sorumluluğu</h2>
            <p className="mt-3 text-muted leading-7">
              DealFinder'a gönderilen fırsatlar, yazılar ve diğer içerikler, gönderen tarafından sorumlu olunur. Gönderilen bilgilerin doğruluğundan ve yasal uygunluğundan emin olma sorumluluğu göndericiye aittir.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight">Üçüncü taraf hizmetler</h2>
            <p className="mt-3 text-muted leading-7">
              DealFinder, kullanıcıları Etsy mağazalarına yönlendirmektedir. Etsy ve ilgili mağazalar, ayrı bir hizmet sağlayıcıdır. DealFinder, üçüncü taraf hizmetlerin faaliyetlerinden sorumlu değildir.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight">Hizmet değiştirme hakkı</h2>
            <p className="mt-3 text-muted leading-7">
              DealFinder, hizmeti, içerikleri veya bu koşulları zaman zaman değiştirebilir. Değişiklikler, platformda yayınlanarak bildirilir.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight">Hizmet sona erme</h2>
            <p className="mt-3 text-muted leading-7">
              DealFinder, hizmeti herhangi bir zamanda sona eritebilir veya durdurabilir. Son dönemde, burada belirtilen koşulları dikkate alarak bilgilendirme yapılacaktır.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
