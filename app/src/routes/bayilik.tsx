import { createFileRoute } from "@tanstack/react-router";

import { Feature, InviteBand, PageBanner, SiteFooter, SiteNav } from "@/components/site/chrome";

export const Route = createFileRoute("/bayilik")({
  head: () => ({
    meta: [
      { title: "Bayilik Başvurusu | Tropix" },
      { content: "Yurt içi veya yurt dışı Tropix bayimiz olmak ister misiniz? Bayilik başvuru süreci ve avantajları.", name: "description" },
    ],
  }),
  component: Bayilik,
});

function Bayilik() {
  return (
    <div className="tx-page">
      <SiteNav />
      <main>
        <PageBanner
          eyebrow="Bayilik"
          image="/assets/sayfa/depo.jpg"
          imageAlt="Tropix dağıtım deposu"
          lede="Yurt içi veya yurt dışı bayimiz olmak ister misiniz?"
          title="Tropix Bayilik Başvuru"
        />

        <section className="tx-prose tx-prose--center">
          <div className="tx-shell">
            <h2>Tropix ile işinizi büyütün</h2>
            <p>
              Tropix, Özeller Group'un güçlü markalarından biri olarak meyve suyu
              ve gazlı içecek alanında fark yaratan ürünler geliştirdi ve
              tüketicilerinin güvenini kazandı. Doğal lezzeti, yüksek kalite
              standardı ve yenilikçi yaklaşımımızla hem yurt içinde hem de yurt
              dışında hızlı bir büyüme yakaladık.
            </p>
            <div className="tx-pill-row">
              <span className="tx-pill">Güçlü marka desteği</span>
              <span className="tx-pill">Geniş ürün yelpazesi</span>
              <span className="tx-pill">Pazarlama desteği</span>
            </div>
          </div>
        </section>

        <Feature
          alt
          eyebrow="Neden Tropix bayiliği"
          image="/assets/sayfa/depo.jpg"
          imageAlt="Paletlenmiş Tropix ürünleri"
          title="Birlikte büyüyoruz"
        >
          <p>
            Bayilik bizim için sadece bir iş modeli değil, aynı zamanda değer
            üretmenin bir parçası. Bayilerimizle birlikte büyüyor, birlikte
            başarıyor ve birlikte kazanıyoruz.
          </p>
          <p>
            Markamızı bölgenizde güvenle temsil etmeniz için kampanya, reklam ve
            tanıtım desteğini birlikte planlıyoruz.
          </p>
        </Feature>

        <Feature
          eyebrow="Lojistik"
          flip
          image="/assets/sayfa/tesis.jpg"
          imageAlt="Tropix üretim ve sevkiyat hattı"
          title="Siparişten rafa, tek elden"
        >
          <p>
            Kendi tesisimizden çıkan sevkiyat, bölgenizdeki noktaya kadar takip
            ediliyor. Kampanya dönemlerinde stok planlaması birlikte yapılıyor,
            bayimiz rafta boş kalmıyor.
          </p>
          <p>
            Yurt dışı bayiliklerinde ihracat evrakları ve lojistik çözümlemelerde
            yanınızdayız.
          </p>
        </Feature>

        <Feature
          alt
          eyebrow="Kimler başvurabilir"
          image="/assets/sayfa/kalite.jpg"
          imageAlt="Tropix kalite kontrol"
          title="Aradığımız iş ortağı"
        >
          <p>
            Bizim için en önemli kriter, girişimcilik ruhuna sahip, markamızın
            değerlerini benimseyen ve müşteri memnuniyetini ön planda tutan iş
            ortaklarıyla yol yürümek.
          </p>
          <p>
            Bölgesinde güçlü bir satış ve dağıtım ağı kurma potansiyeli, müşteri
            odaklı bakış açısı ve markamızın vizyonunu paylaşma isteği sürecin
            temel noktaları. Başvurular gizlilik esasına göre değerlendirilir ve
            kısa sürede dönüş yapılır.
          </p>
        </Feature>

        <InviteBand />
      </main>
      <SiteFooter />
    </div>
  );
}
