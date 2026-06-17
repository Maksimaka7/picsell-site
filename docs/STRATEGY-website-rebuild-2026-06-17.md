# PICSELL — Website Positioning & Rebuild Strategy
*Source of truth for the picsell.ai rebuild. Author: chat-Claude. Date: 2026-06-17.*
*Language: Ukrainian primary + English parity. Goal priority: lead-gen first.*

---

## 0. The core problem we are fixing
The product is **one ecosystem** (Core + Field + Vision + Radar + HoReCa + Analytics + AI),
but the site presents it as **5 separate microservices**. Competitors sell a *platform tied
to a pain*. We shift the narrative from "here are our services" → **"here is the FMCG field
team's pain → here is how PICSELL closes it → and here are the modules as proof underneath."**

---

## 1. Positioning

**One-line promise (UK):** «Бачиш полицю. Керуєш командою. Виграєш ринок.»
*(keep — it is pain/benefit-led and already live)*
**One-line promise (EN):** "See the shelf. Run the field. Win the market."

**Category:** AI-first Retail Execution & SFA platform for FMCG and HoReCa.

**Three pains we sell against:**
1. **Полиця наосліп** — не видно реальної представленості/частки полиці/цін конкурентів у точці. → **Vision + Radar**.
2. **Польова команда некерована** — маршрути, візити, замовлення, дисципліна на папері/в Excel. → **Core + Field**.
3. **Рішення із запізненням** — дані є, але інсайт приходить пізно і вручну. → **Analytics + AI Assistant**.

### Competitive wedge (fair, category-level — never name-and-attack)
- **vs Effie (manual SFA / data collection):** PICSELL — **AI-first**. Vision розпізнає полицю, асистент підказує дію в момент візиту — не лише чек-листи й звіти постфактум.
- **vs SalesWorks (enterprise IR+TPM ecosystem):** та сама AI-потужність, але **легка, швидка до запуску, доступна** — не місяці впровадження й не ентерпрайз-бюджет.
- **Unique to PICSELL:** **HoReCa Intelligence** (Share of Menu, coverage, pricing compliance) + **Radar** (жива конкурентна розвідка) — ними не б'є жоден із двох. Українська команда, локальна підтримка, єдина платформа.

---

## 2. Honesty matrix — LIVE vs ROADMAP (binds all copy)
> Rule: LIVE → "є зараз". ROADMAP → "розвиток / скоро". Never present roadmap as fact.
> The first demo call will expose any lie and kill trust — our wedge is *delivering*, not promising.

| Module | LIVE (sell as now) | ROADMAP (sell as "soon") |
|---|---|---|
| **Core** | користувачі/ролі, точки/мережі, маршрути/візити, GPS, фото-звіти, задачі, тегування фото, моніторинг цін, асортиментні матриці, Store Check, Perfect Store, планування мерчів, Power BI | — |
| **Field (Excalibur)** | каталог, замовлення, повернення, борги, оплати, історія, маршрути ТП, GPS, інтеграція ERP/1С | Route/Sales Planning, CRM, Client Card, Lead/Promo Mgmt, Gift Sets, Expiration, Advanced Analytics |
| **Vision** | розпізнавання SKU, цінників, промо, POSM, DMP, object detection, якість фото | Shelf Share, Shelf Space, Planogram Compliance, Real-time AI Validation |
| **Radar** | web-parsing, моніторинг цін/асортименту конкурентів, гео-аналіз, Power BI; **кейс Lactalis (7 мереж/~50 магазинів)**, масштабування Bayadera | — |
| **HoReCa Intelligence** | моніторинг меню/цін, присутність брендів, коктейльні карти, SKU-аналітика, контроль контрактних умов, KPI (Distribution, Coverage, Share of Menu, Visibility, Pricing Compliance) | — |
| **Analytics** | дашборди Sales/Merch/Perfect Store/Price/Route/HoReCa/Radar/Executive, Power BI, GIS/Geo, KPI | — |
| **AI Assistant** | — | прототип на n8n → аналіз продажів/боргів/повернень, звіти, інсайти, AI-помічники (керівник/супервайзер/ТП) — позначати **«скоро»** |

---

## 3. Sitemap (evolve existing, don't rebuild)

**Primary nav:** Платформа · Рішення (сегменти) · Калькулятор · Кейси · Демо

- **Home** `/` — rewritten narrative (see §4).
- **Solutions (segment landings)** — primary entry points, pain-led:
  - `/solutions-brands` — Виробникам (контроль полиці, Perfect Store, частка полиці, Radar)
  - `/solutions-distributors` — Дистриб'юторам (Field/SFA, маршрути, замовлення, 1С, дисципліна)
  - `/solutions-horeca` — HoReCa (Share of Menu, меню/ціни, контрактні умови)
- **Platform** `/` hub + module pages reframed as capabilities (not standalone products):
  `/vision-ai` `/sales-app` `/radar` `/horeca` `/analytics` (+ Core section on platform hub)
- **NEW `/calculator`** — interactive SaaS price calculator → lead-gen engine (see §5).
- **NEW `/compare`** — "PICSELL vs класичний SFA" — fair, category-level comparison table.
- **Demo** `/demo` — universal CTA, already wired to CC (form → lead + AI draft + Telegram).
- Keep: `/pricing` (light, points to calculator), `/about`, `/blog`, `/case-studies`, `/case-lactalis`, `/privacy`, `/terms`.

---

## 4. Home page copy blocks (UK; EN parity to follow)
1. **Hero** — «Бачиш полицю. Керуєш командою. Виграєш ринок.» + підзаголовок (AI-платформа retail execution для FMCG та HoReCa) + CTA «Розрахувати вартість» (→ калькулятор) + «Замовити демо».
2. **Біль → рішення** (3 болі з §1, кожен → модулі-докази).
3. **Як працює** (3 кроки: Фото/візит → AI розпізнає → Інсайт і дія).
4. **Платформа = модулі** (Core база + Vision/Field/Radar/HoReCa/Analytics; AI «скоро»). Кожен — 1 рядок цінності, не фіче-лист.
5. **Сегменти** — 3 картки → solutions-лендінги.
6. **Довіра** — Radar/Lactalis кейс, логотипи (за згодою — Maksim надасть окремо), цифри лише правдиві.
7. **Калькулятор-тизер** — вбудований міні-блок → повний `/calculator`.
8. **Фінальний CTA** — демо + калькулятор.

---

## 5. Interactive price calculator — spec

**Positioning:** SaaS, **оплата за користувача (per-seat)**, Core обов'язковий, доп-модулі галочками.

**Roles (per-seat rate differs):**
| Role | Typical bundle |
|---|---|
| Мерчандайзер | Core + Vision |
| Торговий представник | Core + Field |
| Супервайзер | Core + Analytics |
| HoReCa-аудитор | Core + HoReCa |
| *(адмін/офіс)* | fixed/free — TBD |

**Add-on modules (checkboxes):** Vision, Field, Radar, HoReCa, Analytics, AI Assistant *(label «скоро»)*. **Core** — always on.

**Formula:** `monthly ≈ Σ(users_by_role × role_rate) + Σ(selected_addons)`; toggle **monthly/annual** (annual = discount). Output shown as **range / "від …"** (constructor still being finalized with CEO Serhiy — do NOT present as final).

**Killer-offer / lead capture:** after the estimate → popup «Надішлемо детальний розрахунок + персональну пропозицію на пошту» → email field → POST `create_inbound_lead`:
```
{ full_name?, email, source:'website', form_id:'calculator',
  utm_source, utm_medium, utm_campaign,         // captured from URL (ads attribution)
  landing_page:'calculator',
  notes: '<selected roles+counts+modules+estimate>' }   // config summary into the lead
```
→ lead lands in CC (Вхідний) + Telegram + AI draft. On the architecture map this reads as
its real tool/resource (e.g. google_ads → site_form) — **no backend change needed**, the
pipeline already exists.

**Rates:** Maksim provides indicative per-seat rates + add-on prices → I wire them into a small
config (JSON in the Hugo data dir, or a `pricing_config` table if we want CC to edit them).

**Honesty:** estimate ≠ binding quote; copy says «орієнтовно», final on demo.

---

## 6. Phases & ownership
- **Phase 1 (lead-gen core):** this doc → Home rewrite + **Calculator** + 3 segment landings + `/compare` + Demo polish.
- **Phase 2:** reframe module pages + **EN parity** + cases/blog.
- **Phase 3:** SEO (SFA Україна / контроль полиці / AI мерчандайзинг), lead magnets.

**Ownership:** chat-Claude = positioning + copy + structure + calculator data-contract + TZ (committed). Claude Code = Hugo layouts/templates/styling + calculator UI. Maksim = approve copy + **product facts** (rates, claims, client logos/cases).

---

## 7. Open inputs from Maksim
- Indicative per-seat rates + add-on prices (for calculator).
- Client logos / case details beyond Lactalis ("є більше — розповім окремо").
- Confirm admin/office seat handling (free/fixed?).
- Any metric we may publish (recognition accuracy, visits, sell-out uplift) — only if defensible.
