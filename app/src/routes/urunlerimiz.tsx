import { createFileRoute, Link } from "@tanstack/react-router";

import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { Arrow, InviteBand, SiteFooter, SiteNav } from "@/components/site/chrome";
import { productScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";

export const Route = createFileRoute("/urunlerimiz")({
  head: () => ({
    meta: [
      { title: "Ürünlerimiz | Tropix" },
      { content: "330 ml kutu içecek, 200 ml meyve suyu, 250 ml kutu içecek ve 250 ml pet şişe Tropix ürünleri.", name: "description" },
    ],
  }),
  component: Urunlerimiz,
});

type Band = {
  alt: string;
  flavours: string[];
  id: string;
  image: string;
  lede: string;
  title: string;
  tone: string;
  volume: string;
};

export const BANDS: Band[] = [
  {
    alt: "Tropix 330 ml slim kutu içecek serisi",
    flavours: ["Limon", "Nar", "Mango", "Karadut", "Elma", "Portakal", "Çilek", "Şeftali", "Ananas"],
    id: "kutu-330",
    image: "/assets/urun/kutu-330.jpg",
    lede: "Dokuz farklı meyve aroması, ince ve uzun 330 ml kutuda. Buzdolabından çıktığı anda içilecek kadar serin.",
    title: "330 ml. Yeni Lezzetler",
    tone: "tx-band--purple",
    volume: "330 ml kutu içecek",
  },
  {
    alt: "Tropix 200 ml meyve suyu kutuları",
    flavours: ["Karpuz", "Vişne", "Kokteyl", "Kayısı", "Portakal", "Şeftali"],
    id: "meyve-suyu",
    image: "/assets/urun/meyve-suyu.jpg",
    lede: "Çocukların çantasına, sofranın yanına, yolun ortasına. 200 ml meyve suyu, tek yudumluk bir mola.",
    title: "Meyve Suyu Seçenekleri",
    tone: "tx-band--pink",
    volume: "200 ml meyve suyu",
  },
  {
    alt: "Tropix kola, gazoz ve portakal kutuları",
    flavours: ["Kola", "Sade Gazoz", "Portakal"],
    id: "kutu-250",
    image: "/assets/urun/kutu-250.jpg",
    lede: "Her damlasında serinlik. Kola, gazoz ve portakal aromalı Tropix 250 ml kutuda, buz gibi.",
    title: "Kola, Gazoz ve Portakal",
    tone: "tx-band--blue",
    volume: "250 ml kutu içecek",
  },
  {
    alt: "Tropix 250 ml pet şişe serisi",
    flavours: ["Gazoz", "Kola", "Portakal", "Karışık", "Limon", "Elma"],
    id: "pet-sise",
    image: "/assets/urun/pet-250.jpg",
    lede: "Altı farklı lezzet, kapağı kapanan 250 ml pet şişede. Yanında taşı, istediğin yerde aç.",
    title: "6 Farklı Lezzeti Keşfedin",
    tone: "tx-band--amber",
    volume: "250 ml pet şişe",
  },
];

export function ProductBand({
  band,
  flip,
  cta,
}: {
  band: Band;
  flip?: boolean;
  cta?: { label: string; to: string };
}) {
  const className = ["tx-band", band.tone, flip ? "tx-band--flip" : ""].filter(Boolean).join(" ");
  return (
    <section className={className} id={band.id}>
      <div className="tx-shell">
        <div className="tx-band-grid">
          <figure className="tx-band-figure">
            <img alt={band.alt} height="1250" loading="lazy" src={band.image} width="1000" />
          </figure>
          <div>
            <span className="tx-band-volume">{band.volume}</span>
            <h2 className="tx-band-title">{band.title}</h2>
            <p className="tx-band-lede">{band.lede}</p>
            <ul className="tx-flavours">
              {band.flavours.map((flavour) => (
                <li key={flavour}>{flavour}</li>
              ))}
            </ul>
            {cta ? (
              <div className="tx-band-actions">
                <Link className="tx-cta-band" to={cta.to}>
                  {cta.label}
                  <Arrow />
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function Urunlerimiz() {
  return (
    <div className="tx-page">
      <SiteNav />
      <main>
        <ScrollScrub scenes={productScenes} theme={scrollScrubTheme} />
        {BANDS.map((band, index) => (
          <ProductBand band={band} flip={index % 2 === 1} key={band.id} />
        ))}
        <InviteBand />
      </main>
      <SiteFooter />
    </div>
  );
}
