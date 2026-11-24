const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const HELPER = eval('(' + fs.readFileSync(path.join(__dirname,'helper.txt'),'utf8').replace(/^const HELPER = /,'').replace(/;\s*$/,'') + ')');
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ ...devices['Pixel 7'], locale:'az-AZ' });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://127.0.0.1:8799/app/index.html'); await p.evaluate(()=>{localStorage.clear();localStorage.setItem("almond-theme","light");}); await p.reload(); await p.waitForTimeout(2700);
  await p.evaluate(HELPER);
  const r = {};
  r.tabs = await p.evaluate(()=>{ V.reset(); role="Satınalma"; tab="home"; render(); return tabsFor("Satınalma").map(t=>t[0]); });
  await p.evaluate(()=>{ tab="catalog"; render(); });
  await p.fill('#fN','Yeni Firma MMC'); await p.click('#fAdd'); await p.waitForTimeout(200);
  await p.fill('#pN','Test məhsulu'); await p.selectOption('#pF','Yeni Firma MMC'); await p.click('#pAdd'); await p.waitForTimeout(200);
  r.afterAdd = await p.evaluate(()=>({ firm:S.firms.includes("Yeni Firma MMC"), prod:(S.products.find(x=>x.name==="Test məhsulu")||{}).firm }));
  // mövcud mala firma seç (cədvəldə)
  r.assign = await p.evaluate(()=>{ const pr=S.products.find(x=>x.name!=="Test məhsulu"); const sel=document.querySelector('select[data-firm="'+pr.id+'"]'); sel.value="Yeni Firma MMC"; sel.dispatchEvent(new Event('change',{bubbles:true})); return { name:pr.name, firm:pr.firm }; });
  r.noDelete = await p.evaluate(()=>({ pdel:document.querySelectorAll('[data-pdel]').length, fmdel:document.querySelectorAll('[data-fmdel]').length, pname:document.querySelectorAll('[data-pname]').length }));
  // firma üzrə görünüş + əlavə
  await p.evaluate(()=>{ catFirm="Yeni Firma MMC"; render(); });
  r.byFirm = await p.evaluate(()=>({ addBox:!!document.getElementById('ffAdd'), unfirm:document.querySelectorAll('[data-unfirm]').length }));
  await p.screenshot({path:path.join(require('os').tmpdir(),'cat-satinalma.png'), fullPage:false});
  r.adminDel = await p.evaluate(()=>{ role="Admin"; catFirm=""; render(); return document.querySelectorAll('[data-pdel]').length>0 && document.querySelectorAll('[data-fmdel]').length>0; });
  r.anbar = await p.evaluate(()=>{ role="Anbar"; render(); return tabsFor("Anbar").map(t=>t[0]).includes("catalog"); });
  console.log(JSON.stringify(r,null,1)); console.log('JS', errs); await br.close();
})();
