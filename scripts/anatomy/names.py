"""
BodyParts3D parça isimlerini (İngilizce FMA) Latince + Türkçe isimli "yapılara" eşler.

Her kural: (regex, latince, türkçe, katman, tür). İlk eşleşen kural kazanır.
Aynı Latince isme düşen parçalar tek yapıda birleştirilir; sağ/sol ayrı tutulur.
Latince/Türkçe içinde {n} sıra sayısı (1, 2, ...) ve {r} Roma rakamı ile değiştirilir.

Katmanlar: deri, kas, iskelet, organ, damar, sinir
Türler renk belirler (bkz. KIND_COLORS).
"""

import re

ORDINALS = {
    'first': 1, 'second': 2, 'third': 3, 'fourth': 4, 'fifth': 5, 'sixth': 6,
    'seventh': 7, 'eighth': 8, 'ninth': 9, 'tenth': 10, 'eleventh': 11, 'twelfth': 12,
}
ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

KIND_COLORS = {
    'skin': '#E7BFA6',
    'hair': '#4A3426',
    'muscle': '#B8433F',
    'tendon': '#E4D8C2',
    'bone': '#EEE6D3',
    'cartilage': '#A9CFD9',
    'tooth': '#FBF7EA',
    'disc': '#C8DFE6',
    'artery': '#D33A3A',
    'vein': '#3B62C4',
    'portal': '#7B5BC6',
    'heart': '#B7383A',
    'valve': '#E9D3C1',
    'lung': '#E7A1A8',
    'gi': '#E29B83',
    'liver': '#8A3B32',
    'gall': '#4E8B3A',
    'bile': '#9BBF55',
    'spleen': '#7A2E4E',
    'pancreas': '#E8BC74',
    'kidney': '#9C4335',
    'urinary': '#E6B26C',
    'gland': '#D98A5A',
    'genital': '#D78AA1',
    'brain': '#EFC4C0',
    'brainstem': '#E2A9A3',
    'white': '#F3E9DE',
    'csf': '#7FC4E6',
    'nerve': '#F2CF3C',
    'eye': '#F6F3EE',
    'iris': '#5D8AA8',
    'lens': '#CFE8F2',
    'membrane': '#E9DCC6',
}

# Kısaltma yardımcıları --------------------------------------------------------

def M(p, la, tr):
    return (p, la, tr, 'kas', 'muscle')

def T(p, la, tr):
    return (p, la, tr, 'kas', 'tendon')

def B(p, la, tr, kind='bone'):
    return (p, la, tr, 'iskelet', kind)

def A(p, la, tr):
    return (p, la, tr, 'damar', 'artery')

def V(p, la, tr, kind='vein'):
    return (p, la, tr, 'damar', kind)

def O(p, la, tr, kind):
    return (p, la, tr, 'organ', kind)

def N(p, la, tr, kind='brain'):
    return (p, la, tr, 'sinir', kind)

FINGERS = {'thumb': 'I', 'index finger': 'II', 'middle finger': 'III', 'ring finger': 'IV', 'little finger': 'V'}
FINGERS_TR = {'thumb': 'başparmak', 'index finger': 'işaret parmağı', 'middle finger': 'orta parmak', 'ring finger': 'yüzük parmağı', 'little finger': 'serçe parmak'}
TOES = {'big toe': 'I', 'second toe': 'II', 'third toe': 'III', 'fourth toe': 'IV', 'little toe': 'V'}
TOES_TR = {'big toe': 'başparmak', 'second toe': '2. parmak', 'third toe': '3. parmak', 'fourth toe': '4. parmak', 'little toe': 'serçe parmak'}
PHALANX = {'proximal': ('proximalis', 'proksimal'), 'middle': ('media', 'orta'), 'distal': ('distalis', 'distal')}

RULES = [
    # ---------------- DERİ ----------------
    (r'^skin$', 'Cutis', 'Deri', 'deri', 'skin'),
    (r'^hair of head$', 'Capilli', 'Saçlar', 'deri', 'hair'),
    (r'^eyebrow$', 'Supercilium', 'Kaş', 'deri', 'hair'),
    (r'^pubic hair$', None, None, None, None),  # dahil edilmez
    (r'^external ear$', 'Auricula', 'Kulak kepçesi', 'deri', 'skin'),
    (r'^lip$', 'Labia oris', 'Dudaklar', 'organ', 'gi'),

    # ---------------- İSKELET ----------------
    B(r'^frontal bone$', 'Os frontale', 'Alın kemiği'),
    B(r'^parietal bone$', 'Os parietale', 'Yan kafa kemiği'),
    B(r'^temporal bone$', 'Os temporale', 'Şakak kemiği'),
    B(r'^occipital bone$', 'Os occipitale', 'Art kafa kemiği'),
    B(r'^sphenoid bone$', 'Os sphenoidale', 'Kama kemiği'),
    B(r'^ethmoid$', 'Os ethmoidale', 'Kalbur kemiği'),
    B(r'^maxilla$', 'Maxilla', 'Üst çene kemiği'),
    B(r'^mandible$', 'Mandibula', 'Alt çene kemiği'),
    B(r'^zygomatic bone$', 'Os zygomaticum', 'Elmacık kemiği'),
    B(r'^nasal bone$', 'Os nasale', 'Burun kemiği'),
    B(r'^lacrimal bone$', 'Os lacrimale', 'Gözyaşı kemiği'),
    B(r'^palatine bone$', 'Os palatinum', 'Damak kemiği'),
    B(r'^vomer$', 'Vomer', 'Vomer (sapan kemiği)'),
    B(r'^inferior nasal concha$', 'Concha nasalis inferior', 'Alt burun konkası'),
    B(r'^hyoid bone$', 'Os hyoideum', 'Dil kemiği'),
    B(r'^atlas$', 'Atlas (C1)', 'Atlas (1. boyun omuru)'),
    B(r'^axis$', 'Axis (C2)', 'Axis (2. boyun omuru)'),
    B(r'^(\w+) cervical vertebra$', 'Vertebra cervicalis {r}', '{n}. boyun (servikal) omuru'),
    B(r'^(\w+) thoracic vertebra$', 'Vertebra thoracica {r}', '{n}. göğüs (torakal) omuru'),
    B(r'^(\w+) lumbar vertebra$', 'Vertebra lumbalis {r}', '{n}. bel (lumbal) omuru'),
    B(r'^sacrum$', 'Os sacrum', 'Sakrum (kuyruk sokumu kemiği)'),
    B(r'^intervertebral disk of axis$', 'Discus intervertebralis C2–C3', 'Omurlar arası disk C2–C3', 'disc'),
    B(r'^intervertebral disk of (\w+) cervical vertebra$', 'Discus intervertebralis C{n}', 'Omurlar arası disk (C{n} altı)', 'disc'),
    B(r'^intervertebral disk of (\w+) thoracic vertebra$', 'Discus intervertebralis T{n}', 'Omurlar arası disk (T{n} altı)', 'disc'),
    B(r'^intervertebral disk of (\w+) lumbar vertebra$', 'Discus intervertebralis L{n}', 'Omurlar arası disk (L{n} altı)', 'disc'),
    B(r'^intervertebral disk$', 'Discus intervertebralis L5–S1', 'Omurlar arası disk L5–S1', 'disc'),
    B(r'^manubrium$', 'Manubrium sterni', 'Göğüs kemiği sapı'),
    B(r'^body of sternum$', 'Corpus sterni', 'Göğüs kemiği gövdesi'),
    B(r'^xiphoid process$', 'Processus xiphoideus', 'Ksifoid çıkıntı'),
    B(r'^(\w+) rib$', 'Costa {r}', '{n}. kaburga'),
    B(r'^(\w+) costal cartilage$', 'Cartilago costalis {r}', '{n}. kaburga kıkırdağı', 'cartilage'),
    B(r'^clavicle$', 'Clavicula', 'Köprücük kemiği'),
    B(r'^scapula$', 'Scapula', 'Kürek kemiği'),
    B(r'^humerus$', 'Humerus', 'Kol kemiği'),
    B(r'^radius$', 'Radius', 'Döner kemik (radius)'),
    B(r'^ulna$', 'Ulna', 'Dirsek kemiği (ulna)'),
    B(r'^scaphoid$', 'Os scaphoideum', 'Kayık kemiği (el)'),
    B(r'^lunate$', 'Os lunatum', 'Ay kemiği'),
    B(r'^triquetral$', 'Os triquetrum', 'Üçgen kemik'),
    B(r'^pisiform$', 'Os pisiforme', 'Bezelye kemiği'),
    B(r'^trapezium$', 'Os trapezium', 'Büyük trapez kemik'),
    B(r'^trapezoid$', 'Os trapezoideum', 'Küçük trapez kemik'),
    B(r'^capitate$', 'Os capitatum', 'Başlı kemik'),
    B(r'^hamate$', 'Os hamatum', 'Çengel kemik'),
    B(r'^(\w+) metacarpal bone$', 'Os metacarpi {r}', '{n}. el tarağı kemiği'),
    B(r'^hip bone$', 'Os coxae', 'Kalça kemiği'),
    B(r'^femur$', 'Femur', 'Uyluk kemiği'),
    B(r'^patella$', 'Patella', 'Diz kapağı'),
    B(r'^tibia$', 'Tibia', 'Kaval kemiği'),
    B(r'^fibula$', 'Fibula', 'Kamış kemiği'),
    B(r'^talus$', 'Talus', 'Aşık kemiği'),
    B(r'^calcaneus$', 'Calcaneus', 'Topuk kemiği'),
    B(r'^navicular bone of foot$', 'Os naviculare', 'Kayık kemiği (ayak)'),
    B(r'^cuboid bone$', 'Os cuboideum', 'Küp kemik'),
    B(r'^medial cuneiform bone$', 'Os cuneiforme mediale', 'İç çivi kemiği'),
    B(r'^intermediate cuneiform bone$', 'Os cuneiforme intermedium', 'Orta çivi kemiği'),
    B(r'^lateral cuneiform bone$', 'Os cuneiforme laterale', 'Dış çivi kemiği'),
    B(r'^(\w+) metatarsal bone$', 'Os metatarsi {r}', '{n}. ayak tarağı kemiği'),
    B(r'^sesamoid bone of foot$', 'Ossa sesamoidea pedis', 'Ayağın susam kemikleri'),
    # Dişler
    B(r'^(upper|lower) central secondary incisor tooth$', 'Dens incisivus medialis', 'Orta kesici diş', 'tooth'),
    B(r'^(upper|lower) lateral secondary incisor tooth$', 'Dens incisivus lateralis', 'Yan kesici diş', 'tooth'),
    B(r'^(upper|lower) secondary canine tooth$', 'Dens caninus', 'Köpek dişi', 'tooth'),
    B(r'^(upper|lower) (\w+) secondary premolar tooth$', 'Dens premolaris', 'Küçük azı dişi', 'tooth'),
    B(r'^(upper|lower) (\w+) secondary molar tooth$', 'Dens molaris', 'Büyük azı dişi', 'tooth'),
    # Burun ve gırtlak kıkırdakları
    B(r'^septal nasal cartilage$', 'Cartilago septi nasi', 'Burun bölmesi kıkırdağı', 'cartilage'),
    B(r'^lateral nasal cartilage$', 'Cartilago nasi lateralis', 'Yan burun kıkırdağı', 'cartilage'),
    B(r'^major alar cartilage$', 'Cartilago alaris major', 'Burun kanadı kıkırdağı', 'cartilage'),
    O(r'^thyroid cartilage$', 'Cartilago thyroidea', 'Tiroid kıkırdağı (Âdem elması)', 'cartilage'),
    O(r'^cricoid cartilage$', 'Cartilago cricoidea', 'Krikoid kıkırdak', 'cartilage'),
    O(r'^arytenoid cartilage$', 'Cartilago arytenoidea', 'Aritenoid kıkırdak', 'cartilage'),
    O(r'^corniculate cartilage$', 'Cartilago corniculata', 'Kornikulat kıkırdak', 'cartilage'),
    O(r'^cuneiform cartilage$', 'Cartilago cuneiformis', 'Kuneiform kıkırdak', 'cartilage'),
    O(r'^epiglottis$', 'Epiglottis', 'Gırtlak kapağı', 'cartilage'),

    # ---------------- KASLAR ----------------
    # Baş-boyun
    M(r'^platysma$', 'Platysma', 'Platisma (boyun deri kası)'),
    M(r'^sternocleidomastoid$', 'M. sternocleidomastoideus', 'Göğüs-köprücük-meme kası'),
    M(r'^digastric$', 'M. digastricus', 'İki karınlı kas'),
    T(r'^intermediate tendon$', 'Tendo intermedius m. digastrici', 'Digastrik kasın ara tendonu'),
    M(r'^stylohyoid$', 'M. stylohyoideus', 'Stilohiyoid kas'),
    M(r'^mylohyoid$', 'M. mylohyoideus', 'Milohiyoid kas (ağız tabanı)'),
    M(r'^geniohyoid$', 'M. geniohyoideus', 'Geniohiyoid kas'),
    M(r'^sternohyoid$', 'M. sternohyoideus', 'Sternohiyoid kas'),
    M(r'^sternothyroid$', 'M. sternothyroideus', 'Sternotiroid kas'),
    M(r'^thyrohyoid$', 'M. thyrohyoideus', 'Tirohiyoid kas'),
    M(r'^omohyoid$', 'M. omohyoideus', 'Omohiyoid kas'),
    M(r'^genioglossus$', 'M. genioglossus', 'Genioglossus (dil kası)'),
    M(r'^hyoglossus$', 'M. hyoglossus', 'Hiyoglossus (dil kası)'),
    M(r'^scalenus anterior$', 'M. scalenus anterior', 'Ön merdiven kası'),
    M(r'^scalenus medius$', 'M. scalenus medius', 'Orta merdiven kası'),
    M(r'^scalenus posterior$', 'M. scalenus posterior', 'Arka merdiven kası'),
    M(r'^longus capitis$', 'M. longus capitis', 'Uzun baş kası'),
    M(r'^.*part of longus colli$', 'M. longus colli', 'Uzun boyun kası'),
    M(r'^rectus capitis anterior$', 'M. rectus capitis anterior', 'Ön düz baş kası'),
    M(r'^rectus capitis lateralis$', 'M. rectus capitis lateralis', 'Yan düz baş kası'),
    M(r'^rectus capitis posterior major$', 'M. rectus capitis posterior major', 'Büyük arka düz baş kası'),
    M(r'^rectus capitis posterior minor$', 'M. rectus capitis posterior minor', 'Küçük arka düz baş kası'),
    M(r'^obliquus capitis inferior$', 'M. obliquus capitis inferior', 'Alt eğik baş kası'),
    M(r'^obliquus capitis superior$', 'M. obliquus capitis superior', 'Üst eğik baş kası'),
    M(r'^levator veli palatini$', 'M. levator veli palatini', 'Yumuşak damağı kaldıran kas'),
    M(r'^tensor veli palatini$', 'M. tensor veli palatini', 'Yumuşak damağı geren kas'),
    M(r'^uvular muscle$', 'M. uvulae', 'Küçük dil kası'),
    M(r'^palatopharyngeus$', 'M. palatopharyngeus', 'Palatofaringeal kas'),
    M(r'^salpingopharyngeus$', 'M. salpingopharyngeus', 'Salpingofaringeal kas'),
    M(r'^stylopharyngeus$', 'M. stylopharyngeus', 'Stilofaringeal kas'),
    M(r'^superior pharyngeal constrictor$', 'M. constrictor pharyngis superior', 'Üst yutak büzücü kası'),
    M(r'^middle pharyngeal constrictor$', 'M. constrictor pharyngis medius', 'Orta yutak büzücü kası'),
    M(r'^inferior pharyngeal constrictor$', 'M. constrictor pharyngis inferior', 'Alt yutak büzücü kası'),
    T(r'^pharyngeal raphe$', 'Raphe pharyngis', 'Yutak rafesi'),
    T(r'^pterygomandibular raphe$', 'Raphe pterygomandibularis', 'Pterigomandibular rafe'),
    T(r'^stylohyoid ligament$', 'Lig. stylohyoideum', 'Stilohiyoid bağ'),
    # Gırtlak kasları ve bağları
    M(r'^.*part of cricothyroid$', 'M. cricothyroideus', 'Krikotiroid kas'),
    M(r'^posterior crico-arytenoid$', 'M. cricoarytenoideus posterior', 'Arka krikoaritenoid kas (ses yarığını açar)'),
    M(r'^lateral crico-arytenoid$', 'M. cricoarytenoideus lateralis', 'Yan krikoaritenoid kas'),
    M(r'^(oblique|transverse) arytenoid$', 'M. arytenoideus', 'Aritenoid kas'),
    M(r'^aryepiglotticus$', 'M. aryepiglotticus', 'Ariepiglottik kas'),
    M(r'^thyro-arytenoid$', 'M. thyroarytenoideus', 'Tiroaritenoid kas'),
    M(r'^vocalis$', 'M. vocalis', 'Ses teli kası'),
    O(r'^vocal ligament$', 'Lig. vocale', 'Ses bağı (ses teli)', 'membrane'),
    O(r'^conus elasticus$', 'Conus elasticus', 'Elastik koni', 'membrane'),
    O(r'^(median|lateral) thyrohyoid ligament$', 'Lig. thyrohyoideum', 'Tirohiyoid bağ', 'membrane'),
    O(r'^thyrohyoid membrane$', 'Membrana thyrohyoidea', 'Tirohiyoid zar', 'membrane'),
    O(r'^median cricothyroid ligament$', 'Lig. cricothyroideum medianum', 'Krikotiroid bağ (acil hava yolu noktası)', 'membrane'),
    O(r'^(hyo|thyro)-epiglottic ligament$', 'Lig. epiglotticum', 'Epiglot bağı', 'membrane'),
    # Göğüs ve karın duvarı
    M(r'^.*part of pectoralis major$', 'M. pectoralis major', 'Büyük göğüs kası'),
    M(r'^pectoralis minor$', 'M. pectoralis minor', 'Küçük göğüs kası'),
    M(r'^subclavius$', 'M. subclavius', 'Köprücük altı kası'),
    M(r'^serratus anterior$', 'M. serratus anterior', 'Ön dişli kas'),
    M(r'^serratus posterior superior$', 'M. serratus posterior superior', 'Üst arka dişli kas'),
    M(r'^serratus posterior inferior$', 'M. serratus posterior inferior', 'Alt arka dişli kas'),
    M(r'^external intercostal muscle$', 'Mm. intercostales externi', 'Dış kaburgalar arası kaslar'),
    M(r'^internal intercostal muscle$', 'Mm. intercostales interni', 'İç kaburgalar arası kaslar'),
    M(r'^innermost intercostal muscle$', 'Mm. intercostales intimi', 'En iç kaburgalar arası kaslar'),
    M(r'^transversus thoracis$', 'M. transversus thoracis', 'Enine göğüs kası'),
    M(r'^set of levatores costarum', 'Mm. levatores costarum', 'Kaburga kaldırıcı kaslar'),
    M(r'^diaphragm$', 'Diaphragma', 'Diyafram'),
    M(r'^external oblique$', 'M. obliquus externus abdominis', 'Dış eğik karın kası'),
    T(r'^linea alba$', 'Linea alba', 'Linea alba (ak çizgi)'),
    M(r'^psoas major$', 'M. psoas major', 'Büyük bel kası'),
    M(r'^iliacus$', 'M. iliacus', 'İliak kas'),
    # Sırt
    M(r'^.*part of trapezius$', 'M. trapezius', 'Trapez (kukuleta) kası'),
    M(r'^levator scapulae$', 'M. levator scapulae', 'Kürek kemiği kaldırıcı kas'),
    M(r'^rhomboid major$', 'M. rhomboideus major', 'Büyük eşkenar dörtgen kas'),
    M(r'^rhomboid minor$', 'M. rhomboideus minor', 'Küçük eşkenar dörtgen kas'),
    M(r'^splenius capitis$', 'M. splenius capitis', 'Baş kayış kası'),
    M(r'^splenius cervicis$', 'M. splenius cervicis', 'Boyun kayış kası'),
    M(r'^iliocostalis (cervicis|thoracis|lumborum)$', 'M. iliocostalis', 'İliokostal kas (erector spinae)'),
    M(r'^longissimus (capitis|cervicis|thoracis)$', 'M. longissimus', 'En uzun kas (erector spinae)'),
    M(r'^spinalis( thoracis)?$', 'M. spinalis', 'Spinal kas (erector spinae)'),
    M(r'^semispinalis (capitis|cervicis|thoracis)$', 'M. semispinalis', 'Yarı dikenli kas'),
    M(r'^(cervical|thoracic|lumbar) rotator$', 'Mm. rotatores', 'Döndürücü kaslar (derin sırt)'),
    M(r'^(set of )?interspinal', 'Mm. interspinales', 'Dikenler arası kaslar'),
    M(r'^.*intertransversari', 'Mm. intertransversarii', 'Enine çıkıntılar arası kaslar'),
    # Omuz ve kol
    M(r'^.*part of deltoid$', 'M. deltoideus', 'Deltoid (omuz) kası'),
    M(r'^supraspinatus$', 'M. supraspinatus', 'Diken üstü kas'),
    M(r'^infraspinatus muscle$', 'M. infraspinatus', 'Diken altı kas'),
    M(r'^teres minor$', 'M. teres minor', 'Küçük yuvarlak kas'),
    M(r'^teres major$', 'M. teres major', 'Büyük yuvarlak kas'),
    M(r'^subscapularis$', 'M. subscapularis', 'Kürek altı kası'),
    M(r'^coracobrachialis$', 'M. coracobrachialis', 'Korakobrakial kas'),
    M(r'^(long|short) head of biceps brachii$', 'M. biceps brachii', 'Pazı kası (iki başlı kol kası)'),
    M(r'^brachialis$', 'M. brachialis', 'Kol kası (brakial kas)'),
    M(r'^(long|lateral|medial) head of triceps brachii$', 'M. triceps brachii', 'Üç başlı kol kası'),
    M(r'^anconeus$', 'M. anconeus', 'Ankoneus kası'),
    M(r'^brachioradialis$', 'M. brachioradialis', 'Brakioradial kas'),
    M(r'^(humeral|ulnar) head of pronator teres$', 'M. pronator teres', 'Yuvarlak pronator kas'),
    M(r'^pronator quadratus$', 'M. pronator quadratus', 'Kare pronator kas'),
    M(r'^supinator$', 'M. supinator', 'Supinator kas'),
    M(r'^flexor carpi radialis$', 'M. flexor carpi radialis', 'Radial bilek bükücü kas'),
    M(r'^(humeral|ulnar) head of flexor carpi ulnaris$', 'M. flexor carpi ulnaris', 'Ulnar bilek bükücü kas'),
    M(r'^palmaris longus$', 'M. palmaris longus', 'Uzun avuç kası'),
    M(r'^flexor digitorum superficialis$', 'M. flexor digitorum superficialis', 'Yüzeyel parmak bükücü kas'),
    M(r'^flexor digitorum profundus$', 'M. flexor digitorum profundus', 'Derin parmak bükücü kas'),
    M(r'^flexor pollicis longus$', 'M. flexor pollicis longus', 'Uzun başparmak bükücü kas'),
    M(r'^extensor carpi radialis longus$', 'M. extensor carpi radialis longus', 'Uzun radial bilek açıcı kas'),
    M(r'^extensor carpi radialis brevis$', 'M. extensor carpi radialis brevis', 'Kısa radial bilek açıcı kas'),
    M(r'^extensor carpi ulnaris$', 'M. extensor carpi ulnaris', 'Ulnar bilek açıcı kas'),
    M(r'^extensor digitorum$', 'M. extensor digitorum', 'Parmak açıcı kas'),
    M(r'^extensor digiti minimi$', 'M. extensor digiti minimi', 'Serçe parmak açıcı kas'),
    M(r'^extensor indicis$', 'M. extensor indicis', 'İşaret parmağı açıcı kas'),
    M(r'^abductor pollicis longus$', 'M. abductor pollicis longus', 'Uzun başparmak uzaklaştırıcı kas'),
    M(r'^extensor pollicis longus$', 'M. extensor pollicis longus', 'Uzun başparmak açıcı kas'),
    M(r'^extensor pollicis brevis$', 'M. extensor pollicis brevis', 'Kısa başparmak açıcı kas'),
    M(r'^abductor pollicis brevis$', 'M. abductor pollicis brevis', 'Kısa başparmak uzaklaştırıcı kas (tenar)'),
    M(r'^(superficial head of )?flexor pollicis brevis$', 'M. flexor pollicis brevis', 'Kısa başparmak bükücü kas (tenar)'),
    M(r'^opponens pollicis$', 'M. opponens pollicis', 'Başparmak karşılayıcı kas (tenar)'),
    M(r'^(oblique|transverse) head of adductor pollicis$', 'M. adductor pollicis', 'Başparmak yaklaştırıcı kas'),
    M(r'^abductor digiti minimi of hand$', 'M. abductor digiti minimi (manus)', 'Serçe parmak uzaklaştırıcı kas (hipotenar)'),
    M(r'^flexor digiti minimi brevis of hand$', 'M. flexor digiti minimi brevis (manus)', 'Serçe parmak kısa bükücü kas (hipotenar)'),
    M(r'^opponens digiti minimi of hand$', 'M. opponens digiti minimi', 'Serçe parmak karşılayıcı kas (hipotenar)'),
    M(r'^set of lumbricals of hand$', 'Mm. lumbricales (manus)', 'Elin solucansı kasları'),
    M(r'^set of (dorsal|palmar) interossei of hand$', 'Mm. interossei (manus)', 'Elin kemikler arası kasları'),
    T(r'^flexor retinaculum of wrist$', 'Retinaculum musculorum flexorum', 'Fleksör retinakulum (karpal tünelin tavanı)'),
    T(r'^interosseous membrane of forearm$', 'Membrana interossea antebrachii', 'Önkol kemikler arası zarı'),
    # Kalça ve bacak
    M(r'^gluteus maximus$', 'M. gluteus maximus', 'Büyük kalça kası'),
    M(r'^gluteus medius$', 'M. gluteus medius', 'Orta kalça kası (ventrogluteal enjeksiyon)'),
    M(r'^gluteus minimus$', 'M. gluteus minimus', 'Küçük kalça kası'),
    M(r'^tensor fasciae latae$', 'M. tensor fasciae latae', 'Uyluk zarını geren kas'),
    T(r'^iliotibial tract$', 'Tractus iliotibialis', 'İliotibial bant'),
    M(r'^piriformis$', 'M. piriformis', 'Armut biçimli kas'),
    M(r'^gemellus superior$', 'M. gemellus superior', 'Üst ikiz kas'),
    M(r'^gemellus inferior$', 'M. gemellus inferior', 'Alt ikiz kas'),
    M(r'^obturator internus$', 'M. obturatorius internus', 'İç obturator kas'),
    M(r'^obturator externus$', 'M. obturatorius externus', 'Dış obturator kas'),
    M(r'^quadratus femoris$', 'M. quadratus femoris', 'Kare uyluk kası'),
    M(r'^sartorius$', 'M. sartorius', 'Terzi kası'),
    M(r'^rectus femoris$', 'M. rectus femoris', 'Düz uyluk kası (quadriceps)'),
    M(r'^vastus lateralis$', 'M. vastus lateralis', 'Dış geniş kas (quadriceps – bebek IM enjeksiyonu)'),
    M(r'^vastus medialis$', 'M. vastus medialis', 'İç geniş kas (quadriceps)'),
    M(r'^vastus intermedius$', 'M. vastus intermedius', 'Ara geniş kas (quadriceps)'),
    M(r'^pectineus$', 'M. pectineus', 'Tarak kası'),
    M(r'^adductor longus$', 'M. adductor longus', 'Uzun yaklaştırıcı kas'),
    M(r'^adductor brevis$', 'M. adductor brevis', 'Kısa yaklaştırıcı kas'),
    M(r'^adductor magnus$', 'M. adductor magnus', 'Büyük yaklaştırıcı kas'),
    M(r'^adductor minimus$', 'M. adductor minimus', 'En küçük yaklaştırıcı kas'),
    M(r'^gracilis$', 'M. gracilis', 'İnce kas'),
    M(r'^(long|short) head of biceps femoris$', 'M. biceps femoris', 'İki başlı uyluk kası (hamstring)'),
    M(r'^semitendinosus$', 'M. semitendinosus', 'Yarı tendinöz kas (hamstring)'),
    M(r'^semimembranosus$', 'M. semimembranosus', 'Yarı zarsı kas (hamstring)'),
    M(r'^popliteus$', 'M. popliteus', 'Diz arkası kası'),
    M(r'^(lateral|medial) head of gastrocnemius$', 'M. gastrocnemius', 'Baldır (ikiz) kası'),
    M(r'^soleus$', 'M. soleus', 'Pisi balığı kası (soleus)'),
    M(r'^plantaris$', 'M. plantaris', 'Plantaris kası'),
    T(r'^calcaneal tendon$', 'Tendo calcaneus (Achillis)', 'Aşil tendonu'),
    M(r'^tibialis anterior$', 'M. tibialis anterior', 'Ön kaval kası'),
    M(r'^tibialis posterior$', 'M. tibialis posterior', 'Arka kaval kası'),
    M(r'^extensor digitorum longus$', 'M. extensor digitorum longus', 'Uzun parmak açıcı kas (ayak)'),
    M(r'^extensor hallucis longus$', 'M. extensor hallucis longus', 'Uzun başparmak açıcı kas (ayak)'),
    M(r'^extensor hallucis brevis$', 'M. extensor hallucis brevis', 'Kısa başparmak açıcı kas (ayak)'),
    M(r'^fibularis longus$', 'M. fibularis (peroneus) longus', 'Uzun fibular kas'),
    M(r'^fibularis brevis$', 'M. fibularis (peroneus) brevis', 'Kısa fibular kas'),
    M(r'^fibularis tertius$', 'M. fibularis (peroneus) tertius', 'Üçüncü fibular kas'),
    M(r'^flexor digitorum longus$', 'M. flexor digitorum longus', 'Uzun parmak bükücü kas (ayak)'),
    M(r'^flexor hallucis longus$', 'M. flexor hallucis longus', 'Uzun başparmak bükücü kas (ayak)'),
    M(r'^flexor digitorum brevis$', 'M. flexor digitorum brevis', 'Kısa parmak bükücü kas (ayak)'),
    M(r'^flexor accessorius$', 'M. quadratus plantae', 'Kare taban kası'),
    M(r'^abductor hallucis$', 'M. abductor hallucis', 'Başparmak uzaklaştırıcı kas (ayak)'),
    M(r'^(lateral|medial) head of flexor hallucis brevis$', 'M. flexor hallucis brevis', 'Kısa başparmak bükücü kas (ayak)'),
    M(r'^(oblique|transverse) head of adductor hallucis$', 'M. adductor hallucis', 'Başparmak yaklaştırıcı kas (ayak)'),
    M(r'^abductor digiti minimi of foot$', 'M. abductor digiti minimi (pedis)', 'Serçe parmak uzaklaştırıcı kas (ayak)'),
    M(r'^flexor digiti minimi brevis of foot$', 'M. flexor digiti minimi brevis (pedis)', 'Serçe parmak kısa bükücü kas (ayak)'),
    M(r'^opponens digiti minimi of foot$', 'M. opponens digiti minimi (pedis)', 'Serçe parmak karşılayıcı kas (ayak)'),
    M(r'^# lumbrical of foot$', 'Mm. lumbricales (pedis)', 'Ayağın solucansı kasları'),
    M(r'^# plantar interosseous of foot$', 'Mm. interossei plantares', 'Ayağın kemikler arası kasları'),
    T(r'^long plantar ligament$', 'Lig. plantare longum', 'Uzun taban bağı'),
    T(r'^interosseous membrane of leg$', 'Membrana interossea cruris', 'Bacak kemikler arası zarı'),
    # Pelvis tabanı
    M(r'^pubococcygeus$', 'M. pubococcygeus (m. levator ani)', 'Pubokoksigeal kas (pelvis tabanı)'),
    M(r'^puborectalis$', 'M. puborectalis (m. levator ani)', 'Puborektal kas (pelvis tabanı)'),
    M(r'^iliococcygeus$', 'M. iliococcygeus (m. levator ani)', 'İliokoksigeal kas (pelvis tabanı)'),
    T(r'^tendinous arch of levator ani$', 'Arcus tendineus m. levatoris ani', 'Levator ani tendon kemeri'),
    M(r'^coccygeus$', 'M. coccygeus', 'Koksigeal kas (pelvis tabanı)'),
    M(r'^external anal sphincter$', 'M. sphincter ani externus', 'Dış anal sfinkter'),
    # Göz çevresi kasları
    M(r'^superior rectus$', 'M. rectus superior', 'Üst düz göz kası (N. III)'),
    M(r'^inferior rectus$', 'M. rectus inferior', 'Alt düz göz kası (N. III)'),
    M(r'^medial rectus$', 'M. rectus medialis', 'İç düz göz kası (N. III)'),
    M(r'^lateral rectus$', 'M. rectus lateralis', 'Dış düz göz kası (N. VI)'),
    M(r'^superior oblique$', 'M. obliquus superior', 'Üst eğik göz kası (N. IV)'),
    M(r'^inferior oblique$', 'M. obliquus inferior', 'Alt eğik göz kası (N. III)'),
    M(r'^levator palpebrae superioris$', 'M. levator palpebrae superioris', 'Üst göz kapağı kaldırıcı kas'),
    T(r'^tendon of levator palpebrae superioris$', 'M. levator palpebrae superioris', 'Üst göz kapağı kaldırıcı kas'),
    T(r'^check ligament of (lateral|medial) rectus$', 'Lig. retinaculum (göz)', 'Göz kası kontrol bağı'),
    T(r'^common tendinous ring$', 'Anulus tendineus communis', 'Ortak tendon halkası'),
    T(r'^trochlea of superior oblique$', 'Trochlea m. obliqui superioris', 'Üst eğik kas makarası'),

    # ---------------- KALP ----------------
    O(r'^wall of atrium$', 'Atrium', 'Kulakçık', 'heart'),
    O(r'^cavity of atrium$', 'Atrium', 'Kulakçık', 'heart'),
    O(r'^wall of ventricle$', 'Ventriculus cordis', 'Karıncık', 'heart'),
    O(r'^cavity of ventricle$', 'Ventriculus cordis', 'Karıncık', 'heart'),
    O(r'^(anterior|posterior) leaflet of mitral valve$', 'Valva mitralis', 'Mitral (biküspit) kapak', 'valve'),
    O(r'^(anterior|posterior|septal) leaflet of tricuspid valve$', 'Valva tricuspidalis', 'Triküspit kapak', 'valve'),
    O(r'^(anterior|posterior|left|right)? ?cusp of aortic valve$', 'Valva aortae', 'Aort kapağı', 'valve'),
    O(r'^(anterior|posterior|left|right)? ?cusp of pulmonary valve$', 'Valva trunci pulmonalis', 'Pulmoner kapak', 'valve'),
    O(r'^.*papillary muscle of ventricle$', 'Mm. papillares', 'Papiller kaslar', 'heart'),

    # ---------------- DAMARLAR: koroner ----------------
    A(r'^trunk of coronary artery$', 'A. coronaria', 'Koroner arter'),
    A(r'^.*(anterior interventricular|anterior descending)', 'R. interventricularis anterior (LAD)', 'Sol ön inen koroner arter (LAD) ve dalları'),
    A(r'^septal branch of anterior interventricular artery$', 'R. interventricularis anterior (LAD)', 'Sol ön inen koroner arter (LAD) ve dalları'),
    A(r'^(circumflex branch|marginal branch) of coronary artery$', 'R. circumflexus', 'Sirkumfleks arter ve dalları'),
    A(r'^.*posterior interventricular', 'R. interventricularis posterior', 'Arka inen koroner arter'),
    A(r'^.*ventricular branch of coronary artery$', 'A. coronaria – ventriküler dallar', 'Koroner arterin ventriküler dalları'),
    A(r'^conus artery$', 'A. coronaria – r. coni arteriosi', 'Konus arteri'),
    V(r'^coronary sinus$', 'Sinus coronarius', 'Koroner sinüs'),
    V(r'^great cardiac vein$', 'V. cardiaca magna', 'Büyük kalp veni'),
    V(r'^(middle|small) cardiac vein$', 'Vv. cardiacae', 'Kalp venleri'),
    V(r'^(anterior cardiac|anterior interventricular|marginal|posterior) vein( of ventricle)?$', 'Vv. cardiacae', 'Kalp venleri'),

    # ---------------- DAMARLAR: büyük arterler ----------------
    A(r'^ascending aorta$', 'Aorta ascendens', 'Çıkan aorta'),
    A(r'^arch of aorta$', 'Arcus aortae', 'Aort kavsi'),
    A(r'^(descending aorta|descending thoracic aorta)$', 'Aorta thoracica (descendens)', 'İnen (torasik) aorta'),
    A(r'^abdominal aorta$', 'Aorta abdominalis', 'Karın aortası'),
    A(r'^brachiocephalic artery$', 'Truncus brachiocephalicus', 'Brakiyosefalik arter'),
    A(r'^common carotid artery$', 'A. carotis communis', 'Ortak karotis arter'),
    A(r'^internal carotid artery$', 'A. carotis interna', 'İç karotis arter'),
    A(r'^subclavian artery$', 'A. subclavia', 'Köprücük altı arteri'),
    A(r'^vertebral artery$', 'A. vertebralis', 'Vertebral arter'),
    A(r'^(thyrocervical trunk|inferior thyroid artery|transverse cervical artery|superficial cervical artery|suprascapular artery|dorsal scapular artery)$', 'Truncus thyrocervicalis ve dalları', 'Tiroservikal gövde ve dalları'),
    A(r'^(costocervical trunk|deep cervical artery|superior intercostal artery)$', 'Truncus costocervicalis ve dalları', 'Kostoservikal gövde ve dalları'),
    A(r'^(internal thoracic|musculophrenic|superior epigastric) artery$', 'A. thoracica interna ve dalları', 'İç göğüs arteri ve dalları'),
    A(r'^(# )?posterior intercostal arter', 'Aa. intercostales posteriores', 'Arka interkostal arterler'),
    A(r'^(subcostal|lumbar) artery$', 'Aa. lumbales / a. subcostalis', 'Bel ve kaburga altı arterleri'),
    A(r'^(bronchial artery|bronchial branch of arch of aorta|esophageal artery|set of oesophageal branches of thoracic aorta)$', 'Rr. viscerales aortae thoracicae', 'Torasik aortanın organ dalları'),
    A(r'^inferior phrenic artery$', 'A. phrenica inferior', 'Alt diyafram arteri'),
    # Kol arterleri
    A(r'^axillary artery$', 'A. axillaris', 'Koltuk altı arteri'),
    A(r'^.*thoraco-acromial artery$', 'A. thoracoacromialis', 'Torakoakromiyal arter'),
    A(r'^(lateral thoracic|subscapular|circumflex scapular|thoracodorsal) artery$', 'A. axillaris dalları', 'Koltuk altı arterinin dalları'),
    A(r'^(anterior|posterior) circumflex humeral artery$', 'Aa. circumflexae humeri', 'Humerusu çevreleyen arterler'),
    A(r'^brachial artery$', 'A. brachialis', 'Kol arteri (tansiyon ölçüm yeri)'),
    A(r'^(deep brachial artery|middle collateral branch of deep brachial artery|radial collateral branch of deep brachial artery)$', 'A. profunda brachii', 'Derin kol arteri'),
    A(r'^(superior|inferior) ulnar collateral artery$', 'Aa. collaterales ulnares', 'Ulnar kollateral arterler'),
    A(r'^radial artery$', 'A. radialis', 'Radial arter (nabız)'),
    A(r'^radial recurrent artery$', 'A. recurrens radialis', 'Radial rekürren arter'),
    A(r'^ulnar artery$', 'A. ulnaris', 'Ulnar arter'),
    A(r'^(anterior|posterior) ulnar recurrent artery$', 'A. recurrens ulnaris', 'Ulnar rekürren arter'),
    A(r'^(common|anterior) interosseous artery$|^recurrent interosseous artery$', 'A. interossea', 'Kemikler arası arter'),
    A(r'^(superficial palmar arterial arch|deep palmar arch|dorsal carpal branch of (radial|ulnar) artery|arteria princeps pollicis|arteria radialis indicis|palmar metacarpal artery|set of dorsal metacarpal arteries|# common palmar digital artery|.*proper palmar digital artery.*|set of dorsal digital arteries)$', 'Arcus palmaris ve el arterleri', 'Avuç kemerleri ve el arterleri'),
    # Karın arterleri
    A(r'^(celiac artery|celiac trunk)$', 'Truncus coeliacus', 'Çölyak gövde'),
    A(r'^common hepatic artery$', 'A. hepatica communis', 'Ortak hepatik arter'),
    A(r'^(hepatic artery proper|trunk of hepatic artery|lobe branch of hepatic artery|caudate lobe branch of hepatic artery|.*segmental hepatic artery)$', 'A. hepatica propria ve dalları', 'Hepatik arter ve karaciğer içi dalları'),
    A(r'^trunk of gastroduodenal artery$', 'A. gastroduodenalis', 'Gastroduodenal arter'),
    A(r'^gastric artery$', 'A. gastrica', 'Mide arteri'),
    A(r'^gastro-epiploic artery$', 'A. gastroomentalis', 'Gastroomental arter'),
    A(r'^splenic artery$', 'A. splenica', 'Dalak arteri'),
    A(r'^(.*pancreaticoduodenal artery|dorsal pancreatic artery|great pancreatic artery|caudal pancreatic artery|inferior pancreatic artery)$', 'Pankreas arterleri', 'Pankreas ve duodenum arterleri'),
    A(r'^(superior mesenteric artery|trunk of superior mesenteric artery)$', 'A. mesenterica superior', 'Üst mezenterik arter'),
    A(r'^(ileal artery|jejunal artery)$', 'Aa. jejunales et ileales', 'Jejunum ve ileum arterleri'),
    A(r'^(ileocolic artery|.*branch of inferior branch of ileocolic artery|anterior cecal artery|posterior cecal artery)$', 'A. ileocolica', 'İleokolik arter'),
    A(r'^appendicular artery$', 'A. appendicularis', 'Apendiks arteri'),
    A(r'^(colic artery|middle colic artery|ascending branch of colic artery|descending branch of colic artery)$', 'Aa. colicae', 'Kolon arterleri'),
    A(r'^(marginal artery of colon|marginal colic artery)$', 'A. marginalis coli', 'Kolonun marjinal arteri'),
    A(r'^inferior mesenteric artery$', 'A. mesenterica inferior', 'Alt mezenterik arter'),
    A(r'^sigmoid artery$', 'Aa. sigmoideae', 'Sigmoid arterler'),
    A(r'^superior rectal artery$', 'A. rectalis superior', 'Üst rektal arter'),
    A(r'^(renal artery|trunk of renal artery|(anterior|posterior) division of renal artery|.*segmental branch of renal artery|ureteric segment of renal artery)$', 'A. renalis', 'Böbrek arteri'),
    A(r'^(inferior|middle) suprarenal artery$', 'Aa. suprarenales', 'Böbrek üstü bezi arterleri'),
    A(r'^testicular artery$', 'A. testicularis', 'Testis arteri (kadında a. ovarica)'),
    # Pelvis ve bacak arterleri
    A(r'^common iliac artery$', 'A. iliaca communis', 'Ortak iliak arter'),
    A(r'^external iliac artery$', 'A. iliaca externa', 'Dış iliak arter'),
    A(r'^internal iliac artery$', 'A. iliaca interna', 'İç iliak arter (kadında a. uterina buradan çıkar)'),
    A(r'^(inferior|superficial) epigastric artery$', 'Aa. epigastricae', 'Epigastrik arterler'),
    A(r'^dorsal artery of penis$', 'A. dorsalis penis', 'Penisin sırt arteri'),
    A(r'^femoral artery$', 'A. femoralis', 'Femoral arter'),
    A(r'^(lateral circumflex femoral artery|descending branch of lateral circumflex femoral artery)$', 'A. circumflexa femoris lateralis', 'Dış sirkumfleks femoral arter'),
    A(r'^(distal perforating artery|set of perforating arteries)$', 'A. profunda femoris (perforan dallar)', 'Derin femoral arter dalları'),
    A(r'^descending genicular artery$|^.*genicular artery$', 'Aa. genus', 'Diz arterleri'),
    A(r'^popliteal artery$', 'A. poplitea', 'Diz arkası arteri'),
    A(r'^(anterior tibial artery|anterior tibial recurrent artery)$', 'A. tibialis anterior', 'Ön tibial arter'),
    A(r'^(posterior tibial artery|set of calcaneal branches of posterior tibial artery)$', 'A. tibialis posterior', 'Arka tibial arter (iç topuk arkası nabız)'),
    A(r'^dorsalis pedis artery$', 'A. dorsalis pedis', 'Ayak sırtı arteri (nabız)'),
    A(r'^(arcuate artery|lateral tarsal artery|deep plantar artery|plantar arch|(lateral|medial|superficial medial) plantar artery|plantar metatarsal artery|set of common plantar digital arteries|set of plantar digital arteries proper|dorsal digital artery of foot)$', 'Ayak arterleri', 'Ayak tabanı ve sırtı arterleri'),
    # Beyin arterleri
    A(r'^basilar artery$', 'A. basilaris', 'Baziler arter'),
    A(r'^(anterior cerebral artery|callosomarginal artery|pericallosal artery|.*branch of callosomarginal artery|precuneal branch of pericallosal artery|(lateral|medial) frontobasal artery|prefrontal artery)$', 'A. cerebri anterior ve dalları', 'Ön beyin arteri ve dalları'),
    A(r'^(sphenoid part of middle cerebral artery|insular part of middle cerebral artery|.*branch of middle cerebral artery.*|trunk of inferior terminal branch of middle cerebral artery|artery of (central|precentral|postcentral) sulcus|(anterior|posterior) parietal artery|anterior temporal artery|polar temporal artery)$', 'A. cerebri media ve dalları', 'Orta beyin arteri ve dalları'),
    A(r'^((pre|post)communicating part of posterior cerebral artery|(lateral|medial) occipital artery|.*branch of lateral occipital artery|set of posterior temporal branches of lateral occipital artery|thalamogeniculate artery|thalamoperforating artery|posteromedial central branch of posterior cerebral artery|posterior medial choroidal artery|splenial artery)$', 'A. cerebri posterior ve dalları', 'Arka beyin arteri ve dalları'),
    A(r'^anterior communicating artery$', 'A. communicans anterior', 'Ön bağlantı arteri (Willis)'),
    A(r'^(posterior communicating artery|hypothalamic branch of posterior communicating artery)$', 'A. communicans posterior', 'Arka bağlantı arteri (Willis)'),
    A(r'^(anterior choroidal artery|branch of anterior choroidal artery.*)$', 'A. choroidea anterior', 'Ön koroid arter'),
    A(r'^(superior cerebellar artery|.*branch of superior cerebellar artery|superior vermian branch.*)$', 'A. superior cerebelli', 'Üst beyincik arteri'),
    A(r'^anterior inferior cerebellar artery$', 'A. inferior anterior cerebelli', 'Ön alt beyincik arteri'),
    A(r'^posterior inferior cerebellar artery$', 'A. inferior posterior cerebelli', 'Arka alt beyincik arteri'),
    A(r'^(lateral|medial) branch of pontine artery$', 'Aa. pontis', 'Pons arterleri'),
    A(r'^anterior spinal artery$', 'A. spinalis anterior', 'Ön spinal arter'),
    A(r'^ophthalmic artery$', 'A. ophthalmica', 'Göz arteri'),
    # Akciğer damarları
    A(r'^pulmonary trunk$', 'Truncus pulmonalis', 'Pulmoner gövde'),
    A(r'^pulmonary artery$', 'A. pulmonalis', 'Pulmoner arter'),
    A(r'^(.*segmental artery|.*lingular artery|upper lobar artery|.*branch of .*segmental artery|accessory subsuperior.*)$', 'Aa. pulmonales segmentales', 'Pulmoner arter dalları'),
    V(r'^(superior|inferior) pulmonary vein$', 'Vv. pulmonales', 'Pulmoner venler'),
    V(r'^(.*segmental vein|.*lingular vein|trunk of apical segmental vein|.*part of .*segmental vein)$', 'Vv. pulmonales segmentales', 'Pulmoner ven dalları'),

    # ---------------- DAMARLAR: venler ----------------
    V(r'^superior vena cava$', 'V. cava superior', 'Üst ana toplardamar'),
    V(r'^inferior vena cava$', 'V. cava inferior', 'Alt ana toplardamar'),
    V(r'^brachiocephalic vein$', 'V. brachiocephalica', 'Brakiyosefalik ven'),
    V(r'^internal jugular vein$', 'V. jugularis interna', 'İç juguler ven'),
    V(r'^subclavian vein$', 'V. subclavia', 'Köprücük altı veni'),
    V(r'^axillary vein$', 'V. axillaris', 'Koltuk altı veni'),
    V(r'^cephalic vein$', 'V. cephalica', 'Sefalik ven'),
    V(r'^basilic vein$', 'V. basilica', 'Bazilik ven'),
    V(r'^median cubital vein$', 'V. mediana cubiti', 'Dirsek önü veni (kan alma)'),
    V(r'^median antebrachial vein$', 'V. mediana antebrachii', 'Önkol orta veni'),
    V(r'^(medial brachial vein|radial vein|ulnar vein|anterior circumflex humeral vein|(lateral thoracic|thoracodorsal|subscapular|circumflex scapular|suprascapular) vein)$', 'Kolun derin venleri', 'Kol ve omuz derin venleri'),
    V(r'^(dorsal venous network of hand|dorsal metacarpal vein|palmar metacarpal vein|common palmar digital vein|proper palmar digital vein.*|(deep|superficial) palmar venous arch|set of dorsal digital veins)$', 'Elin venleri', 'El sırtı ve avuç venleri (damar yolu)'),
    V(r'^(internal thoracic|musculophrenic|superior epigastric) vein$|^set of anterior intercostal veins$', 'V. thoracica interna', 'İç göğüs veni'),
    V(r'^azygos vein$', 'V. azygos', 'Azigos ven'),
    V(r'^(hemiazygos|accessory hemiazygos) vein$', 'V. hemiazygos', 'Hemiazigos ven'),
    V(r'^(superior intercostal|subcostal|lumbar|ascending lumbar) vein$', 'Vv. intercostales / lumbales', 'İnterkostal ve lumbal venler'),
    V(r'^(superior|inferior) phrenic vein$', 'Vv. phrenicae', 'Diyafram venleri'),
    V(r'^(hepatic vein|middle hepatic vein|tributary of middle hepatic vein|.*tributary of (middle )?hepatic vein)$', 'Vv. hepaticae', 'Hepatik venler'),
    V(r'^(hepatic portal vein|portal vein|trunk of portal vein|pre-hepatic portal vein|.*branch of portal vein)$', 'V. portae hepatis', 'Portal ven (kapı toplardamarı)', 'portal'),
    V(r'^splenic vein$', 'V. splenica', 'Dalak veni', 'portal'),
    V(r'^superior mesenteric vein$', 'V. mesenterica superior', 'Üst mezenterik ven', 'portal'),
    V(r'^inferior mesenteric vein$', 'V. mesenterica inferior', 'Alt mezenterik ven', 'portal'),
    V(r'^(gastric|gastroepiploic|pancreaticoduodenal|ileal|ileocolic|colic|middle colic|sigmoid|superior rectal) vein$', 'Portal sistem venleri', 'Mide-bağırsak venleri (portal sistem)', 'portal'),
    V(r'^renal vein$', 'V. renalis', 'Böbrek veni'),
    V(r'^suprarenal vein$', 'V. suprarenalis', 'Böbrek üstü bezi veni'),
    V(r'^testicular vein$', 'V. testicularis', 'Testis veni (kadında v. ovarica)'),
    V(r'^common iliac vein$', 'V. iliaca communis', 'Ortak iliak ven'),
    V(r'^external iliac vein$', 'V. iliaca externa', 'Dış iliak ven'),
    V(r'^internal iliac vein$', 'V. iliaca interna', 'İç iliak ven'),
    V(r'^((superior|inferior) gluteal|obturator|internal pudendal|lateral sacral|median sacral|iliolumbar) vein$', 'Pelvis venleri', 'Pelvis duvarı ve organ venleri'),
    V(r'^(inferior|superficial) epigastric vein$', 'Vv. epigastricae', 'Epigastrik venler'),
    V(r'^(deep|superficial) dorsal vein of penis$', 'Vv. dorsales penis', 'Penis sırt venleri'),
    V(r'^femoral vein$', 'V. femoralis', 'Femoral ven'),
    V(r'^(deep femoral|(lateral|medial) circumflex femoral) vein$|^set of perforating veins$', 'V. profunda femoris', 'Derin femoral ven'),
    V(r'^great saphenous vein$', 'V. saphena magna', 'Büyük safen ven (en uzun ven)'),
    V(r'^small saphenous vein$', 'V. saphena parva', 'Küçük safen ven'),
    V(r'^(popliteal|genicular) vein$', 'V. poplitea', 'Diz arkası veni'),
    V(r'^(anterior|posterior) tibial vein$|^fibular vein$', 'Vv. tibiales / fibulares', 'Bacağın derin venleri (DVT)'),
    V(r'^(dorsal venous arch of foot|plantar venous arch of foot|tributary of plantar venous arch|plantar metatarsal vein|set of plantar digital veins)$', 'Ayak venleri', 'Ayak venleri'),

    # ---------------- ORGANLAR ----------------
    O(r'^tongue$', 'Lingua', 'Dil', 'gi'),
    O(r'^gingiva of (upper|lower) jaw$', 'Gingiva', 'Diş eti', 'gi'),
    O(r'^submandibular gland$', 'Gl. submandibularis', 'Çene altı tükürük bezi', 'gland'),
    O(r'^sublingual gland$', 'Gl. sublingualis', 'Dil altı tükürük bezi', 'gland'),
    O(r'^esophagus$', 'Oesophagus', 'Yemek borusu', 'gi'),
    O(r'^stomach$', 'Gaster', 'Mide', 'gi'),
    O(r'^duodenum$', 'Duodenum', 'Onikiparmak bağırsağı', 'gi'),
    O(r'^(proximal|middle|distal) part of jejunum$', 'Jejunum', 'Jejunum (boş bağırsak)', 'gi'),
    O(r'^(proximal|middle|distal) part of ileum$', 'Ileum', 'İleum (kıvrım bağırsak)', 'gi'),
    O(r'^ileocecal junction$', 'Caecum', 'Kör bağırsak (çekum)', 'gi'),
    O(r'^appendix$', 'Appendix vermiformis', 'Apandis', 'gi'),
    O(r'^ascending colon$', 'Colon ascendens', 'Çıkan kolon', 'gi'),
    O(r'^transverse colon$', 'Colon transversum', 'Transvers kolon', 'gi'),
    O(r'^descending colon$', 'Colon descendens', 'İnen kolon', 'gi'),
    O(r'^taenia (libera|mesocolica|omentalis)$', 'Taeniae coli', 'Kolon şeritleri (tenya koli)', 'membrane'),
    O(r'^rectum$', 'Rectum', 'Rektum', 'gi'),
    O(r'^(mesentery of small intestine|transverse mesocolon|mesoappendix)$', 'Mesenterium', 'Mezenter / mezokolon', 'membrane'),
    O(r'^(hepatovenous segment .*|caudate lobe of liver)$', 'Hepar', 'Karaciğer', 'liver'),
    O(r'^(hepatic duct|duct of caudate lobe of liver|.*tributary of hepatic biliary tree)$', 'Ductus hepatici', 'Karaciğer içi safra kanalları', 'bile'),
    O(r'^common hepatic duct$', 'Ductus hepaticus communis', 'Ortak hepatik kanal', 'bile'),
    O(r'^cystic duct$', 'Ductus cysticus', 'Kistik kanal', 'bile'),
    O(r'^gallbladder$', 'Vesica biliaris', 'Safra kesesi', 'gall'),
    O(r'^(pancreas|parenchyma of pancreas)$', 'Pancreas', 'Pankreas', 'pancreas'),
    O(r'^pancreatic duct( tree)?$', 'Ductus pancreaticus', 'Pankreas kanalı (Wirsung)', 'bile'),
    O(r'^spleen$', 'Splen (lien)', 'Dalak', 'spleen'),
    O(r'^trachea$', 'Trachea', 'Soluk borusu', 'cartilage'),
    O(r'^main bronchus( proper)?$', 'Bronchus principalis', 'Ana bronş', 'cartilage'),
    O(r'^.*bronchial tree$', 'Arbor bronchialis', 'Bronş ağacı (segment bronşları)', 'lung'),
    O(r'^kidney$', 'Ren', 'Böbrek', 'kidney'),
    O(r'^ureter$', 'Ureter', 'Üreter', 'urinary'),
    O(r'^urinary bladder$', 'Vesica urinaria', 'İdrar kesesi (mesane)', 'urinary'),
    O(r'^urethra$', 'Urethra', 'Üretra', 'urinary'),
    O(r'^adrenal gland$', 'Gl. suprarenalis', 'Böbrek üstü bezi', 'gland'),
    O(r'^lobe of thymus$', 'Thymus', 'Timus', 'gland'),
    O(r'^prostate$', 'Prostata', 'Prostat', 'genital'),
    O(r'^testis$', 'Testis', 'Testis (er bezi)', 'genital'),
    O(r'^epididymis$', 'Epididymis', 'Epididim', 'genital'),
    O(r'^deferent duct$', 'Ductus deferens', 'Sperm kanalı (ductus deferens)', 'genital'),
    O(r'^seminal vesicle$', 'Vesicula seminalis', 'Semen kesesi', 'genital'),
    O(r'^corpus cavernosum of penis$', 'Corpus cavernosum penis', 'Penisin kavernöz cismi', 'genital'),
    O(r'^corpus spongiosum of penis$', 'Corpus spongiosum penis', 'Penisin süngerimsi cismi', 'genital'),
    O(r'^glans penis$', 'Glans penis', 'Glans penis', 'genital'),
    # Göz ve gözyaşı aygıtı
    O(r'^sclera$', 'Sclera', 'Sklera (göz akı)', 'eye'),
    O(r'^cornea$', 'Cornea', 'Kornea', 'lens'),
    O(r'^choroid$', 'Choroidea', 'Koroid', 'iris'),
    O(r'^iris$', 'Iris', 'İris', 'iris'),
    O(r'^corona ciliaris$', 'Corpus ciliare', 'Siliyer cisim', 'iris'),
    O(r'^lens$', 'Lens', 'Göz merceği', 'lens'),
    O(r'^suspensory ligament of lens$', 'Zonula ciliaris', 'Mercek askı bağı', 'lens'),
    O(r'^vitreous body$', 'Corpus vitreum', 'Camsı cisim', 'lens'),
    O(r'^anterior chamber of eyeball$', 'Camera anterior bulbi', 'Ön kamara', 'lens'),
    O(r'^optic part of retina$', 'Retina', 'Retina (ağ tabaka)', 'nerve'),
    O(r'^lacrimal gland$', 'Gl. lacrimalis', 'Gözyaşı bezi', 'gland'),
    O(r'^(lacrimal canaliculus|lacrimal lake|lacrimal sac|nasolacrimal duct)$', 'Apparatus lacrimalis', 'Gözyaşı kanalları', 'gland'),
    O(r'^tarsal plate of (upper|lower) eyelid$', 'Tarsus palpebrae', 'Göz kapağı tarsal plağı', 'membrane'),
    (r'^pituitary gland$', 'Hypophysis', 'Hipofiz bezi', 'sinir', 'gland'),
    (r'^pineal body$', 'Gl. pinealis', 'Epifiz bezi', 'sinir', 'gland'),

    # ---------------- SİNİR SİSTEMİ ----------------
    N(r'^precentral gyrus$', 'Gyrus precentralis', 'Ön merkezi kıvrım (primer motor korteks)'),
    N(r'^postcentral gyrus$', 'Gyrus postcentralis', 'Arka merkezi kıvrım (primer duyu korteksi)'),
    N(r'^superior frontal gyrus$', 'Gyrus frontalis superior', 'Üst frontal kıvrım'),
    N(r'^middle frontal gyrus$', 'Gyrus frontalis medius', 'Orta frontal kıvrım'),
    N(r'^inferior frontal gyrus$', 'Gyrus frontalis inferior', 'Alt frontal kıvrım (Broca alanı – solda)'),
    N(r'^orbital gyrus$', 'Gyri orbitales', 'Orbital kıvrımlar'),
    N(r'^(anterior|posterior) part of superior temporal gyrus$', 'Gyrus temporalis superior', 'Üst temporal kıvrım (işitme, Wernicke alanı)'),
    N(r'^middle temporal gyrus$', 'Gyrus temporalis medius', 'Orta temporal kıvrım'),
    N(r'^inferior temporal gyrus$', 'Gyrus temporalis inferior', 'Alt temporal kıvrım'),
    N(r'^fusiform gyrus$', 'Gyrus fusiformis', 'İğsi kıvrım'),
    N(r'^parahippocampal gyrus$', 'Gyrus parahippocampalis', 'Parahipokampal kıvrım'),
    N(r'^cingulate gyrus$', 'Gyrus cinguli', 'Kuşak kıvrımı (limbik)'),
    N(r'^angular gyrus$', 'Gyrus angularis', 'Açısal kıvrım'),
    N(r'^supramarginal gyrus$', 'Gyrus supramarginalis', 'Supramarjinal kıvrım'),
    N(r'^superior parietal lobule$', 'Lobulus parietalis superior', 'Üst parietal lobül'),
    N(r'^occipital lobe$', 'Lobus occipitalis', 'Oksipital lob (görme merkezi)'),
    N(r'^insula$', 'Insula', 'İnsula'),
    N(r'^white matter of cerebral hemisphere$', 'Substantia alba', 'Beyin ak maddesi', 'white'),
    N(r'^corpus callosum$', 'Corpus callosum', 'Nasırlı cisim (iki yarıkürenin bağlantısı)', 'white'),
    N(r'^internal capsule$', 'Capsula interna', 'İç kapsül', 'white'),
    N(r'^(anterior|posterior) commissure$|^commissure of fornix of forebrain$', 'Commissurae cerebri', 'Beyin komissürleri', 'white'),
    N(r'^fornix of forebrain$', 'Fornix', 'Forniks', 'white'),
    N(r'^caudate nucleus$', 'Nucleus caudatus', 'Kuyruklu çekirdek (bazal ganglion)', 'brainstem'),
    N(r'^putamen$', 'Putamen', 'Putamen (bazal ganglion)', 'brainstem'),
    N(r'^globus pallidus$', 'Globus pallidus', 'Soluk küre (bazal ganglion)', 'brainstem'),
    N(r'^amygdala$', 'Corpus amygdaloideum', 'Amigdala (duygu)', 'brainstem'),
    N(r'^hippocampus$', 'Hippocampus', 'Hipokampus (hafıza)', 'brainstem'),
    N(r'^thalamus$', 'Thalamus', 'Talamus (duyu aktarma merkezi)', 'brainstem'),
    N(r'^hypothalamus$', 'Hypothalamus', 'Hipotalamus (hormon ve ısı kontrolü)', 'brainstem'),
    N(r'^(mammillary body|tuber cinereum|lamina terminalis|habenula|stria medullaris of thalamus|stria terminalis|septum of telencephalon)$', 'Diencephalon yapıları', 'Ara beyin yapıları', 'brainstem'),
    N(r'^(lateral|medial) geniculate body$', 'Corpus geniculatum', 'Dizsi cisim (görme/işitme aktarımı)', 'brainstem'),
    N(r'^(superior|inferior) colliculus$|^brachium of (superior|inferior) colliculus$', 'Colliculi (tectum)', 'Kollikuluslar (orta beyin tavanı)', 'brainstem'),
    N(r'^(midbrain|peduncle of midbrain|interpeduncular fossa)$', 'Mesencephalon', 'Orta beyin', 'brainstem'),
    N(r'^pons$', 'Pons', 'Pons (köprü)', 'brainstem'),
    N(r'^medulla oblongata$', 'Medulla oblongata', 'Soğan ilik (solunum ve kalp merkezleri)', 'brainstem'),
    N(r'^cerebellum$', 'Cerebellum', 'Beyincik (denge ve koordinasyon)'),
    N(r'^tentorium cerebelli$', 'Tentorium cerebelli', 'Beyincik çadırı (dura)', 'membrane'),
    N(r'^choroid plexus of cerebral hemisphere$', 'Plexus choroideus', 'Koroid pleksus (BOS üretir)', 'csf'),
    N(r'^(lateral ventricle|# ventricle|cerebral aqueduct|interventricular foramen|central canal of spinal cord)$', 'Ventriculi cerebri', 'Beyin ventrikülleri (BOS boşlukları)', 'csf'),
    N(r'^optic chiasm$', 'Chiasma opticum', 'Optik kiazma', 'nerve'),
    N(r'^optic nerve$', 'N. opticus (II)', 'Görme siniri (N. II)', 'nerve'),
    N(r'^optic tract$', 'Tractus opticus', 'Optik yol', 'nerve'),
    N(r'^(superior|inferior) branch of oculomotor nerve$', 'N. oculomotorius (III)', 'Göz hareket siniri (N. III)', 'nerve'),
    N(r'^trochlear nerve$', 'N. trochlearis (IV)', 'Troklear sinir (N. IV)', 'nerve'),
    N(r'^(ophthalmic|frontal|supra-orbital|supratrochlear|lacrimal|nasociliary|infratrochlear|(anterior|posterior) ethmoidal|long ciliary|short ciliary) nerve$|^communicating branch of nasociliary nerve.*$', 'N. ophthalmicus (V1) ve dalları', 'Oftalmik sinir (N. V1) ve dalları', 'nerve'),
    N(r'^ciliary ganglion$', 'Ganglion ciliare', 'Siliyer gangliyon', 'nerve'),
]

COMPILED = [(re.compile(p), la, tr, layer, kind) for (p, la, tr, layer, kind) in RULES]


def parse_side(name):
    n = name.lower()
    side = None
    if re.search(r'\bleft\b', n):
        side = 'L'
    elif re.search(r'\bright\b', n):
        side = 'R'
    n = re.sub(r'\b(left|right)\b', '', n)
    n = re.sub(r'\s+', ' ', n).strip()
    return n, side


def classify(name):
    """İngilizce isim → (latince, türkçe, katman, tür, taraf) ya da None (dahil etme) / 'UNMATCHED'."""
    n, side = parse_side(name)
    num = None
    m_ord = re.search(r'\b(' + '|'.join(ORDINALS) + r')\b', n)
    if m_ord:
        num = ORDINALS[m_ord.group(1)]
    norm = re.sub(r'\b(' + '|'.join(ORDINALS) + r')\b', '#', n)
    # Parmak kemikleri (isimleri parmağa göre üretilir)
    m = re.match(r'^(proximal|middle|distal) phalanx of (.+)$', n)
    if m:
        part, digit = m.groups()
        la_p, tr_p = PHALANX[part]
        if digit in FINGERS:
            return (f'Phalanx {la_p} digiti {FINGERS[digit]} manus', f'{FINGERS_TR[digit].capitalize()} {tr_p} falanksı', 'iskelet', 'bone', side)
        if digit in TOES:
            return (f'Phalanx {la_p} digiti {TOES[digit]} pedis', f'Ayak {TOES_TR[digit]} {tr_p} falanksı', 'iskelet', 'bone', side)
    for rx, la, tr, layer, kind in COMPILED:
        if rx.search(norm) or rx.search(n):
            if la is None:
                return None
            if num is not None:
                la = la.replace('{r}', ROMAN[num]).replace('{n}', str(num))
                tr = tr.replace('{n}', str(num))
            # Dişlerde alt/üst çene ayrımı
            if kind == 'tooth':
                jaw = 'üst' if n.startswith('upper') else 'alt'
                la = f'{la} ({"maxillaris" if jaw == "üst" else "mandibularis"})'
                tr = f'{tr} ({jaw} çene)'
            # Kalp odacıklarında sağ/sol ismin parçasıdır
            if kind == 'heart' and side and la in ('Atrium', 'Ventriculus cordis'):
                la = f'{la} {"dextrum" if side == "R" else "sinistrum"}' if la == 'Atrium' else f'Ventriculus {"dexter" if side == "R" else "sinister"}'
                tr = f'{"Sağ" if side == "R" else "Sol"} {tr.lower()}'
                side = None
            # Koroner arter gövdesi
            if la == 'A. coronaria' and side:
                la = f'A. coronaria {"dextra" if side == "R" else "sinistra"}'
                tr = f'{"Sağ" if side == "R" else "Sol"} koroner arter'
                side = None
            return (la, tr, layer, kind, side)
    return 'UNMATCHED'
