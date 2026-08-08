/**
 * Scene data for the three Tropix journeys.
 *
 * Journey shape: single-shot, three times over. Each film is ONE continuous
 * take rendered in a single call, then split into frame-exact consecutive
 * segments so every chapter owns a stretch of the same unbroken camera move.
 * There are no seams to defend: each cut point is an exact frame boundary of a
 * single render, and every poster is the first frame of the encoded clip
 * beside it.
 *
 * `scroll` is deliberately generous so the film reads as a slow cinematic move
 * rather than a flick, and the closing chapter gets the most distance so the
 * product reveal is never scrolled past before it lands.
 *
 * Keep every array a module constant. Changing an array's identity on render
 * intentionally rebuilds the media controller.
 */
import type {
  ScrollScrubScene,
  ScrollScrubTheme,
} from "@/components/scroll-scrub/scroll-scrub";

/** Brand tokens for the journey layer, sampled from the Tropix identity. */
export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#7bc043",
  background: "#01190a",
  ink: "#ffffff",
  muted: "#93ab99",
};

const clip = (world: string, index: number) => ({
  clip: `/assets/world/${world}-0${index}.mp4`,
  mobileClip: `/assets/world/${world}-0${index}-mobile.mp4`,
  mobilePoster: `/assets/world/${world}-0${index}-mobile-poster.jpg`,
  poster: `/assets/world/${world}-0${index}-poster.jpg`,
});

/** Home: meyveden kutuya, the full 24s take in five chapters. */
export const homeScenes: ScrollScrubScene[] = [
  {
    ...clip("ana", 1),
    align: "left",
    body: "Sezonunda toplanan meyve, aromasını kaybetmeden Gaziantep'teki tesisimize giriyor. Tropix'in tadı burada, daha ilk gün belirleniyor.",
    id: "kaynak",
    kicker: "Gaziantep, Özeller Group",
    label: "Kaynak",
    scroll: 3,
    tags: ["Sezonluk hasat", "Doğal lezzet"],
    title: "Her şey meyvenin kendisiyle başlar",
  },
  {
    ...clip("ana", 2),
    align: "right",
    body: "Doğru sıcaklık, doğru süre. Meyvenin kendi tatlılığı korunuyor, üzerine tadı değiştirecek hiçbir şey eklenmiyor.",
    id: "oz",
    kicker: "Aroma",
    label: "Öz",
    scroll: 3,
    tags: ["Katkısız aroma", "Kontrollü proses"],
    title: "Aromanın merkezine iniyoruz",
  },
  {
    ...clip("ana", 3),
    align: "left",
    body: "Meyvenin özü kendi hattımızda kutuya dönüşüyor. Dolum, kapaklama ve paketleme aynı çatı altında.",
    id: "uretim",
    kicker: "Üretim",
    label: "Üretim",
    scroll: 3.2,
    tags: ["Kendi tesisimiz", "3.180+ adet üretim"],
    title: "Meyveden kutuya, tek hatta",
  },
  {
    ...clip("ana", 4),
    align: "right",
    body: "Soğuk zincirden çıkan kutu, üzerinde buğusuyla rafa gidiyor. Elinize aldığınızda hâlâ buz gibi.",
    id: "serinlik",
    kicker: "Serinlik",
    label: "Serinlik",
    linger: 0.2,
    scroll: 3.6,
    tags: ["Soğuk zincir", "51 ile dağıtım"],
    title: "Buz gibi, ilk günkü gibi",
  },
  {
    ...clip("ana", 5),
    align: "left",
    body: "Kutudan pet şişeye, meyve suyundan gazoza. Hangisine uzanırsan uzan, ilk yudumda tanıdığın tat.",
    id: "lezzet",
    kicker: "İç serinle, gülümse",
    label: "Lezzet",
    linger: 0.3,
    scroll: 4.2,
    tags: ["4 ambalaj ailesi", "9+ ülkeye ihracat"],
    title: "Serinleten lezzet",
  },
];

/** Ürünlerimiz: the product family orbit. */
export const productScenes: ScrollScrubScene[] = [
  {
    ...clip("urun", 1),
    align: "left",
    body: "Dört ayrı ambalaj ailesi, yirmiyi aşkın aroma. Hepsi aynı hattan, aynı standartla çıkıyor.",
    id: "urun-aile",
    kicker: "Ürünlerimiz",
    label: "Aile",
    scroll: 3.2,
    tags: ["330 ml kutu", "250 ml kutu"],
    title: "Aynı lezzet, dört ayrı ambalaj",
  },
  {
    ...clip("urun", 2),
    align: "right",
    body: "İnce ve uzun kutu, kapağı kapanan pet şişe, çantaya giren meyve suyu. Her an için bir Tropix var.",
    id: "urun-form",
    kicker: "Ambalaj",
    label: "Form",
    scroll: 3.2,
    tags: ["200 ml meyve suyu", "250 ml pet"],
    title: "Her ana bir ambalaj",
  },
  {
    ...clip("urun", 3),
    align: "left",
    body: "Rafta hangisine uzanırsan uzan, ilk yudumda tanıdığın tat seni karşılıyor.",
    id: "urun-lezzet",
    kicker: "İç serinle, gülümse",
    label: "Lezzet",
    linger: 0.3,
    scroll: 4,
    tags: ["20+ aroma", "Doğal lezzet"],
    title: "Serinleten lezzet",
  },
];

/** Hakkımızda: the production line. */
export const productionScenes: ScrollScrubScene[] = [
  {
    ...clip("uretim", 1),
    align: "left",
    body: "Gaziantep Başpınar'daki tesisimizde dolum hattı hiç durmuyor. Her kutu aynı kontrolden geçiyor.",
    id: "tesis-hat",
    kicker: "Hakkımızda",
    label: "Hat",
    scroll: 3.2,
    tags: ["Kendi tesisimiz", "Fason üretim yok"],
    title: "Kendi tesisimiz, kendi hattımız",
  },
  {
    ...clip("uretim", 2),
    align: "right",
    body: "Gelen meyveden dolum sonrasına kadar her aşamada numune alınıyor. Standardı tutturmayan parti hatta devam etmiyor.",
    id: "tesis-kalite",
    kicker: "Kalite",
    label: "Kalite",
    scroll: 3.2,
    tags: ["Her partide numune", "Kayıt altında"],
    title: "Her parti, aynı standart",
  },
  {
    ...clip("uretim", 3),
    align: "left",
    body: "76'yı aşkın çalışanımızla 51 ile dağıtım yapıyor, dokuzdan fazla ülkeye ihracat gerçekleştiriyoruz.",
    id: "tesis-olcek",
    kicker: "Ölçek",
    label: "Ölçek",
    linger: 0.25,
    scroll: 3.8,
    tags: ["76+ personel", "9+ ülke"],
    title: "Gaziantep'ten dokuz ülkeye",
  },
];

