const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const HELPER = eval('(' + fs.readFileSync(path.join(__dirname,'helper.txt'),'utf8').replace(/^const HELPER = /,'').replace(/;\s*$/,'') + ')');
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ ...devices['Pixel 7'], locale:'az-AZ' });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://127.0.0.1:8799/app/index.html'); await p.evaluate(()=>{localStorage.clear();localStorage.setItem("almond-theme","light");}); await p.reload(); await p.waitForTimeout(2700);
  await p.evaluate(HELPER);
  const r = {};
  // fresh order (1 h): no button yet
  await p.evaluate(()=>{ V.reset(); window.O = V.order({ status:"acik", items:[["Kakao","5 kq"],["Ovaleks","2 kq"]] }); O.supplier=""; O.created = new Date(Date.now()-3600e3).toISOString();
    role="Anbar"; tab="orders"; oq="#"+O.id; fullSet.add(O.id); render(); });
  const id = await p.evaluate(()=>O.id);
  r.early = !(await p.$('[data-act="spskip"][data-id="'+id+'"]'));
  // 4 h later: button, receive directly
  await p.evaluate(()=>{ O.created = new Date(Date.now()-4*3600e3).toISOString(); render(); });
  await p.fill('#spf-'+id, 'A Agro'); await p.click('[data-act="spskip"][data-id="'+id+'"]'); await p.waitForTimeout(150);
  r.after = await p.evaluate(()=>({ status:O.status, sup:O.supplier, sk:!!O.spSkip, alert:S.alerts[0].to.join(","), title:S.alerts[0].title }));
  await p.click('[data-full="'+id+'-0"]'); await p.click('[data-full="'+id+'-1"]'); await p.waitForTimeout(150);
  await p.evaluate(()=>{ render(); });
  if (await p.$('[data-act="receive"][data-id="'+id+'"]')) await p.click('[data-act="receive"][data-id="'+id+'"]');
  await p.waitForTimeout(150);
  r.closed = await p.evaluate(()=>O.status);
  r.stat = await p.evaluate(()=>{ role="Admin"; tab="arch"; arM="week"; arW=monday(today()); render(); return document.querySelector('#main').innerText.includes("Satınalma sifarişi vaxtında qəbul etməyib"); });
  console.log(JSON.stringify(r));
  if (!r.early || r.after.status!=="yolda" || r.after.sup!=="A Agro" || !r.after.sk || !/Satınalma/.test(r.after.alert) || r.closed!=="bagli" || !r.stat) errs.push("spskip failed");
  console.log('JS', errs); await br.close();
})();
