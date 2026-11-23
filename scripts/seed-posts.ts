import type { posts as postsTable } from "../src/db/schema";

type PostSeed = Omit<typeof postsTable.$inferInsert, "published" | "publishedAt">;

export const posts: PostSeed[] = [
  {
    slug: "shag-pe-par-cret",
    titleRo: "Shag pe păr creț: de ce funcționează",
    titleRu: "Шэг на кудрявых волосах: почему это работает",
    topicRo: "Forme",
    topicRu: "Формы",
    readingMin: 3,
    cover: "/media/photo/street-curls.webp",
    video: "/media/video/street.mp4",
    excerptRo: "Tunsoarea shag este alegerea ideală dacă vrei un look rebel, plin de volum și de mișcare. Iată de ce buclele o iubesc.",
    excerptRu: "Шэг — идеальный выбор, если хочется дерзкого образа с объёмом и движением. Рассказываем, почему локоны его любят.",
    bodyRo: `Tunsoarea shag este alegerea ideală dacă vrei un look rebel, plin de volum și de mișcare. Pe părul creț, ea face ceva ce puține forme reușesc: lasă bucla să fie bucla.

## Volum redefinit

Straturile scurte din creștet ridică buclele și le împiedică să se lase îngreunate. Greutatea dispare de sus, iar forma se așază singură — fără perie, fără placă.

## Textură naturală

Tăieturile filate pun în valoare forma fiecărui cârlionț. Nu tăiem bucla „la întâmplare”: o citim uscată, în starea ei naturală, și abia apoi decidem unde intră foarfeca.

> Un shag bun nu se vede în prima zi. Se vede în a treia săptămână, când crește frumos.

## Versatilitate

Merge perfect atât cu un breton scurt și creț, cât și cu șuvițe mai lungi care încadrează chipul.

### Cum îl porți acasă

- spală cu un șampon fără sulfați, o dată la 2–3 zile;
- aplică produsul de bucle pe părul ud, nu pe cel uscat;
- usucă cu difuzorul la temperatură medie sau lasă-l să se usuce singur;
- revino pentru o corecție la 8–10 săptămâni.`,
    bodyRu: `Шэг — идеальный выбор, если хочется дерзкого образа с объёмом и движением. На кудрявых волосах он делает то, что удаётся немногим формам: позволяет локону оставаться локоном.

## Новый объём

Короткие слои у макушки поднимают локоны и не дают им провисать под собственным весом. Тяжесть уходит сверху, и форма ложится сама — без щётки и утюжка.

## Натуральная текстура

Филированные срезы подчёркивают форму каждого завитка. Мы не режем локон «наугад»: сначала смотрим на него сухим, в естественном состоянии, и только потом решаем, где работать ножницами.

> Хороший шэг видно не в первый день. Его видно на третьей неделе, когда он красиво отрастает.

## Универсальность

Он одинаково хорош и с короткой кудрявой чёлкой, и с длинными прядями, обрамляющими лицо.

### Как носить дома

- мойте шампунем без сульфатов раз в 2–3 дня;
- наносите средство для локонов на влажные, а не сухие волосы;
- сушите диффузором на средней температуре или естественным образом;
- приходите на коррекцию через 8–10 недель.`,
  },
  {
    slug: "airtouch-sau-balayage",
    titleRo: "AIRTouch sau balayage: ce alegi",
    titleRu: "AIRTouch или балаяж: что выбрать",
    topicRo: "Culoare",
    topicRu: "Цвет",
    readingMin: 4,
    cover: "/media/photo/film-hands.webp",
    video: "/media/video/film.mp4",
    excerptRo: "Ambele dau lumină. Diferența e în cum crește părul după — și cât de des vrei să revii la salon.",
    excerptRu: "Обе техники дают свет. Разница в том, как волосы отрастают потом — и как часто вы готовы возвращаться в салон.",
    bodyRo: `Ambele tehnici dau lumină părului. Diferența e în felul în care culoarea crește după — și în cât de des vrei să revii la salon.

## AIRTouch

Șuvițele se separă cu aerul de la uscător: firele scurte zboară, cele lungi rămân și sunt deschise. Rezultatul e o tranziție fără nicio linie de demarcație, ca o lumină care vine din interiorul părului.

- **pentru cine:** cine vrea un blond sau un castaniu luminos care crește invizibil;
- **durată:** 4–6 ore;
- **revenire:** la 4–6 luni, uneori doar pentru nuanțare.

## Balayage

Culoarea se pictează manual, de la mijlocul lungimii spre vârfuri. E mai liber, mai „desenat”, cu accente acolo unde lumina cade natural.

- **pentru cine:** păr mediu și lung, cine vrea un efect de vacanță;
- **durată:** 3–5 ore;
- **revenire:** la 3–4 luni.

> Dacă nu știi ce alegi, alege consultația. Îți arătăm pe părul tău, nu pe poze.

## Prețul

Ambele tehnici au preț „de la”, pentru că lungimea și densitatea schimbă cantitatea de produs și timpul. Prețul final îl afli la consultație, înainte să începem.`,
    bodyRu: `Обе техники дают волосам свет. Разница в том, как цвет отрастает потом — и как часто вы готовы возвращаться в салон.

## AIRTouch

Пряди разделяются потоком воздуха от фена: короткие волоски улетают, длинные остаются и осветляются. В итоге — переход без единой линии, будто свет идёт изнутри волос.

- **кому:** тем, кто хочет блонд или светлый каштан, который отрастает незаметно;
- **время:** 4–6 часов;
- **повтор:** через 4–6 месяцев, иногда только тонирование.

## Балаяж

Цвет наносится вручную, от середины длины к кончикам. Он свободнее, более «нарисованный», с акцентами там, где естественно падает свет.

- **кому:** для средней и длинной длины, для эффекта «после отпуска»;
- **время:** 3–5 часов;
- **повтор:** через 3–4 месяца.

> Если не можете выбрать — выбирайте консультацию. Покажем на ваших волосах, а не на картинках.

## Цена

У обеих техник цена «от», потому что длина и густота меняют расход продукта и время. Итоговую сумму вы узнаете на консультации, до начала работы.`,
  },
  {
    slug: "dark-chocolate",
    titleRo: "Dark Chocolate: tonul sezonului rece",
    titleRu: "Dark Chocolate: оттенок холодного сезона",
    topicRo: "Culoare",
    topicRu: "Цвет",
    readingMin: 2,
    cover: "/media/photo/dark-chocolate.webp",
    video: "/media/video/chocolate.mp4",
    excerptRo: "Un castaniu adânc, cu reflexe reci și luciu de oglindă. De ce e culoarea pe care o cer cel mai des toamna.",
    excerptRu: "Глубокий каштан с холодными рефлексами и зеркальным блеском. Почему его чаще всего просят осенью.",
    bodyRo: `Dark Chocolate e un castaniu adânc, aproape negru în umbră și cald în lumină. Toamna și iarna e culoarea pe care o cer cel mai des.

## De ce funcționează

Un ton închis reflectă lumina mai uniform decât unul deschis. Asta înseamnă luciu — iar luciul face ca părul să pară mai des și mai sănătos.

## Cui i se potrivește

Aproape oricui: pe pielea deschisă dă contrast de film, pe pielea măslinie arată cald și bogat. Merge cu bretonul greu și cu bobul drept.

> Culoarea închisă iartă mult, dar nu iartă vârfurile uscate. De aceea o facem mereu împreună cu o tunsoare sau o corecție.

## Cum o păstrezi

- spală cu apă călduță, nu fierbinte;
- folosește o mască nuanțatoare o dată pe săptămână;
- protejează-l de soare și de placa fierbinte;
- revino pentru gloss la 6–8 săptămâni.`,
    bodyRu: `Dark Chocolate — глубокий каштан: почти чёрный в тени и тёплый на свету. Осенью и зимой его просят чаще всего.

## Почему он работает

Тёмный тон отражает свет равномернее светлого. Это значит блеск — а блеск делает волосы визуально гуще и здоровее.

## Кому подходит

Почти всем: на светлой коже даёт киношный контраст, на оливковой выглядит тёплым и насыщенным. Хорошо сочетается с плотной чёлкой и прямым бобом.

> Тёмный цвет многое прощает, но не прощает сухие кончики. Поэтому мы всегда делаем его вместе со стрижкой или коррекцией.

## Как сохранить

- мойте тёплой, а не горячей водой;
- раз в неделю используйте тонирующую маску;
- защищайте волосы от солнца и горячего утюжка;
- приходите на глосс каждые 6–8 недель.`,
  },
  {
    slug: "culoarea-intre-vizite",
    titleRo: "Cum îți păstrezi culoarea între vizite",
    titleRu: "Как сохранить цвет между визитами",
    topicRo: "Îngrijire",
    topicRu: "Уход",
    readingMin: 3,
    cover: "/media/photo/wash-ritual.webp",
    excerptRo: "Șase obiceiuri mici care fac diferența între o culoare care se stinge în trei săptămâni și una care rămâne vie trei luni.",
    excerptRu: "Шесть маленьких привычек, которые отличают цвет, тускнеющий за три недели, от цвета, живущего три месяца.",
    bodyRo: `Culoarea nu se pierde la salon. Se pierde acasă, la duș, puțin câte puțin. Iată șase obiceiuri care o țin vie.

## 1. Așteaptă 48 de ore

Prima spălare la două zile după vopsire. Cuticula are nevoie de timp să se închidă peste pigment.

## 2. Apa călduță

Apa fierbinte deschide firul și scoate culoarea. Clătirea finală — rece.

## 3. Mai puțin șampon

Spală scalpul, nu lungimile. Spuma care curge pe lungimi e suficientă.

## 4. Protecție termică, mereu

Placa și ondulatorul „ard” tonul, mai ales pe blond. Fără protecție, nuanța se îngălbenește.

## 5. Gloss la 6–8 săptămâni

O nuanțare scurtă readuce luciul și tonul fără să mai vopsești rădăcina.

## 6. Prosopul de microfibră

Nu freca. Presează. Firul ud e cel mai fragil.

> Îngrijirea de acasă face jumătate din lucrare. Cealaltă jumătate o facem noi.`,
    bodyRu: `Цвет теряется не в салоне. Он уходит дома, в душе, понемногу. Вот шесть привычек, которые сохраняют его живым.

## 1. Подождите 48 часов

Первое мытьё — через два дня после окрашивания. Кутикуле нужно время, чтобы закрыться над пигментом.

## 2. Тёплая вода

Горячая вода раскрывает волос и вымывает цвет. Последнее ополаскивание — прохладной.

## 3. Меньше шампуня

Мойте кожу головы, а не длину. Пены, стекающей по длине, достаточно.

## 4. Термозащита — всегда

Утюжок и плойка «выжигают» тон, особенно на блонде. Без защиты оттенок желтеет.

## 5. Глосс каждые 6–8 недель

Короткое тонирование возвращает блеск и тон без окрашивания корней.

## 6. Полотенце из микрофибры

Не трите. Промакивайте. Влажный волос — самый хрупкий.

> Домашний уход — половина работы. Другую половину делаем мы.`,
  },
];
