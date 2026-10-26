import type { Topic } from '../types';

export const dolasim: Topic = {
  id: 'dolasim',
  title: 'Kalp ve Dolaşım Sistemi',
  icon: 'heart-outline',
  color: '#E53950',
  summary:
    'Kalbin yeri, katmanları, odacıkları, kapakçıkları ve ileti sistemi; büyük damarlar, aortun dalları ve lenfatik sistem.',
  sections: [
    {
      title: 'Kalbin yeri ve katmanları',
      bullets: [
        'Mediastinum medium\'da, iki akciğer arasında; yaklaşık 2/3\'ü orta hattın solunda',
        'Apex cordis: sol 5. interkostal aralık, midklavikular hat (apeks atımı burada hissedilir)',
        'Pericardium: dışta fibröz perikard, içte seröz perikard (parietal ve visseral = epikard); aralarında perikard boşluğu',
        'Myocardium: kalp kası; sol ventrikül duvarı en kalındır (sistemik dolaşıma pompalar)',
        'Endocardium: odacıkları ve kapakları döşeyen iç katman',
      ],
    },
    {
      title: 'Odacıklar ve kan akışı',
      bullets: [
        'Sağ atrium: v. cava superior, v. cava inferior ve sinus coronarius\'tan kirli kan alır',
        'Sağ atrium → triküspit kapak → sağ ventrikül → pulmoner kapak → truncus pulmonalis → akciğerler',
        'Akciğerler → 4 v. pulmonalis → sol atrium → mitral (biküspit) kapak → sol ventrikül → aort kapağı → aorta',
        'Aa. pulmonales kirli (oksijeni az) kan, vv. pulmonales temiz kan taşır — kural dışı damarlar',
      ],
    },
    {
      title: 'Kapakçıklar',
      bullets: [
        'Atriyoventriküler kapaklar: triküspit (sağ, 3 yaprak), mitral/biküspit (sol, 2 yaprak)',
        'AV kapaklar chordae tendineae ile mm. papillares\'e bağlıdır; ventrikül kasılırken atriuma geri kaçmayı önler',
        'Semilunar kapaklar: pulmoner ve aort kapağı (3\'er yarımay yaprak)',
        'S1 (birinci kalp sesi) AV kapakların, S2 semilunar kapakların kapanmasıyla oluşur',
        'Oskültasyon odakları: aort – sağ 2. interkostal aralık; pulmoner – sol 2. interkostal aralık; triküspit – sol 4. interkostal aralık sternum kenarı; mitral – sol 5. interkostal aralık midklavikular hat',
      ],
    },
    {
      title: 'Kalbin ileti sistemi',
      bullets: [
        'SA düğüm (nodus sinuatrialis): sağ atriumda, v. cava superior girişi yakınında — doğal pacemaker (60–100/dk)',
        'AV düğüm (nodus atrioventricularis): iletiyi kısa süre geciktirir (atriumlar ventriküllerden önce kasılsın)',
        'His demeti (fasciculus atrioventricularis) → sağ ve sol dal → Purkinje lifleri',
      ],
    },
    {
      title: 'Kalbin kendi damarları',
      bullets: [
        'A. coronaria dextra ve sinistra: aortanın başlangıcındaki (sinus aortae) ilk dallar',
        'A. coronaria sinistra → ramus interventricularis anterior (LAD) ve ramus circumflexus',
        'Kalbin venleri sinus coronarius\'ta toplanıp sağ atriuma dökülür',
      ],
    },
    {
      title: 'Aorta ve dalları',
      bullets: [
        'Aorta ascendens → arcus aortae → aorta descendens (thoracica + abdominalis)',
        'Arcus aortae\'nın dalları (sağdan sola): truncus brachiocephalicus, a. carotis communis sinistra, a. subclavia sinistra',
        'Truncus brachiocephalicus → a. carotis communis dextra + a. subclavia dextra',
        'Aorta abdominalis dalları: truncus coeliacus (T12), a. mesenterica superior (L1), aa. renales (L1–L2), aa. ovaricae/testiculares (L2), a. mesenterica inferior (L3)',
        'Truncus coeliacus → a. gastrica sinistra, a. splenica, a. hepatica communis',
        'Aorta L4 hizasında aa. iliacae communes\'e ayrılır → a. iliaca externa (bacağa, a. femoralis olur) ve interna (pelvis organlarına)',
      ],
    },
    {
      title: 'Venöz sistem',
      bullets: [
        'V. cava superior: baş, boyun, üst ekstremite ve toraks kanını sağ atriuma getirir',
        'V. cava inferior: diafram altındaki bölgelerin kanını getirir',
        'V. portae hepatis: v. mesenterica superior + v. splenica birleşimi; sindirim kanalından gelen besin yüklü kanı karaciğere taşır',
        'Yüzeyel venler: v. cephalica, v. basilica, v. mediana cubiti (kan alma), v. saphena magna (vücudun en uzun veni)',
      ],
    },
    {
      title: 'Lenfatik sistem',
      bullets: [
        'Ductus thoracicus: vücudun en büyük lenf kanalı; sağ üst çeyrek dışındaki tüm vücudun lenfini sol venöz açıya (v. subclavia + v. jugularis interna birleşimi) döker',
        'Ductus lymphaticus dexter: sağ baş-boyun, sağ kol ve sağ toraksın lenfini sağ venöz açıya döker',
        'Dalak (lien/splen): en büyük lenfoid organ; sol hipokondriyumda, 9.–11. kaburgalar hizasında',
        'Timus: T lenfositlerin olgunlaştığı organ; çocuklukta büyük, erişkinde yağ dokusuna döner',
      ],
    },
  ],
  clinical: [
    'Gebelikte kan hacmi ~%40–50 artar, kalp debisi yükselir; fizyolojik sistolik üfürüm duyulabilir.',
    'Son trimesterde sırtüstü yatınca uterus v. cava inferior\'a bası yapar → "supin hipotansiyon sendromu". Gebe sol yan yatırılır.',
    'Kan alma ve damar yolu için en sık v. mediana cubiti (dirsek önü, fossa cubitalis) kullanılır.',
  ],
  mnemonics: [
    {
      title: 'Kanın kapaklardan geçiş sırası',
      hook: 'Tatlı Pasta, Mutlu Akşam',
      explanation: 'Triküspit → Pulmoner → Mitral → Aort.',
    },
    {
      title: 'Oskültasyon odakları',
      hook: 'APTM: "Ağabeyim Para Tutar, Mutlu olur" – 2, 2, 4, 5',
      explanation: 'Aort sağ 2., Pulmoner sol 2., Triküspit sol 4., Mitral sol 5. interkostal aralık.',
    },
    {
      title: 'Arcus aortae dalları',
      hook: 'Babam Kahve Sever (BKS)',
      explanation: 'Truncus Brachiocephalicus, a. carotis communis sinistra (Karotis), a. Subclavia sinistra.',
    },
    {
      title: 'Kapak yaprak sayısı',
      hook: 'Sağda TRİ (3), solda Bİ (2) – "Sağ el üç parmak, sol el iki"',
      explanation: 'Sağ AV kapak triküspit, sol AV kapak biküspit (mitral).',
    },
  ],
  cards: [
    { q: 'Apeks atımı nerede hissedilir?', a: 'Sol 5. interkostal aralık, midklavikular hat' },
    { q: 'Kalbin en kalın duvarlı odacığı?', a: 'Sol ventrikül' },
    { q: 'Kalbin doğal pacemaker\'ı?', a: 'SA (sinoatriyal) düğüm' },
    { q: 'Sağ atrium ile sağ ventrikül arasındaki kapak?', a: 'Triküspit kapak' },
    { q: 'Sol atrium ile sol ventrikül arasındaki kapak?', a: 'Mitral (biküspit) kapak' },
    { q: 'Temiz kan taşıyan venler?', a: 'Vv. pulmonales' },
    { q: 'Kirli kan taşıyan arterler?', a: 'Aa. pulmonales' },
    { q: 'Kalbin venöz kanını sağ atriuma döken yapı?', a: 'Sinus coronarius' },
    { q: 'Arcus aortae\'nın ilk dalı?', a: 'Truncus brachiocephalicus' },
    { q: 'Aortanın ikiye ayrıldığı seviye?', a: 'L4' },
    { q: 'V. portae hangi venlerin birleşmesiyle oluşur?', a: 'V. mesenterica superior ve v. splenica' },
    { q: 'Vücudun en uzun veni?', a: 'V. saphena magna' },
    { q: 'Kan almada en sık kullanılan ven?', a: 'V. mediana cubiti' },
    { q: 'Vücudun en büyük lenf kanalı?', a: 'Ductus thoracicus' },
    { q: 'En büyük lenfoid organ?', a: 'Dalak (lien)' },
    { q: 'AV kapakları papiller kaslara bağlayan yapılar?', a: 'Chordae tendineae' },
    { q: 'Aort kapağı oskültasyon odağı?', a: 'Sağ 2. interkostal aralık' },
    { q: 'Gebe sırtüstü yattığında basıya uğrayan damar?', a: 'V. cava inferior' },
  ],
};

export const solunum: Topic = {
  id: 'solunum',
  title: 'Solunum Sistemi',
  icon: 'cloud-outline',
  color: '#3A86C8',
  summary: 'Burun ve sinüslerden alveollere kadar hava yolu, larinks kıkırdakları, akciğer lobları ve plevra.',
  sections: [
    {
      title: 'Üst solunum yolları',
      bullets: [
        'Cavitas nasi: concha nasalis superior, media, inferior havayı ısıtır ve nemlendirir',
        'Sinus paranasales: frontalis, maxillaris (en büyük), ethmoidales, sphenoidalis',
        'Pharynx (yutak): nasopharynx, oropharynx, laryngopharynx; hem solunum hem sindirim yolu',
        'Tuba auditiva (Östaki borusu) nasofarinkse açılır',
      ],
    },
    {
      title: 'Larinks (gırtlak)',
      bullets: [
        'C3–C6 hizasında; ses üretimi ve alt hava yolunun korunması',
        'Tek kıkırdaklar: cartilago thyroidea (en büyük, "Âdem elması"), cartilago cricoidea (TAM halka olan tek kıkırdak), epiglottis (yutkunurken larinks girişini kapatır)',
        'Çift kıkırdaklar: arytenoidea (ses tellerini hareket ettirir), corniculata, cuneiformis',
        'Plica vocalis (gerçek ses telleri); aralarındaki boşluk rima glottidis — hava yolunun en dar yeri (erişkinde)',
        'Larinks kaslarının çoğu n. laryngeus recurrens (n. vagus dalı) ile innerve edilir',
      ],
    },
    {
      title: 'Trakea ve bronşlar',
      bullets: [
        'Trakea: C6\'dan başlar, ~10–12 cm; 16–20 adet arkası açık C şekilli kıkırdak halka',
        'T4–T5 hizasında (angulus sterni) carina\'da sağ ve sol ana bronşa ayrılır',
        'Sağ ana bronş daha kısa, daha geniş ve daha dikey — yabancı cisimler en sık sağa kaçar',
        'Bronş ağacı: ana bronş → lober bronş → segmenter bronş → bronşiol → terminal bronşiol → respiratuvar bronşiol → alveol',
      ],
    },
    {
      title: 'Akciğerler',
      bullets: [
        'Sağ akciğer: 3 lob (üst, orta, alt); fissura obliqua ve fissura horizontalis',
        'Sol akciğer: 2 lob (üst, alt); fissura obliqua; kalp nedeniyle incisura cardiaca ve lingula bulunur',
        'Hilum pulmonis: ana bronş, a. pulmonalis, vv. pulmonales, lenf damarları ve sinirlerin girip çıktığı yer',
        'Alveol hücreleri: Tip I pnömosit (gaz değişimi, yassı), Tip II pnömosit (sürfaktan üretimi)',
      ],
    },
    {
      title: 'Plevra',
      bullets: [
        'Pleura visceralis akciğeri, pleura parietalis göğüs duvarını döşer',
        'Aralarında az miktarda sıvı içeren cavitas pleuralis bulunur',
        'Recessus costodiaphragmaticus: plevra boşluğunun en alt kısmı — sıvı burada toplanır',
      ],
    },
  ],
  clinical: [
    'Sürfaktan yaklaşık 24. haftada üretilmeye başlar, 34–35. haftada yeterli düzeye ulaşır. Preterm bebeklerde eksikliği respiratuvar distres sendromu (RDS) yapar; erken doğum tehdidinde anneye kortikosteroid verilerek fetal akciğer olgunlaşması hızlandırılır.',
    'Gebelikte büyüyen uterus diaframı ~4 cm yukarı iter; buna rağmen tidal volüm artar (progesteron etkisi), gebe "nefes darlığı" hissedebilir.',
    'Yenidoğanda burun solunumu zorunlu gibidir; burun tıkanıklığı beslenmeyi bozar.',
  ],
  mnemonics: [
    {
      title: 'Akciğer lobları',
      hook: 'Sağ 3, Sol 2 – solda kalbe yer açılmış',
      explanation: 'Sağ akciğer 3 loblu, sol akciğer 2 loblu (incisura cardiaca + lingula).',
    },
    {
      title: 'Yabancı cisim',
      hook: 'Sağ bronş "Kısa, Geniş, Dik" – lokma sağa kaçar',
      explanation: 'Aspire edilen cisimler sıklıkla sağ ana bronşa gider.',
    },
    {
      title: 'Pnömositler',
      hook: 'Tip 1 = 1. iş gaz değişimi, Tip 2 = 2. iş sürfaktan',
      explanation: 'Tip I hücreler gaz değişimini, Tip II hücreler sürfaktanı sağlar.',
    },
  ],
  cards: [
    { q: 'En büyük paranazal sinüs?', a: 'Sinus maxillaris' },
    { q: 'Larinksin tam halka şeklindeki tek kıkırdağı?', a: 'Cartilago cricoidea' },
    { q: '"Âdem elması"nı oluşturan kıkırdak?', a: 'Cartilago thyroidea' },
    { q: 'Yutkunurken larinks girişini kapatan yapı?', a: 'Epiglottis' },
    { q: 'Larinks kaslarının çoğunu innerve eden sinir?', a: 'N. laryngeus recurrens' },
    { q: 'Trakeanın ikiye ayrıldığı nokta?', a: 'Carina (T4–T5)' },
    { q: 'Yabancı cisimlerin daha sık kaçtığı bronş?', a: 'Sağ ana bronş' },
    { q: 'Sağ akciğer kaç lobludur?', a: '3' },
    { q: 'Sol akciğere özgü dil şeklindeki çıkıntı?', a: 'Lingula' },
    { q: 'Sürfaktan üreten hücre?', a: 'Tip II pnömosit' },
    { q: 'Sürfaktan eksikliği yenidoğanda neye yol açar?', a: 'Respiratuvar distres sendromu (RDS)' },
    { q: 'Akciğer yüzeyini örten zar?', a: 'Pleura visceralis' },
    { q: 'Plevra boşluğunun en alt noktası?', a: 'Recessus costodiaphragmaticus' },
    { q: 'Erişkinde hava yolunun en dar yeri?', a: 'Rima glottidis' },
  ],
};

export const sindirim: Topic = {
  id: 'sindirim',
  title: 'Sindirim Sistemi',
  icon: 'restaurant-outline',
  color: '#43A047',
  summary:
    'Ağız boşluğundan anüse sindirim kanalı; karaciğer, safra yolları, pankreas ve periton. Organların karın bölgelerindeki yerleri.',
  sections: [
    {
      title: 'Ağız ve yutak',
      bullets: [
        'Süt dişleri 20, kalıcı dişler 32',
        'Tükürük bezleri: gl. parotidea (en büyük; kanalı üst 2. büyük azı karşısına açılır), gl. submandibularis, gl. sublingualis',
        'Dil: kas organı; tat tomurcukları papillalarda',
      ],
    },
    {
      title: 'Özofagus ve mide',
      bullets: [
        'Özofagus: ~25 cm, C6\'dan başlar, T10\'da diaframı geçer, T11\'de mideye açılır',
        'Mide bölümleri: cardia, fundus, corpus, pars pylorica (antrum + kanal) ve pylorus (sfinkter)',
        'Curvatura minor (iç, kısa kenar) ve curvatura major (dış, uzun kenar)',
        'Mide sol hipokondriyak ve epigastrik bölgededir',
      ],
    },
    {
      title: 'İnce bağırsak',
      bullets: [
        'Duodenum (~25 cm): C şekilli, pankreas başını sarar; büyük kısmı retroperitoneal',
        'Papilla duodeni major (Vater): ductus choledochus ve ductus pancreaticus burada duodenuma açılır (inen parça)',
        'Jejunum: ince bağırsağın proksimal 2/5\'i; daha kalın duvarlı, bol plika',
        'Ileum: distal 3/5; Peyer plakları; vitamin B12 ve safra tuzları burada emilir',
        'Villus ve mikrovilluslar emilim yüzeyini büyük ölçüde artırır',
      ],
    },
    {
      title: 'Kalın bağırsak',
      bullets: [
        'Caecum (sağ iliak bölge) + appendix vermiformis',
        'Colon ascendens → flexura coli dextra (hepatik) → colon transversum → flexura coli sinistra (splenik) → colon descendens → colon sigmoideum → rectum → canalis analis',
        'Kalın bağırsağa özgü yapılar: taenia coli (3 kas şeridi), haustra, appendices epiploicae',
        'McBurney noktası: SİAS ile göbeği birleştiren çizginin dış 1/3\'ü — apendiks tabanının yüzey izdüşümü',
      ],
    },
    {
      title: 'Karaciğer ve safra yolları',
      bullets: [
        'Karaciğer (hepar): vücudun en büyük bezi (~1,5 kg); sağ hipokondriyumda',
        'Anatomik lobları: sağ, sol, quadratus, caudatus; lig. falciforme sağ ve sol lobu önde ayırır',
        'Porta hepatis: v. portae, a. hepatica propria girer; ductus hepaticus çıkar',
        'Çift kanlanma: ~%75 v. portae (besin), ~%25 a. hepatica (oksijen)',
        'Safra kesesi (vesica biliaris) safrayı depolar ve yoğunlaştırır',
        'Ductus hepaticus communis + ductus cysticus = ductus choledochus',
      ],
    },
    {
      title: 'Pankreas',
      bullets: [
        'Bölümleri: caput (duodenum C\'si içinde), collum, corpus, cauda (dalağa uzanır)',
        'Ekzokrin: sindirim enzimleri (amilaz, lipaz, tripsinojen) — ductus pancreaticus (Wirsung) ile duodenuma',
        'Endokrin: Langerhans adacıkları — alfa hücreleri glukagon, beta hücreleri insülin, delta hücreleri somatostatin',
      ],
    },
    {
      title: 'Periton',
      bullets: [
        'Peritoneum parietale karın duvarını, viscerale organları örter',
        'İntraperitoneal organlar: mide, jejunum, ileum, colon transversum, colon sigmoideum, karaciğer (büyük kısmı), dalak, uterus fundusu',
        'Retroperitoneal organlar: böbrekler, adrenaller, üreterler, aorta ve VCI, pankreas (kuyruk hariç), duodenum (büyük kısmı), colon ascendens ve descendens, rektum',
        'Omentum majus: mideden sarkan "yağlı önlük"; omentum minus: mide ile karaciğer arası',
      ],
    },
  ],
  clinical: [
    'Gebelikte büyüyen uterus apendiksi yukarı ve laterale iter; gebede apandisit ağrısı daha yukarıda (sağ üst kadrana yakın) olabilir.',
    'Progesteron düz kası gevşettiği için gebelikte reflü (alt özofagus sfinkteri gevşer) ve kabızlık sıktır.',
    'Gebelikte safra kesesinin boşalması yavaşlar, safra taşı riski artar.',
  ],
  mnemonics: [
    {
      title: 'Kolon sırası',
      hook: 'Çıkan – Yatan – İnen – S yapan',
      explanation: 'Colon ascendens → transversum → descendens → sigmoideum → rectum.',
    },
    {
      title: 'Retroperitoneal organlar',
      hook: 'SAD PUCKER',
      explanation:
        'Suprarenal bezler, Aorta/VCI, Duodenum (çoğu), Pankreas (kuyruk hariç), Üreterler, Colon ascendens/descendens, Kidney (böbrek), Esophagus (alt kısım), Rektum.',
    },
    {
      title: 'Safra yolları',
      hook: 'Hepatik + Kistik = Koledok ("HK = K")',
      explanation: 'Ductus hepaticus communis ile ductus cysticus birleşerek ductus choledochus\'u yapar.',
    },
  ],
  cards: [
    { q: 'Kalıcı diş sayısı?', a: '32' },
    { q: 'En büyük tükürük bezi?', a: 'Gl. parotidea' },
    { q: 'Özofagus diaframı hangi seviyede geçer?', a: 'T10' },
    { q: 'Midenin pilor bölgesindeki sfinkter?', a: 'Pylorus' },
    { q: 'Ductus choledochus\'un duodenuma açıldığı yer?', a: 'Papilla duodeni major (Vater)' },
    { q: 'Vitamin B12\'nin emildiği bölüm?', a: 'Ileum (terminal)' },
    { q: 'Apendiksin bağlı olduğu kalın bağırsak bölümü?', a: 'Caecum' },
    { q: 'Apendiks tabanının yüzey izdüşümü?', a: 'McBurney noktası' },
    { q: 'Kalın bağırsaktaki üç kas şeridi?', a: 'Taenia coli' },
    { q: 'Vücudun en büyük bezi?', a: 'Karaciğer' },
    { q: 'Karaciğere besin yüklü kan getiren damar?', a: 'V. portae hepatis' },
    { q: 'Ductus choledochus hangi kanalların birleşimiyle oluşur?', a: 'Ductus hepaticus communis ve ductus cysticus' },
    { q: 'İnsülin salgılayan hücreler?', a: 'Pankreas beta hücreleri' },
    { q: 'Glukagon salgılayan hücreler?', a: 'Pankreas alfa hücreleri' },
    { q: 'Mideden sarkan "yağlı önlük"?', a: 'Omentum majus' },
    { q: 'Böbrekler periton açısından nasıldır?', a: 'Retroperitoneal' },
    { q: 'Gebelikte reflünün başlıca nedeni?', a: 'Progesteronun alt özofagus sfinkterini gevşetmesi' },
  ],
};

export const uriner: Topic = {
  id: 'uriner',
  title: 'Üriner Sistem',
  icon: 'water-outline',
  color: '#F2B705',
  summary: 'Böbrek, nefron, üreter, mesane ve üretra. Gebelikte üriner sistemdeki değişiklikler.',
  sections: [
    {
      title: 'Böbrekler',
      bullets: [
        'Retroperitoneal; T12–L3 hizasında; sağ böbrek karaciğer nedeniyle biraz daha aşağıda',
        'Fasya ve yağ katmanları içinde: capsula fibrosa, capsula adiposa (perirenal yağ), fascia renalis (Gerota)',
        'Hilum renale\'de önden arkaya: v. renalis, a. renalis, pelvis renalis (VAP)',
        'Kesitte: dışta cortex, içte medulla (pyramides renales); papillalar → calices minores → calices majores → pelvis renalis',
        'Her böbrekte ~1 milyon nefron vardır',
      ],
    },
    {
      title: 'Nefron',
      bullets: [
        'Corpusculum renale = glomerulus (kapiller yumağı) + capsula glomerularis (Bowman kapsülü) — filtrasyon',
        'Tubulus contortus proximalis: geri emilimin çoğu',
        'Ansa nephroni (Henle kulpu): idrarın yoğunlaştırılması',
        'Tubulus contortus distalis → ductus colligens (toplayıcı kanal)',
        'Jukstaglomerüler aparat: renin salgılar (kan basıncı düzenlenmesi)',
      ],
    },
    {
      title: 'Üreter',
      bullets: [
        '~25–30 cm, retroperitoneal; böbrek pelvisinden mesaneye',
        'Üç fizyolojik darlık (taşların takıldığı yerler): üreteropelvik bileşke, a. iliaca\'ları çaprazladığı yer (pelvis girişi), üreterovezikal bileşke',
        'Kadında a. uterina\'nın altından geçer',
      ],
    },
    {
      title: 'Mesane ve üretra',
      bullets: [
        'Mesane (vesica urinaria): pubik bölgede, symphysis\'in arkasında; duvarındaki kas m. detrusor vesicae',
        'Trigonum vesicae: iki üreter ağzı ve ostium urethrae internum arasındaki düz üçgen alan',
        'Kadın üretrası ~3,5–4 cm, kısa ve düz → idrar yolu enfeksiyonu (İYE) kadınlarda daha sık',
        'Erkek üretrası ~18–20 cm: pars prostatica, pars membranacea, pars spongiosa',
        'M. sphincter urethrae externus istemli (iskelet kası), internus istemsiz',
      ],
    },
  ],
  clinical: [
    'Gebelikte progesteron üreterleri gevşetir ve büyüyen uterus bası yapar → fizyolojik hidronefroz (sağda daha belirgin, uterus sağa döndüğü için). Asemptomatik bakteriüri ve piyelonefrit riski artar.',
    'Gebeliğin başında ve sonunda uterusun mesaneye basısı sık idrara çıkmaya neden olur.',
    'Doğumda dolu mesane fetal başın inişini engelleyebilir ve postpartum uterus atonisine katkıda bulunur; mesanenin boş tutulması önemlidir.',
  ],
  mnemonics: [
    {
      title: 'Böbrek hilumu (önden arkaya)',
      hook: 'VAP – Ven, Arter, Pelvis',
      explanation: 'Önde v. renalis, ortada a. renalis, arkada pelvis renalis.',
    },
    {
      title: 'Üreter darlıkları',
      hook: 'Çıkış – Köprü – Giriş',
      explanation: 'Böbrekten çıkış (üreteropelvik), iliak damar köprüsü, mesaneye giriş (üreterovezikal).',
    },
  ],
  cards: [
    { q: 'Böbrekler hangi vertebra seviyeleri arasındadır?', a: 'T12–L3' },
    { q: 'Hangi böbrek daha aşağıdadır?', a: 'Sağ böbrek' },
    { q: 'Böbreği saran fasya?', a: 'Fascia renalis (Gerota)' },
    { q: 'Böbreğin fonksiyonel birimi?', a: 'Nefron' },
    { q: 'Glomerulus + Bowman kapsülü ne oluşturur?', a: 'Corpusculum renale (Malpighi cisimciği)' },
    { q: 'İdrarı yoğunlaştıran nefron bölümü?', a: 'Henle kulpu' },
    { q: 'Renin salgılayan yapı?', a: 'Jukstaglomerüler aparat' },
    { q: 'Mesane duvarındaki kas?', a: 'M. detrusor vesicae' },
    { q: 'Mesanede üreter ağızları ve üretra ağzı arasındaki üçgen?', a: 'Trigonum vesicae' },
    { q: 'Kadın üretrasının uzunluğu?', a: '~3,5–4 cm' },
    { q: 'Gebelikte hidronefroz hangi tarafta daha belirgindir?', a: 'Sağ tarafta' },
    { q: 'Erkek üretrasının en uzun bölümü?', a: 'Pars spongiosa' },
  ],
};

export const erkekUreme: Topic = {
  id: 'erkek-ureme',
  title: 'Erkek Üreme Sistemi',
  icon: 'male-outline',
  color: '#2A7FBA',
  summary: 'Testis, epididim, sperm yolları, yardımcı bezler ve penis.',
  sections: [
    {
      title: 'Testis ve epididim',
      bullets: [
        'Testisler scrotum içinde, vücut sıcaklığından ~2–3 °C düşük ortamda (spermatogenez için gerekli)',
        'Tunica albuginea ile sarılıdır; içinde tubuli seminiferi contorti bulunur — spermatogenez burada',
        'Sertoli hücreleri spermleri besler ve destekler; Leydig (interstisyel) hücreleri testosteron salgılar',
        'Epididymis: testisin arka yüzünde; spermlerin olgunlaştığı ve depolandığı yer',
        'Fetal dönemde testisler karın içinden skrotuma iner; inmemesi kriptorşidizm',
      ],
    },
    {
      title: 'Sperm yolu',
      bullets: [
        'Tubuli seminiferi → rete testis → epididymis → ductus deferens → ductus ejaculatorius → urethra',
        'Ductus deferens: ~45 cm; funiculus spermaticus içinde canalis inguinalis\'ten geçer (vazektomide kesilen yapı)',
        'Ductus deferens + vesicula seminalis kanalı → ductus ejaculatorius (prostat içinden üretraya açılır)',
      ],
    },
    {
      title: 'Yardımcı bezler',
      bullets: [
        'Vesicula seminalis: semen hacminin ~%60–70\'i; fruktozdan zengin (spermin enerji kaynağı)',
        'Prostat: mesanenin altında, üretranın başlangıcını çevreler; semenin ~%20–30\'u; yaşla büyüyebilir (BPH)',
        'Gll. bulbourethrales (Cowper bezleri): ejakülasyon öncesi kayganlaştırıcı salgı',
      ],
    },
    {
      title: 'Penis',
      bullets: [
        '2 corpus cavernosum (sırt tarafında) + 1 corpus spongiosum (içinden üretra geçer, ucunda glans penis)',
        'Ereksiyon parasempatik, ejakülasyon sempatik kontrol altındadır',
      ],
    },
  ],
  clinical: [
    'Yenidoğan muayenesinde testislerin skrotumda olup olmadığı kontrol edilir (inmemiş testis prematürelerde daha sık).',
    'Hipospadias: üretra ağzının penisin alt yüzünde olması; sünnet öncesi fark edilmesi önemlidir.',
  ],
  mnemonics: [
    {
      title: 'Sperm yolu',
      hook: 'SEVEN UP',
      explanation:
        'Seminifer tübüller – Epididim – Vas (ductus) deferens – Ejakülatör kanal – (Nothing) – Üretra – Penis.',
    },
    {
      title: 'Hücreler',
      hook: 'Leydig = Libido (testosteron), Sertoli = Sütanne (sperm bakıcısı)',
      explanation: 'Leydig hücreleri testosteron salgılar, Sertoli hücreleri gelişen spermleri destekler.',
    },
  ],
  cards: [
    { q: 'Spermatogenezin gerçekleştiği yer?', a: 'Tubuli seminiferi' },
    { q: 'Testosteron salgılayan hücreler?', a: 'Leydig hücreleri' },
    { q: 'Spermleri besleyip destekleyen hücreler?', a: 'Sertoli hücreleri' },
    { q: 'Spermlerin olgunlaştığı ve depolandığı organ?', a: 'Epididymis' },
    { q: 'Vazektomide kesilen yapı?', a: 'Ductus deferens' },
    { q: 'Semen hacminin çoğunu salgılayan bez?', a: 'Vesicula seminalis' },
    { q: 'Üretranın başlangıcını çevreleyen bez?', a: 'Prostat' },
    { q: 'İçinden üretra geçen erektil cisim?', a: 'Corpus spongiosum' },
    { q: 'Testisin skrotuma inmemesine ne denir?', a: 'Kriptorşidizm' },
    { q: 'Üretra ağzının penisin alt yüzünde olması?', a: 'Hipospadias' },
  ],
};
