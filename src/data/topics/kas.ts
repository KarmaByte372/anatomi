import type { Topic } from '../types';

export const kas: Topic = {
  id: 'kas',
  title: 'Kas Sistemi',
  icon: 'barbell-outline',
  color: '#E5734A',
  summary:
    'Kas dokusu tipleri, önemli kas grupları ve sinirleri, diafram ve karın duvarı. Enjeksiyon bölgeleri ebelik için ayrıca işaretlendi.',
  sections: [
    {
      title: 'Kas dokusu tipleri',
      bullets: [
        'İskelet kası: çizgili, istemli, çok çekirdekli; kemiklere tendonla tutunur',
        'Kalp kası: çizgili, istemsiz; hücreler arası interkalar diskler vardır',
        'Düz kas: çizgisiz, istemsiz; damar, bağırsak, uterus (myometrium) duvarında',
      ],
    },
    {
      title: 'Temel kavramlar',
      bullets: [
        'Origo: kasın sabit kalan tutunma noktası (genellikle proksimal)',
        'Insertio: kasın hareket ettirdiği tutunma noktası (genellikle distal)',
        'Agonist: hareketi yapan ana kas; antagonist: zıt hareketi yapan kas',
        'Tendon kası kemiğe, aponevroz geniş yassı kasları birbirine/kemiğe bağlar',
      ],
    },
    {
      title: 'Baş ve boyun kasları',
      bullets: [
        'Mimik kasları (m. orbicularis oculi, m. orbicularis oris, m. buccinator vb.): n. facialis (VII) innerve eder',
        'Çiğneme kasları (m. masseter, m. temporalis, m. pterygoideus medialis ve lateralis): n. mandibularis (V3) innerve eder',
        'M. sternocleidomastoideus: başı karşı tarafa çevirir; n. accessorius (XI)',
        'M. trapezius: omuz silkme, scapula hareketi; n. accessorius (XI)',
      ],
    },
    {
      title: 'Solunum kasları ve diafram',
      bullets: [
        'Diaphragma: ana inspirasyon kası; kasıldığında aşağı iner, göğüs hacmi artar',
        'Diaframın siniri n. phrenicus (C3–C5)',
        'Diafram delikleri: T8 – v. cava inferior, T10 – özofagus (hiatus oesophageus), T12 – aorta (hiatus aorticus)',
        'Mm. intercostales externi inspirasyona, interni zorlu ekspirasyona yardım eder',
      ],
    },
    {
      title: 'Karın duvarı kasları',
      bullets: [
        'M. rectus abdominis: orta hattın iki yanında dikey kas; ortada linea alba ile ayrılır',
        'M. obliquus externus abdominis (en dış), m. obliquus internus abdominis, m. transversus abdominis (en iç)',
        'Bu üç yassı kasın aponevrozları rectus kılıfını (vagina musculi recti abdominis) oluşturur',
        'Canalis inguinalis: kadında lig. teres uteri, erkekte funiculus spermaticus geçer',
      ],
    },
    {
      title: 'Üst ekstremite kasları',
      bullets: [
        'M. deltoideus: kolu abduksiyona getirir (15°–90°); n. axillaris',
        'Rotator manşet (SİTS): m. supraspinatus, m. infraspinatus, m. teres minor, m. subscapularis',
        'M. biceps brachii: dirseği büker ve önkolu supinasyona getirir; n. musculocutaneus',
        'M. triceps brachii: dirseği gerer; n. radialis',
        'Önkol ön yüzü fleksörler (n. medianus, n. ulnaris), arka yüzü ekstansörler (n. radialis)',
      ],
    },
    {
      title: 'Alt ekstremite kasları',
      bullets: [
        'M. gluteus maximus: kalçanın en güçlü ekstansörü; n. gluteus inferior',
        'M. gluteus medius ve minimus: kalça abduktörleri, yürürken pelvisi dengeler; n. gluteus superior',
        'M. quadriceps femoris (rectus femoris, vastus lateralis, vastus medialis, vastus intermedius): dizi gerer; n. femoralis',
        'Hamstring kasları (m. biceps femoris, m. semitendinosus, m. semimembranosus): dizi büker, kalçayı gerer; n. ischiadicus',
        'M. sartorius: vücudun en uzun kası ("terzi kası")',
        'M. gastrocnemius + m. soleus → tendo calcaneus (Aşil tendonu); plantar fleksiyon; n. tibialis',
        'M. tibialis anterior: dorsifleksiyon; n. fibularis (peroneus) profundus',
      ],
    },
  ],
  clinical: [
    'Kas içi (IM) enjeksiyon bölgeleri: m. deltoideus (aşılar, küçük hacimler), ventrogluteal bölge (m. gluteus medius – en güvenli, büyük damar/sinir yok), dorsogluteal bölge (sadece üst-dış kadran; n. ischiadicus riski), m. vastus lateralis.',
    'Yenidoğan ve süt çocuklarında (K vitamini, hepatit B aşısı) tercih edilen bölge uyluk ön-dış yüzündeki m. vastus lateralis\'tir.',
    'Gebelikte m. rectus abdominis\'in iki yarısı linea alba boyunca ayrılabilir: diastasis recti.',
    'Doğumda ıkınma: diafram ve karın duvarı kaslarının birlikte kasılmasıyla karın içi basınç artar.',
  ],
  mnemonics: [
    {
      title: 'Diafram delikleri',
      hook: '8 Vena, 10 Özofagus, 12 Aorta  →  "VÖA" (8-10-12)',
      explanation: 'T8\'de v. cava inferior, T10\'da özofagus, T12\'de aorta diaframı geçer.',
    },
    {
      title: 'Diafram siniri',
      hook: '3-4-5 diaframı hayatta tutar',
      explanation: 'N. phrenicus C3, C4, C5 köklerinden gelir; boyun yaralanmalarında solunum durabilir.',
    },
    {
      title: 'Rotator manşet',
      hook: 'SİTS',
      explanation: 'Supraspinatus, İnfraspinatus, Teres minor, Subscapularis.',
    },
    {
      title: 'Hamstring kasları',
      hook: 'Bi-Semi-Semi',
      explanation: 'Biceps femoris, semitendinosus, semimembranosus — uyluğun arka yüzü.',
    },
  ],
  cards: [
    { q: 'İstemsiz ve çizgili kas tipi?', a: 'Kalp kası' },
    { q: 'Uterus duvarında hangi tip kas bulunur?', a: 'Düz kas (myometrium)' },
    { q: 'Ana inspirasyon kası?', a: 'Diaphragma' },
    { q: 'Diafram hangi sinir tarafından innerve edilir?', a: 'N. phrenicus (C3–C5)' },
    { q: 'Özofagus diaframı hangi seviyede geçer?', a: 'T10' },
    { q: 'Aorta diaframı hangi seviyede geçer?', a: 'T12' },
    { q: 'Mimik kaslarını innerve eden sinir?', a: 'N. facialis (VII)' },
    { q: 'Çiğneme kaslarını innerve eden sinir?', a: 'N. mandibularis (V3)' },
    { q: 'Rotator manşet kasları?', a: 'Supraspinatus, infraspinatus, teres minor, subscapularis' },
    { q: 'Dirseği geren (ekstansiyon) kas?', a: 'M. triceps brachii' },
    { q: 'Dizi geren kas grubu?', a: 'M. quadriceps femoris' },
    { q: 'Vücudun en uzun kası?', a: 'M. sartorius' },
    { q: 'Aşil tendonunu oluşturan kaslar?', a: 'M. gastrocnemius ve m. soleus' },
    { q: 'En güvenli IM enjeksiyon bölgesi?', a: 'Ventrogluteal bölge (m. gluteus medius)' },
    { q: 'Yenidoğanda IM enjeksiyon için tercih edilen kas?', a: 'M. vastus lateralis' },
    { q: 'Dorsogluteal enjeksiyonda yaralanma riski taşıyan sinir?', a: 'N. ischiadicus' },
    { q: 'Rectus kaslarının gebelikte ayrılmasına ne denir?', a: 'Diastasis recti' },
    { q: 'Kadında canalis inguinalis\'ten geçen yapı?', a: 'Lig. teres uteri' },
  ],
};
