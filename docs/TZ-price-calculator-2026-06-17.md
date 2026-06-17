# TZ — Interactive price calculator (`/calculator`) — lead-gen engine

Implements §5 of `docs/STRATEGY-website-rebuild-2026-06-17.md`. Hugo site (`picsell-site`).
SaaS per-seat positioning. Goal: visible estimate + email capture → lead into CC.
**UK + EN.** Tone: clear, confident, honest ("орієнтовно, фінал на демо").

## 1. Pricing data (put in `data/pricing.{uk,en}.yaml` or `data/pricing.yaml` keyed by lang)
> Rates are INDICATIVE (constructor still finalized with CEO). Easy to edit later.

```yaml
currency: "₴"
billing:
  annual_discount_pct: 20          # annual = −20%
roles:                              # per-seat, Core already included in each role rate
  - id: merch
    label_uk: "Мерчандайзер"
    label_en: "Merchandiser"
    bundle_uk: "Core + Vision"
    rate: 1800                      # ₴/user/month
  - id: sales
    label_uk: "Торговий представник"
    label_en: "Sales rep"
    bundle_uk: "Core + Field"
    rate: 1000
  - id: supervisor
    label_uk: "Супервайзер"
    label_en: "Supervisor"
    bundle_uk: "Core + Analytics"
    rate: 1000
  - id: core
    label_uk: "Інший користувач (Core)"
    label_en: "Other user (Core)"
    bundle_uk: "Core"
    rate: 1400
  - id: admin
    label_uk: "Адмін / офіс"
    label_en: "Admin / office"
    bundle_uk: "—"
    rate: 0                         # free
addons:                             # per-COMPANY, NOT per-seat (checkboxes)
  - id: radar
    label_uk: "Radar — конкурентна розвідка"
    label_en: "Radar — competitive intelligence"
    base: 20000                     # від 20 000 ₴
    per_unit: 5000                  # +5000 ₴ / площадка
    unit_label_uk: "площадка"
    unit_label_en: "marketplace"
  - id: horeca
    label_uk: "HoReCa Intelligence"
    label_en: "HoReCa Intelligence"
    base: 20000                     # від 20 000 ₴
    per_unit: 10                    # +10 ₴ / меню
    unit_label_uk: "меню"
    unit_label_en: "menu"
offer_uk: "−20% та безкоштовна міграція з вашої CRM при річному контракті"
offer_en: "−20% and free migration from your current CRM on an annual contract"
```

## 2. UI (`/calculator` page + `layouts` partial; vanilla JS, no framework)
Two columns (stack on mobile):

**Left — team (per-seat):** for each role a number stepper (0..N) with label + bundle hint
+ "× rate ₴". `admin` shows "безкоштовно". Live subtotal per role.

**Right — options (per-company checkboxes):**
- **Radar**: checkbox → reveals a "площадки" stepper. cost = `base + per_unit × qty`.
- **HoReCa**: checkbox → reveals a "меню (шт)" number input. cost = `base + per_unit × qty`.

**Billing toggle:** Місяць / Рік. Annual applies `−20%` to the **whole total** and shows the saving.

**Result panel (sticky):**
- Big total: `Σ(role.count × role.rate) + Σ(addons)`, then annual discount if toggled.
- Label: **«Орієнтовно X ₴/міс»** (+ «X ₴/рік, ви економите Y ₴» when annual).
- Offer badge: `offer_*`.
- Disclaimer (small): «Орієнтовний розрахунок. Точна пропозиція — на демо.»
- Primary CTA button: **«Отримати детальний розрахунок на пошту»** → opens capture popup.
- Secondary: «Замовити демо» → `/demo`.

Honesty rules: never call it a final price; `admin` always free; Core not double-charged
(role rates already include Core — there is no separate Core line unless the user adds
"Інший користувач (Core)").

## 3. Lead capture popup → CC
On submit (name optional, **email required**, consent checkbox), POST to the existing
Supabase function (same one the demo/site forms use). **Confirm exact endpoint with
chat-Claude**; payload shape:
```js
POST https://iblorvxgiashmdnfzbbs.supabase.co/functions/v1/submit-lead
{
  full_name,                       // optional
  email,                           // required
  phone,                           // optional
  source: "website",
  form_id: "calculator",
  utm_source, utm_medium, utm_campaign,   // read from URL/sessionStorage (ads attribution)
  landing_page: "calculator",
  message: "<human-readable config: roles+counts, addons+qty, billing, estimate ₴>"
}
```
Backend already routes `form_id=calculator` → lead (stage «Вхідний») + Telegram + AI draft,
and it appears on the Sales architecture map by its real utm/source. **No backend change needed.**

Success state: «Готово! Розрахунок надішлемо на пошту, менеджер звʼяжеться.» Handle error
(show retry). Never block the UI; no localStorage.

## 4. Build / quality
Hugo builds clean. Mobile-first. UK + EN via Hugo i18n/data. Match site's existing visual
language (reuse current CSS/tokens). Accessible (labels, keyboard, focus trap in popup).

## Ownership
chat-Claude: this TZ + `inbound_forms` `calculator` config (DONE) + verify submit-lead handles it.
Claude Code: build `/calculator` (Hugo layout + data + JS + popup) on branch
`feat/price-calculator`, open PR **"do NOT merge"**. Maksim: confirm rates, approve copy.
