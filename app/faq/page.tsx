import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DealFinder SSS",
  description: "DealFinder hakkında sıkça sorulan sorular: platform nasıl çalışır, fırsatlar nereden gelir ve nasıl bulunur?",
};

const questions = [
  {
    q: "DealFinder nedir?",
    a: "DealFinder, indirimli ürünleri ve aktif kupon kodlarını Etsy üzerinde keşfetmenizi sağlayan bağımsız bir platformdur. Satıcılar tarafından gönderilen fırsatları inceler ve onaylandıktan sonra katalogda yerleştirir.",
  },
  {
    q: "DealFinder'daki fırsatlar nereden geliyor?",
    a: "Fırsatlar, Etsy satıcıları tarafından platforma gönderilir. Her gönderi, ilgili Etsy mağazasına ve ürüne doğrudan bağlantı içerir.",
  },
  {
    q: "Bir fırsatı nasıl gönderebilirim?",
    a: "Etsy satıcısıysanız, /submit sayfasında fırsat gönderim formunu doldurarak ürünlerinizi veya kupon kodlarınızı platforma gönderebilirsiniz. Gönderim ücretsizdir.",
  },
  {
    q: "Gönderdiğim fırsat hemen yayınlanır mı?",
    a: "Gönderilen fırsatlar önce incelenir. Onaylandıktan sonra katalogda yer alır. Yayın süresi, gönderim hacmi ve incelenme sırasında ortaya çıkabilecek durumlar göre değişebilir.",
  },
  {
    q: "Fırsatların doğruluğu nasıl kontrol ediliyor?",
    a: "Gönderilen her fırsat, ilgili Etsy ürün sayfası ve kupon kodunun geçerliliği açısından incelenir. Doğrulama, gönderim sırasında ve katalogda yer aldıktan sonra periyodik olarak yapılabilir.",
  },
  {
    q: "Fırsatların süresi dolarsa ne olur?",
    a: "Bir fırsatın süresi dolması, ilgili fiyat veya kupon kodunun geçerliliğinin sona ermesi anlamına gelir. Bu durumda fırsat, katalogdan kaldırılabilir veya geçersiz olarak işaretlenebilir.",
  },
  {
    q: "DealFinder ürünleri kendisi mi satıyor?",
    a: "Hayır. DealFinder ürün satmaz, sipariş almaz veya ödeme işlemi yapmaz. Platform, Etsy satıcılarına yönlendirme sağlar. Tüm işlemler, ilgili Etsy mağazası veya Etsy üzerinden yapılır.",
  },
  {
    q: "Etsy'deki ürünlere nasıl ulaşabilirim?",
    a: "Her fırsat kartında ve ürün sayfasında, ilgili Etsy mağazasına veya ürün sayfasına doğrudan bağlantı bulunur. 'View Deal' veya 'Etsy'de Görüntüle' butonuna tıklayarak mağazaya veya ürün sayfasına ulaşabilirsiniz.",
  },
  {
    q: "Bir fırsatın yanlış olduğunu nasıl bildirebilirim?",
    a: "Bir fırsatın fiyatı, kuponu veya başka bir bilgisi konusunda sorun tespit ederseniz, bize ulaşabilirsiniz. Bilgileri güncellemeye çalışırız.",
  },
  {
    q: "Satıcı olarak neden fırsat göndermeliyim?",
    a: "Fırsat gönderimi, indirimli ürünlerinize veya kupon kodlarınıza ilgi duyabilecek kullanıcıların dikkatini çekmenizi sağlar. Gönderim ücretsizdir ve onaylandıktan sonra ürünleriniz DealFinder kataloğunda yer alır.",
  },
];

export default function FaqPage() {
  return (
    <div className="container-shell py-12 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Sıkça Sorulan Sorular</p>
        <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">
          DealFinder SSS.
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted">
          DealFinder hakkında sıkça sorulan soruların cevapları aşağıdadır.
        </p>

        <div className="mt-10 space-y-6">
          {questions.map((item, i) => (
            <div key={i} className="rounded-2xl border border-ink/10 bg-white p-6">
              <h2 className="font-semibold text-ink">{item.q}</h2>
              <p className="mt-3 text-muted leading-7">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
