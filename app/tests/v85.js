const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const HELPER = eval('(' + fs.readFileSync(path.join(__dirname,'helper.txt'),'utf8').replace(/^const HELPER = /,'').replace(/;\s*$/,'') + ')');
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ ...devices['Pixel 7'], locale:'az-AZ' });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://127.0.0.1:8799/app/index.html'); await p.evaluate(()=>{localStorage.clear();localStorage.setItem("almond-theme","light");}); await p.reload(); await p.waitForTimeout(2700);
  await p.evaluate(HELPER);
  await p.evaluate(()=>{ V.reset(); window.O = V.order({ status:"yolda", eta:today(), supplier:"Altınoğlu", items:[["Kakao","100 kq"],["Lahmacun kağızı","60 kq"],["Ovaleks","50 kq"]] }); role="Anbar"; tab="home"; render(); });
  const r = {};
  r.mini = await p.evaluate(()=>!!document.querySelector('.mcard[data-hopen="'+O.id+'"]') && !document.querySelector('#o-'+O.id));
  await p.screenshot({path:path.join(require('os').tmpdir(),'v85-home.png')});
  await p.click('.mcard[data-hopen="'+await p.evaluate(()=>O.id)+'"]'); await p.waitForTimeout(150);
  const id = await p.evaluate(()=>O.id);
  await p.fill('#got-'+id+'-0','25'); await p.dispatchEvent('#got-'+id+'-0','change');
  await p.click('[data-act="receive"][data-id="'+id+'"]'); await p.waitForTimeout(200);
  // v92: Qəbul et → anbarın işi bitir: boş qalanlar "gəlmədi" → Gəlməyən siyahısı
  r.partial = await p.evaluate(()=>({ status:O.status, stage:stage(O).t, inWork:myWork().some(x=>x.id===O.id), gelmeyen:resultRows().filter(x=>x.cat==="miss" && x.o.id===O.id).length }));
  r.closed = await p.evaluate(()=>({ status:O.status, items:O.items.map(i=>pname(i.pid)+":"+i.got+":"+(problem(O,i)||"ok")) }));
  // reopen the not-arrived one
  r.reopen = await p.evaluate(()=>{ orderAct("reopen", O.id); return { status:O.status, items:O.items.map(i=>pname(i.pid)+":"+i.got), stage:stage(O).t }; });
  console.log(JSON.stringify(r,null,1));
  if (!r.mini || r.partial.status!=="bagli" || r.partial.inWork || r.partial.gelmeyen!==3 || r.reopen.status!=="yolda") errs.push("partial flow failed");
  console.log('JS', errs); await br.close();
})();
