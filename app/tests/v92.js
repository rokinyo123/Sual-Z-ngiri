const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const HELPER = eval('(' + fs.readFileSync(path.join(__dirname,'helper.txt'),'utf8').replace(/^const HELPER = /,'').replace(/;\s*$/,'') + ')');
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ ...devices['Pixel 7'], locale:'az-AZ' });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://127.0.0.1:8799/app/index.html'); await p.evaluate(()=>{localStorage.clear();localStorage.setItem("almond-theme","light");}); await p.reload(); await p.waitForTimeout(2700);
  await p.evaluate(HELPER);
  const r = {};
  // 1. Anbar writes a return in the ↩ Qaytarma section
  await p.evaluate(()=>{ V.reset(); role="Anbar"; tab="ret"; render(); });
  await p.click('[data-rnew]');
  await p.fill('[data-rf="product"]','Kakao'); await p.fill('[data-rf="firm"]','A Agro'); await p.fill('[data-rf="qty"]','25 kq'); await p.fill('[data-rf="why"]','zədəli');
  await p.click('[data-rrepl="1"]'); await p.click('[data-rsend]'); await p.waitForTimeout(100);
  r.created = await p.evaluate(()=>{ const x = S.rets[0]; return { st:x.status, repl:x.repl, alert:S.alerts[0].to.join(","), title:S.alerts[0].title }; });
  // 2. Satınalma sets the day
  await p.evaluate(()=>{ role="Satınalma"; tab="ret"; render(); });
  r.spMine = await p.evaluate(()=>rtMine().length);
  const id = await p.evaluate(()=>S.rets[0].id);
  await p.fill('[data-rd="'+id+'"]', await p.evaluate(()=>today())); await p.dispatchEvent('[data-rd="'+id+'"]','input');
  await p.click('[data-rtdate="'+id+'"]');
  r.dated = await p.evaluate(()=>({ st:S.rets[0].status, to:S.alerts[0].to.join(",") }));
  // 3. Anbar returns → replacement wanted → Satınalma writes eta → Anbar gets the new one
  await p.evaluate(()=>{ role="Anbar"; tab="ret"; render(); }); await p.click('[data-rtdone="'+id+'"]');
  r.returned = await p.evaluate(()=>S.rets[0].status);
  await p.evaluate(()=>{ role="Satınalma"; render(); });
  await p.fill('[data-rd="'+id+'"]', await p.evaluate(()=>plusDays(1))); await p.dispatchEvent('[data-rd="'+id+'"]','input'); await p.click('[data-rteta="'+id+'"]');
  await p.evaluate(()=>{ role="Anbar"; render(); }); await p.click('[data-rtgot="'+id+'"]');
  r.done = await p.evaluate(()=>({ st:S.rets[0].status, html:document.querySelector('#main').innerText.includes("Qaytarılanlar") }));
  // 4. overdue → in-app stuck alert
  r.late = await p.evaluate(()=>{ const x = rtNew({ wh:"Anbar", product:"Ovaleks", firm:"X", qty:"5 kq", why:"", repl:false }); x.status="dated"; x.date=plusDays(-1); rtSignals(); return rtLate(x) && S.alerts.some(a=>a.id.startsWith("rt-late-"+x.id)); });
  // 5. returned at receipt: not Gəlməyən, goes to Qaytarma
  await p.evaluate(()=>{ window.O = V.order({ status:"yolda", eta:today(), supplier:"A Agro", items:[["Kakao","10 kq"],["Lahmacun kağızı","2 kq"]] }); role="Anbar"; tab="home"; homeOpen.add(O.id); render(); });
  const oid = await p.evaluate(()=>O.id);
  await p.click('[data-retb="'+oid+'-0"]'); await p.fill('#rq-'+oid+'-0','4'); await p.fill('#rw-'+oid+'-0','çürük'); await p.click('[data-retok="'+oid+'-0"]');
  await p.evaluate(()=>{ homeOpen.add(O.id); render(); });
  await p.click('[data-full="'+oid+'-1"]'); await p.waitForTimeout(100);
  await p.evaluate(()=>{ homeOpen.add(O.id); render(); });
  if (await p.$('[data-act="receive"][data-id="'+oid+'"]')) await p.click('[data-act="receive"][data-id="'+oid+'"]');
  await p.waitForTimeout(150);
  r.recv = await p.evaluate(()=>({ status:O.status, miss:resultRows().filter(x=>x.o.id===O.id && x.cat==="miss").length, prob:O.items.map(i=>problem(O,i)||"ok"), rt:S.rets.filter(x=>x.oid===O.id).map(x=>x.status+":"+x.qty) }));
  // 6. İstehsalat cannot delete; Keyfiyyət can order; all-orders tab
  r.perm = await p.evaluate(()=>{ role="İstehsalat"; const o = V.order({ status:"acik", from:"İstehsalat", items:[["Kakao","1 kq"]] }); o.from="İstehsalat"; o.created=new Date().toISOString();
    const del = canDelete(o); role="Keyfiyyət"; const kf = tabsFor("Keyfiyyət").some(t=>t[0]==="new");
    role="Anbar"; tab="orders"; osec="hamisi"; oq=""; render(); const all = document.querySelector('[data-osec="hamisi"]').innerText;
    return { del, kf, all, hasClosed: document.querySelector('#main').innerText.includes("#"+O.id) }; });
  console.log(JSON.stringify(r,null,1));
  const ok = r.created.st==="open" && /Satınalma/.test(r.created.alert) && r.spMine===1 && r.dated.st==="dated" && r.returned==="repl" && r.done.st==="done" && r.done.html && r.late &&
    r.recv.status==="bagli" && r.recv.miss===0 && r.recv.rt.length===1 && /^repl/.test(r.recv.rt[0]) && !r.perm.del && r.perm.kf && r.perm.hasClosed;
  if (!ok) errs.push("v92 failed");
  console.log('JS', errs); await br.close();
})();
