import type { Topic } from '../types';

export const sinir: Topic = {
  id: 'sinir',
  title: 'Sinir Sistemi',
  icon: 'flash-outline',
  color: '#8E44AD',
  summary:
    'Beyin lobları, beyin sapı, beyincik, meninksler, omurilik, 12 kranial sinir, spinal sinirler ve otonom sinir sistemi.',
  sections: [
    {
      title: 'Bölümleri',
      bullets: [
        'Merkezi sinir sistemi (MSS): beyin (encephalon) + omurilik (medulla spinalis)',
        'Periferik sinir sistemi (PSS): 12 çift kranial sinir + 31 çift spinal sinir + gangliyonlar',
        'Fonksiyonel olarak: somatik (istemli) ve otonom (istemsiz: sempatik + parasempatik)',
        'Nöron: dendrit (uyarı alır), hücre gövdesi, akson (uyarı iletir); miyelin kılıf iletimi hızlandırır',
      ],
    },
    {
      title: 'Beyin (cerebrum) lobları',
      bullets: [
        'Lobus frontalis: istemli hareket (gyrus precentralis – primer motor korteks), kişilik, planlama; Broca alanı (konuşma üretimi, genellikle sol)',
        'Lobus parietalis: dokunma, ağrı, ısı duyusu (gyrus postcentralis – primer duyu korteksi)',
        'Lobus temporalis: işitme, hafıza; Wernicke alanı (konuşmayı anlama)',
        'Lobus occipitalis: görme',
        'Insula: tat, iç organ duyuları',
        'Sulcus centralis frontal ve parietal lobu ayırır; sulcus lateralis temporal lobu ayırır',
        'Corpus callosum iki hemisferi birbirine bağlar',
      ],
    },
    {
      title: 'Diencephalon, beyin sapı ve beyincik',
      bullets: [
        'Thalamus: koku hariç tüm duyuların korteks öncesi aktarma merkezi',
        'Hypothalamus: vücut ısısı, açlık-susama, hormon düzenlemesi (hipofizi kontrol eder), oksitosin ve ADH üretimi',
        'Beyin sapı: mesencephalon (orta beyin), pons, medulla oblongata — solunum ve kalp merkezleri medulla oblongata\'dadır',
        'Kranial sinirlerin III–XII\'si beyin sapından çıkar',
        'Cerebellum (beyincik): denge, koordinasyon, kas tonusu',
      ],
    },
    {
      title: 'Meninksler ve BOS',
      bullets: [
        'Dıştan içe: dura mater – arachnoidea mater – pia mater',
        'Spatium epidurale: dura ile kemik arası (omurgada) — epidural anestezi buraya yapılır',
        'Spatium subarachnoideum: araknoid ile pia arası; BOS (beyin omurilik sıvısı) burada dolaşır — spinal anestezi ve lomber ponksiyon buraya yapılır',
        'BOS ventriküllerdeki plexus choroideus tarafından üretilir; toplam ~150 mL, günde ~500 mL yapılır',
        'Ventriküller: 2 lateral ventrikül → 3. ventrikül → aqueductus cerebri → 4. ventrikül → subaraknoid aralık',
      ],
    },
    {
      title: 'Omurilik (medulla spinalis)',
      bullets: [
        'Foramen magnum\'dan başlar; erişkinde L1–L2 hizasında conus medullaris ile sonlanır (yenidoğanda ~L3)',
        'Conus\'tan sonra sinir kökleri cauda equina (at kuyruğu) olarak devam eder',
        'Kesitte gri cevher içte (H/kelebek şekli), ak cevher dışta (beyinin tersi)',
        'Ön boynuz motor, arka boynuz duyusal nöronları içerir',
        '31 çift spinal sinir: 8 servikal, 12 torakal, 5 lumbal, 5 sakral, 1 koksigeal',
      ],
    },
    {
      title: 'Spinal sinir pleksusları',
      bullets: [
        'Plexus cervicalis (C1–C4): n. phrenicus (C3–C5) diaframa gider',
        'Plexus brachialis (C5–T1): n. musculocutaneus, n. axillaris, n. radialis, n. medianus, n. ulnaris',
        'Plexus lumbalis (L1–L4): n. femoralis (uyluk ön), n. obturatorius (uyluk iç)',
        'Plexus sacralis (L4–S4): n. ischiadicus (vücudun en kalın ve en uzun siniri), n. pudendus (S2–S4)',
        'Dermatom: bir spinal sinirin innerve ettiği deri alanı (örn. göbek T10, meme başı T4)',
      ],
    },
    {
      title: '12 kranial sinir',
      bullets: [
        'I – N. olfactorius: koku (duyusal)',
        'II – N. opticus: görme (duyusal)',
        'III – N. oculomotorius: göz hareketlerinin çoğu, göz kapağını kaldırma, pupilla daralması (motor)',
        'IV – N. trochlearis: m. obliquus superior (motor) — en ince kranial sinir',
        'V – N. trigeminus: yüz duyusu + çiğneme kasları (karışık) — en kalın kranial sinir; V1 ophthalmicus, V2 maxillaris, V3 mandibularis',
        'VI – N. abducens: m. rectus lateralis, gözü dışa çevirir (motor)',
        'VII – N. facialis: mimik kasları, dilin ön 2/3 tat, gözyaşı ve tükürük bezleri (karışık)',
        'VIII – N. vestibulocochlearis: işitme ve denge (duyusal)',
        'IX – N. glossopharyngeus: dilin arka 1/3 tat, yutma, parotis bezi (karışık)',
        'X – N. vagus: boyun, göğüs ve karın organlarının parasempatik innervasyonu, larinks (karışık) — en uzun dağılımlı kranial sinir',
        'XI – N. accessorius: m. sternocleidomastoideus ve m. trapezius (motor)',
        'XII – N. hypoglossus: dil kasları (motor)',
      ],
    },
    {
      title: 'Otonom sinir sistemi',
      bullets: [
        'Sempatik ("savaş ya da kaç"): torakolumbal çıkış (T1–L2); kalp hızı ↑, bronş dilatasyonu, pupilla genişlemesi, sindirim ↓',
        'Parasempatik ("dinlen ve sindir"): kraniosakral çıkış (kranial sinir III, VII, IX, X + S2–S4); kalp hızı ↓, sindirim ↑, pupilla daralması',
        'N. vagus parasempatik liflerin ~%75\'ini taşır',
        'Mesanenin boşaltılması ve uterus/pelvis organları sakral parasempatik (S2–S4) kontrol altındadır',
      ],
    },
  ],
  clinical: [
    'Doğum ağrısı: 1. evrede uterus ve serviks ağrısı T10–L1 segmentlerine, 2. evrede perine ağrısı n. pudendus ile S2–S4\'e taşınır. Epidural analjezi bu segmentleri hedefler.',
    'Lomber ponksiyon ve spinal anestezi, omuriliğin bittiği yerin altında L3–L4 veya L4–L5 aralığından yapılır (iki crista iliaca\'yı birleştiren Tuffier hattı ≈ L4).',
    'Nöral tüp defektlerini (spina bifida, anensefali) önlemek için gebelik öncesinden başlayarak folik asit kullanılması önerilir.',
    'Doğum travmasında plexus brachialis üst köklerinin (C5–C6) zedelenmesi Erb paralizisine yol açar ("garson bahşişi" pozisyonu).',
  ],
  mnemonics: [
    {
      title: '12 kranial sinir (sırası)',
      hook: 'Ormanda Oturan Otuz Tavşan Tatlı Armut, Fındık, Ve Greyfurt, Vişne, Ayva, Havuç yedi',
      explanation:
        'Olfactorius, Opticus, Oculomotorius, Trochlearis, Trigeminus, Abducens, Facialis, Vestibulocochlearis, Glossopharyngeus, Vagus, Accessorius, Hypoglossus.',
    },
    {
      title: 'Kranial sinir tipleri',
      hook: 'DD MM K M K D KK MM',
      explanation:
        'D = duyusal, M = motor, K = karışık. I D, II D, III M, IV M, V K, VI M, VII K, VIII D, IX K, X K, XI M, XII M.',
    },
    {
      title: 'Meninksler (dıştan içe)',
      hook: 'DAP – Dura, Araknoid, Pia ("Dışarıda Ayakkabı, Pabuç içte")',
      explanation: 'Dura mater en dışta, pia mater beyne yapışık en içte.',
    },
    {
      title: 'Plexus brachialis düzeni',
      hook: 'Kırmızı Trenle Dört Kişi Döndü',
      explanation: 'Kökler – Trunkuslar – Divizyonlar – Kordlar (fasciculus) – Dallar.',
    },
    {
      title: 'Göz kasları',
      hook: 'LR6 SO4, gerisi 3',
      explanation: 'Lateral rektus VI. (abducens), superior oblik IV. (trochlearis), diğer göz kasları III. (oculomotorius) sinir.',
    },
  ],
  cards: [
    { q: 'MSS\'yi oluşturan yapılar?', a: 'Beyin ve omurilik' },
    { q: 'Kaç çift spinal sinir vardır?', a: '31' },
    { q: 'Primer motor korteks hangi lobdadır?', a: 'Lobus frontalis (gyrus precentralis)' },
    { q: 'Görme merkezi hangi lobdadır?', a: 'Lobus occipitalis' },
    { q: 'Konuşmayı anlama merkezi?', a: 'Wernicke alanı' },
    { q: 'Konuşma üretim merkezi?', a: 'Broca alanı' },
    { q: 'Solunum ve kalp merkezlerinin bulunduğu yer?', a: 'Medulla oblongata' },
    { q: 'Denge ve koordinasyon merkezi?', a: 'Cerebellum' },
    { q: 'Hipofizi kontrol eden yapı?', a: 'Hypothalamus' },
    { q: 'En dıştaki meninks?', a: 'Dura mater' },
    { q: 'BOS\'un dolaştığı aralık?', a: 'Spatium subarachnoideum' },
    { q: 'Epidural anestezinin yapıldığı aralık?', a: 'Spatium epidurale' },
    { q: 'BOS\'u üreten yapı?', a: 'Plexus choroideus' },
    { q: 'Erişkinde omurilik hangi seviyede sonlanır?', a: 'L1–L2' },
    { q: 'Vücudun en kalın siniri?', a: 'N. ischiadicus' },
    { q: 'Yüzün duyusunu taşıyan kranial sinir?', a: 'N. trigeminus (V)' },
    { q: 'Mimik kaslarını innerve eden kranial sinir?', a: 'N. facialis (VII)' },
    { q: 'Gözü dışa çeviren kası innerve eden sinir?', a: 'N. abducens (VI)' },
    { q: 'Parasempatik liflerin çoğunu taşıyan sinir?', a: 'N. vagus (X)' },
    { q: 'Dil kaslarını innerve eden sinir?', a: 'N. hypoglossus (XII)' },
    { q: 'Sempatik sistemin çıkış seviyesi?', a: 'Torakolumbal (T1–L2)' },
    { q: 'Doğumda C5–C6 kök hasarına bağlı felç?', a: 'Erb paralizisi' },
    { q: 'Nöral tüp defektini önlemek için verilen vitamin?', a: 'Folik asit' },
  ],
};

export const endokrin: Topic = {
  id: 'endokrin',
  title: 'Endokrin Sistem',
  icon: 'flask-outline',
  color: '#00897B',
  summary: 'Hipotalamus-hipofiz ekseni, tiroid, paratiroid, adrenal bezler, pankreas, gonadlar ve plasenta hormonları.',
  sections: [
    {
      title: 'Hipotalamus ve hipofiz',
      bullets: [
        'Hipofiz (gl. pituitaria) sella turcica\'da (os sphenoidale) yer alır; hipotalamusa infundibulum ile bağlıdır',
        'Ön hipofiz (adenohipofiz): GH (büyüme), PRL (prolaktin), TSH, ACTH, FSH, LH',
        'Arka hipofiz (nörohipofiz): ADH (vazopressin) ve oksitosin — hipotalamusta üretilir, arka hipofizde depolanıp salınır',
        'Oksitosin: doğumda uterus kasılması ve süt atılımı',
        'FSH: folikül gelişimi; LH: ovülasyonu tetikler (LH piki) ve corpus luteum\'u destekler',
      ],
    },
    {
      title: 'Tiroid ve paratiroid',
      bullets: [
        'Tiroid: larinks ve trakeanın önünde; iki lob ve isthmus (2.–4. trakea halkaları önünde)',
        'Folikül hücreleri T3 ve T4 (metabolizma), parafoliküler C hücreleri kalsitonin (kan Ca ↓) salgılar',
        'Paratiroid bezleri: genellikle 4 adet, tiroidin arka yüzünde; PTH (parathormon) kan kalsiyumunu ↑',
        'Gebelikte ve yenidoğanda tiroid hormonu beyin gelişimi için kritiktir; yenidoğanda topuk kanı ile hipotiroidi taraması yapılır',
      ],
    },
    {
      title: 'Böbrek üstü (adrenal) bezleri',
      bullets: [
        'Böbreklerin üst kutbunda, retroperitoneal',
        'Korteks (dıştan içe): zona glomerulosa – mineralokortikoid (aldosteron); zona fasciculata – glukokortikoid (kortizol); zona reticularis – androjenler',
        'Medulla: adrenalin (epinefrin) ve noradrenalin — sempatik sistemle birlikte çalışır',
      ],
    },
    {
      title: 'Diğer endokrin dokular',
      bullets: [
        'Epifiz (gl. pinealis): melatonin — uyku-uyanıklık döngüsü',
        'Pankreas Langerhans adacıkları: insülin (β), glukagon (α), somatostatin (δ)',
        'Over: östrojen, progesteron, inhibin; testis: testosteron, inhibin',
        'Timus: timozin (T lenfosit olgunlaşması)',
        'Böbrek: eritropoietin (EPO) ve renin',
      ],
    },
    {
      title: 'Plasenta hormonları',
      bullets: [
        'hCG: gebelik testlerinde ölçülen hormon; ilk trimesterde corpus luteum\'u destekler, 8–10. haftada pik yapar',
        'hPL (insan plasental laktojeni): anne insülin direncini artırarak fetüse glukoz sağlar',
        'Progesteron: gebeliği sürdürür, uterusu gevşetir',
        'Östrojen (özellikle östriol): uterus büyümesi, meme gelişimi',
      ],
    },
  ],
  clinical: [
    'Gebelik diyabeti (GDM) hPL ve diğer plasental hormonların oluşturduğu insülin direnciyle ilişkilidir; 24–28. haftalarda tarama yapılır.',
    'Sentetik oksitosin doğum indüksiyonu ve postpartum kanama önlenmesinde kullanılır.',
  ],
  mnemonics: [
    {
      title: 'Ön hipofiz hormonları',
      hook: 'FLAT PiG',
      explanation: 'FSH, LH, ACTH, TSH, PRL (Prolaktin), GH.',
    },
    {
      title: 'Adrenal korteks',
      hook: 'GFR → Tuz, Şeker, Seks (dıştan içe)',
      explanation:
        'Zona Glomerulosa – aldosteron (tuz), zona Fasciculata – kortizol (şeker), zona Reticularis – androjen (seks).',
    },
    {
      title: 'Arka hipofiz',
      hook: 'Arka hipofiz "O-A": Oksitosin ve ADH',
      explanation: 'İkisi de hipotalamusta yapılır, arka hipofizden salınır.',
    },
  ],
  cards: [
    { q: 'Hipofizin yerleştiği kemik çukur?', a: 'Sella turcica' },
    { q: 'Arka hipofizden salınan hormonlar?', a: 'Oksitosin ve ADH' },
    { q: 'Ovülasyonu tetikleyen hormon?', a: 'LH (LH piki)' },
    { q: 'Folikül gelişimini uyaran hormon?', a: 'FSH' },
    { q: 'Kan kalsiyumunu artıran hormon?', a: 'Parathormon (PTH)' },
    { q: 'Kan kalsiyumunu düşüren hormon?', a: 'Kalsitonin' },
    { q: 'Kalsitonin salgılayan hücreler?', a: 'Tiroidin parafoliküler (C) hücreleri' },
    { q: 'Aldosteron salgılayan adrenal katman?', a: 'Zona glomerulosa' },
    { q: 'Kortizol salgılayan adrenal katman?', a: 'Zona fasciculata' },
    { q: 'Adrenalin salgılayan bölüm?', a: 'Adrenal medulla' },
    { q: 'Melatonin salgılayan bez?', a: 'Epifiz (gl. pinealis)' },
    { q: 'Gebelik testinde ölçülen hormon?', a: 'hCG' },
    { q: 'Annede insülin direncini artıran plasental hormon?', a: 'hPL' },
    { q: 'Gebeliği sürdüren temel hormon?', a: 'Progesteron' },
  ],
};

export const duyu: Topic = {
  id: 'duyu',
  title: 'Duyu Organları ve Deri',
  icon: 'eye-outline',
  color: '#1E88E5',
  summary: 'Göz, kulak, koku, tat ve deri katmanları.',
  sections: [
    {
      title: 'Göz (bulbus oculi)',
      bullets: [
        'Dış katman (tunica fibrosa): sclera (beyaz, arka 5/6) ve cornea (saydam, ön 1/6; damarsızdır)',
        'Orta katman (tunica vasculosa / uvea): choroidea, corpus ciliare (lens uyumu, humor aquosus üretimi), iris (pupilla çapını ayarlar)',
        'İç katman (retina): çubuk hücreleri (karanlıkta görme), koni hücreleri (renkli ve net görme)',
        'Macula lutea ve ortasındaki fovea centralis: en keskin görme noktası (yalnızca koni)',
        'Discus nervi optici: fotoreseptör yok — kör nokta',
        'Lens: yakın-uzak uyumu; humor aquosus ön kamarada, corpus vitreum lens arkasında',
        'Humor aquosus Schlemm kanalı ile drene olur; drenaj bozulursa göz içi basıncı artar (glokom)',
        'Gözyaşı bezi (gl. lacrimalis) gözün üst-dış köşesinde',
      ],
    },
    {
      title: 'Kulak',
      bullets: [
        'Dış kulak: auricula (kulak kepçesi), meatus acusticus externus, membrana tympanica (kulak zarı)',
        'Orta kulak: kulak kemikçikleri malleus (çekiç) → incus (örs) → stapes (üzengi); stapes fenestra vestibuli\'ye (oval pencere) oturur',
        'Tuba auditiva (Östaki) orta kulağı nazofarinkse bağlar, basıncı dengeler',
        'İç kulak: cochlea (işitme; Corti organı) ve vestibül + canales semicirculares (denge)',
      ],
    },
    {
      title: 'Koku ve tat',
      bullets: [
        'Koku reseptörleri burun boşluğunun tavanındaki regio olfactoria\'da; n. olfactorius (I) ile iletilir',
        'Tat tomurcukları dil papillalarında: dilin ön 2/3\'ü n. facialis (VII), arka 1/3\'ü n. glossopharyngeus (IX)',
        'Temel tatlar: tatlı, tuzlu, ekşi, acı, umami',
      ],
    },
    {
      title: 'Deri (integumentum commune)',
      bullets: [
        'Epidermis (çok katlı yassı keratinize epitel, damarsız) – dermis (bağ dokusu, damar, sinir, kıl kökü, bezler) – hipodermis (subkutan yağ dokusu)',
        'Epidermis katmanları (derinden yüzeye): stratum basale, spinosum, granulosum, lucidum (sadece kalın deride: avuç içi, ayak tabanı), corneum',
        'Melanosit (stratum basale): melanin pigmenti',
        'Bezler: ter bezleri (ekrin ve apokrin) ve yağ bezleri (sebase)',
      ],
    },
  ],
  clinical: [
    'Yenidoğanda Östaki borusu kısa, geniş ve yatay olduğundan sırtüstü beslenmede orta kulak enfeksiyonu (otitis media) riski artar.',
    'Gebelikte melanin artışı: areola koyulaşması, linea nigra (linea alba\'nın kararması), yüzde kloazma (gebelik maskesi). Derinin gerilmesiyle stria gravidarum (çatlak) oluşur.',
    'Yenidoğanda deri ince ve subkutan yağ azdır; ısı kaybı kolaydır — ten tene temas önemlidir.',
  ],
  mnemonics: [
    {
      title: 'Kulak kemikçikleri',
      hook: 'Çekiçle Örse vurdum, Üzengi fırladı (ÇÖÜ)',
      explanation: 'Dıştan içe: malleus (çekiç), incus (örs), stapes (üzengi).',
    },
    {
      title: 'Epidermis katmanları (derinden yüzeye)',
      hook: 'Bütün Sabah Gülüp Lafladık, Coştuk',
      explanation: 'Stratum Basale, Spinosum, Granulosum, Lucidum, Corneum.',
    },
    {
      title: 'Çubuk mu koni mi?',
      hook: 'Koni = Kolor (renk), Çubuk = Çok karanlıkta',
      explanation: 'Koniler renkli görme, çubuklar loş ışıkta görme sağlar.',
    },
  ],
  cards: [
    { q: 'Gözün saydam, damarsız ön tabakası?', a: 'Cornea' },
    { q: 'En keskin görme noktası?', a: 'Fovea centralis' },
    { q: 'Kör noktanın yeri?', a: 'Discus nervi optici' },
    { q: 'Renkli görmeyi sağlayan hücreler?', a: 'Koni hücreleri' },
    { q: 'Loş ışıkta görmeyi sağlayan hücreler?', a: 'Çubuk hücreleri' },
    { q: 'Humor aquosus\'u üreten yapı?', a: 'Corpus ciliare' },
    { q: 'Pupilla çapını ayarlayan yapı?', a: 'Iris' },
    { q: 'Oval pencereye oturan kemikçik?', a: 'Stapes' },
    { q: 'Orta kulağı nazofarinkse bağlayan kanal?', a: 'Tuba auditiva (Östaki borusu)' },
    { q: 'İşitme organı?', a: 'Cochlea (Corti organı)' },
    { q: 'Dengeden sorumlu iç kulak yapıları?', a: 'Vestibül ve semisirküler kanallar' },
    { q: 'Dilin ön 2/3 tat duyusunu taşıyan sinir?', a: 'N. facialis (VII)' },
    { q: 'Epidermisin en derin katmanı?', a: 'Stratum basale' },
    { q: 'Sadece kalın deride bulunan epidermis katmanı?', a: 'Stratum lucidum' },
    { q: 'Gebelikte linea alba\'nın kararmasına ne denir?', a: 'Linea nigra' },
  ],
};
