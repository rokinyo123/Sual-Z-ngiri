const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const HELPER = eval('(' + fs.readFileSync(path.join(__dirname,'helper.txt'),'utf8').replace(/^const HELPER = /,'').replace(/;\s*$/,'') + ')');
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ ...devices['Pixel 7'], locale:'az-AZ' });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog', d=>d.accept());
  await p.goto('http://127.0.0.1:8799/app/index.html'); await p.evaluate(()=>{localStorage.clear();localStorage.setItem("almond-theme","light");}); await p.reload(); await p.waitForTimeout(2700);
  await p.evaluate(HELPER);
  // closed order opened directly by Admin → 🗑 Sil works
  await p.evaluate(()=>{ V.reset(); window.O = V.order({ status:"bagli", eta:plusDays(-3), supplier:"A Agro", items:[["Kakao","5 kq"]] }); O.recvDone = true; O.items[0].got = 5;
    role="Admin"; });
  await p.evaluate(()=>{ tab="orders"; oq="#"+O.id; fullSet.add(O.id); render(); });
  const id = await p.evaluate(()=>O.id), r = {};
  r.btn = !!(await p.$('[data-act="del"][data-id="'+id+'"]'));
  await p.click('[data-act="del"][data-id="'+id+'"]'); await p.click('[data-act="del"][data-id="'+id+'"]'); await p.waitForTimeout(150);
  r.deleted = await p.evaluate(()=>!S.orders.some(o=>o.id===O.id) || !!(S.orders.find(o=>o.id===O.id)||{}).deleted);
  // returns + acts deletable by Admin
  await p.evaluate(()=>{ rtNew({ wh:"Anbar", product:"Ovaleks", firm:"X", qty:"5 kq", why:"", repl:false }); tab="ret"; render(); });
  await p.click('[data-rtdel]'); await p.waitForTimeout(100);
  r.rt = await p.evaluate(()=>rtList().length);
  await p.evaluate(()=>{ (S.qas=S.qas||[]).push({ id:"q1", kind:"ncr", product:"Kakao", ptype:"Digər", desc:"x", sev:"mid", wh:"Anbar", by:"Keyfiyyət", at:new Date().toISOString(), status:"open" }); tab="qa"; render(); });
  await p.click('[data-qadel="q1"]'); await p.waitForTimeout(100);
  r.qa = await p.evaluate(()=>qaList().length);
  r.notAdmin = await p.evaluate(()=>{ role="Anbar"; tab="ret"; rtNew({ wh:"Anbar", product:"A", firm:"X", qty:"1", why:"", repl:false }); render(); return !document.querySelector('[data-rtdel]'); });
  console.log(JSON.stringify(r));
  if (!r.btn || !r.deleted || r.rt!==0 || r.qa!==0 || !r.notAdmin) errs.push("admin delete failed");
  console.log('JS', errs); await br.close();
})();
