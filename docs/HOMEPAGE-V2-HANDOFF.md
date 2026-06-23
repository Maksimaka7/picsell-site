# PICSELL.AI — Homepage v2 · Per-screen build handoff (for Claude Code)

**Branch:** `feat/homepage-v2` (off `main`). **Build here, never touch `main` until promotion.**
**Stack:** Hugo (UK primary + EN mirror), Netlify project `idyllic-haupia-c797a4`, Deploy Previews per push.
**Goal:** rebuild the homepage to position PICSELL as a **complete retail-execution platform for FMCG** ("одна платформа, усі ролі"), not a single field-team tool.

> Language: instructions in English, **all on-page copy in Ukrainian** (mirror to EN under `content/en` + `layouts/en`).

---

## 0. Workflow (strict)
- Claude Code edits only on `feat/homepage-v2`. Open PRs **into `feat/homepage-v2`** (NOT `main`), labeled "do NOT merge" — chat-Claude reviews diff (role-gate / regressions first), squash-merges into the branch.
- One **atomic PR per screen** (revert-safe). Build order in §13.
- Promotion = single final PR `feat/homepage-v2 → main` after Maksim signs off on the Netlify preview. URL stays `/` (no SEO loss); old homepage stays in git history (revert-safe).
- **EN mirror promoted together** with UK — never ship UK-only.

## 1. Files in play (inventoried 2026-06-23)
- `layouts/index.html` — the homepage layout (~96 KB, currently DARK). This is the main file to rebuild → LIGHT.
- `layouts/en/` — EN layout overrides.
- `content/uk/_index.md` — homepage content/front-matter (UK). `content/en/` — EN mirror.
- `config.toml`, `netlify.toml`, `static/`, `partials/`. Calculator may also live as a standalone page `/calculator`.

## 2. Brand tokens (LIGHT theme)
- Blue (primary) `#0057FF` · Neon lime (accent) `#C8FF00` · Cyan `#00D4FF` · Red/OOS `#FF003D`
- Ink/text `#0F1E37` · base `#FAFAF8` · border `#E5E2DA` · muted `#6B7280`
- Fonts: Geologica (display/H1, 900), Orbitron (eyebrows/labels, uppercase + letterspacing), Inter (body). All Google Fonts.
- Theme = LIGHT/white. Convert the dark layout to light.

## 3. Honesty rules (BINDING — first demo call exposes lies)
- **Logos/clients:** publish only confirmed ones. As of now Maksim confirmed **Lactalis + Bayadera + Henkel + Schwarzkopf + Nestlé + Diageo** are usable on screen 2 (6 logos). Do NOT add others without confirmation.
- **Metrics:** drop "99.9%" and giant animated counters. Use attributed client outcomes only when confirmed (screen 7 kept empty until partner sign-off).
- **AI Assistant = LIVE** (no longer "скоро"). Everything else module-wise is live too (2026 roadmap realized: Vision Shelf Share/Planogram/Real-time Validation; Field CRM/Lead/Promo/Planning).
- **Security (screen 10):** NO ISO 27001/27701 badges (not certified). Only claim what's true: EU data residency, encryption, role-based access (RLS), GDPR-readiness, backups, local UA support.
- **Calculator:** always show "орієнтовно / фінальні тарифи узгоджуються індивідуально" (pricing constructor still being finalized with CEO).
- **Positioning claim:** use the defensible version — "єдина в Україні платформа, що поєднує Vision + Field + HoReCa + Radar в одному застосунку." Avoid unqualified "№1 / без аналогів".

## 4. Screen 1 — Hero
- Eyebrow (Orbitron): `КОМПЛЕКСНА RETAIL-EXECUTION ПЛАТФОРМА ДЛЯ FMCG`
- H1 (Geologica 900): **`Бачиш полицю. Керуєш полем. Володієш ринком.`** (locked)
- Subline: `Vision AI, польові продажі, HoReCa та конкурентна розвідка — в одному застосунку для кожної ролі.`
- CTA: `Замовити демо` (filled blue) + `Розрахувати вартість` (lime outline → calculator/`#calc`).
- Right: **hero video** (autoplay, muted, loop, `<video poster>` = dashboard frame). 6-shot scenario (≈8–9 s): (1) store + merch raises phone → (2) Vision scan w/ bounding boxes → (3) data→dashboard (Share of Shelf, OOS, Perfect Store) → (4) field/map/CRM card → (5) Radar/HoReCa market view → (6) brand + loop. 16:9 desktop + 9:16/1:1 mobile crop. Maksim supplies generated frames (Grok). Until video ready, fallback = static dashboard mock + animated shelf row.

## 5. Screen 2 — Trust logos
- Row of confirmed client logos: Lactalis, Henkel, Bayadera, Schwarzkopf, Nestlé, Diageo. Grayscale → color on hover. Caption: `Нам довіряють`.

## 6. Screen 3 — Ecosystem architecture (animated, 2 states)
- **State A (default):** layered architecture — bottom `Один застосунок, усі ролі` → `PICSELL Core` slab → modules row (Field, Vision, Radar, HoReCa) → intelligence (Analytics, AI Assistant). Animated flows: blue data pulses rising module→intelligence; lime closed-loop pulse returning intelligence→core/field. Scroll-trigger: layers reveal bottom-up, then flows start.
- **State B (interactive):** clicking a role highlights its path, dims the rest:
  - Мерчандайзер → Core → Vision → Analytics
  - Торговий → Core → Field → Analytics
  - Супервайзер → Core → Field + Vision → Analytics + AI (closed loop highlighted)
  - Керівник → Core → Radar + HoReCa → AI + Analytics
- Impl: React/SVG, `id`-ed nodes/edges, `opacity` via `.active/.dim` + transition. Brand colors: data `#0057FF`, loop `#C8FF00`. Mobile: roles become a horizontal swipe row under the schema. (Visual spec built as widgets in the design session.)

## 7. Screen 4 — Module showcase (Core / Field / Vision)
Three blocks, **alternating screenshot side** (Vision left → Field right → Core left). Each: eyebrow (Orbitron) · H3 · 1-line · 5 strongest features (Tabler icon + label + 1-line) · `ще N можливостей →` link to module page. Phone shows a **real iOS screen**, cleaned to brand data (АТБ/ЄВА/Сільпо, Persil, real prices/stock). Placeholder phone until real screens supplied.

- **Vision AI** — `Бачиш полицю очима AI` · `Знімок із телефона — і за секунди розпізнана полиця, частка та планограма.`
  1. Розпізнавання SKU, цінників, промо, POSM 2. Shelf Share 3. Planogram Compliance 4. Real-time AI Validation 5. Контроль якості фото (антифрод) · `ще 8 можливостей` → `/vision-ai`. Screen: camera scan + bounding boxes + Share of Shelf.
- **Field (Excalibur)** — `Веди продажі в полях` · `Весь цикл торгового в одному застосунку.`
  1. Каталог і замовлення 2. CRM + картка клієнта 3. Promo Management + Gift Sets 4. Борги, оплати, повернення 5. Маршрути ТП + GPS + 1С/ERP · `ще 12 можливостей` → `/sales-app`. Screen: Excalibur order/catalog (Persil, prices, stock).
- **Core** — `Керуєш командою і точками` · `Фундамент польового виконання.`
  1. Маршрути, візити, GPS 2. Завдання + фото-звіти + тегування 3. Store Check + Perfect Store 4. Асортиментні матриці + моніторинг цін 5. Планування мерчів + контроль робочого часу · `ще 14 можливостей` → `/core`. Screen: visit timeline / store card.

## 8. Screen 5 — Unique band (HoReCa + Radar)
Centered eyebrow `УНІКАЛЬНО В PICSELL` + H2 `Ринкова розвідка, якої немає в конкурентів`. Two accent cards:
- **HoReCa Intelligence** (purple accent) — `Контролюй бар і ресторан`. KPI visual: Share of Menu bars (наш бренд / конкурент / інші) + metric chips Coverage, Visibility. Chips: Distribution, Pricing compliance, Коктейльні карти. → `/horeca`.
- **Radar** (amber accent) — `Бачиш увесь ринок конкурентів`. Badge `live · 7 мереж · ~50 магазинів`. KPI visual: competitor price rows w/ deltas (red down / green up) + metric chips Нові точки, Асортимент. → `/radar`.
- Data = illustrative placeholders until real aggregates/case numbers confirmed.

## 9. Screen 6 — Pain → closed loop
Eyebrow `CLOSED LOOP` + H2 `Не звітуємо про проблему — закриваємо її у візиті`. Four hero "Біль → Закрито у візиті" cards (OOS / конкурент витісняє / планограма / промо) each with module chips. Below, the full pain→solution matrix (render as a styled list/table):

| Біль | Чим закриває | Коли | Модуль |
|---|---|---|---|
| OOS помічають за тижні | Vision бачить порожнє місце → алерт+задача | у візиті | Vision+Core |
| Фейкові фото / GPS | Контроль якості фото + GPS візиту | у візиті | Vision+Core |
| Конкурент витісняє | Shelf Share → повернення фейсингів | у візиті | Vision |
| Викладка ≠ планограмі | Planogram Compliance → фікс | у візиті | Vision |
| Промо не виконується | Promo Management + перевірка на фото | у візиті | Field+Vision |
| Торгові не дотискають, борги | Каталог+замовлення, борги/оплати, CRM | у візиті | Field |
| HoReCa «темрява» | Меню, бренди, Share of Menu, ціни | реальний час | HoReCa |
| Не бачиш конкурентів | Radar парсить ринок → дельти, нові точки | щодня | Radar |
| Маршрути хаотичні | Route/Sales Planning, маршрути, GPS | планування | Field+Core |
| Дані в Excel | Єдина аналітика + Power BI | реальний час | Analytics |
| Керівник аналізує вручну | AI Assistant: інсайти, звіти, чат | за запитом | AI Assistant |

Punchline copy: конкуренти закривають 3–4 рядки і "після візиту"; PICSELL — 11, із них 6 "у візиті".

## 10. Screen 7 — Results / case (SKIPPED for now)
Hold until partner sign-off. When ready: Lactalis case (attributed) + Radar 7 networks/~50 stores, real outcomes (no capability %).

## 11. Screen 8 — Comparison
Above table: 3 archetype cards — **PICSELL** (highlighted, 2px info border, badge `Комплексна платформа`) / **Класичний SFA** (Effie·SalesWorks) / **Лише IR** (Trax·ParallelDots). Then detailed honest matrix, legend ✓ повноцінно / ◐ частково / — немає. Columns PICSELL / Класичний SFA / Лише-IR. Rows grouped: Core, Field, Vision, Ринкова розвідка, Аналітика+AI, Модель. (Full row set in the design session; key "only PICSELL ✓" rows: Radar web-parsing, HoReCa, калькулятор на сайті.) Render: sticky header, PICSELL column tinted, icons not text, groups collapsible on mobile. **Be fair** — competitors have AI/IR/planogram (✓ where true); our wedge is breadth + transparency + local.

## 12. Screens 9–11
- **Screen 9 — Calculator** (embedded + standalone `/calculator`).
  - Roles (per-seat /mo): Мерчандайзер Core+Vision `1800`; Торговий Core+Field `1000`; Супервайзер Core+Analytics `1000`; Користувач Core `1400`; Адмін `0`.
  - Add-ons (per company, checkboxes): Radar `від 20000 + 5000×площадка`; HoReCa `від 20000 + 10×меню`.
  - Formula: `Σ(seats×rate) + radar + horeca`. Billing toggle Щомісяця / Річно `×12×0.8` (−20%). Offer note: `Річний контракт: −20% + безкоштовна міграція CRM`. Disclaimer `орієнтовно`.
  - Lead capture: `Отримати детальну пропозицію` → email → **POST edge fn `submit-lead`** `{ email (required), full_name?, phone?, source:'website', form_id:'calculator', utm_* (from URL), landing_page:'calculator', message:'<roles+counts+addons+estimate>' }` → CC stage «Вхідний» + Telegram + AI draft.
- **Screen 10 — Security/trust band.** 6 items (3×2): Дані в ЄС (Frankfurt) · Шифрування (keys in vault) · Рольовий доступ (RLS) · GDPR-готовність · Резервні копії · Локальна підтримка (UA). NO ISO badges unless confirmed. Section bg `#FAFAF8`.
- **Screen 11 — Final CTA + demo form.** Left: H2 `Побач PICSELL на своїй полиці` + reassurance (30 хв без зобовʼязань / демо на реальних точках / швидке впровадження). Right: form — Ім'я, Email*, Телефон, Компанія, select `Я представляю` (Виробник/Дистриб'ютор/Роздрібна мережа/HoReCa/Інше), select `Розмір польової команди` (до 10/10–50/51–100/100+), select `Звідки дізнались` (Пошук/LinkedIn/Рекомендація/Реклама/Подія/Інше). Submit → **POST `submit-lead`** `{ ..., form_id:'homepage'|'demo', source:'website', utm_* from URL }`. No `<form>` tag in React — onClick + state. Team-size qualifier scores the lead.

## 13. Build order (atomic PRs into feat/homepage-v2)
1. Light-theme conversion of `layouts/index.html` + brand tokens + fonts (foundation).
2. Hero (screen 1) + video placeholder.
3. Trust logos (2) + Security band (10) [small, low-risk].
4. Ecosystem architecture (3) — state A, then state B.
5. Module showcase (4) with placeholder phones.
6. Unique band (5).
7. Pain→closed loop (6).
8. Comparison (8).
9. Calculator (9) + `/calculator` page.
10. CTA + demo form (11).
11. EN mirror pass (content/en + layouts/en).
12. Real assets pass: hero video, real iOS screens, confirmed metrics/case (7).

## 14. Open blockers / decisions pending (Maksim)
- Confirm publishable client logos beyond Lactalis+Bayadera (currently assuming all 6 OK — verify).
- Confirm any real metrics/case numbers for screens 5/7.
- Security certs/pentest wording for screen 10 (or keep as-is).
- Hero video frames (Maksim generates via Grok).
- Final pricing sign-off (CEO) — keep "орієнтовно" until then.

## 15. Lead pipeline reference (backend already live — no changes)
- Edge fn `submit-lead` → `create_inbound_lead` → CC stage «Вхідний» (`3322ae38-7f30-4b75-b266-3c3be984c541`), pipeline `6c3f5bfa-03ad-4788-9ebd-e971dcb6525b`, owner Maksim `3a65d359-e6e6-4d5c-a312-f481ba970228`. `inbound_forms` configs exist: homepage, demo, contact-us, calculator. Always pass `utm_*` from URL.
