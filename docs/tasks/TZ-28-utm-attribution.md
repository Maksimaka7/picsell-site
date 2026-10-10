# ТЗ-28 · Атрибуція: перший і останній дотик, click id, `lead_submit`

**Репозиторій:** `Maksimaka7/picsell-site`
**Гілка:** `main`
**База:** `d03b9b4` (блоби: `head.html` = `b7f130e`, `analytics-events.html` = `fd8af4e`, `cta-demo.html` = `79880b4`, `calculator.html` = `57aa8ac`, `page/demo.html` = `32a188d`)
**Готовий файл:** `docs/tasks/tz28/attribution.html` → скопіювати в `layouts/partials/attribution.html` (як є)
**Правки в 5 файлах:** розділ 3, крок 1 — точні, по рядках
**Оцінка:** 30 хвилин разом із перевіркою
**Бекенд:** уже готовий — `submit-lead` v28 приймає всі поля нижче, RPC пише `leads.attribution` (first/last/click_ids/form_page), `utm_*` = останній дотик.

---

## 1. Що не так зараз (виміряно по коду, не з чужого ТЗ)

Зовнішнє ТЗ від маркетингу каже «мітки губляться при переході на внутрішню сторінку». По коду картина інша і гірша:

| Що | Як зараз | Наслідок |
|---|---|---|
| Сховище | `sessionStorage['picsell_utm']` | живе лише у вкладці; закрив вкладку → повернувся завтра → мітки зникли |
| Без UTM | у `submit-lead` йде `utm_source:'direct'` | **органіка Google, LinkedIn-пост, будь-який referrer = «direct»**. Функція `getSource()` з референсом існувала, але її результат ішов лише в приховані поля `<form>` для Netlify, а Netlify їх відкидає (стаб їх не декларує) |
| Click id | не збираються | `gclid`/`fbclid` не доходять ніде |
| Перший дотик | відсутній | не видно, звідки людина прийшла вперше |
| `lead_submit` у GTM | немає | є лише `generate_lead` через `gtag` |

Саме тому в CC «Воронка leads → Архітектура» показує **228 з 261 як Direct**.

Точок відправки лідів рівно три (у шаблонах більше немає; попапів немає):

1. `/demo/` і `/en/demo/` — `layouts/page/demo.html`, `<form name="demo-request">`
2. Головна, блок «Замовте персональне демо» — `layouts/partials/cta-demo.html`. **Це не `<form>`, а кнопка `#ctaSubmit` з click-обробником** — пошук «всіх форм» її пропускає.
3. Калькулятор, «Отримати детальну пропозицію» — `layouts/partials/calculator.html`, теж кнопка без `<form>`.

Поле «Звідки дізнались» (`#ctaSrc`, «канал») на головній лишається як є — це відповідь людини, а атрибуція — факт візиту; вони не замінюють одне одного.

---

## 2. Що робиться

**Новий `layouts/partials/attribution.html`**, підключено в `head.html` одразу після GTM (на всіх сторінках обох мов, включно з блогом).

- `localStorage`, при недоступності — first-party cookie (`path=/`, `SameSite=Lax`, `Secure` на https). `sessionStorage` більше не використовується.
- `picsell_first_touch` — пишеться один раз. `picsell_last_touch` — перезаписується лише **не-прямим** заходом: UTM/click id у URL **або зовнішній referrer**. Прямий захід і внутрішні переходи нічого не чіпають і не чистять. Обидва мають `exp` = 90 днів від запису, перевіряється при читанні.
- Без UTM, але з referrer — класифікація: пошуковики → `google / organic` тощо; соцмережі → `linkedin / social`, `facebook / social`, `telegram / social`; решта → `<домен> / referral`; без referrer → `direct / none`.
  *Відхід від зовнішнього ТЗ свідомий:* там last touch оновлюється лише за UTM. Тоді людина, що прийшла з реклами Facebook, а через тиждень — з органіки Google, лишилась би «Facebook» в останньому дотику. Правило «останній не-прямий» — стандарт GA, і саме воно прибирає «Direct 228».
- Тільки click id без `utm_source` → джерело з click id (`gclid`→google, `fbclid`→facebook, `ttclid`→tiktok, `msclkid`→bing), medium `cpc`.
- Нічого не дописується до посилань, URL не змінюється.
- `window.picsellAttr.payload()` — плоскі поля для `submit-lead`: `ft_source…ft_time`, `lt_source…lt_referrer`, `gclid gbraid wbraid fbclid ttclid msclkid` (з last touch), `form_page` (повний URL сторінки відправки) + сумісні `utm_source/medium/campaign/content`, `landing_page`, `referrer`. Порожні = `''`. Ніколи не кидає виняток.
- `window.picsellAttr.push(formName)` — `dataLayer.push({event:'lead_submit', form_name, lt_source, lt_medium, lt_campaign})`.

**Три точки відправки:** старі `getUtm()` / `sessionStorage` прибрано, тіло запиту доповнюється `picsellAttr.payload()` **в момент відправки**. `lead_submit` — лише після `res.ok`, поруч із наявним `generate_lead` (той не чіпали, не дублюється). `form_name`: `demo_request`, `homepage_demo`, `calculator` — ті самі мітки, що в `generate_lead`.

**`analytics-events.html`:** старий блок UTM (sessionStorage + приховані поля) видалено повністю — Netlify ці поля все одно відкидав.

Логіку `attribution.html` прогнано в Node зі змодельованими `location`/`referrer`/`localStorage` — сценарії a–d нижче, органіка Google, LinkedIn, лише `gclid`, протухання через 91 день: усе як очікується. **Але це модель, а не браузер** — перевірка нижче обов'язкова.

---

## 3. Що зробити тобі

1. Правки:
   - `cp docs/tasks/tz28/attribution.html layouts/partials/attribution.html`
   - `layouts/partials/head.html`: одразу після рядка `})(window,document,'script','dataLayer','GTM-K4T96TN5');</script>` додати рядок `{{ partial "attribution.html" . }}`
   - `layouts/partials/analytics-events.html`: видалити весь блок від `// ── UTM & SOURCE TRACKING` до `// ── END UTM TRACKING ───…` включно (≈70 рядків), лишити замість нього коментар `// UTM / source tracking moved to partials/attribution.html (TZ-28)`. Решту (gtag-події) не чіпати.
   - `layouts/partials/cta-demo.html` і `layouts/partials/calculator.html` (однаково в обох):
     - видалити функцію `getUtm()` (2 рядки);
     - `var utm=getUtm();` → `var attr=window.picsellAttr?window.picsellAttr.payload():{};`
     - `body:JSON.stringify({ … })` → `body:JSON.stringify(Object.assign({ … },attr))`
     - з об'єкта прибрати рядки `utm_source…`, `utm_campaign…` і `landing_page:(sessionStorage…)` — тепер їх дає `attr`;
     - у гілці `if(res.ok)` одразу після наявного `gtag('event','generate_lead',…)` додати `if(window.picsellAttr)window.picsellAttr.push('homepage_demo');` (у калькуляторі — `'calculator'`).
   - `layouts/page/demo.html`, функція `submitDemoForm`, блок «2) Supabase leads»:
     - прибрати `var utm={}; try{utm=JSON.parse(sessionStorage…)}`;
     - об'єкт тіла винести в `var body={ …, lang:lang };` без рядків `utm_*` і `landing_page`;
     - після нього: `try{var at=window.picsellAttr?window.picsellAttr.payload():{};for(var k in at)body[k]=at[k];}catch(e){}`
     - `fetch(…submit-lead,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(function(res){if(res.ok&&window.picsellAttr)window.picsellAttr.push('demo_request');}).catch(function(){});`
   - `grep -rn "picsell_utm\|picsell_landing\|getUtm" layouts/` — має бути порожньо.
   - У `docs/tasks/README.md` додати в таблицю статусу рядок TZ-28 «Атрибуція: перший/останній дотик, click id, `lead_submit`» — `Виконано <hash>`.
2. `hugo` збирається без помилок. Переконайся, що в **зібраному** `public/index.html` і `public/en/demo/index.html` є `window.picsellAttr` (мініфікатор не з'їв скрипт; у партіалі немає `{{ }}` — Hugo його не чіпає).
3. Коміт, пуш у `main`, дочекайся деплою Netlify.
4. Перевірка на **продакшні** в Chrome (не на локальному сервері — інший домен, інший referrer):

| # | Сценарій | Очікується в Telegram (гілка лідів) і в `leads` |
|---|---|---|
| a | `/?utm_source=facebook&utm_medium=cpc&utm_campaign=qa_tz28&fbclid=123` → `/pricing/` → `/demo/` → форма | «Джерело (останнє): facebook / cpc», «Кампанія: qa_tz28» (підкреслення не ламає повідомлення), `fbclid=123`, «Посадкова» з повним URL, «Форма з …/demo/» |
| b | закрити вкладку, відкрити `/demo/` напряму в новій вкладці → форма | ті самі мітки, що в (a) |
| c | `/?utm_source=google&utm_medium=cpc&gclid=abc` → калькулятор → «Отримати детальну пропозицію» | останнє = google / cpc, «Перший дотик: facebook / cpc / qa_tz28», `gclid=abc` |
| d | інкогніто, `/en/demo/` без міток → форма | «direct / none», форма надсилається |
| e | (a) на `/en/` + форма на головній (`#ctaSubmit`) | як (a); `lang: en` |
| f | DevTools → Application: заблокувати cookies/storage для сайту → форма | лід надсилається, атрибуція порожня, у консолі без помилок |

Для кожної заявки: email `qa.tz28.<літера>@picsell.ai`, ім'я `QA TZ-28 <літера>`.

Також перевір:
- `dataLayer` у консолі після успішної відправки — рівно **один** `lead_submit` на відправку з правильним `form_name`.
- SQL (через Supabase, проект `iblorvxgiashmdnfzbbs`):
  ```sql
  select email, utm_source, utm_medium, utm_campaign, attribution
  from leads where email like 'qa.tz28.%' order by created_at;
  ```
  `attribution->'first'->>'source'` = facebook, `attribution->'last'->>'source'` = google для (c).

5. У звіті: таблиця a–f з фактичним результатом, список змінених файлів, **id тестових лідів** (Максим прибере, або я зачищу сам).

---

## 4. Чого не робити

- Не повертати `sessionStorage` як основне сховище і не дописувати UTM до внутрішніх посилань.
- Не чіпати `generate_lead` і поле «Звідки дізнались».
- Не додавати UTM-поля в Netlify-стаб у `baseof.html` — джерело правди CRM, не Netlify Forms.
