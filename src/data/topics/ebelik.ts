import type { Topic } from '../types';

export const pelvis: Topic = {
  id: 'pelvis',
  title: 'Pelvis ve Pelvis Tabanı',
  icon: 'ellipse-outline',
  color: '#C2185B',
  summary:
    'Doğum kanalının kemik yapısı, pelvis tipleri, obstetrik çaplar, pelvis tabanı kasları ve perine. Ebeliğin en kritik anatomi konusu.',
  sections: [
    {
      title: 'Kemik pelvis',
      bullets: [
        'İki os coxae (ilium + ischium + pubis), sacrum ve coccyx\'ten oluşur',
        'Önde symphysis pubica, arkada iki art. sacroiliaca ile halka şeklinde birleşir',
        'Önemli noktalar: promontorium (S1\'in ön üst kenarı), spina iliaca anterior superior (SİAS), spina ischiadica, tuber ischiadicum, arcus pubis',
        'Linea terminalis (promontorium → linea arcuata → pecten pubis → symphysis üst kenarı) pelvisi ikiye ayırır',
        'Pelvis major (büyük/yalancı pelvis): linea terminalis\'in üstü, karın organlarını taşır',
        'Pelvis minor (küçük/gerçek pelvis): linea terminalis\'in altı — DOĞUM KANALI budur',
      ],
    },
    {
      title: 'Pelvis tipleri (Caldwell–Moloy)',
      bullets: [
        'Jinekoid: kadınlarda en sık (~%50); giriş yuvarlak — normal doğum için en uygun',
        'Android: erkek tipi; giriş kalp şeklinde, yan duvarlar daralır — doğum güçlüğü',
        'Antropoid: giriş oval, ön-arka çap transversten uzun — oksiput posterior gelişe yatkın',
        'Platipelloid: yassı; transvers çap geniş, ön-arka çap kısa — en nadir tip',
      ],
    },
    {
      title: 'Kadın ve erkek pelvisi farkları',
      bullets: [
        'Kadında pelvis girişi daha geniş ve yuvarlak, erkekte kalp şeklinde',
        'Kadında arcus pubis açısı geniş (>80–90°), erkekte dar (~60°)',
        'Kadında pelvis daha sığ ve geniş, kemikler daha ince',
        'Kadında sacrum daha kısa ve geniş, spina ischiadica\'lar daha az içe çıkıntılı',
      ],
    },
    {
      title: 'Obstetrik çaplar (yaklaşık değerler)',
      body: ['Fetüs başı doğum sırasında bu üç düzlemden geçer: giriş (apertura pelvis superior), orta pelvis ve çıkış (apertura pelvis inferior).'],
      bullets: [
        'Giriş – conjugata vera (anatomik): promontorium → symphysis üst kenarı, ~11 cm',
        'Giriş – conjugata obstetrica: promontorium → symphysis arka yüzünün en yakın noktası, ~10,5–11 cm; girişin en kısa ön-arka çapı (bebeğin geçmek zorunda olduğu)',
        'Giriş – conjugata diagonalis: promontorium → symphysis alt kenarı, ~12,5 cm; vajinal muayenede ölçülebilen tek çap. Obstetrik konjugat ≈ diagonal − 1,5/2 cm',
        'Giriş – transvers çap ~13 cm (girişin en uzun çapı), oblik çap ~12,5 cm',
        'Orta pelvis – interspinöz çap (iki spina ischiadica arası) ~10 cm: pelvisin EN DAR çapı',
        'Çıkış – intertüberöz çap (iki tuber ischiadicum arası) ~11 cm; ön-arka çap ~11,5 cm (koksiks geriye itilince artar)',
        'Spina ischiadica\'lar fetal başın inişini (station/seviye) değerlendirmede referanstır: spina hizası = 0 seviyesi',
      ],
    },
    {
      title: 'Pelvis tabanı (diaphragma pelvis)',
      bullets: [
        'M. levator ani: m. pubococcygeus (m. puborectalis dahil) + m. iliococcygeus',
        'M. coccygeus (ischiococcygeus)',
        'Görevi: pelvis organlarını desteklemek, kontinans sağlamak; doğumda fetal başın rotasyonuna yardım eder',
        'M. puborectalis rektumu öne çekerek anorektal açıyı oluşturur (fekal kontinans)',
      ],
    },
    {
      title: 'Perine (perineum)',
      bullets: [
        'Symphysis pubica, iki tuber ischiadicum ve coccyx arasında elmas şeklinde bölge',
        'Önde regio urogenitalis (üçgen), arkada regio analis (üçgen)',
        'Yüzeyel perine kasları: m. bulbospongiosus, m. ischiocavernosus, m. transversus perinei superficialis',
        'Derin perine kasları: m. transversus perinei profundus, m. sphincter urethrae externus',
        'Centrum tendineum perinei (perine cisimciği): vajina ile anüs arasındaki fibromüsküler düğüm noktası; perine kaslarının çoğu buraya tutunur',
        'M. sphincter ani externus: anal kanalı çevreler — 3. ve 4. derece yırtıklarda hasar görür',
        'Sinir: n. pudendus (S2–S4); kan: a. pudenda interna (a. iliaca interna dalı)',
      ],
    },
    {
      title: 'Perine yırtıkları',
      bullets: [
        '1. derece: sadece perine derisi ve vajina mukozası',
        '2. derece: perine kasları da yırtılmış, anal sfinkter sağlam',
        '3. derece: anal sfinkter kompleksi yırtılmış',
        '4. derece: anal sfinkter + rektum mukozası (anal epitel) yırtılmış',
      ],
    },
  ],
  clinical: [
    'Epizyotomi genellikle mediolateral yapılır; centrum tendineum ve anal sfinkterden uzaklaşarak 3.–4. derece yırtık riskini azaltır.',
    'Pudendal blok, spina ischiadica\'nın hemen altından n. pudendus\'a yapılır (vajinal yolla parmakla spina bulunur).',
    'Orta pelvisteki interspinöz çap en dar yer olduğundan baş takılmaları (derin transvers arrest) burada olur.',
    'Pelvis tabanı kas egzersizleri (Kegel) doğum sonrası inkontinansı önlemede kullanılır.',
  ],
  mnemonics: [
    {
      title: 'Pelvis tipleri',
      hook: 'JAAP – Jinekoid Ana, Android Abi, Antropoid Amca, Platipelloid Pek nadir',
      explanation: 'Jinekoid en sık ve doğuma en uygun; android erkek tipi; antropoid oval; platipelloid yassı ve en nadir.',
    },
    {
      title: 'Konjugatlar',
      hook: 'Diagonal en uzun, Obstetrik en kısa: D 12,5 – V 11 – O 10,5',
      explanation: 'Conjugata diagonalis ~12,5 cm (muayenede ölçülür), vera ~11 cm, obstetrica ~10,5 cm (bebeğin geçtiği en dar ön-arka çap).',
    },
    {
      title: 'Levator ani',
      hook: 'Pubo-Ilio: "PI" sayısı gibi tabanı taşır',
      explanation: 'M. levator ani = m. pubococcygeus (+ puborectalis) ve m. iliococcygeus.',
    },
  ],
  cards: [
    { q: 'Doğum kanalını oluşturan pelvis bölümü?', a: 'Pelvis minor (gerçek pelvis)' },
    { q: 'Pelvis major ve minor\'u ayıran hat?', a: 'Linea terminalis' },
    { q: 'Kadınlarda en sık görülen ve doğuma en uygun pelvis tipi?', a: 'Jinekoid pelvis' },
    { q: 'Erkek tipi, kalp şeklinde girişi olan pelvis?', a: 'Android pelvis' },
    { q: 'En nadir görülen, yassı pelvis tipi?', a: 'Platipelloid pelvis' },
    { q: 'Vajinal muayenede ölçülebilen pelvis çapı?', a: 'Conjugata diagonalis (~12,5 cm)' },
    { q: 'Pelvis girişinin en kısa ön-arka çapı?', a: 'Conjugata obstetrica (~10,5–11 cm)' },
    { q: 'Pelvisin en dar çapı?', a: 'İnterspinöz çap (~10 cm)' },
    { q: 'Fetal baş seviyesi (station) "0" hangi noktaya göre belirlenir?', a: 'Spina ischiadica hizası' },
    { q: 'Pelvis girişinin en uzun çapı?', a: 'Transvers çap (~13 cm)' },
    { q: 'M. levator ani\'yi oluşturan kaslar?', a: 'M. pubococcygeus ve m. iliococcygeus' },
    { q: 'Perine kaslarının toplandığı fibromüsküler yapı?', a: 'Centrum tendineum perinei' },
    { q: 'Perine bölgesini innerve eden sinir?', a: 'N. pudendus (S2–S4)' },
    { q: 'Anal sfinkterin yırtıldığı perine yırtığı derecesi?', a: '3. derece' },
    { q: 'Rektum mukozasına kadar uzanan yırtık?', a: '4. derece' },
    { q: 'Pudendal blokta referans alınan kemik çıkıntı?', a: 'Spina ischiadica' },
    { q: 'Promontorium hangi kemiğe aittir?', a: 'Sacrum (S1)' },
  ],
};

export const kadinUreme: Topic = {
  id: 'kadin-ureme',
  title: 'Kadın Üreme Sistemi',
  icon: 'female-outline',
  color: '#D6457A',
  summary:
    'Dış genital organlar (vulva), vajina, uterus, tubalar ve overler; bağlar, kan damarları ve peritoneal boşluklar.',
  sections: [
    {
      title: 'Dış genital organlar (vulva / pudendum femininum)',
      bullets: [
        'Mons pubis: symphysis önündeki yağ yastığı',
        'Labia majora (büyük dudaklar) ve labia minora (küçük dudaklar)',
        'Clitoris: erektil doku; penisin homoloğu',
        'Vestibulum vaginae: labia minora arasındaki boşluk; içine ostium urethrae externum (önde) ve ostium vaginae (arkada) açılır',
        'Gl. vestibularis major (Bartholin bezi): vajina girişinin saat 4 ve 8 hizasında; kayganlaştırıcı salgı — apse/kist yapabilir',
        'Gll. paraurethrales (Skene bezleri): üretra çevresinde',
        'Hymen: vajina girişindeki ince zar',
      ],
    },
    {
      title: 'Vajina',
      bullets: [
        'Yaklaşık 8–10 cm uzunlukta fibromüsküler kanal; önünde mesane ve üretra, arkasında rektum',
        'Üst ucu serviksi çevreler: fornix anterior, posterior ve lateraller',
        'Fornix posterior en derindir ve excavatio rectouterina (Douglas boşluğu) ile komşudur',
        'Epiteli çok katlı yassı epitel; östrojen etkisiyle glikojen içerir, laktobasiller asidik pH (3,8–4,5) sağlar',
      ],
    },
    {
      title: 'Uterus',
      bullets: [
        'Armut şeklinde, yaklaşık 7,5 × 5 × 2,5 cm, ~50–70 g (gebe olmayan)',
        'Bölümleri: fundus (tubaların üstü), corpus (gövde), isthmus (dar bölge), cervix (boyun)',
        'Normal pozisyon: anteversiyon (serviks–vajina açısı öne) + antefleksiyon (korpus serviks üzerine öne bükük)',
        'Duvar katmanları: endometrium (iç, adet ile dökülen), myometrium (düz kas, doğumda kasılır), perimetrium (dış, seröz)',
        'Serviks: ostium uteri internum ve externum; nullipar kadında dış ağız yuvarlak, multiparda yarık şeklinde',
        'Gebelikte isthmus genişleyerek alt uterin segmenti oluşturur — sezaryen kesisi genellikle buradan yapılır',
      ],
    },
    {
      title: 'Uterus bağları',
      bullets: [
        'Lig. latum uteri (geniş bağ): uterusun iki yanından pelvis duvarına uzanan periton katlantısı; içinde tuba, damarlar, bağlar bulunur',
        'Lig. teres uteri (yuvarlak bağ): uterus köşesinden canalis inguinalis\'ten geçerek labium majus\'a uzanır; uterusu anteversiyonda tutar; gebelikte gerilmesi kasık ağrısı yapar',
        'Lig. cardinale (lig. transversum cervicis, Mackenrodt): serviksi pelvis yan duvarına bağlar; uterusun ana destek bağı',
        'Lig. uterosacrale: serviksi sacruma bağlar',
        'Lig. ovarii proprium: overi uterusa bağlar',
        'Lig. suspensorium ovarii (infundibulopelvik bağ): overi pelvis duvarına bağlar, içinde a./v. ovarica seyreder',
      ],
    },
    {
      title: 'Tuba uterina (Fallop tüpü)',
      bullets: [
        'Yaklaşık 10 cm; bölümleri lateralden mediale: infundibulum (fimbrialar) – ampulla – isthmus – pars uterina (intramural)',
        'Fimbrialar ovülasyonla atılan oositi yakalar',
        'Döllenme genellikle AMPULLADA olur; ektopik gebelik de en sık ampullada görülür',
        'Silyalı epitel ve peristaltizm embriyoyu uterusa taşır',
      ],
    },
    {
      title: 'Ovaryum (yumurtalık)',
      bullets: [
        'Badem şeklinde, yaklaşık 3 × 2 × 1 cm; fossa ovarica\'da',
        'Korteksinde folliküller, medullasında damarlar bulunur',
        'Hormonlar: östrojen (folliküller), progesteron (corpus luteum)',
        'Ovülasyondan sonra kalan follikül corpus luteum\'a dönüşür; gebelik olmazsa corpus albicans olur',
      ],
    },
    {
      title: 'Kan damarları ve lenf',
      bullets: [
        'A. uterina: a. iliaca interna\'nın dalı; serviks yanında üreterin ÖNÜNDEN ve ÜSTÜNDEN çaprazlar',
        'A. ovarica: doğrudan aorta abdominalis\'ten (L2) çıkar',
        'Sağ v. ovarica v. cava inferior\'a, sol v. ovarica sol v. renalis\'e dökülür',
        'Overin lenfi paraaortik lenf düğümlerine, vulvanın lenfi yüzeyel inguinal lenf düğümlerine gider',
      ],
    },
    {
      title: 'Peritoneal boşluklar',
      bullets: [
        'Excavatio vesicouterina: mesane ile uterus arasında (önde, sığ)',
        'Excavatio rectouterina (Douglas boşluğu): uterus ile rektum arasında; ayakta duran kadında periton boşluğunun EN ALÇAK noktası — kan, sıvı ve apse burada toplanır',
      ],
    },
  ],
  clinical: [
    'Histerektomide a. uterina bağlanırken hemen altından geçen üreter yaralanabilir ("köprünün altından su akar").',
    'Rüptüre ektopik gebelikte kan Douglas boşluğunda toplanır; USG\'de burada serbest sıvı aranır.',
    'Gebelikte uterus pelvisten çıkar: 12. haftada symphysis üstünde, 20. haftada göbek hizasında, 36. haftada ksifoide en yakın noktadadır.',
    'Postpartum kanamayı durduran temel mekanizma myometriumdaki kas liflerinin damarları sıkıştırmasıdır ("yaşayan bağlar"). Uterus atonisinde fundus masajı yapılır.',
  ],
  mnemonics: [
    {
      title: 'Uterus katmanları (içten dışa)',
      hook: 'EMP: Endo – Myo – Peri',
      explanation: 'Endometrium (iç), myometrium (kas), perimetrium (seröz dış katman).',
    },
    {
      title: 'Tuba bölümleri (dıştan içe)',
      hook: 'İnce Ayşe İçeri Pasta getirdi: İnfundibulum – Ampulla – İsthmus – Pars uterina',
      explanation: 'Fimbrialı infundibulumdan uterusa doğru sıralama. Döllenme ampullada olur.',
    },
    {
      title: 'Üreter ve a. uterina',
      hook: 'Köprünün altından su akar',
      explanation: 'A. uterina (köprü) üreterin (su) üstünden çaprazlar.',
    },
    {
      title: 'Uterus pozisyonu',
      hook: 'Normal uterus "AA": AnteVersiyon + AnteFleksiyon',
      explanation: 'Uterus öne eğik ve öne bükük durur; retroversiyon normal varyant olabilir.',
    },
  ],
  cards: [
    { q: 'Bartholin bezlerinin yeri?', a: 'Vajina girişinde saat 4 ve 8 hizası' },
    { q: 'Penisin kadındaki homoloğu?', a: 'Clitoris' },
    { q: 'Vajinanın en derin forniksi?', a: 'Fornix posterior' },
    { q: 'Periton boşluğunun en alçak noktası (kadında)?', a: 'Excavatio rectouterina (Douglas)' },
    { q: 'Uterusun normal pozisyonu?', a: 'Anteversiyon ve antefleksiyon' },
    { q: 'Uterusun kas katmanı?', a: 'Myometrium' },
    { q: 'Adet döneminde dökülen uterus katmanı?', a: 'Endometrium (fonksiyonel tabaka)' },
    { q: 'Gebelikte alt uterin segmenti oluşturan bölüm?', a: 'Isthmus uteri' },
    { q: 'Uterusun ana destek bağı?', a: 'Lig. cardinale (Mackenrodt)' },
    { q: 'Canalis inguinalis\'ten geçip labium majus\'a uzanan bağ?', a: 'Lig. teres uteri (yuvarlak bağ)' },
    { q: 'A. ovarica\'nın taşındığı bağ?', a: 'Lig. suspensorium ovarii (infundibulopelvik)' },
    { q: 'Döllenmenin en sık gerçekleştiği yer?', a: 'Tuba uterina ampullası' },
    { q: 'Oositi yakalayan tuba yapıları?', a: 'Fimbrialar' },
    { q: 'A. uterina hangi arterin dalıdır?', a: 'A. iliaca interna' },
    { q: 'A. ovarica nereden çıkar?', a: 'Aorta abdominalis (L2)' },
    { q: 'Sol v. ovarica nereye dökülür?', a: 'Sol v. renalis' },
    { q: 'Histerektomide a. uterina\'nın altından geçen, yaralanabilen yapı?', a: 'Üreter' },
    { q: 'Corpus luteum hangi hormonu salgılar?', a: 'Progesteron (ve östrojen)' },
    { q: 'Gebelikte fundus 20. haftada nerededir?', a: 'Göbek (umbilikus) hizasında' },
  ],
};

export const meme: Topic = {
  id: 'meme',
  title: 'Meme Anatomisi ve Laktasyon',
  icon: 'heart-circle-outline',
  color: '#EC6F9C',
  summary: 'Memenin yeri, iç yapısı, damar ve lenf drenajı; emzirmede rol oynayan hormonlar ve refleksler.',
  sections: [
    {
      title: 'Yeri ve dış yapı',
      bullets: [
        'Dikey olarak 2.–6. kaburgalar, yatay olarak sternum kenarından midaksiller hatta kadar uzanır',
        'M. pectoralis major fasyası üzerinde oturur; aradaki gevşek doku (retromammarian boşluk) memeye hareket sağlar',
        'Cauda axillaris (Spence kuyruğu): koltuk altına uzanan uzantı',
        'Papilla mammae (meme başı) ve areola; areolada gll. areolares (Montgomery bezleri) — yağlı salgıyla meme başını korur',
      ],
    },
    {
      title: 'İç yapı',
      bullets: [
        '15–20 lob, her lob lobüllere, lobüller süt üreten alveollere (asinus) ayrılır',
        'Alveolleri çevreleyen miyoepitel hücreleri kasılarak sütü kanallara iter',
        'Her lobun bir ductus lactiferus\'u meme başına açılır; areola altında genişleyerek sinus lactiferus yapar (güncel USG çalışmalarında belirgin sinüs olmadığı, kanalların genişlediği gösterilmiştir)',
        'Ligg. suspensoria mammae (Cooper bağları): memeyi deriye ve fasyaya asar',
      ],
    },
    {
      title: 'Kan damarları ve lenf',
      bullets: [
        'Arterler: a. thoracica interna (memenin ~%60\'ı), a. thoracica lateralis, interkostal arterler',
        'Lenf drenajının ~%75\'i aksiller lenf düğümlerine, geri kalanı parasternal (internal torasik) düğümlere',
        'Bu nedenle meme kanserinde ilk yayılım genellikle koltuk altı lenf düğümlerinedir',
      ],
    },
    {
      title: 'Laktasyon hormonları',
      bullets: [
        'Prolaktin (ön hipofiz): süt YAPIMI; emme uyarısıyla artar',
        'Oksitosin (arka hipofizden salınır): süt ATILIMI (let-down / süt indirme refleksi) ve uterus kasılması',
        'Gebelikte yüksek progesteron süt salgısını baskılar; doğumda plasenta çıkınca progesteron düşer ve süt gelir',
        'İlk süt kolostrum: protein ve IgA açısından zengindir',
      ],
    },
  ],
  clinical: [
    'Emzirme sırasında salınan oksitosin uterusu kastırır; doğum sonu kanamayı azaltır ve involüsyonu hızlandırır (emzirirken kramp tarzı ağrı olabilir).',
    'Doğru emzirme pozisyonunda bebek sadece meme başını değil areolanın büyük kısmını ağzına almalıdır.',
    'Mastit en sık meme başı çatlaklarından giren Staphylococcus aureus ile olur.',
  ],
  mnemonics: [
    {
      title: 'Prolaktin mi oksitosin mi?',
      hook: 'PROlaktin PROdüksiyon, OKSİtosin OKSİjen gibi fışkırtır (atılım)',
      explanation: 'Prolaktin süt yapımını, oksitosin sütün dışarı atılmasını sağlar.',
    },
  ],
  cards: [
    { q: 'Meme hangi kaburgalar arasında uzanır?', a: '2. ve 6. kaburgalar arası' },
    { q: 'Memenin üzerinde oturduğu kas?', a: 'M. pectoralis major' },
    { q: 'Koltuk altına uzanan meme dokusu?', a: 'Cauda axillaris (Spence kuyruğu)' },
    { q: 'Areoladaki yağ bezlerinin adı?', a: 'Montgomery bezleri (gll. areolares)' },
    { q: 'Memeyi asan bağlar?', a: 'Cooper bağları (ligg. suspensoria mammae)' },
    { q: 'Memede kaç lob bulunur?', a: '15–20' },
    { q: 'Memenin lenf drenajının çoğu nereye gider?', a: 'Aksiller lenf düğümleri' },
    { q: 'Memeyi en çok besleyen arter?', a: 'A. thoracica interna' },
    { q: 'Süt yapımını sağlayan hormon?', a: 'Prolaktin' },
    { q: 'Süt atılım (let-down) refleksini sağlayan hormon?', a: 'Oksitosin' },
    { q: 'Sütü kanallara iten hücreler?', a: 'Miyoepitel hücreleri' },
    { q: 'İlk süte ne ad verilir?', a: 'Kolostrum' },
  ],
};

export const fetal: Topic = {
  id: 'fetal',
  title: 'Fetal Dolaşım ve Fetal Kafatası',
  icon: 'happy-outline',
  color: '#F08A5D',
  summary:
    'Fetal dolaşımdaki şantlar ve doğumdan sonra dönüştükleri yapılar; fontaneller, suturalar ve fetal baş çapları.',
  sections: [
    {
      title: 'Fetal dolaşım',
      body: [
        'Fetüste akciğerler çalışmadığı için oksijen plasentadan gelir. Kan, akciğer ve karaciğeri büyük ölçüde atlayacak şekilde üç şanttan geçer.',
      ],
      bullets: [
        'V. umbilicalis (1 adet): plasentadan fetüse OKSİJENLİ kan taşır',
        'Ductus venosus: göbek venindeki kanın çoğunu karaciğeri atlatarak v. cava inferior\'a aktarır',
        'Foramen ovale: sağ atriumdan sol atriuma geçiş — akciğeri atlar',
        'Ductus arteriosus: truncus pulmonalis\'ten aortaya geçiş — akciğeri atlar',
        'Aa. umbilicales (2 adet): a. iliaca interna\'lardan çıkar, fetüsten plasentaya OKSİJENİ AZ kan taşır',
        'Göbek kordonunda 2 arter + 1 ven bulunur (Wharton jölesi içinde); tek umbilikal arter anomalilerle ilişkili olabilir',
      ],
    },
    {
      title: 'Doğumdan sonra dönüşümler',
      bullets: [
        'V. umbilicalis → lig. teres hepatis (karaciğerin yuvarlak bağı)',
        'Ductus venosus → lig. venosum',
        'Foramen ovale → fossa ovalis (ilk nefesle sol atrium basıncı artınca kapanır)',
        'Ductus arteriosus → lig. arteriosum (oksijen artışı ve prostaglandin düşüşüyle günler içinde kapanır)',
        'Aa. umbilicales → distal kısım lig. umbilicale mediale; proksimal kısım a. vesicalis superior olarak kalır',
      ],
    },
    {
      title: 'Fetal kafatası: suturalar',
      bullets: [
        'Sutura sagittalis: iki parietal kemik arasında — vajinal muayenede başın yönünü bulmada kullanılır',
        'Sutura coronalis: frontal ve parietal kemikler arasında',
        'Sutura lambdoidea: parietaller ile occipital arasında',
        'Sutura frontalis (metopica): iki frontal kemik yarısı arasında',
        'Doğumda suturalar sayesinde kafatası kemikleri üst üste binerek (molding) başın pelvisten geçmesini kolaylaştırır',
      ],
    },
    {
      title: 'Fontaneller (bıngıldaklar)',
      bullets: [
        'Ön fontanel (fonticulus anterior, bregma): elmas/baklava şeklinde, en büyük; 4 sutura birleşir; 18–24 ayda kapanır',
        'Arka fontanel (fonticulus posterior, lambda): üçgen şeklinde, küçük; 3 sutura birleşir; 2–3 ayda kapanır',
        'Ön fontanelin çökük olması dehidratasyonu, kabarık olması kafa içi basınç artışını düşündürür',
      ],
    },
    {
      title: 'Fetal baş çapları (yaklaşık)',
      bullets: [
        'Suboksipitobregmatik ~9,5 cm: tam fleksiyon (verteks geliş) — en uygun, en küçük çap',
        'Biparietal ~9,5 cm: en geniş transvers çap',
        'Bitemporal ~8 cm',
        'Oksipitofrontal ~11,5 cm: başın kısmi fleksiyonu (oksiput posterior)',
        'Mentovertikal (verteks-mental) ~13,5 cm: alın gelişi — en büyük çap, vajinal doğum genellikle mümkün değil',
        'Submentobregmatik ~9,5 cm: yüz gelişi',
      ],
    },
  ],
  clinical: [
    'Vajinal muayenede üçgen şeklindeki arka fontanel önde hissediliyorsa baş iyi flekte ve oksiput anterior pozisyondadır (en uygun).',
    'Prematürelerde ductus arteriosus açık kalabilir (PDA).',
    'Yenidoğanın ilk nefesiyle pulmoner direnç düşer; bu dönüşümü bilmek neonatal resüsitasyonu anlamak için temeldir.',
  ],
  mnemonics: [
    {
      title: 'Göbek kordonu',
      hook: 'AVA: Arter – Ven – Arter (2 arter, 1 ven)',
      explanation: 'Ven oksijenli kanı bebeğe getirir; iki arter kirli kanı plasentaya götürür.',
    },
    {
      title: 'Şantların atladığı organlar',
      hook: 'Venosus karaciğeri, Ovale ile Arteriosus akciğeri atlatır',
      explanation: 'Ductus venosus → karaciğer bypass; foramen ovale ve ductus arteriosus → akciğer bypass.',
    },
    {
      title: 'Fontanel kapanma',
      hook: 'Arka = Az (2–3 ay), Ön = Önemli süre (18–24 ay)',
      explanation: 'Arka (lambda) fontanel erken, ön (bregma) fontanel geç kapanır.',
    },
  ],
  cards: [
    { q: 'Göbek kordonunda kaç arter ve ven vardır?', a: '2 arter, 1 ven' },
    { q: 'Fetüse oksijenli kan taşıyan damar?', a: 'V. umbilicalis' },
    { q: 'Karaciğeri bypass eden fetal şant?', a: 'Ductus venosus' },
    { q: 'Sağ atriumdan sol atriuma geçiş sağlayan açıklık?', a: 'Foramen ovale' },
    { q: 'Truncus pulmonalis\'i aortaya bağlayan fetal yapı?', a: 'Ductus arteriosus' },
    { q: 'V. umbilicalis doğumdan sonra neye dönüşür?', a: 'Lig. teres hepatis' },
    { q: 'Ductus venosus doğumdan sonra neye dönüşür?', a: 'Lig. venosum' },
    { q: 'Foramen ovale doğumdan sonra neye dönüşür?', a: 'Fossa ovalis' },
    { q: 'Ductus arteriosus doğumdan sonra neye dönüşür?', a: 'Lig. arteriosum' },
    { q: 'Umbilikal arterlerin distal kısmı neye dönüşür?', a: 'Lig. umbilicale mediale' },
    { q: 'Ön fontanel ne zaman kapanır?', a: '18–24 ay' },
    { q: 'Arka fontanel ne zaman kapanır?', a: '2–3 ay' },
    { q: 'Üçgen şeklindeki fontanel?', a: 'Arka fontanel (lambda)' },
    { q: 'İki parietal kemik arasındaki sutura?', a: 'Sutura sagittalis' },
    { q: 'Tam flekte verteks gelişte geçen baş çapı?', a: 'Suboksipitobregmatik (~9,5 cm)' },
    { q: 'En büyük fetal baş çapı (alın gelişi)?', a: 'Mentovertikal (~13,5 cm)' },
    { q: 'Doğumda kafatası kemiklerinin üst üste binmesine ne denir?', a: 'Molding (şekillenme)' },
  ],
};
