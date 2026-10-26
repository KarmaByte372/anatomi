import type { Topic } from '../types';

export const giris: Topic = {
  id: 'giris',
  title: 'Anatomiye Giriş ve Terminoloji',
  icon: 'compass-outline',
  color: '#7C5CBF',
  summary:
    'Anatomik pozisyon, vücut düzlemleri, yön ve hareket terimleri. Bütün konuların temeli burası — önce bunu oturt.',
  sections: [
    {
      title: 'Anatomik pozisyon',
      body: [
        'Bütün anatomik tarifler, vücut "anatomik pozisyonda" kabul edilerek yapılır. Böylece kişi yatsa da, otursa da aynı terimler kullanılır.',
      ],
      bullets: [
        'Ayakta dik duruş, yüz ve gözler karşıya bakar',
        'Kollar gövdenin yanında, avuç içleri öne dönük',
        'Ayaklar birbirine paralel, parmak uçları önde',
        'Sağ / sol daima HASTANIN sağı ve solu kastedilir',
      ],
    },
    {
      title: 'Vücut düzlemleri',
      bullets: [
        'Sagittal (median) düzlem: vücudu tam ortadan sağ ve sol iki eşit yarıya ayırır. Ortaya paralel olanlara parasagittal denir.',
        'Frontal (koronal) düzlem: vücudu ön (anterior) ve arka (posterior) olarak ayırır.',
        'Transvers (horizontal / aksiyel) düzlem: vücudu üst (superior) ve alt (inferior) olarak ayırır. BT kesitleri bu düzlemdedir.',
      ],
    },
    {
      title: 'Yön terimleri',
      bullets: [
        'Superior (kranial) – yukarı, başa doğru  ↔  Inferior (kaudal) – aşağı, ayağa doğru',
        'Anterior (ventral) – ön  ↔  Posterior (dorsal) – arka',
        'Medial – orta hatta yakın  ↔  Lateral – orta hattan uzak',
        'Proksimal – gövdeye / başlangıca yakın  ↔  Distal – gövdeden uzak (uzuvlar için)',
        'Superfisyal – yüzeye yakın  ↔  Derin (profundus) – yüzeyden uzak',
        'Internus – iç  ↔  Externus – dış (boşluklu organlar için)',
        'İpsilateral – aynı taraf  ↔  Kontralateral – karşı taraf',
        'Palmar – avuç içi, Plantar – ayak tabanı, Dorsum – el/ayak sırtı',
      ],
    },
    {
      title: 'Hareket terimleri',
      bullets: [
        'Fleksiyon: bükme, iki parça arasındaki açı küçülür',
        'Ekstansiyon: germe, açı büyür',
        'Abduksiyon: orta hattan uzaklaştırma',
        'Adduksiyon: orta hatta yaklaştırma',
        'Rotasyon (iç/dış): kendi ekseni etrafında dönme',
        'Sirkümdüksiyon: uzvun koni çizerek dairesel hareketi',
        'Pronasyon: avuç içini arkaya/aşağı çevirme; Supinasyon: avuç içini öne/yukarı çevirme',
        'İnversiyon: ayak tabanını içe çevirme; Eversiyon: dışa çevirme',
        'Dorsifleksiyon: ayak sırtını bacağa yaklaştırma; Plantar fleksiyon: parmak ucuna kalkma',
      ],
    },
    {
      title: 'Vücut boşlukları',
      bullets: [
        'Dorsal boşluk: cavitas cranii (beyin) + canalis vertebralis (medulla spinalis)',
        'Ventral boşluk: cavitas thoracis (kalp, akciğerler) + cavitas abdominopelvica',
        'Toraks ile abdomen arasında diaphragma bulunur',
        'Seröz zarlar: pleura (akciğer), pericardium (kalp), peritoneum (karın)',
      ],
    },
    {
      title: 'Karın bölgeleri (9 bölge)',
      body: [
        'İki vertikal midklavikular hat ve iki horizontal hat (subkostal ve intertüberküler) karnı 9 bölgeye ayırır. Muayene ve Leopold manevralarında konum tarif ederken çok kullanılır.',
      ],
      bullets: [
        'Üst sıra: sağ hipokondriyak – epigastrik – sol hipokondriyak',
        'Orta sıra: sağ lateral (lumbal) – umbilikal – sol lateral (lumbal)',
        'Alt sıra: sağ inguinal (iliak) – pubik (hipogastrik) – sol inguinal (iliak)',
        'Basit yöntem: göbekten geçen iki dik çizgiyle 4 kadran (sağ üst, sol üst, sağ alt, sol alt)',
      ],
    },
  ],
  clinical: [
    'Hasta dosyasına "sol alt kadranda ağrı" yazdığında hastanın solu kastedilir — karşına baktığında senin sağında kalır.',
    'Gebelikte fundus yüksekliği ve fetal pozisyon tarif edilirken bu terimler (fundus, lateral, pubik bölge) birebir kullanılır.',
  ],
  mnemonics: [
    {
      title: 'Abduksiyon / Adduksiyon',
      hook: 'ABduksiyon = ABartıp kolunu açmak, ADduksiyon = ADam gibi kolunu yanına ekle (add)',
      explanation: 'Abduksiyon orta hattan uzaklaştırma, adduksiyon orta hatta yaklaştırmadır.',
    },
    {
      title: 'Pronasyon / Supinasyon',
      hook: 'SUPinasyonda elinde ÇORBA (soup) tutarsın',
      explanation: 'Supinasyon avuç içi yukarı (çorba kâsesi tutar gibi), pronasyon avuç içi aşağı.',
    },
    {
      title: 'Proksimal / Distal',
      hook: 'PROKSİMAL = PRİZE yakın, DİSTAL = DIŞARIDA uzak',
      explanation: 'Uzuvlarda gövdeye yakın olan proksimal, uzak olan distaldir (dirsek, bileğe göre proksimaldir).',
    },
  ],
  cards: [
    { q: 'Anatomik pozisyonda avuç içleri nereye bakar?', a: 'Öne (anteriora)' },
    { q: 'Vücudu sağ ve sol eşit yarılara ayıran düzlem?', a: 'Median (midsagittal) düzlem' },
    { q: 'Vücudu ön ve arka olarak ayıran düzlem?', a: 'Frontal (koronal) düzlem' },
    { q: 'Vücudu üst ve alt olarak ayıran düzlem?', a: 'Transvers (horizontal) düzlem' },
    { q: 'Orta hatta yakın olanı ifade eden terim?', a: 'Medial' },
    { q: 'Uzuvlarda gövdeye yakın olanı ifade eden terim?', a: 'Proksimal' },
    { q: 'Kranial teriminin anlamı?', a: 'Başa doğru, yukarı (superior)' },
    { q: 'Kaudal teriminin anlamı?', a: 'Aşağıya, kuyruğa doğru (inferior)' },
    { q: 'Ventral teriminin anlamı?', a: 'Ön taraf (anterior)' },
    { q: 'Uzvu orta hattan uzaklaştırma hareketi?', a: 'Abduksiyon' },
    { q: 'Avuç içini öne/yukarı çevirme hareketi?', a: 'Supinasyon' },
    { q: 'Parmak ucuna kalkma hareketi?', a: 'Plantar fleksiyon' },
    { q: 'Ayak tabanını içe çevirme hareketi?', a: 'İnversiyon' },
    { q: 'Karnın orta üst bölgesinin adı?', a: 'Epigastrik bölge' },
    { q: 'Karın ve göğüs boşluğunu ayıran kas?', a: 'Diaphragma' },
    { q: 'Aynı tarafı ifade eden terim?', a: 'İpsilateral' },
  ],
};

export const iskelet: Topic = {
  id: 'iskelet',
  title: 'İskelet Sistemi',
  icon: 'body-outline',
  color: '#8D6E63',
  summary:
    'Kemiğin yapısı ve sınıflandırması, kafatası, omurga, göğüs kafesi ve üst-alt ekstremite kemikleri. Erişkinde 206 kemik.',
  sections: [
    {
      title: 'Genel bilgiler',
      bullets: [
        'Erişkin iskeletinde 206 kemik bulunur (yenidoğanda ~270–300; birleşmelerle azalır)',
        'Aksiyel iskelet (80): kafatası, kulak kemikçikleri, os hyoideum, omurga, kaburgalar, sternum',
        'Apendiküler iskelet (126): omuz kuşağı, üst ekstremite, pelvis kuşağı, alt ekstremite',
        'Görevleri: destek, koruma, hareket (kaldıraç), kan yapımı (kırmızı kemik iliği), mineral (Ca, P) deposu',
      ],
    },
    {
      title: 'Kemik çeşitleri',
      bullets: [
        'Uzun kemikler: femur, humerus, tibia, falankslar',
        'Kısa kemikler: karpal ve tarsal kemikler',
        'Yassı kemikler: sternum, kaburgalar, kafatası tavanı, scapula',
        'Düzensiz kemikler: vertebralar, os coxae',
        'Sesamoid kemikler: tendon içinde gelişir — en büyüğü patella',
        'Havalı (pnömatik) kemikler: sinüs içerir — maxilla, frontale, sphenoidale, ethmoidale',
      ],
    },
    {
      title: 'Uzun kemiğin yapısı',
      bullets: [
        'Diafiz: gövde; ortasında cavitas medullaris (sarı kemik iliği)',
        'Epifiz: uçlar; süngerimsi kemik ve kırmızı kemik iliği içerir',
        'Metafiz: diafiz ile epifiz arası; büyüme plağı (epifiz plağı, lamina epiphysialis) burada — boyca uzama sağlar',
        'Periosteum: kemiği dıştan saran zar; kan damarı ve sinir içerir, kalınlığına büyüme ve kırık iyileşmesi sağlar',
        'Endosteum: medüller boşluğu döşeyen iç zar',
        'Eklem yüzeyleri hiyalin kıkırdak ile kaplıdır',
      ],
    },
    {
      title: 'Kafatası (cranium) – 22 kemik',
      body: ['Neurocranium beyni korur (8 kemik), viscerocranium yüz iskeletini oluşturur (14 kemik).'],
      bullets: [
        'Neurocranium: os frontale (1), os parietale (2), os temporale (2), os occipitale (1), os sphenoidale (1), os ethmoidale (1)',
        'Viscerocranium: maxilla (2), os zygomaticum (2), os nasale (2), os lacrimale (2), os palatinum (2), concha nasalis inferior (2), vomer (1), mandibula (1)',
        'Tek hareketli kafa kemiği mandibuladır (art. temporomandibularis)',
        'Suturalar: s. coronalis (frontal–parietal), s. sagittalis (iki parietal arası), s. lambdoidea (parietal–occipital)',
        'Kulak kemikçikleri: malleus (çekiç), incus (örs), stapes (üzengi) — vücudun en küçük kemiği stapes',
      ],
    },
    {
      title: 'Omurga (columna vertebralis)',
      bullets: [
        '7 servikal (C), 12 torakal (T), 5 lumbal (L) vertebra + sacrum (5 vertebra kaynaşmış) + coccyx (3–5 kaynaşmış)',
        'C1 = atlas (corpus\'u yoktur), C2 = axis (dens axis), C7 = vertebra prominens (ensede elle hissedilir)',
        'Servikal vertebraların transvers çıkıntısında foramen transversarium vardır (a. vertebralis geçer)',
        'Torakal vertebralar kaburgalarla eklem yapar (fovea costalis)',
        'Lumbal vertebralar en büyük gövdeye sahiptir (en fazla yükü taşır)',
        'Fizyolojik eğrilikler: servikal ve lumbal lordoz (öne), torakal ve sakral kifoz (arkaya)',
        'Discus intervertebralis: dışta anulus fibrosus, ortada nucleus pulposus',
      ],
    },
    {
      title: 'Göğüs kafesi (thorax)',
      bullets: [
        'Sternum: manubrium, corpus, processus xiphoideus',
        'Angulus sterni (Louis açısı): manubrium–corpus birleşimi, 2. kaburga hizası — kaburga saymanın başlangıç noktası',
        '12 çift kaburga (costa): 1–7 gerçek (costae verae), 8–10 yalancı (costae spuriae), 11–12 serbest/yüzen (costae fluctuantes)',
        'Kaburganın alt kenarındaki sulcus costae\'da interkostal ven, arter, sinir (yukarıdan aşağı VAN) seyreder',
      ],
    },
    {
      title: 'Üst ekstremite (her bir taraf 32 kemik)',
      bullets: [
        'Omuz kuşağı: clavicula (köprücük kemiği) ve scapula (kürek kemiği)',
        'Kol: humerus',
        'Önkol: radius (lateral, başparmak tarafı) ve ulna (medial, serçe parmak tarafı)',
        'El bileği: 8 karpal kemik — proksimal sıra (lateralden mediale): scaphoideum, lunatum, triquetrum, pisiforme; distal sıra: trapezium, trapezoideum, capitatum, hamatum',
        'El tarağı: 5 metakarp; parmaklar: 14 falanks (başparmakta 2, diğerlerinde 3)',
        'En sık kırılan karpal kemik: os scaphoideum',
      ],
    },
    {
      title: 'Alt ekstremite (her bir taraf 30 kemik + os coxae)',
      bullets: [
        'Pelvis kuşağı: os coxae = ilium + ischium + pubis (acetabulum\'da birleşir)',
        'Uyluk: femur — vücudun en uzun ve en güçlü kemiği',
        'Diz: patella (en büyük sesamoid kemik)',
        'Bacak: tibia (medial, kalın, yük taşıyan) ve fibula (lateral, ince)',
        'Ayak bileği: 7 tarsal kemik — talus, calcaneus (en büyük tarsal, topuk), naviculare, cuboideum, 3 cuneiforme (mediale, intermedium, laterale)',
        'Ayak tarağı: 5 metatars; parmaklar: 14 falanks',
        'İç topuk = malleolus medialis (tibia), dış topuk = malleolus lateralis (fibula)',
      ],
    },
  ],
  clinical: [
    'Kırmızı kemik iliği erişkinde başlıca yassı kemiklerde (sternum, kalça kemiği) bulunur; kemik iliği biyopsisi crista iliaca\'dan yapılır.',
    'Yenidoğanda epifiz plakları açıktır; doğum travmasında en sık kırılan kemik clavicula\'dır.',
    'Gebelikte artan lumbal lordoz bel ağrısının sık nedenidir.',
  ],
  mnemonics: [
    {
      title: 'Karpal kemikler (8)',
      hook: 'Sabah Lokantada Tavuk Pişti, Tabakta Tereyağlı Cacık Hazır',
      explanation:
        'Scaphoideum, Lunatum, Triquetrum, Pisiforme (proksimal sıra) – Trapezium, Trapezoideum, Capitatum, Hamatum (distal sıra). İkisi de lateralden (başparmaktan) mediale.',
    },
    {
      title: 'Tarsal kemikler (7)',
      hook: 'Talihli Cem Nehirde Cuma günü 3 Cüce gördü',
      explanation: 'Talus, Calcaneus, Naviculare, Cuboideum, 3 Cuneiforme (mediale, intermedium, laterale).',
    },
    {
      title: 'Omur sayıları',
      hook: 'Kahvaltı 7\'de, öğle yemeği 12\'de, akşam yemeği 5\'te',
      explanation: '7 servikal, 12 torakal, 5 lumbal vertebra.',
    },
    {
      title: 'Kaburgalar',
      hook: '7 Gerçek, 3 Yalancı, 2 Yüzen',
      explanation: '1–7 sternuma doğrudan bağlanır; 8–10 üstteki kıkırdağa bağlanır; 11–12 serbest uçludur.',
    },
    {
      title: 'Radius mu ulna mı?',
      hook: 'RAdius RAdyo antenini başparmağınla çevirdiğin taraftadır',
      explanation: 'Radius lateralde (başparmak tarafı), ulna medialde (serçe parmak tarafı).',
    },
  ],
  cards: [
    { q: 'Erişkin insan iskeletinde kaç kemik vardır?', a: '206' },
    { q: 'Vücudun en uzun kemiği?', a: 'Femur' },
    { q: 'Vücudun en küçük kemiği?', a: 'Stapes (üzengi)' },
    { q: 'En büyük sesamoid kemik?', a: 'Patella' },
    { q: 'Kafatası kaç kemikten oluşur?', a: '22 (8 neurocranium + 14 viscerocranium)' },
    { q: 'Kafatasının tek hareketli kemiği?', a: 'Mandibula' },
    { q: 'C1 vertebranın adı?', a: 'Atlas' },
    { q: 'C2 vertebranın adı?', a: 'Axis' },
    { q: 'Kaç torakal vertebra vardır?', a: '12' },
    { q: 'Kaç lumbal vertebra vardır?', a: '5' },
    { q: 'Angulus sterni hangi kaburga hizasındadır?', a: '2. kaburga' },
    { q: 'Serbest (yüzen) kaburgalar hangileri?', a: '11. ve 12. kaburgalar' },
    { q: 'Önkolda lateralde (başparmak tarafında) olan kemik?', a: 'Radius' },
    { q: 'En sık kırılan karpal kemik?', a: 'Os scaphoideum' },
    { q: 'Topuk kemiğinin Latince adı?', a: 'Calcaneus' },
    { q: 'Os coxae\'yı oluşturan üç kemik?', a: 'Ilium, ischium, pubis' },
    { q: 'Uzun kemikte boyca uzamayı sağlayan yapı?', a: 'Epifiz (büyüme) plağı' },
    { q: 'Kemiği dıştan saran zar?', a: 'Periosteum' },
    { q: 'Doğum travmasında en sık kırılan kemik?', a: 'Clavicula' },
    { q: 'Malleolus medialis hangi kemiğe aittir?', a: 'Tibia' },
  ],
};

export const eklemler: Topic = {
  id: 'eklemler',
  title: 'Eklemler (Artrologi)',
  icon: 'git-merge-outline',
  color: '#5C6BC0',
  summary: 'Eklem tipleri, sinovyal eklemin yapısı, önemli eklemler ve gebelikte eklemlerde olan değişiklikler.',
  sections: [
    {
      title: 'Yapısına göre eklem çeşitleri',
      bullets: [
        'Fibröz eklemler (synarthrosis – hareketsiz): sutura (kafatası), syndesmosis (distal tibiofibular), gomphosis (diş–çene)',
        'Kıkırdak eklemler (amphiarthrosis – az hareketli): synchondrosis (hiyalin kıkırdak; epifiz plağı, 1. kaburga–sternum) ve symphysis (fibrokıkırdak; symphysis pubica, discus intervertebralis)',
        'Sinovyal eklemler (diarthrosis – serbest hareketli): vücuttaki eklemlerin çoğu',
      ],
    },
    {
      title: 'Sinovyal eklemin yapısı',
      bullets: [
        'Eklem kıkırdağı (hiyalin) – kemik uçlarını kaplar, sürtünmeyi azaltır',
        'Eklem kapsülü – dışta fibröz tabaka, içte membrana synovialis',
        'Synovial sıvı – kayganlık ve kıkırdağın beslenmesi',
        'Eklem boşluğu (cavitas articularis)',
        'Yardımcı yapılar: bağlar (ligamentler), menisküsler, discus, labrum, bursalar',
      ],
    },
    {
      title: 'Sinovyal eklem tipleri (şekline göre)',
      bullets: [
        'Düz (art. plana): karpal kemikler arası, akromioklavikular',
        'Menteşe (ginglymus): humeroulnar (dirsek), interfalangeal eklemler — tek eksen: fleksiyon/ekstansiyon',
        'Silindirik / pivot (trochoidea): atlantoaksiyel medyan, proksimal radioulnar — rotasyon',
        'Elipsoid (ellipsoidea): radiokarpal (el bileği)',
        'Eyer (sellaris): başparmağın 1. karpometakarpal eklemi — karşı koyma (opozisyon)',
        'Küresel (spheroidea): omuz (art. humeri) ve kalça (art. coxae) — en geniş hareket',
        'Bikondiler: diz eklemi (art. genus), temporomandibular eklem',
      ],
    },
    {
      title: 'Önemli eklemler',
      bullets: [
        'Omuz eklemi: vücudun en hareketli, buna karşılık en sık çıkan eklemi; rotator manşet kasları stabilize eder',
        'Kalça eklemi: derin acetabulum ve güçlü bağlar sayesinde çok stabil; lig. capitis femoris içinde femur başını besleyen arter bulunur',
        'Diz eklemi: vücudun en büyük eklemi; menisküs medialis (C şekilli, daha sık yaralanır) ve lateralis (O şekilli); lig. cruciatum anterius tibianın öne kaymasını, posterius arkaya kaymasını engeller',
        'Art. sacroiliaca: sacrum ile ilium arasında; gebelikte gevşer',
        'Symphysis pubica: iki pubis arasında fibrokıkırdak eklem; gebelikte relaksin etkisiyle genişler',
      ],
    },
  ],
  clinical: [
    'Gebelikte relaksin ve progesteron etkisiyle pelvis eklemleri gevşer, doğum kanalı biraz genişler. Aşırı gevşeme "symphysis pubis disfonksiyonu" (kasık ağrısı, yürürken ağrı) yapabilir.',
    'Bebeklerde gelişimsel kalça displazisi (GKD) taraması için Ortolani ve Barlow testleri yapılır — kalça ekleminin anatomisi bu yüzden önemli.',
  ],
  mnemonics: [
    {
      title: 'Eklem tipleri',
      hook: 'Fibröz SuSiGo, Kıkırdak SinSim',
      explanation: 'Fibröz: Sutura, Syndesmosis, Gomphosis. Kıkırdak: Synchondrosis, Symphysis.',
    },
    {
      title: 'Eyer eklemi',
      hook: 'Başparmak ata biner (eyer)',
      explanation: 'Başparmağın 1. karpometakarpal eklemi eyer (sellar) tipindedir.',
    },
  ],
  cards: [
    { q: 'Kafatası kemikleri arasındaki eklem tipi?', a: 'Sutura (fibröz eklem)' },
    { q: 'Diş ile çene arasındaki eklem?', a: 'Gomphosis' },
    { q: 'Symphysis pubica hangi tip eklemdir?', a: 'Kıkırdak eklem (symphysis, fibrokıkırdak)' },
    { q: 'Serbest hareketli eklemlere ne denir?', a: 'Sinovyal eklem (diarthrosis)' },
    { q: 'Dirsek (humeroulnar) eklemi hangi tiptedir?', a: 'Menteşe (ginglymus)' },
    { q: 'Omuz ve kalça eklemleri hangi tiptedir?', a: 'Küresel (spheroidea)' },
    { q: 'Başparmağın karpometakarpal eklemi hangi tiptedir?', a: 'Eyer (sellaris)' },
    { q: 'Atlantoaksiyel medyan eklem hangi tiptedir?', a: 'Pivot (trochoidea)' },
    { q: 'Vücudun en hareketli eklemi?', a: 'Omuz eklemi' },
    { q: 'Vücudun en büyük eklemi?', a: 'Diz eklemi' },
    { q: 'Daha sık yaralanan menisküs?', a: 'Menisküs medialis' },
    { q: 'Tibianın öne kaymasını engelleyen bağ?', a: 'Lig. cruciatum anterius (ön çapraz bağ)' },
    { q: 'Gebelikte pelvis eklemlerini gevşeten hormon?', a: 'Relaksin' },
    { q: 'Eklem içini döşeyen ve kayganlık sıvısı üreten zar?', a: 'Membrana synovialis' },
  ],
};
