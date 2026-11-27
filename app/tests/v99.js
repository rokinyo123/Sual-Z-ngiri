const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const HELPER = eval('(' + fs.readFileSync(path.join(__dirname,'helper.txt'),'utf8').replace(/^const HELPER = /,'').replace(/;\s*$/,'') + ')');
(async () => {
  const br = await chromium.launch(); const ctx = await br.newContext({ ...devices['Pixel 7'], locale:'az-AZ' });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://127.0.0.1:8799/app/index.html'); await p.evaluate(()=>{localStorage.clear();localStorage.setItem("almond-theme","light");}); await p.reload(); await p.waitForTimeout(2700);
  await p.evaluate(HELPER);
  const r = {};
  await p.evaluate(()=>{ V.reset(); S.chats=[]; window.O = V.order({ status:"yolda", items:[["Kakao","5 kq"]] }); role="Anbar"; tab="home"; render(); });
  await p.click('#chatb'); await p.waitForTimeout(100);
  r.rooms = await p.evaluate(()=>document.querySelectorAll('.chr').length);
  await p.click('[data-chroom="'+await p.evaluate(()=>chPair("Anbar","Satınalma"))+'"]');
  const id = await p.evaluate(()=>O.id);
  await p.fill('#chT', 'Salam, #'+id+' sabah gəlir?'); await p.click('[data-chsend]'); await p.waitForTimeout(100);
  r.sent = await p.evaluate(()=>({ n:S.chats.length, room:S.chats[0].room, link:!!document.querySelector('.chm [data-goorder]') }));
  // Satınalma sees unread, Texnoloq does not see the private room
  r.sp = await p.evaluate(()=>{ role="Satınalma"; tab="home"; render(); return chUnreadAll(); });
  r.tx = await p.evaluate(()=>{ role="Texnoloq"; render(); return { u:chUnreadAll(), see:chCanSee(S.chats[0].room) }; });
  await p.evaluate(()=>{ role="Satınalma"; tab="chat"; chRoom=S.chats[0].room; render(); });
  r.read = await p.evaluate(()=>chUnreadAll());
  // general room
  await p.evaluate(()=>{ chRoom="all"; render(); }); await p.fill('#chT','Hamıya salam'); await p.click('[data-chsend]');
  r.all = await p.evaluate(()=>{ role="Keyfiyyət"; tab="home"; render(); return chUnreadAll(); });
  await p.evaluate(()=>{ role="Anbar"; tab="chat"; chRoom=chPair("Anbar","Satınalma"); render(); });
  await p.screenshot({path:path.join(require('os').tmpdir(),'v99.png')});
  console.log(JSON.stringify(r));
  if (r.rooms<5 || r.sent.n!==1 || !r.sent.link || r.sp!==1 || r.tx.u!==0 || r.tx.see || r.read!==0 || r.all!==1) errs.push("chat failed");
  console.log('JS', errs); await br.close();
})();
