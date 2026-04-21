const https = require('https');

const BOT_TOKEN = '8769244217:AAHE2dhuAkpdK8F_R3hon_OKT7e1O-U3XU0';
const CHAT_ID = '-1003956968407'; // PICSELL Заявки forum
const THREAD_ZAYAVKY = 6; // Тема: Заявки
const THREAD_ANALITYKA = 4; // Тема: Аналітика
const THREAD_DAIJEST = 2; // Тема: Дайджест

// Notion CRM integration
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = '64216545d7aa422a92902ee7749a1d43'; // Клієнти та Угоди

function createNotionLead(data) {
  if (!NOTION_TOKEN) return Promise.resolve(null);
  const lang = data.lang || 'uk';
  const src = (data.utm_source || 'direct').toLowerCase();

  // Джерело — точні назви з бази
  let dzherelo = 'Inbound';
  if (src === 'linkedin') dzherelo = 'LinkedIn';
  else if (src === 'referral') dzherelo = 'Referral';
  else if (src === 'cold') dzherelo = 'Cold Outreach';

  const today = new Date().toISOString().split('T')[0];

  const notesArr = [
    data.role    ? `Роль: ${data.role}` : '',
    data.agents  ? `Агентів: ${data.agents}` : '',
    data.interests ? `Інтереси: ${data.interests}` : '',
    data.landing_page ? `Landing: ${data.landing_page}` : '',
    data.utm_medium ? `Medium: ${data.utm_medium}` : ''
  ].filter(Boolean).join(' | ');

  // Продукти з чекбоксів
  let products = [];
  if (data.interests) {
    const il = data.interests.toLowerCase();
    if (il.includes('vision')) products.push('Vision AI');
    if (il.includes('sales app') || il.includes('польові') || il.includes('field')) products.push('SFA');
    if (il.includes('horeca')) products.push('HoReCa Radar');
    if (il.includes('analytics') || il.includes('дашборд')) products.push('Analytics');
    products = [...new Set(products)];
  }

  // Будуємо properties згідно Notion API v1
  const properties = {
    'Компанія': {
      title: [{ type: 'text', text: { content: data.company || 'Невідомо' } }]
    },
    'Контактна особа': {
      rich_text: [{ type: 'text', text: { content: data.name || '' } }]
    },
    'Email': { email: data.email || null },
    'Телефон': { phone_number: data.phone || null },
    'Статус': { select: { name: '🔍 Лід' } },
    'Пріоритет': { select: { name: '⚡ Теплий' } },
    'Джерело': { select: { name: dzherelo } },
    'Mova': { select: { name: lang === 'en' ? 'EN' : 'UA' } },
    'UTM Source': {
      rich_text: [{ type: 'text', text: { content: data.utm_source || 'direct' } }]
    },
    'Нотатки': {
      rich_text: [{ type: 'text', text: { content: notesArr } }]
    },
    'Наступний крок': {
      rich_text: [{ type: 'text', text: { content: 'Зателефонувати / написати для призначення демо' } }]
    },
    'Дата першого контакту': { date: { start: today } }
  };

  if (products.length > 0) {
    properties['Продукти'] = { multi_select: products.map(name => ({ name })) };
  }

  const body = JSON.stringify({
    parent: { database_id: NOTION_DB_ID },
    properties
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.notion.com',
      path: '/v1/pages',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const r = JSON.parse(d);
          if (r.object === 'error') console.error('Notion API error:', r.message);
          resolve(r);
        } catch(e) { resolve(null); }
      });
    });
    req.on('error', (e) => { console.error('Notion request error:', e); resolve(null); });
    req.write(body);
    req.end();
  });
}

function sendTelegram(text, threadId) {
  return new Promise((resolve, reject) => {
    const payload = {
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'HTML'
    };
    if (threadId) payload.message_thread_id = threadId;
    const body = JSON.stringify(payload);

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const payload = JSON.parse(event.body);
    const { form_name, data } = payload;

    // Визначаємо мову та прапорець
    const lang = data.lang || 'uk';
    const langFlag = lang === 'en' ? '🇺🇸 EN' : '🇺🇦 UA';
    const langLabel = lang === 'en' ? 'English site' : 'Українська версія';

    // Інтереси з чекбоксів
    const interests = data.interests ? `\n🎯 <b>Інтереси:</b> ${data.interests}` : '';

    // Джерело трафіку
    const sourceEmoji = {
      'google': '🔍', 'google / organic': '🔍', 'google / cpc': '💰',
      'linkedin': '💼', 'facebook': '📘', 'instagram': '📸',
      'twitter': '🐦', 'telegram': '✈️',
      'direct': '🔗', 'referral': '🌐'
    };
    const src = data.utm_source || 'direct';
    const medium = data.utm_medium || '';
    const campaign = data.utm_campaign || '';
    const landingPage = data.landing_page || '';
    const emoji = sourceEmoji[src.toLowerCase()] || sourceEmoji[medium.toLowerCase()] || '🌐';
    let trafficLine = `\n${emoji} <b>Джерело:</b> ${src}`;
    if(medium && medium !== src) trafficLine += ` / ${medium}`;
    if(campaign) trafficLine += ` — <i>${campaign}</i>`;
    if(landingPage && landingPage !== '/demo/' && landingPage !== '/en/demo/') trafficLine += `\n📍 <b>Входив з:</b> ${landingPage}`;

    let message = '';

    if (form_name === 'demo-request') {
      message = `🔔 <b>Нова заявка на демо! ${langFlag}</b>\n\n` +
        `👤 <b>Ім'я:</b> ${data.name || '—'}\n` +
        `🏢 <b>Компанія:</b> ${data.company || '—'}\n` +
        `📱 <b>Телефон:</b> ${data.phone || '—'}\n` +
        `📧 <b>Email:</b> ${data.email || '—'}\n` +
        `💼 <b>Роль:</b> ${data.role || '—'}\n` +
        `👥 <b>Агентів:</b> ${data.agents || '—'}` +
        interests + trafficLine +
        `\n\n📌 <b>Форма:</b> /demo — ${langLabel}`;

    } else if (form_name === 'homepage-demo') {
      message = `🔔 <b>Нова заявка з головної! ${langFlag}</b>\n\n` +
        `👤 <b>Ім'я:</b> ${data.name || '—'}\n` +
        `🏢 <b>Компанія:</b> ${data.company || '—'}\n` +
        `📱 <b>Телефон:</b> ${data.phone || '—'}\n` +
        `📧 <b>Email:</b> ${data.email || '—'}\n` +
        `💼 <b>Роль:</b> ${data.role || '—'}` +
        interests + trafficLine +
        `\n\n📌 <b>Форма:</b> Головна сторінка — ${langLabel}`;

    } else if (form_name === 'subscribe') {
      message = `📬 <b>Нова підписка на блог! ${langFlag}</b>\n\n` +
        `📧 <b>Email:</b> ${data.email || '—'}\n` +
        `📌 <b>Версія:</b> ${langLabel}` + trafficLine;

    } else {
      message = `📋 <b>Нова форма:</b> ${form_name} ${langFlag}\n\n` +
        Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
    }

    const threadId = (form_name === 'subscribe') ? THREAD_ANALITYKA : THREAD_ZAYAVKY;

    // Паралельно: Telegram + Notion CRM
    const tasks = [sendTelegram(message, threadId)];
    if (form_name === 'demo-request' || form_name === 'homepage-demo') {
      tasks.push(createNotionLead(data));
    }
    await Promise.allSettled(tasks);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };

  } catch (err) {
    console.error('Telegram notify error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
