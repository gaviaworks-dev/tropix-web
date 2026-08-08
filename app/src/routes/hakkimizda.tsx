import { createFileRoute } from "@tanstack/react-router";

import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { Feature, InviteBand, SiteFooter, SiteNav, StatRow } from "@/components/site/chrome";
import { productionScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";

export const Route = createFileRoute("/hakkimizda")({
  head: () => ({
    meta: [
      { title: "Hakkımızda | Tropix" },
      { content: "Tropix, Özeller Group bünyesinde Gaziantep'te meyve suyu ve gazlı içecek üretiyor.", name: "description" },
    ],
  }),
  component: Hakkimizda,
});

function Hakkimizda() {
  return (
    <div className="tx-page">
      <SiteNav />
      <main>
        <ScrollScrub scenes={productionScenes} theme={scrollScrubTheme} />
        <StatRow />
        <section className="tx-prose tx-alt">
          <div className="tx-shell">
            <h2>Tropix</h2>
            <p>
              Tropix, Özeller Group'un güçlü kurumsal yapısı ve yenilikçi vizyonu
              ile büyüyen, meyve suyu ve gazlı içecek sektöründe fark yaratan bir
              markadır. Gaziantep'teki modern üretim tesisimizde ürettiğimiz her
              ürün, doğadan aldığımız lezzeti yüksek kalite standardıyla
              tüketiciye ulaştırır.
            </p>
            <div className="tx-cards">
              <div className="tx-card">
                <h3>Vizyonumuz</h3>
                <p>
                  Doğadan ilham alarak, Mardin'in köklü değerlerinden güç alıp
                  Gaziantep'teki modern üretim tesisimizde kaliteyi ve lezzeti
                  her damlada tüketicilerimizin beğenisine sunmak.
                </p>
              </div>
              <div className="tx-card">
                <h3>Misyonumuz</h3>
                <p>
                  Etik değerlerimizden ödün vermeden, yenilikçi ve dinamik
                  üretim modelimizi doğaya duyduğumuz saygı ile harmanlayarak hem
                  Türkiye'de hem de dünyada gazlı içecek ve meyve suyu
                  sektörünün öncü markalarından biri olmak.
                </p>
              </div>
              <div className="tx-card">
                <h3>Değerlerimiz</h3>
                <p>
                  Ticari, ahlaki ve hukuki tüm değerlere bağlı kalırız.
                  Tüketicilerimize, çalışanlarımıza ve iş ortaklarımıza değer
                  veririz. Kalite ve sürekli gelişim anlayışıyla tüketici
                  memnuniyetini en üst seviyede tutarız. Ulusal ve uluslararası
                  pazarda büyüyerek ülke ekonomisine katkıda bulunur, daha
                  sağlıklı ve yaşanabilir bir gelecek için üretiriz.
                </p>
              </div>
            </div>
          </div>
        </section>
        <Feature
          eyebrow="Kalite"
          image="/assets/sayfa/kalite.jpg"
          imageAlt="Kalite kontrol laboratuvarında meyve suyu numuneleri"
          title="Her parti, aynı standart"
        >
          <p>
            Gelen meyveden dolum sonrasına kadar her aşamada numune alınıyor.
            Renk, tat, yoğunluk ve asitlik değerleri kayıt altında tutuluyor.
            Bir parti standardı tutturmadıysa hatta devam etmiyor.
          </p>
          <p>
            Bu yüzden Gaziantep'te dolan bir kutu ile dokuz ülkede rafa çıkan
            kutu arasında fark yok.
          </p>
        </Feature>
        <Feature
          alt
          eyebrow="Üretim"
          flip
          image="/assets/sayfa/tesis.jpg"
          imageAlt="Modern Tropix üretim tesisi"
          title="Kendi tesisimiz, kendi hattımız"
        >
          <p>
            Dolum, kapaklama ve paketleme aynı çatı altında yürüyor. Fason
            üretim yok; her ürün kendi hattımızdan geçiyor, bu da hızı ve
            tutarlılığı bizim kontrolümüzde tutuyor.
          </p>
          <p>
            76'yı aşkın çalışanımızla 51 ile dağıtım yapıyor, 9'dan fazla
            ülkeye ihracat gerçekleştiriyoruz.
          </p>
        </Feature>
        <InviteBand />
      </main>
      <SiteFooter />
    </div>
  );
}
