import { createFileRoute } from "@tanstack/react-router";

import { Arrow, Feature, PageBanner, SiteFooter, SiteNav } from "@/components/site/chrome";

export const Route = createFileRoute("/kariyer")({
  head: () => ({
    meta: [
      { title: "Kariyer | Tropix" },
      { content: "Özeller Group bünyesinde Tropix ile kariyer yolculuğuna başlayın.", name: "description" },
    ],
  }),
  component: Kariyer,
});

function Kariyer() {
  return (
    <div className="tx-page">
      <SiteNav />
      <main>
        <PageBanner
          eyebrow="Kariyer"
          image="/assets/sayfa/tesis.jpg"
          imageAlt="Tropix üretim tesisi"
          lede="Özeller Group bünyesinde kariyer yolculuğuna hazır mısınız?"
          title="Tropix'te Kariyer"
        />

        <section className="tx-prose tx-prose--center">
          <div className="tx-shell">
            <h2>Kariyer fırsatları</h2>
            <p>
              Tropix, Özeller Group'un güçlü kurumsal yapısı ve yenilikçi vizyonu
              ile büyüyen, hızlı tüketim sektöründe fark yaratan bir marka.
              Bizimle çalışmak, hem kurumsal bir yapının güvencesini hem de genç
              ve dinamik bir ekibin parçası olma fırsatını sunuyor.
            </p>
            <div className="tx-pill-row">
              <span className="tx-pill">Eşit fırsatlar</span>
              <span className="tx-pill">Sürdürülebilirlik</span>
              <span className="tx-pill">Yenilikçilik</span>
              <span className="tx-pill">Takım ruhu</span>
            </div>
          </div>
        </section>

        <Feature
          alt
          eyebrow="Neden Tropix"
          image="/assets/sayfa/bahce.jpg"
          imageAlt="Hasat zamanı meyve bahçesi"
          title="Değerlerimizle çalışıyoruz"
        >
          <p>
            Çalışanlarımızın potansiyeline inanır, herkese adil ve şeffaf
            fırsatlar sunarız. Çevreye ve topluma duyarlı üretim anlayışımızla
            geleceğe değer katarız.
          </p>
          <p>
            Sürekli gelişim ve yaratıcı fikirlerle sektörde fark yaratır,
            başarıya giden yolun güçlü bir ekipten geçtiğine inanırız.
          </p>
        </Feature>

        <Feature
          eyebrow="Açık pozisyonlar"
          flip
          image="/assets/sayfa/depo.jpg"
          imageAlt="Tropix depo ve sevkiyat"
          title="Ekibimize katılın"
        >
          <p>Üretim tesislerimizde görev alacak güçlü ekip arkadaşları.</p>
          <p>Ofislerimizde beyaz yaka pozisyonlarda katkı sağlayacak profesyoneller.</p>
          <p>Saha satış operasyonlarımızda markamızı en iyi şekilde temsil edecek takım arkadaşları.</p>
        </Feature>

        <section className="tx-prose tx-prose--center tx-alt">
          <div className="tx-shell">
            <h2>Hemen başvurun</h2>
            <p>
              Güncel özgeçmişinizi aşağıdaki e-posta adresine gönderin.
              Başvurunuz bize ulaştıktan kısa süre içinde insan kaynakları
              ekibimiz tarafından değerlendirilir ve süreç hakkında
              bilgilendirilirsiniz.
            </p>
            <p>
              <a className="tx-cta-line" href="mailto:info@ozellergroup.com.tr">
                info@ozellergroup.com.tr
                <Arrow />
              </a>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
