const https = require('https');

const BOT_TOKEN = '8769244217:AAHE2dhuAkpdK8F_R3hon_OKT7e1O-U3XU0';
const CHAT_ID = '-1003956968407'; // PICSELL Заявки forum
const THREAD_ZAYAVKY = 6; // Тема: Заявки
const THREAD_ANALITYKA = 4; // Тема: Аналітика
const THREAD_DAIJEST = 2; // Тема: Дайджест

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

    let message = '';

    if (form_name === 'demo-request') {
      message = `🔔 <b>Нова заявка на демо! ${langFlag}</b>\n\n` +
        `👤 <b>Ім'я:</b> ${data.name || '—'}\n` +
        `🏢 <b>Компанія:</b> ${data.company || '—'}\n` +
        `📱 <b>Телефон:</b> ${data.phone || '—'}\n` +
        `📧 <b>Email:</b> ${data.email || '—'}\n` +
        `💼 <b>Роль:</b> ${data.role || '—'}\n` +
        `👥 <b>Агентів:</b> ${data.agents || '—'}` +
        interests +
        `\n\n📌 <b>Форма:</b> /demo — ${langLabel}`;

    } else if (form_name === 'homepage-demo') {
      message = `🔔 <b>Нова заявка з головної! ${langFlag}</b>\n\n` +
        `👤 <b>Ім'я:</b> ${data.name || '—'}\n` +
        `🏢 <b>Компанія:</b> ${data.company || '—'}\n` +
        `📱 <b>Телефон:</b> ${data.phone || '—'}\n` +
        `📧 <b>Email:</b> ${data.email || '—'}\n` +
        `💼 <b>Роль:</b> ${data.role || '—'}` +
        interests +
        `\n\n📌 <b>Форма:</b> Головна сторінка — ${langLabel}`;

    } else if (form_name === 'subscribe') {
      message = `📬 <b>Нова підписка на блог! ${langFlag}</b>\n\n` +
        `📧 <b>Email:</b> ${data.email || '—'}\n` +
        `📌 <b>Версія:</b> ${langLabel}`;

    } else {
      message = `📋 <b>Нова форма:</b> ${form_name} ${langFlag}\n\n` +
        Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
    }

    const threadId = (form_name === 'subscribe') ? THREAD_ANALITYKA : THREAD_ZAYAVKY;
    await sendTelegram(message, threadId);

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
