const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

/**
 * Mağaza ekran görüntülerini web sürümünden üretir.
 * Kullanım: `npx expo start --web` çalışırken `node scripts/store-screenshots.js [iphone|ipad|android]`
 * Çıktı: docs/ekran-goruntuleri/<cihaz>/*.png
 */
const ROOT = process.cwd(); // proje kökünden çalıştırılır

/** Test ekranında doğru şıkkı seçebilmek için kart soru → cevap eşlemesi */
function loadAnswers() {
  const src = path.join(ROOT, 'src/data/topics');
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'topics-'));
  for (const f of fs.readdirSync(src)) {
    const { outputText } = ts.transpileModule(fs.readFileSync(path.join(src, f), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    });
    fs.writeFileSync(path.join(tmp, f.replace(/\.ts$/, '.js')), outputText);
  }
  const answers = {};
  for (const t of require(path.join(tmp, 'index.js')).topics) for (const c of t.cards) answers[c.q] = c.a;
  return answers;
}
const ANSWERS = loadAnswers();
const BASE = 'http://localhost:8081';
const DEVICES = {
  iphone: { width: 440, height: 956, dpr: 3 },   // 1320 × 2868 (6,9")
  ipad: { width: 1032, height: 1376, dpr: 2 },   // 2064 × 2752 (13")
  android: { width: 360, height: 720, dpr: 3 },  // 1080 × 2160
};
const only = process.argv.slice(2);

async function seed(p) {
  await p.addInitScript(() => {
    const d = new Date(); const today = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    localStorage.setItem('anatomi-settings-v1', JSON.stringify({ department: 'ebelik', reviewerMode: false }));
    const boxes = {};
    const decks = { pelvis: 14, 'kadin-ureme': 11, fetal: 8, iskelet: 12, kas: 6, dolasim: 9, meme: 5 };
    for (const [k, n] of Object.entries(decks)) for (let i = 0; i < n; i++) boxes[`${k}-${i}`] = 2 + (i % 4);
    localStorage.setItem('anatomi-progress-v1', JSON.stringify({ boxes, quizBest: { pelvis: 90, fetal: 80, iskelet: 75 }, streak: 6, lastStudyDay: today }));
  });
}

async function go(p, path, wait = 2500) {
  await p.goto(BASE + path, { waitUntil: 'networkidle', timeout: 180000 });
  await p.addStyleTag({ content: '::-webkit-scrollbar{display:none} *{scrollbar-width:none}' });
  await p.waitForTimeout(wait);
}

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const [name, d] of Object.entries(DEVICES)) {
    if (only.length && !only.includes(name)) continue;
    const dir = path.join(ROOT, 'docs/ekran-goruntuleri', name);
    fs.mkdirSync(dir, { recursive: true });
    const p = await b.newPage({ viewport: { width: d.width, height: d.height }, deviceScaleFactor: d.dpr });
    await seed(p);
    const shot = async (n) => { await p.screenshot({ path: `${dir}/${n}.png`, timeout: 300000 }); console.log(name, n); };

    // 1 Ana sayfa
    await go(p, '/');
    await shot('1-ana-sayfa');

    // 2 3D model (kas + iskelet)
    await go(p, '/vucut', 15000);
    await shot('2-3d-model');

    // 3 Röntgen modu: kalça kemiği
    await p.getByPlaceholder('Yapı ara').fill('os coxae');
    await p.waitForTimeout(800);
    await p.getByText('Os coxae', { exact: true }).first().click();
    await p.waitForTimeout(15000);
    await p.evaluate(() => {
      const el = [...document.querySelectorAll('div')].find((e) => e.scrollHeight > e.clientHeight + 50 && getComputedStyle(e).overflowY !== 'visible');
      if (el) el.scrollTop = 230;
    });
    await p.waitForTimeout(1500);
    await shot('3-rontgen-pelvis');

    // 4 Konu anlatımı
    await go(p, '/konu/pelvis');
    await shot('4-konu-pelvis');

    // 5 Bilgi kartı (cevap açık)
    await go(p, '/calis/pelvis');
    await p.getByText('Cevabı göster').click();
    await p.waitForTimeout(1200);
    await shot('5-bilgi-karti');

    // 6 Test: doğru cevaplanmış soru, 7 sonuç
    await go(p, '/test/pelvis');
    for (let i = 0; i < 10; i++) {
      const q = await p.evaluate((qs) => Object.keys(qs).find((k) => document.body.innerText.includes(k)), ANSWERS);
      const a = ANSWERS[q];
      const target = i === 6 ? p.locator('text=/^[A-D]$/').first() : null;
      if (target) {
        // bir yanlış: doğru olmayan ilk şık
        const opts = await p.evaluate((ans) => [...document.querySelectorAll('div')].map((e) => e.innerText).filter((t) => /^[A-D]\n/.test(t)).map((t) => t.slice(2)).filter((t) => t !== ans), a);
        await p.getByText(opts[0], { exact: true }).first().click();
      } else {
        await p.getByText(a, { exact: true }).last().click();
      }
      await p.waitForTimeout(600);
      if (i === 0) await shot('6-test-sorusu');
      await p.getByText(i === 9 ? 'Sonucu gör' : 'Sonraki soru').click();
      await p.waitForTimeout(500);
    }
    await p.waitForTimeout(1200);
    await shot('7-test-sonucu');
    await p.close();
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
