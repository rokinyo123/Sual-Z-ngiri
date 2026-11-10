function watermark(t) {
  const a = 0.7 * (1 - R(t, KT.abune - 0.8, KT.abune - 0.4)); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.save(); ctx.beginPath(); ctx.arc(78, 78, 28, 0, 7); ctx.clip(); ctx.drawImage(logo, 50, 50, 56, 56); ctx.restore();
  ctx.font = `bold 32px ${MO}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 8; ctx.fillText('@esgarow', 118, 79);
  ctx.restore();
  tx('AYƏNİN SİRRİ · 2', W - 50, 79, `30px ${AN}`, G1, a * 0.9, { align: 'right', ls: '3px' });
}
function endCard(t) {
  const a0 = KT.abune - 0.6, k = R(t, a0, a0 + 0.6); if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = k; brandBg(t); ctx.restore();
  ctx.fillStyle = `rgba(3,5,15,${0.6 * k})`; ctx.fillRect(0, 0, W, H);
  const s = lerp(0.85, 1, eOut((t - a0) / 0.8));
  ctx.save(); ctx.globalAlpha = k; ctx.translate(W / 2, 760); ctx.scale(s, s);
  ctx.globalCompositeOperation = 'lighter'; glow(0, 0, 420, 'rgba(255,200,110,A)', 0.35); ctx.globalCompositeOperation = 'source-over';
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 210, 0, 7); ctx.clip(); ctx.drawImage(logo, -210, -210, 420, 420); ctx.restore();
  ctx.strokeStyle = G1; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 214, 0, 7); ctx.stroke(); ctx.restore();
  tx('@esgarow', W / 2, 1100, `110px ${AN}`, G2, k, { glow: '#ffb030', blur: 35, ls: '4px' });
  tx('TikTok • YouTube • Instagram', W / 2, 1200, `36px ${MO}`, 'rgba(230,235,255,0.85)', k);
  const b = R(t, a0 + 0.5, a0 + 0.9), p = 1 + 0.04 * Math.sin(t * 6);
  ctx.save(); ctx.globalAlpha = b; ctx.translate(W / 2, 1390); ctx.scale(p, p); ctx.fillStyle = '#e8343a'; rrect(-260, -64, 520, 128, 64); ctx.fill(); ctx.restore();
  tx('🔔', W / 2 - 180, 1392, `56px "Noto Color Emoji"`, '#fff', b);
  tx('ABUNƏ OL', W / 2 + 45, 1394, `66px ${AN}`, '#fff', b, { ls: '4px' });
}

