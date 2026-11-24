const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const HELPER = eval('(' + fs.readFileSync(path.join(__dirname,'helper.txt'),'utf8').replace(/^const HELPER = /,'').replace(/;\s*$/,'') + ')');
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ ...devices['Pixel 7'], locale:'az-AZ' });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://127.0.0.1:8799/app/index.html'); await p.evaluate(()=>{localStorage.clear();localStorage.setItem("almond-theme","light");}); await p.reload(); await p.waitForTimeout(2700);
  await p.evaluate(HELPER);
  await p.evaluate(()=>{ V.reset(); const o = V.order({ status:"yolda", eta:today(), supplier:"Təchizatçı", items:[["Kakos xirda","15 kq"],["falga kariçnivi(şokolad)","1"]] }); role="Anbar"; S.orders.forEach(o=>homeOpen.add(o.id)); render(); });
  await p.click('[data-other="105-0"]'); await p.waitForTimeout(150);
  await p.fill('#of-105-0','Rofruit'); await p.click('[data-otherok="105-0"]'); await p.waitForTimeout(150);
  await p.click('[data-gnone="105-1"]');
  const c = await p.$('#o-105'); if (c) await c.screenshot({path:path.join(require('os').tmpdir(),'v78-card.png')});
  await p.click('[data-act="receive"][data-id="105"]'); await p.waitForTimeout(200);
  // later: the not-arrived item is brought by another firm from the Gəlməyən list
  await p.evaluate(()=>{ tab="orders"; osec="gelmeyen"; render(); });
  await p.click('[data-other="105-1"]'); await p.fill('#of-105-1','A Agro'); await p.click('[data-otherok="105-1"]'); await p.waitForTimeout(200);
  const r = await p.evaluate(()=>{ const o=S.orders.find(x=>x.id===105); const st=stats(plusDays(-7),today());
    return { items:o.items.map(i=>pname(i.pid)+":"+i.got+":"+(problem(o,i)||"ok")+":"+itemState(o,i)[0]), stage:stage(o).t, full:isFull(o), other:st.other.length, sup:Object.fromEntries(Object.entries(st.sup).map(([k,v])=>[k,v.n+"/"+v.full+"/"+v.bad])), notOnTime:st.notOnTime.length, alerts:(S.alerts||[]).slice(0,2).map(a=>a.title) }; });
  console.log(JSON.stringify(r,null,1)); console.log('JS', errs); await br.close();
})();
