import { createFileRoute } from "@tanstack/react-router";

import { PageBanner, SiteFooter, SiteNav } from "@/components/site/chrome";

export const Route = createFileRoute("/bize-ulasin")({
  head: () => ({
    meta: [
      { title: "Bize Ulaşın | Tropix" },
      { content: "Tropix iletişim bilgileri: Gaziantep, Şehitkamil. Bayilik, sponsorluk ve öneri talepleriniz için bize ulaşın.", name: "description" },
    ],
  }),
  component: BizeUlasin,
});

function BizeUlasin() {
  return (
    <div className="tx-page">
      <SiteNav />
      <main>
        <PageBanner
          eyebrow="Bize Ulaşın"
          image="/assets/sayfa/iletisim.jpg"
          imageAlt="Tropix iletişim"
          lede="Her türlü soru, bayilik, sponsorluk ve öneri talepleriniz için bize ulaşabilirsiniz."
          title="Tropix İletişim Bilgileri"
        />
        <section className="tx-prose">
          <div className="tx-shell">
            <div className="tx-contact">
              <div className="tx-contact-item">
                <h3>Adres</h3>
                <p>
                  Başpınar (Organize) OSB Mahallesi, O.S.B. 5. Bölge, 83561 No'lu
                  Cadde, No: 20, İç Kapı No: 0, Şehitkamil / Gaziantep
                </p>
              </div>
              <div className="tx-contact-item">
                <h3>E-posta</h3>
                <a href="mailto:info@ozellergroup.com.tr">info@ozellergroup.com.tr</a>
              </div>
              <div className="tx-contact-item">
                <h3>Telefon</h3>
                <a href="tel:+905326857027">+90 532 685 70 27</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
