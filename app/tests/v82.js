const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const HELPER = eval('(' + fs.readFileSync(path.join(__dirname,'helper.txt'),'utf8').replace(/^const HELPER = /,'').replace(/;\s*$/,'') + ')');
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ ...devices['Pixel 7'], locale:'az-AZ' });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://127.0.0.1:8799/app/index.html'); await p.evaluate(()=>{localStorage.clear();}); await p.reload(); await p.waitForTimeout(2700);
  await p.evaluate(HELPER);
  const r = await p.evaluate(()=>{ V.reset(); const c=new Date(Date.now()-48*3600000).toISOString(), d22=dstr(new Date(c));
    V.order({ status:"yolda", created:c, eta:today(), supplier:"Hicaz", items:[["Badam ağ","5 kq"]] });
    V.order({ status:"bagli", created:c, eta:plusDays(-1), supplier:"A Agro", recvDone:true, recvAt:c, items:[["Kakao","10 kq",{got:0}]] });
    role="Anbar"; tab="orders"; oq=""; RF=RT=d22; osec="aktiv"; render();
    return { d22, tabs:[...document.querySelectorAll('[data-osec]')].map(b=>b.textContent), cards:document.querySelectorAll('#main article.oc').length }; });
  console.log(JSON.stringify(r,null,1)); console.log('JS', errs); await br.close();
})();
