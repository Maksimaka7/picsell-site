const https = require('https');

const BOT_TOKEN = '8769244217:AAHE2dhuAkpdK8F_R3hon_OKT7e1O-U3XU0';
const CHAT_ID = '-5255672708'; // PICSELL Заявки group

function sendTelegram(text) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'HTML'
    });

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

    let message = '';

    if (form_name === 'demo-request') {
      message = `🔔 <b>Нова заявка на демо!</b>\n\n` +
        `👤 <b>Ім'я:</b> ${data.name || '—'}\n` +
        `🏢 <b>Компанія:</b> ${data.company || '—'}\n` +
        `📱 <b>Телефон:</b> ${data.phone || '—'}\n` +
        `📧 <b>Email:</b> ${data.email || '—'}\n` +
        `💼 <b>Роль:</b> ${data.role || '—'}\n` +
        `👥 <b>Агентів:</b> ${data.agents || '—'}\n\n` +
        `📌 Форма: /demo`;

    } else if (form_name === 'homepage-demo') {
      message = `🔔 <b>Нова заявка з головної!</b>\n\n` +
        `👤 <b>Ім'я:</b> ${data.name || '—'}\n` +
        `🏢 <b>Компанія:</b> ${data.company || '—'}\n` +
        `📱 <b>Телефон:</b> ${data.phone || '—'}\n` +
        `📧 <b>Email:</b> ${data.email || '—'}\n` +
        `💼 <b>Роль:</b> ${data.role || '—'}\n\n` +
        `📌 Форма: головна сторінка`;

    } else if (form_name === 'subscribe') {
      message = `📬 <b>Нова підписка на блог!</b>\n\n` +
        `📧 <b>Email:</b> ${data.email || '—'}`;

    } else {
      message = `📋 <b>Нова форма:</b> ${form_name}\n\n` +
        Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
    }

    await sendTelegram(message);

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
