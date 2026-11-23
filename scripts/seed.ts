/**
 * Seeds the studio content. Safe to re-run: content tables are only filled when empty,
 * unless `--reset` is passed (bookings and admins are never wiped).
 *   bun run db:seed            # fill empty tables, upsert the admin
 *   bun run db:seed -- --reset # replace all site content
 */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import * as schema from "../src/db/schema";
import { posts as postSeed } from "./seed-posts";

const client = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false });
const db = drizzle(client, { schema });
const reset = process.argv.includes("--reset");

const { admins, serviceCategories, services, works, posts, testimonials, faqs, settings, collabs, paletteSwatches } = schema;

async function isEmpty(table: typeof services | typeof works | typeof posts | typeof faqs | typeof testimonials | typeof serviceCategories | typeof collabs | typeof paletteSwatches) {
  const rows = await db.select().from(table).limit(1);
  return rows.length === 0;
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL!;
  const password = process.env.ADMIN_PASSWORD!;
  const passwordHash = await bcrypt.hash(password, 11);
  await db
    .insert(admins)
    .values({ email, name: "Style Wincester", passwordHash })
    .onConflictDoUpdate({ target: admins.email, set: { passwordHash } });
  console.log(`admin: ${email}`);
}

type S = Omit<typeof services.$inferInsert, "categoryId" | "sort">;

const menu: { slug: string; nameRo: string; nameRu: string; introRo: string; introRu: string; items: S[] }[] = [
  {
    slug: "tunsori",
    nameRo: "Tunsori",
    nameRu: "Стрижки",
    introRo: "Forma se construiește pe textura ta naturală, nu împotriva ei. Fiecare tunsoare include spălare, consultație și styling final.",
    introRu: "Форма строится на вашей натуральной текстуре, а не вопреки ей. Каждая стрижка включает мытьё, консультацию и финальную укладку.",
    items: [
      { nameRo: "Tunsoare de autor · păr scurt", nameRu: "Авторская стрижка · короткие волосы", noteRo: "până la bărbie", noteRu: "до подбородка", priceFrom: 450, durationMin: 60 },
      { nameRo: "Tunsoare de autor · păr mediu", nameRu: "Авторская стрижка · средняя длина", noteRo: "până la umeri", noteRu: "до плеч", priceFrom: 500, durationMin: 75 },
      { nameRo: "Tunsoare de autor · păr lung", nameRu: "Авторская стрижка · длинные волосы", noteRo: "sub omoplați", noteRu: "ниже лопаток", priceFrom: 550, durationMin: 75 },
      { nameRo: "Shag, Wolf cut, Mullet", nameRu: "Шэг, вулф-кат, маллет", noteRo: "straturi texturate, volum în creștet", noteRu: "текстурные слои, объём у макушки", priceFrom: 600, durationMin: 90, featured: true },
      { nameRo: "Bob & Pixie", nameRu: "Боб и пикси", noteRo: "arhitectura liniei", noteRu: "архитектура линии", priceFrom: 550, durationMin: 75, featured: true },
      { nameRo: "Breton", nameRu: "Чёлка", noteRo: "corecție între vizite", noteRu: "коррекция между визитами", priceFrom: 150, durationMin: 20 },
      { nameRo: "Tunsoare masculină", nameRu: "Мужская стрижка", noteRo: "mașină + foarfecă", noteRu: "машинка + ножницы", priceFrom: 350, durationMin: 45, featured: true },
      { nameRo: "Tunsoare masculină texturată", nameRu: "Мужская текстурная стрижка", noteRo: "doar foarfecă, bucle și lungimi medii", noteRu: "только ножницы, кудри и средняя длина", priceFrom: 400, durationMin: 60 },
      { nameRo: "Tunsoare copii", nameRu: "Детская стрижка", noteRo: "până la 10 ani", noteRu: "до 10 лет", priceFrom: 250, durationMin: 30 },
    ],
  },
  {
    slug: "culoare",
    nameRo: "Culoare",
    nameRu: "Окрашивание",
    introRo: "AIRTouch, nuanțări și tonuri adânci. Prețul final depinde de lungime, densitate și istoricul părului — îl confirmăm la consultație, înainte să începem.",
    introRu: "AIRTouch, тонирование и глубокие оттенки. Итоговая цена зависит от длины, густоты и истории волос — подтверждаем её на консультации, до начала работы.",
    items: [
      { nameRo: "AIRTouch", nameRu: "AIRTouch", noteRo: "lumină naturală, fără linii de demarcație", noteRu: "естественный свет без линий перехода", priceFrom: 2800, priceTo: 4500, durationMin: 300, featured: true },
      { nameRo: "Balayage", nameRu: "Балаяж", noteRo: "pictat manual, tranziție moale", noteRu: "ручная техника, мягкий переход", priceFrom: 2500, priceTo: 4000, durationMin: 270 },
      { nameRo: "Nuanțare / gloss", nameRu: "Тонирование / глосс", noteRo: "luciu, ton, neutralizare", noteRu: "блеск, тон, нейтрализация", priceFrom: 900, isFrom: true, durationMin: 90, featured: true },
      { nameRo: "Tonuri adânci: Dark Chocolate, Cherry Cola", nameRu: "Глубокие оттенки: Dark Chocolate, Cherry Cola", noteRo: "culorile-semnătură ale studioului", noteRu: "фирменные оттенки студии", priceFrom: 1500, isFrom: true, durationMin: 150, featured: true },
      { nameRo: "Vopsire rădăcini", nameRu: "Окрашивание корней", noteRo: "până la 3 cm", noteRu: "до 3 см", priceFrom: 700, isFrom: true, durationMin: 90 },
      { nameRo: "Vopsire integrală într-un ton", nameRu: "Окрашивание в один тон", priceFrom: 1200, priceTo: 1800, durationMin: 120 },
      { nameRo: "Men Blonde", nameRu: "Мужской блонд", noteRo: "decolorare + tonare", noteRu: "осветление + тонирование", priceFrom: 1200, isFrom: true, durationMin: 120 },
      { nameRo: "Total blond", nameRu: "Тотал блонд", noteRo: "decolorare integrală cu protecție", noteRu: "полное осветление с защитой", priceFrom: 2200, isFrom: true, durationMin: 300 },
      { nameRo: "Corecție de culoare", nameRu: "Коррекция цвета", noteRo: "doar după consultație", noteRu: "только после консультации", priceFrom: 3000, isFrom: true, durationMin: 360 },
    ],
  },
  {
    slug: "ingrijire",
    nameRo: "Îngrijire & styling",
    nameRu: "Уход и укладка",
    introRo: "Ritualuri care țin culoarea vie și forma curată între vizite.",
    introRu: "Ритуалы, которые сохраняют цвет живым, а форму — чистой между визитами.",
    items: [
      { nameRo: "Consultație de formă și culoare", nameRu: "Консультация по форме и цвету", noteRo: "20 de minute, cu poze de referință", noteRu: "20 минут, с референсами", priceFrom: 0, durationMin: 20 },
      { nameRo: "Ritual de spălare & masaj al scalpului", nameRu: "Ритуал мытья и массаж кожи головы", priceFrom: 250, durationMin: 30 },
      { nameRo: "Reconstrucție profundă", nameRu: "Глубокая реконструкция", noteRo: "add-on la orice serviciu de culoare", noteRu: "дополнение к любому окрашиванию", priceFrom: 450, durationMin: 30 },
      { nameRo: "Botox capilar", nameRu: "Ботокс для волос", priceFrom: 900, isFrom: true, durationMin: 120 },
      { nameRo: "Spălare + brushing", nameRu: "Мытьё + брашинг", priceFrom: 300, durationMin: 45 },
      { nameRo: "Styling de seară", nameRu: "Вечерняя укладка", priceFrom: 500, durationMin: 60 },
      { nameRo: "Styling editorial", nameRu: "Редакционный стайлинг", noteRo: "ședințe foto, campanii, evenimente — pe set", noteRu: "съёмки, кампании, события — на площадке", priceFrom: 1500, isFrom: true, durationMin: 180 },
    ],
  },
  {
    slug: "pachete",
    nameRo: "Pachete",
    nameRu: "Комплексы",
    introRo: "Combinațiile pe care le cer cel mai des, la un preț mai bun decât separat.",
    introRu: "Сочетания, которые выбирают чаще всего, — выгоднее, чем по отдельности.",
    items: [
      { nameRo: "Tunsoare + nuanțare", nameRu: "Стрижка + тонирование", priceFrom: 1300, durationMin: 150, featured: true },
      { nameRo: "AIRTouch + tunsoare + reconstrucție", nameRu: "AIRTouch + стрижка + реконструкция", priceFrom: 3500, isFrom: true, durationMin: 360 },
      { nameRo: "Transformare completă", nameRu: "Полное преображение", noteRo: "consultație, formă nouă, culoare, îngrijire", noteRu: "консультация, новая форма, цвет, уход", priceFrom: 3900, isFrom: true, durationMin: 420 },
    ],
  },
];

const workSeed: (typeof works.$inferInsert)[] = [
  { titleRo: "Joan of Arc", titleRu: "Жанна д’Арк", captionRo: "Copertă Selin Magazine, Amsterdam. Păr: Style Wincester.", captionRu: "Обложка Selin Magazine, Амстердам. Волосы: Style Wincester.", tag: "editorial", kind: "photo", src: "/media/photo/selin-cover.webp", width: 491, height: 640, credit: "Foto @shhamanphoto · Model @laps1dd · @avilionmodels · Creative @dumitruslobodnyuk", featured: true },
  { titleRo: "Dark Chocolate", titleRu: "Dark Chocolate", captionRo: "Ton adânc, rece, cu luciu de oglindă.", captionRu: "Глубокий холодный тон с зеркальным блеском.", tag: "color", kind: "video", src: "/media/video/chocolate.mp4", poster: "/media/photo/dark-chocolate.webp", width: 1080, height: 1440, featured: true },
  { titleRo: "Seria Noapte", titleRu: "Ночная серия", captionRo: "Linie lungă, fără efort, de la spălare la stradă.", captionRu: "Длинная лёгкая линия — от мытья до улицы.", tag: "styling", kind: "video", src: "/media/video/hero.mp4", poster: "/media/photo/night-portrait.webp", width: 1080, height: 1920, featured: true },
  { titleRo: "Shag pe păr creț", titleRu: "Шэг на кудрявых волосах", captionRo: "Volum redefinit: straturile scurte din creștet ridică buclele.", captionRu: "Новый объём: короткие слои у макушки поднимают локоны.", tag: "cut", kind: "video", src: "/media/video/street.mp4", poster: "/media/photo/street-curls.webp", width: 720, height: 1280, featured: true },
  { titleRo: "Bob — arhitectura liniei", titleRu: "Боб — архитектура линии", captionRo: "Un bob greu, care se mișcă dintr-o singură bucată.", captionRu: "Плотный боб, который двигается единым полотном.", tag: "cut", kind: "video", src: "/media/video/bob.mp4", poster: "/media/photo/bob-polo.webp", width: 720, height: 1280 },
  { titleRo: "Roșu adânc pe bucle", titleRu: "Глубокий красный на локонах", captionRo: "Cherry Cola pe bucle naturale.", captionRu: "Cherry Cola на натуральных локонах.", tag: "color", kind: "video", src: "/media/video/curls.mp4", poster: "/media/photo/red-curls.webp", width: 1600, height: 902, featured: true },
  { titleRo: "Straturi în mișcare", titleRu: "Слои в движении", captionRo: "Shag de lungime medie, filmat pe peliculă.", captionRu: "Шэг средней длины, снятый на плёнку.", tag: "cut", kind: "video", src: "/media/video/film.mp4", poster: "/media/photo/film-hands.webp", width: 1600, height: 794 },
  { titleRo: "Arhitectura în tunsori", titleRu: "Архитектура в стрижках", captionRo: "Bucle scurte, contur moale.", captionRu: "Короткие локоны, мягкий контур.", tag: "men", kind: "photo", src: "/media/photo/men-curls.webp", width: 480, height: 640, credit: "Models @avilionmodels" },
  { titleRo: "Men Blonde", titleRu: "Мужской блонд", captionRo: "Decolorare + tonare pe tunsoare scurtă.", captionRu: "Осветление и тонирование на короткой стрижке.", tag: "men", kind: "photo", src: "/media/photo/men-blonde.webp", width: 480, height: 640 },
  { titleRo: "Aura, înainte de tunsoare", titleRu: "Аура, до стрижки", captionRo: "Roșu cupru, volum sculptat.", captionRu: "Медно-красный, скульптурный объём.", tag: "color", kind: "photo", src: "/media/photo/aura-red.webp", width: 480, height: 640 },
  { titleRo: "După și înainte", titleRu: "После и до", captionRo: "Bob cu șuvițe calde, purtabil zilnic.", captionRu: "Боб с тёплыми прядями на каждый день.", tag: "cut", kind: "photo", src: "/media/photo/before-after-bob.webp", width: 640, height: 480 },
  { titleRo: "Marcela în „Scroll Dress”", titleRu: "Марчела в «Scroll Dress»", captionRo: "Păr pentru Yulia Efros.", captionRu: "Волосы для Yulia Efros.", tag: "editorial", kind: "photo", src: "/media/photo/scroll-dress.webp", width: 480, height: 640, credit: "Foto @lina.burbulea · Model @nistor_marcela · MUA @veronicaguzun_mua" },
  { titleRo: "Breton greu, lungime dreaptă", titleRu: "Плотная чёлка, прямая длина", captionRo: "Dark Chocolate, tăietură netă.", captionRu: "Dark Chocolate, чистый срез.", tag: "color", kind: "photo", src: "/media/photo/dark-chocolate-2.webp", width: 1080, height: 1440 },
  { titleRo: "Ritualul de spălare", titleRu: "Ритуал мытья", captionRo: "Momentul în care începe orice formă.", captionRu: "Момент, с которого начинается любая форма.", tag: "styling", kind: "photo", src: "/media/photo/wash-ritual.webp", width: 1080, height: 1920 },
  { titleRo: "Pixie vișiniu", titleRu: "Вишнёвый пикси", captionRo: "Formă scurtă, culoare adâncă.", captionRu: "Короткая форма, глубокий цвет.", tag: "color", kind: "photo", src: "/media/photo/red-curls-2.webp", width: 1600, height: 902 },
  { titleRo: "Profil umed", titleRu: "Влажный профиль", captionRo: "Textura înainte de uscare.", captionRu: "Текстура до сушки.", tag: "styling", kind: "photo", src: "/media/photo/wet-profile.webp", width: 1080, height: 1920 },
];

const faqSeed = [
  {
    questionRo: "Cum mă programez?",
    questionRu: "Как записаться?",
    answerRo: "Lasă o cerere pe pagina de programare sau scrie-ne în DM pe Instagram. Confirmăm ora și adresa exactă în aceeași zi.",
    answerRu: "Оставьте заявку на странице записи или напишите нам в директ Instagram. Подтверждаем время и точный адрес в тот же день.",
  },
  {
    questionRo: "De ce prețul la culoare începe cu „de la”?",
    questionRu: "Почему цена окрашивания указана «от»?",
    answerRo: "Cantitatea de produs și timpul depind de lungime, densitate și de culoarea de acum. La consultație îți spunem prețul final, înainte să începem — fără surprize.",
    answerRu: "Расход продукта и время зависят от длины, густоты и текущего цвета. Итоговую цену называем на консультации, до начала работы — без сюрпризов.",
  },
  {
    questionRo: "Cât durează un AIRTouch?",
    questionRu: "Сколько длится AIRTouch?",
    answerRo: "Între 4 și 6 ore. Vino cu părul spălat cu o zi înainte, fără produse de styling, și rezervă-ți toată după-amiaza.",
    answerRu: "От 4 до 6 часов. Приходите с волосами, вымытыми накануне, без стайлинга, и оставьте себе весь день.",
  },
  {
    questionRo: "Pot veni cu o poză de referință?",
    questionRu: "Можно прийти с референсом?",
    answerRo: "Te rugăm. 2–3 poze cu ce îți place și una cu ce nu-ți place ne spun mai mult decât orice descriere.",
    answerRu: "Обязательно. 2–3 фото того, что нравится, и одно — того, что не нравится, скажут больше любого описания.",
  },
  {
    questionRo: "Lucrați și cu bărbați?",
    questionRu: "Вы работаете с мужчинами?",
    answerRo: "Da: tunsori texturate cu foarfeca, bucle scurte, Men Blonde și tonări.",
    answerRu: "Да: текстурные стрижки ножницами, короткие локоны, мужской блонд и тонирование.",
  },
  {
    questionRo: "Cum anulez sau mut programarea?",
    questionRu: "Как отменить или перенести запись?",
    answerRo: "Scrie-ne cu cel puțin 24 de ore înainte. Pentru serviciile lungi de culoare, timpul e rezervat doar pentru tine.",
    answerRu: "Напишите нам минимум за 24 часа. На долгие окрашивания время бронируется только под вас.",
  },
];

// Placeholders only: hidden until the studio replaces them with real client words.
const testimonialSeed = [
  { name: "Exemplu — înlocuiește", serviceRo: "AIRTouch", serviceRu: "AIRTouch", textRo: "Aici va apărea recenzia reală a unei cliente.", textRu: "Здесь появится настоящий отзыв клиентки.", visible: false },
  { name: "Exemplu — înlocuiește", serviceRo: "Shag", serviceRu: "Шэг", textRo: "Aici va apărea recenzia reală a unei cliente.", textRu: "Здесь появится настоящий отзыв клиентки.", visible: false },
];

// Credits taken from the studio's published Instagram posts.
const collabSeed = [
  { name: "Selin Magazine", roleRo: "Copertă „Joan of Arc”, Amsterdam", roleRu: "Обложка «Joan of Arc», Амстердам", url: "https://www.instagram.com/selin.magazine/" },
  { name: "Avilion Models", roleRo: "Agenție de modele", roleRu: "Модельное агентство", url: "https://www.instagram.com/avilionmodels/" },
  { name: "Yulia Efros", roleRo: "Designer · „Scroll Dress”", roleRu: "Дизайнер · «Scroll Dress»", url: "https://www.instagram.com/yuliaefros/" },
  { name: "Dmitri Bordeniuc", roleRo: "Fotograf", roleRu: "Фотограф", url: "https://www.instagram.com/shhamanphoto/" },
  { name: "Lina Burbulea", roleRo: "Fotograf", roleRu: "Фотограф", url: "https://www.instagram.com/lina.burbulea/" },
  { name: "Veronica Guzun", roleRo: "Make-up artist", roleRu: "Визажист", url: "https://www.instagram.com/veronicaguzun_mua/" },
];

const paletteSeed = [
  { nameRo: "Dark Chocolate", nameRu: "Dark Chocolate", noteRo: "castaniu rece, luciu de oglindă", noteRu: "холодный каштан, зеркальный блеск", color: "#3b2418", photo: "/media/photo/dark-chocolate.webp", photoWidth: 1080, photoHeight: 1440 },
  { nameRo: "Cherry Cola", nameRu: "Cherry Cola", noteRo: "vișiniu adânc pe bucle", noteRu: "глубокий вишнёвый на локонах", color: "#5c1519", photo: "/media/photo/red-curls.webp", photoWidth: 1600, photoHeight: 902 },
  { nameRo: "Cupru roșu", nameRu: "Красная медь", noteRo: "foc cald, pentru forme scurte", noteRu: "тёплый огонь для коротких форм", color: "#9a3d20", photo: "/media/photo/aura-red.webp", photoWidth: 480, photoHeight: 640 },
  { nameRo: "Miere", nameRu: "Мёд", noteRo: "AIRTouch cald pe castaniu", noteRu: "тёплый AIRTouch на каштане", color: "#b98a4f", photo: "/media/photo/film-hands.webp", photoWidth: 1600, photoHeight: 794 },
  { nameRo: "Bej cenușiu", nameRu: "Пепельный беж", noteRo: "blond răcorit, fără galben", noteRu: "холодный блонд без желтизны", color: "#a89a86", photo: "/media/photo/night-portrait.webp", photoWidth: 1080, photoHeight: 1920 },
  { nameRo: "Platină", nameRu: "Платина", noteRo: "Men Blonde, decolorare + tonare", noteRu: "мужской блонд, осветление и тон", color: "#e4dccb", photo: "/media/photo/men-blonde.webp", photoWidth: 480, photoHeight: 640 },
];

const siteSettings: schema.SiteSettings = {
  phone: "",
  email: "",
  instagram: "style.winces.ter",
  telegram: "",
  addressRo: "Chișinău, Moldova. Adresa exactă o primești la confirmarea programării.",
  addressRu: "Кишинёв, Молдова. Точный адрес пришлём при подтверждении записи.",
  mapUrl: "",
  hours: [
    { daysRo: "Marți — Sâmbătă", daysRu: "Вторник — суббота", time: "10:00 — 20:00" },
    { daysRo: "Duminică · Luni, la cerere", daysRu: "Воскресенье · понедельник, по запросу", time: "11:00 — 17:00" },
  ],
  announcementRo: "",
  announcementRu: "",
  heroVideo: "/media/video/hero.mp4",
  heroPoster: "/media/poster/hero.webp",
};

async function main() {
  await seedAdmin();

  if (reset) {
    await db.delete(services);
    await db.delete(serviceCategories);
    await db.delete(works);
    await db.delete(posts);
    await db.delete(faqs);
    await db.delete(testimonials);
    await db.delete(settings);
    await db.delete(collabs);
    await db.delete(paletteSwatches);
  }

  if (await isEmpty(serviceCategories)) {
    for (const [ci, cat] of menu.entries()) {
      const [row] = await db
        .insert(serviceCategories)
        .values({ slug: cat.slug, nameRo: cat.nameRo, nameRu: cat.nameRu, introRo: cat.introRo, introRu: cat.introRu, sort: ci })
        .returning({ id: serviceCategories.id });
      await db.insert(services).values(cat.items.map((s, i) => ({ ...s, categoryId: row.id, sort: i })));
    }
    console.log("services seeded");
  }

  if (await isEmpty(works)) {
    await db.insert(works).values(workSeed.map((w, i) => ({ ...w, sort: i })));
    console.log("works seeded");
  }

  if (await isEmpty(posts)) {
    const now = Date.now();
    await db.insert(posts).values(
      postSeed.map((p, i) => ({ ...p, published: true, publishedAt: new Date(now - i * 9 * 86_400_000) })),
    );
    console.log("posts seeded");
  }

  if (await isEmpty(faqs)) {
    await db.insert(faqs).values(faqSeed.map((f, i) => ({ ...f, sort: i })));
    console.log("faqs seeded");
  }

  if (await isEmpty(testimonials)) {
    await db.insert(testimonials).values(testimonialSeed.map((t, i) => ({ ...t, sort: i })));
    console.log("testimonials seeded (hidden)");
  }

  if (await isEmpty(collabs)) {
    await db.insert(collabs).values(collabSeed.map((c, i) => ({ ...c, sort: i })));
    console.log("collabs seeded");
  }

  if (await isEmpty(paletteSwatches)) {
    await db.insert(paletteSwatches).values(paletteSeed.map((p, i) => ({ ...p, sort: i })));
    console.log("palette seeded");
  }

  await db.insert(settings).values({ key: "site", value: siteSettings }).onConflictDoNothing();
  console.log("done");
  await client.end();
}

main().catch(async (e) => {
  console.error(e);
  await client.end();
  process.exit(1);
});
