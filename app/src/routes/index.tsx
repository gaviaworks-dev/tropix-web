import { createFileRoute, Link } from "@tanstack/react-router";

import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import type { ScrollScrubScene } from "@/components/scroll-scrub/scroll-scrub";
import { Arrow, InviteBand, SiteFooter, SiteNav, StatRow } from "@/components/site/chrome";
import { BANDS, ProductBand } from "@/routes/urunlerimiz";
import { homeScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";

export const Route = createFileRoute("/")({
  component: Index,
});

function JourneyActions() {
  return (
    <a className="tx-cta-band" href="/urunlerimiz">
      Ürünleri keşfet
      <Arrow />
    </a>
  );
}

/**
 * Module constant: the scenes array identity must stay stable, otherwise the
 * media controller is rebuilt on every render.
 */
const JOURNEY_SCENES: ScrollScrubScene[] = homeScenes.map((scene, index) =>
  index === homeScenes.length - 1 ? { ...scene, actions: <JourneyActions /> } : scene,
);

function Index() {
  return (
    <div className="tx-page">
      <SiteNav />
      <main>
        <ScrollScrub scenes={JOURNEY_SCENES} theme={scrollScrubTheme} />

        <section className="tx-band tx-band--green">
          <div className="tx-shell">
            <div className="tx-band-grid">
              <figure className="tx-band-figure">
                <img
                  alt="Tropix ürün ailesi, iç serinle gülümse"
                  height="1250"
                  src="/assets/marka.jpg"
                  width="1000"
                />
              </figure>
              <div>
                <span className="tx-band-volume">Hakkımızda</span>
                <h2 className="tx-band-title">İç serinle, gülümse</h2>
                <p className="tx-band-lede">
                  Tropix, Özeller Group bünyesinde Gaziantep'teki modern üretim
                  tesisinde meyve suyu ve gazlı içecek üretiyor. Doğadan aldığımız
                  lezzeti, yüksek kalite standardıyla her damlada aynı tutuyoruz.
                </p>
                <ul className="tx-flavours">
                  <li>Doğal lezzet</li>
                  <li>Modern tesis</li>
                  <li>Yerli üretim</li>
                </ul>
                <div className="tx-band-actions">
                  <Link className="tx-cta-band" to="/hakkimizda">
                    Bizi tanıyın
                    <Arrow />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {BANDS.map((band, index) => (
          <ProductBand
            band={band}
            cta={{ label: "Ürünleri keşfet", to: "/urunlerimiz" }}
            flip={index % 2 === 0}
            key={band.id}
          />
        ))}

        <StatRow />
        <InviteBand alt />
      </main>
      <SiteFooter />
    </div>
  );
}
