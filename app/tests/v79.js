const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const HELPER = eval('(' + fs.readFileSync(path.join(__dirname,'helper.txt'),'utf8').replace(/^const HELPER = /,'').replace(/;\s*$/,'') + ')');
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ ...devices['Pixel 7'], locale:'az-AZ' });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://127.0.0.1:8799/app/index.html'); await p.evaluate(()=>{localStorage.clear();localStorage.setItem("almond-theme","light");}); await p.reload(); await p.waitForTimeout(2700);
  await p.evaluate(HELPER);
  await p.evaluate(()=>{ V.reset(); V.order({ status:"yolda", eta:today(), supplier:"Hicaz", items:[["Toyuq file","10 kq"],["Banan","15 kq"]] }); role="Anbar"; render(); });
  await p.click('[data-retb="105-0"]'); await p.fill('#rq-105-0','4'); await p.fill('#rw-105-0','zədəli qablaşdırma'); await p.click('[data-retok="105-0"]'); await p.waitForTimeout(150);
  await p.click('[data-full="105-1"]');
  const c = await p.$('#o-105'); if (c) await c.screenshot({path:path.join(require('os').tmpdir(),'v79-card.png')});
  await p.click('[data-act="receive"][data-id="105"]'); await p.waitForTimeout(200);
  const r = await p.evaluate(()=>{ const o=S.orders.find(x=>x.id===105); const st=stats(plusDays(-7),today()); role="Anbar";
    return { items:o.items.map(i=>pname(i.pid)+":"+i.got+":"+(problem(o,i)||"ok")), canAns:canAnswer(o,o.items[0]), gelmeyen:resultRows().filter(x=>x.cat==="miss").map(x=>x.pr), ret:st.retIn.length, alert:(S.alerts||[]).find(a=>a.to.includes("Satınalma")).items }; });
  console.log(JSON.stringify(r,null,1)); console.log('JS', errs); await br.close();
})();
