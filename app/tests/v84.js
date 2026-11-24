const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const HELPER = eval('(' + fs.readFileSync(path.join(__dirname,'helper.txt'),'utf8').replace(/^const HELPER = /,'').replace(/;\s*$/,'') + ')');
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ ...devices['Pixel 7'], locale:'az-AZ' });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://127.0.0.1:8799/app/index.html'); await p.evaluate(()=>{localStorage.clear();localStorage.setItem("almond-theme","light");}); await p.reload(); await p.waitForTimeout(2700);
  await p.evaluate(HELPER);
  const r = await p.evaluate(()=>{ V.reset(); const d3=new Date(Date.now()-72*3600000).toISOString(), d1=new Date(Date.now()-24*3600000).toISOString();
    const A = V.order({ status:"bagli", created:d3, eta:plusDays(-2), supplier:"Altınoğlu", recvDone:true, recvAt:d3, items:[["Un şəkərbura","120 kq",{got:0}],["Ovaleks","50 kq",{got:0}]] });
    const B = V.order({ status:"bagli", created:d1, eta:plusDays(-1), supplier:"Altınoğlu", recvDone:true, recvAt:d1, items:[["Un şəkərbura","120 kq",{got:120}]] });
    role="Anbar"; tab="orders"; osec="gelmeyen"; oq=""; render();
    const btn = document.querySelector('[data-cover="'+A.id+'-0|'+B.id+'"]'); const had = !!btn, noOv = !document.querySelector('[data-cover^="'+A.id+'-1|"]');
    btn.click();
    const after = resultRows().filter(x=>x.cat==="miss").map(x=>pname(x.i.pid));
    return { had, noOvaleksCand:noOv, after, stage:stage(A).t, satAlert:(S.alerts||[])[0].title }; });
  console.log(JSON.stringify(r)); if (!r.had || !r.noOvaleksCand || r.after.join()!=="Ovaleks") errs.push("cover failed");
  console.log('JS', errs); await br.close();
})();
