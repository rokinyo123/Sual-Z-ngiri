const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const HELPER = eval('(' + fs.readFileSync(path.join(__dirname,'helper.txt'),'utf8').replace(/^const HELPER = /,'').replace(/;\s*$/,'') + ')');
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ ...devices['Pixel 7'], locale:'az-AZ' });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://127.0.0.1:8799/app/index.html'); await p.evaluate(()=>{localStorage.clear();localStorage.setItem("almond-theme","light");}); await p.reload(); await p.waitForTimeout(2700);
  await p.evaluate(HELPER);
  await p.evaluate(()=>{ V.reset(); window.O = V.order({ status:"yolda", eta:today(), supplier:"A Agro", items:[["Kakao","5 kq"],["Lahmacun kağızı","2 kq"],["Ovaleks","5 kq"]] }); role="Anbar"; tab="home"; homeOpen.add(O.id); render(); });
  const id = await p.evaluate(()=>O.id), r = {};
  await p.click('[data-full="'+id+'-0"]');
  await p.click('[data-act="receive"][data-id="'+id+'"]'); await p.waitForTimeout(200);
  r.partial = await p.evaluate(()=>({ status:O.status, recv:!!O.recvDone }));
  await p.evaluate(()=>{ tab="home"; homeOpen.add(O.id); render(); });
  await p.click('[data-full="'+id+'-1"]'); await p.waitForTimeout(100);
  r.mid = await p.evaluate(()=>({ status:O.status, stage:stage(O).t }));
  await p.click('[data-full="'+id+'-2"]'); await p.waitForTimeout(200);
  r.auto = await p.evaluate(()=>({ status:O.status, recv:!!O.recvDone, stage:stage(O).t }));
  // old stuck data: partial + all filled but still open → healed on load
  r.heal = await p.evaluate(()=>{ const o = V.order({ status:"yolda", eta:today(), supplier:"A Agro", items:[["Kakao","5 kq"],["Ovaleks","5 kq"]] });
    o.items.forEach(i=>i.got=5); o.partAt = new Date().toISOString(); const before = stage(o).t; partDoneFix(); return { before, status:o.status, recv:!!o.recvDone }; });
  console.log(JSON.stringify(r,null,1));
  if (r.partial.status!=="yolda" || r.mid.status!=="yolda" || !r.auto.recv || r.auto.status==="yolda" || !r.heal.recv || /0 mal/.test(r.heal.before)) errs.push("auto-close failed");
  console.log('JS', errs); await br.close();
})();
