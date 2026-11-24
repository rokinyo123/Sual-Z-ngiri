#!/bin/bash
# Almond Anbar · avtomatik sınaqlar. İstifadə: bash app/tests/run.sh  (repo kökündən; Playwright + Chromium lazımdır)
cd "$(dirname "$0")/../.." || exit 1
python3 -m http.server 8799 >/dev/null 2>&1 & SRV=$!; sleep 1.5
fail=0
for t in app/tests/*.js; do
  out=$(timeout 120 node "$t" 2>&1); if echo "$out" | grep -q "^JS \[\]"; then echo "✓ $(basename $t)"; else echo "✗ $(basename $t)"; echo "$out" | tail -5; fail=1; fi
done
kill $SRV 2>/dev/null; exit $fail
