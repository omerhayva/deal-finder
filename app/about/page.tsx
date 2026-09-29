import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DealFinder Hakkında",
  description: "DealFinder nedir, nasıl çalışır ve bağımsız Etsy satıcıları için neden değerli bir keşif platformu olduğuna dair bilgiler.",
};

export default function AboutPage() {
  return (
    <div className="container-shell py-12 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">DealFinder Hakkında</p>
        <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">
          Bağımsız keşif, daha temiz keşif.
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted">
          DealFinder, indirimli ürünleri ve aktif kuponları keşfetmenin daha sade bir yolunu sunmak için kurulmuş bağımsız bir platformdur.
        </p>

        <div className="mt-12 rounded-2xl border border-ink/10 bg-white p-8">
          <h2 className="font-display text-2xl tracking-tight">Platformun amacı</h2>
          <p className="mt-4 text-muted leading-7">
            DealFinder, Etsy üzerinde belirli bir ürün kategorisinde indirimli fiyatlar veya aktif kupon kodları bulunan ürünleri bir araya getirir. Kullanıcılar, mağazaya göz atmadan önce hangi fırsatların değerlendirmeye değer olduğunu daha hızlı görebilir.
          </p>
          <p className="mt-4 text-muted leading-7">
            Platform, satıcılar tarafından gönderilen fırsatları inceleyerek katalogda yer alır. Her gönderi, ilgili Etsy mağazasına ve ürüne doğrudan bağlantı sağlar.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-ink/10 bg-white p-8">
          <h2 className="font-display text-2xl tracking-tight">Fırsatlar nasıl çalışır?</h2>
          <ul className="mt-5 space-y-4 text-muted">
            <li className="list-inside list-disc">Etsy satıcıları, indirimli ürünlerini veya aktif kuponlarını DealFinder'a gönderir.</li>
            <li className="list-inside list-disc">Gönderiler incelenir ve onaylandıktan sonra katalogda yer alır.</li>
            <li className="list-inside list-disc">Kullanıcılar, kategorilere göre veya arama yaparak fırsatları keşfedebilir.</li>
            <li className="list-inside list-disc">Her fırsat, ilgili Etsy ürün sayfasına doğrudan bağlantı ile ulaşılabilir.</li>
          </ul>
        </div>

        <div className="mt-10 rounded-2xl border border-ink/10 bg-white p-8">
          <h2 className="font-display text-2xl tracking-tight">Bağımsız keşif platformu</h2>
          <p className="mt-4 text-muted leading-7">
            DealFinder, herhangi bir Etsy mağazası veya satıcısı ile resmi bir ilişki içinde değildir. Platform, indirimli ürünleri keşfetmek isteyen kullanıcılar ve daha geniş kitlelere ulaşmak isteyen bağımsız satıcılar arasında bir köprü görevi görür.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link href="/submit" className="button-primary">
            Fırsat gönder <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
