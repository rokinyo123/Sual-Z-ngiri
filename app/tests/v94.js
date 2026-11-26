const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const HELPER = eval('(' + fs.readFileSync(path.join(__dirname,'helper.txt'),'utf8').replace(/^const HELPER = /,'').replace(/;\s*$/,'') + ')');
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ ...devices['Pixel 7'], locale:'az-AZ' });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://127.0.0.1:8799/app/index.html'); await p.evaluate(()=>{localStorage.clear();localStorage.setItem("almond-theme","light");}); await p.reload(); await p.waitForTimeout(2700);
  await p.evaluate(HELPER);
  await p.evaluate(()=>{ V.reset(); S.exps=[]; role="İstehsalat"; tab="exp"; render(); });
  const r = {};
  // without money taken: plain expenses, no balance
  await p.fill('[data-xf="amt"]','20'); await p.fill('[data-xf="what"]','Taksi'); await p.click('[data-xadd]');
  r.noBal = await p.evaluate(()=>!document.querySelector('#main').innerText.includes("Qalıq"));
  await p.fill('[data-xi="amt"]','500'); await p.click('[data-xin]');
  await p.fill('[data-xf="amt"]','35,5'); await p.fill('[data-xf="what"]','Lazer kəsim'); await p.click('[data-xadd]');
  r.txt = await p.evaluate(()=>document.querySelector('#main').innerText);
  r.bal = await p.evaluate(()=>xBal(S.exps.filter(x=>!x.deleted)).bal);
  await p.screenshot({path:path.join(require('os').tmpdir(),'v94.png'), fullPage:true});
  console.log(JSON.stringify({ noBal:r.noBal, bal:r.bal, hasQ:/Qalıq: 444,50/.test(r.txt) }));
  if (!r.noBal || Math.abs(r.bal-444.5)>1e-9 || !/Qalıq:\s*444,50/.test(r.txt) || !/xərc 55,50/.test(r.txt)) errs.push("exp balance failed");
  console.log('JS', errs); await br.close();
})();
