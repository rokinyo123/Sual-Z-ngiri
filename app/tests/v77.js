const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const HELPER = eval('(' + fs.readFileSync(path.join(__dirname,'helper.txt'),'utf8').replace(/^const HELPER = /,'').replace(/;\s*$/,'') + ')');
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ ...devices['Pixel 7'], locale:'az-AZ' });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://127.0.0.1:8799/app/index.html'); await p.evaluate(()=>{localStorage.clear();localStorage.setItem("almond-theme","light");}); await p.reload(); await p.waitForTimeout(2700);
  await p.evaluate(HELPER);
  // sifariş 2 gün əvvəl verilib, bu gün gəlməli idi; 3 Vinildən 1-i gəldi; Pomidor 5 kq 2 kq gəldi
  await p.evaluate(()=>{ V.reset(); const c=new Date(Date.now()-48*3600000).toISOString();
    const o = V.order({ status:"yolda", created:c, eta:today(), supplier:"bazar", items:[["Vinil","3"],["Pomidor çeri","5 kq"],["Şanti","250 kq"]] }); window.O=o.id; role="Anbar"; S.orders.forEach(o=>homeOpen.add(o.id)); render(); });
  await p.fill('#got-105-0','1'); await p.dispatchEvent('#got-105-0','change'); await p.fill('#got-105-1','2'); await p.dispatchEvent('#got-105-1','change'); await p.click('[data-full="105-2"]');
  await p.click('[data-act="receive"][data-id="105"]'); await p.waitForTimeout(200);
  const r = {};
  r.tabs = await p.evaluate(()=>{ tab="orders"; osec="gelmeyen"; render(); return [...document.querySelectorAll('[data-osec]')].map(b=>b.textContent); });
  r.gelmeyen = await p.evaluate(()=>[...document.querySelectorAll('#main .irow .rs')].map(e=>e.textContent));
  await p.screenshot({path:path.join(require('os').tmpdir(),'v77-gelmeyen.png'), fullPage:true});
  r.satAns = await p.evaluate(()=>{ const o=S.orders.find(x=>x.id===O); return o.items.map(i=>pname(i.pid)+":"+canAnswer(o,i)); });
  r.gelenler = await p.evaluate(()=>{ osec="tam"; render(); return [...document.querySelectorAll('#main .irow .st')].map(e=>e.textContent); });
  await p.screenshot({path:path.join(require('os').tmpdir(),'v77-gelenler.png'), fullPage:true});
  r.stats = await p.evaluate(()=>{ const st=stats(plusDays(-7),today()); return st.notOnTime.map(x=>pname(x.i.pid)+" miss "+x.miss+" ev "+x.ev.map(e=>e.qty+"@"+e.days).join(",")); });
  await p.evaluate(()=>{ role="Rəhbərlik"; tab="arch"; arM="week"; render(); window.scrollTo(0,0); const h=[...document.querySelectorAll('#main h3')].find(x=>/Deyilən/.test(x.textContent)); if (h) h.scrollIntoView(); });
  await p.screenshot({path:path.join(require('os').tmpdir(),'v77-stats.png'), fullPage:false});
  console.log(JSON.stringify(r,null,1)); console.log('JS', errs); await br.close();
})();
