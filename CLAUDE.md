# CLAUDE.md

This repo holds two things:
1. A web app (`index.html`, `app/`, `anbar/`, `demo/`, …).
2. The **@esgarow video production kit** in `esgarow_out/` (engine, reference code, finished episodes).

For any @esgarow video work (script, hook, voice, image prompts, montage, ASMR, titles), **use the `esgarow-video` skill** (`.claude/skills/esgarow-video/SKILL.md`). It defines the house standard set by episode 5; every new video must be at least that good. When a new technique works, add it to the skill's Changelog.

For videos in the **Flow one-shot style** (AI clips from Google Flow/Veo chained with Extend, like `esgarow_out/tesvif_zaman/out/final4.mp4`, which the user loves), **use the `esgarow-flow` skill** (`.claude/skills/esgarow-flow/SKILL.md`) and the template in `esgarow_out/flow_engine/`. The user's favourite genre now is the **surə təfsiri Flow hibrid** series (Bəqərə ayah by ayah, reference `esgarow_out/beqere_19_20/`); its rules are in that skill's ★ section.

## Almond Anbar app (`app/`)

The warehouse order-chain PWA for Almond lives in `app/`. Before any change to it, **read `app/NOTES.md`**: architecture, data model, roles, deploy flow and the rules the owner set. The owner writes in Azerbaijani; answer in Azerbaijani. The owner's handbook (non-technical) is a Claude Doc, "Almond Anbar — İdarəetmə kitabçası".
