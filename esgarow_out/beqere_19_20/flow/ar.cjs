(async()=>{
const { chromium } = require('playwright');
const fs = require('fs');
const P = {
 hook: 'يَكَادُ الْبَرْقُ يَخْطَفُ أَبْصَارَهُمْ',
 a1: 'أَوْ كَصَيِّبٍ مِّنَ السَّمَاءِ فِيهِ ظُلُمَاتٌ وَرَعْدٌ وَبَرْقٌ',
 a2: 'يَجْعَلُونَ أَصَابِعَهُمْ فِي آذَانِهِم مِّنَ الصَّوَاعِقِ حَذَرَ الْمَوْتِ',
 a3: 'وَاللَّهُ مُحِيطٌ بِالْكَافِرِينَ',
 a4: 'يَكَادُ الْبَرْقُ يَخْطَفُ أَبْصَارَهُمْ',
 a5: 'كُلَّمَا أَضَاءَ لَهُم مَّشَوْا فِيهِ',
 a6: 'وَإِذَا أَظْلَمَ عَلَيْهِمْ قَامُوا',
 a7: 'وَلَوْ شَاءَ اللَّهُ لَذَهَبَ بِسَمْعِهِمْ وَأَبْصَارِهِمْ',
 a8: 'إِنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
 hacc: 'وَمِنَ النَّاسِ مَن يَعْبُدُ اللَّهَ عَلَىٰ حَرْفٍ',
};
const font = fs.readFileSync('public/fonts/Amiri-Bold.ttf').toString('base64');
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 980, height: 400 }, deviceScaleFactor: 1 });
for (const [k, t] of Object.entries(P)) {
  await pg.setContent(`<html><head><style>@font-face{font-family:A;src:url(data:font/ttf;base64,${font})}
  html,body{margin:0;background:transparent}
  #t{font-family:A;direction:rtl;text-align:center;width:960px;padding:30px 10px;font-size:84px;line-height:1.55;color:#F4E3B5;
  text-shadow:0 0 22px rgba(255,200,90,.55),0 2px 10px rgba(0,0,0,.85),0 0 3px rgba(0,0,0,.6)}</style></head>
  <body><div id="t">${t}</div></body></html>`);
  await pg.evaluate(() => document.fonts.ready);
  await pg.locator('#t').screenshot({ path: `public/ar/${k}.png`, omitBackground: true });
}
await b.close(); console.log('ok');
})();
