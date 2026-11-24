const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const HELPER = eval('(' + fs.readFileSync(path.join(__dirname,'helper.txt'),'utf8').replace(/^const HELPER = /,'').replace(/;\s*$/,'') + ')');
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ ...devices['Pixel 7'], locale:'az-AZ' });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://127.0.0.1:8799/app/index.html'); await p.evaluate(()=>{localStorage.clear();}); await p.reload(); await p.waitForTimeout(2700);
  await p.evaluate(HELPER);
  const r = await p.evaluate(()=>{ V.reset(); role="Anbar"; tab="home"; render();
    // köhnə, Satınalmanı gözləyən xəbərsiz mal
    const now=new Date().toISOString(); S.orders.unshift({ id:nextId(), from:"Anbar", wh:"Anbar", rep:"noorder", hold:{t:"noorder",at:now,desc:"köhnə",by:"Anbar"}, created:now, items:[], status:"anbar", eta:today(), supplier:"", last_move:now, arrivedAt:now, note:"", photos:[], files:[], comments:[], history:[] });
    sDraft = { mode:"noorder", firm:"Naməlum kuryer", wh:"Anbar (İnqilab)", desc:"3 qutu kakao", note:"", rows:[] }; render();
    const btn = [...document.querySelectorAll('[data-ssend]')].map(b=>b.textContent);
    sampleSend();
    const o = S.orders.find(x=>x.hold && x.hold.desc==="3 qutu kakao"), old = S.orders.find(x=>x.hold && x.hold.desc==="köhnə");
    const al = (S.alerts||[]).find(a=>a.oid===o.id);
    role="Satınalma"; render();
    const satWork = myWork().map(x=>x.id), heldN = S.orders.filter(held).length;
    const st = stats(plusDays(-7), today());
    return { btn, status:o.status, stage:stage(o).t, alertTo:al&&al.to, satWork, heldN, oldStatus:old.status, oldHeld:held(old), statNo:st.noorder.length, statInv:st.noinv.length }; });
  await p.evaluate(()=>{ role="Rəhbərlik"; tab="arch"; arM="week"; render(); });
  r.statsText = await p.evaluate(()=>[...document.querySelectorAll('#main td')].map(t=>t.textContent).filter(t=>/Xəbərsiz mal/.test(t)).slice(0,2));
  console.log(JSON.stringify(r,null,1)); console.log('JS', errs); await br.close();
})();
