const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const HELPER = eval('(' + fs.readFileSync(path.join(__dirname,'helper.txt'),'utf8').replace(/^const HELPER = /,'').replace(/;\s*$/,'') + ')');
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ ...devices['Pixel 7'], locale:'az-AZ' });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://127.0.0.1:8799/app/index.html'); await p.evaluate(()=>{localStorage.clear();localStorage.setItem("almond-theme","light");}); await p.reload(); await p.waitForTimeout(2700);
  await p.evaluate(HELPER);
  await p.evaluate(()=>{ V.reset(); const o = V.order({ status:"yolda", eta:today(), supplier:"Rofruit", items:[["Kakao","100 kq"],["Lahmacun kağızı","60 kq"],["Moloko sadə","120 kq"]] }); role="Anbar"; render(); });
  await p.click('[data-full="105-0"]'); await p.fill('#got-105-1','25'); await p.dispatchEvent('#got-105-1','change'); await p.click('[data-gnone="105-2"]');
  await p.click('[data-act="receive"][data-id="105"]'); await p.waitForTimeout(300);
  const r = await p.evaluate(()=>{ role="Keyfiyyət"; tab="home"; render(); return { bell: document.querySelector('#bell .bn').textContent, line: (document.querySelector('.nline')||{}).textContent, work: myWork().map(o=>o.id) }; });
  await p.evaluate(()=>{ tab="qc"; render(); window.scrollTo(0,0); }); await p.waitForTimeout(300);
  const c = await p.$('#o-105'); if (c) await c.screenshot({path:path.join(require('os').tmpdir(),'kf-card.png')});
  console.log(JSON.stringify(r,null,1)); console.log('JS', errs); await br.close();
})();
