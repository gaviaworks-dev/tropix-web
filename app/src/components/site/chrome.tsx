import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

/** Shared arrow. Each CTA garment styles it through currentColor. */
export function Arrow() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 16 10">
      <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

const NAV = [
  { label: "Hakkımızda", to: "/hakkimizda" },
  { label: "Ürünlerimiz", to: "/urunlerimiz" },
  { label: "Bayilik", to: "/bayilik" },
  { label: "Kariyer", to: "/kariyer" },
  { label: "Bize Ulaşın", to: "/bize-ulasin" },
] as const;

/**
 * Sits over the scroll-scrub film on the three journey pages and goes solid the
 * moment the film scrolls away.
 *
 * `overMedia` is a prop rather than something the nav sniffs for itself, so the
 * prerendered HTML already carries the right state and the header never flashes
 * white over the opening frame before hydration.
 *
 * The switch point is the bottom edge of the .scroll-scrub section: while any of
 * the film is still behind the bar, the bar stays transparent. Read straight off
 * the element rather than a hard-coded offset, so it keeps working if a scene's
 * scroll length changes. The engine itself is untouched — this only reads its
 * geometry.
 */
export function SiteNav({ overMedia = false }: { overMedia?: boolean } = {}) {
  const [transparent, setTransparent] = useState(overMedia);

  useEffect(() => {
    if (!overMedia) return;

    const nav = document.querySelector<HTMLElement>(".tx-nav");
    const media = document.querySelector<HTMLElement>(".scroll-scrub");
    if (!nav || !media) return;

    let frame = 0;
    const read = () => {
      frame = 0;
      setTransparent(media.getBoundingClientRect().bottom > nav.offsetHeight);
    };
    const onScroll = () => {
      // One read per painted frame; the scroll event itself fires far more often.
      if (!frame) frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [overMedia]);

  return (
    <header className="tx-nav" data-over-media={transparent ? "true" : undefined}>
      <div className="tx-nav-inner">
        <Link className="tx-mark" to="/">
          <img
            alt="Tropix"
            className="tx-mark-dark"
            height="110"
            src="/assets/tropix-logo.png"
            width="237"
          />
          <img
            alt=""
            aria-hidden="true"
            className="tx-mark-light"
            height="110"
            src="/assets/tropix-logo-white.png"
            width="237"
          />
        </Link>
        <nav aria-label="Ana menü" className="tx-nav-links">
          {NAV.map((item) => (
            <Link
              activeProps={{ "data-active": "true" }}
              className="tx-nav-link"
              key={item.to}
              to={item.to}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="tx-cta-primary" to="/bayilik">
          Bayilik başvurusu
          <Arrow />
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="tx-footer">
      <div className="tx-shell">
        <div className="tx-footer-grid">
          <div className="tx-footer-brand">
            <Link className="tx-mark" to="/">
              <img alt="Tropix" height="110" src="/assets/tropix-logo-white.png" width="237" />
            </Link>
            <p>
              Gaziantep'teki modern üretim tesisimizde meyve suyu ve gazlı içecek
              üretiyoruz. İç serinle, gülümse.
            </p>
          </div>
          <div>
            <h3>Kurumsal</h3>
            <ul>
              <li><Link to="/hakkimizda">Hakkımızda</Link></li>
              <li><Link to="/bayilik">Bayilik</Link></li>
              <li><Link to="/kariyer">Kariyer</Link></li>
              <li><Link to="/bize-ulasin">İletişim</Link></li>
            </ul>
          </div>
          <div>
            <h3>Ürünler</h3>
            <ul>
              <li><Link to="/urunlerimiz">330 ml. Kutu İçecek</Link></li>
              <li><Link to="/urunlerimiz">250 ml. Kutu İçecek</Link></li>
              <li><Link to="/urunlerimiz">200 ml. Meyve Suyu</Link></li>
              <li><Link to="/urunlerimiz">250 ml. Pet Şişe</Link></li>
            </ul>
          </div>
          <div>
            <h3>Bize Ulaşın</h3>
            <ul>
              <li><a href="mailto:info@ozellergroup.com.tr">info@ozellergroup.com.tr</a></li>
              <li><a href="tel:+905326857027">+90 532 685 70 27</a></li>
              <li className="tx-footer-address">
                Başpınar OSB Mahallesi, O.S.B. 5. Bölge, 83561 No'lu Cadde No: 20,
                Şehitkamil / Gaziantep
              </li>
            </ul>
            <div className="tx-footer-parent">
              <img alt="Özeller Group" height="205" src="/assets/ozeller.png" width="420" />
              <span>Bir Özeller Group markasıdır</span>
            </div>
          </div>
        </div>
        <div className="tx-footer-meta">
          <span>2026 Tropix. Tüm hakları saklıdır.</span>
          <span>Özeller Group, Gaziantep</span>
        </div>
      </div>
    </footer>
  );
}

/** Plain-page banner: the quiet counterpart of the cinematic journey. */
export function PageBanner({
  eyebrow,
  title,
  lede,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className="tx-banner">
      {image ? (
        <>
          <div aria-hidden={imageAlt ? undefined : "true"} className="tx-banner-media">
            <img alt={imageAlt ?? ""} height="900" src={image} width="1600" />
          </div>
          <div aria-hidden="true" className="tx-banner-scrim" />
        </>
      ) : null}
      <div className="tx-shell">
        <span className="tx-banner-eyebrow">{eyebrow}</span>
        <h1 className="tx-banner-title">{title}</h1>
        {lede ? <p className="tx-banner-lede">{lede}</p> : null}
      </div>
    </section>
  );
}

/** Image + text split, the quiet pages' answer to the banded product world. */
export function Feature({
  eyebrow,
  title,
  image,
  imageAlt,
  flip,
  alt,
  children,
}: {
  eyebrow: string;
  title: string;
  image: string;
  imageAlt: string;
  flip?: boolean;
  alt?: boolean;
  children: React.ReactNode;
}) {
  const className = ["tx-feature", flip ? "tx-feature--flip" : "", alt ? "tx-alt" : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <section className={className}>
      <div className="tx-shell">
        <div className="tx-feature-grid">
          <figure className="tx-feature-figure">
            <img alt={imageAlt} height="900" loading="lazy" src={image} width="1200" />
          </figure>
          <div className="tx-feature-body">
            <span className="tx-feature-eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

const STATS = [
  { label: "Personel", value: "76+" },
  { label: "Adet üretim", value: "3.180+" },
  { label: "İle dağıtım", value: "51" },
  { label: "Ülkeye ihracat", value: "9+" },
] as const;

export function StatRow({ alt }: { alt?: boolean }) {
  return (
    <section className={alt ? "tx-numbers tx-alt" : "tx-numbers"}>
      <div className="tx-shell">
        <div className="tx-stats">
          {STATS.map((stat) => (
            <div className="tx-stat" key={stat.label}>
              <div className="tx-stat-value">{stat.value}</div>
              <div className="tx-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InviteBand({ alt }: { alt?: boolean }) {
  return (
    <section className={alt ? "tx-invite tx-alt" : "tx-invite"}>
      <div className="tx-shell">
        <h2>Yurt içi veya yurt dışı bayimiz olmak ister misiniz?</h2>
        <p>
          Bölgenizde Tropix'i güçlü bir şekilde temsil edecek iş ortakları
          arıyoruz. Güçlü marka desteği, geniş ürün yelpazesi, pazarlama ve
          reklam desteğiyle birlikte büyüyoruz.
        </p>
        <div className="tx-invite-actions">
          <a className="tx-cta-primary" href="mailto:info@ozellergroup.com.tr">
            Başvuru gönder
            <Arrow />
          </a>
          <a className="tx-cta-line" href="tel:+905326857027">
            +90 532 685 70 27
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
