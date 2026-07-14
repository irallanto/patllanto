const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (err) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const name = payload.name || 'Anonymous';
  const email = payload.email || 'no-reply@example.com';
  const message = payload.message || '';

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL; // where submissions are sent
  const FROM_EMAIL = process.env.FROM_EMAIL || RECIPIENT_EMAIL;

  if (!SENDGRID_API_KEY || !RECIPIENT_EMAIL) {
    return { statusCode: 500, body: 'Server not configured (missing env vars)' };
  }

  const sgPayload = {
    personalizations: [{ to: [{ email: RECIPIENT_EMAIL }] }],
    from: { email: FROM_EMAIL },
    subject: `Portfolio inquiry from ${name}`,
    content: [{ type: 'text/plain', value: `Name: ${name}\nEmail: ${email}\n\n${message}` }]
  };

  try {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sgPayload)
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: 502, body: `SendGrid error: ${res.status} ${text}` };
    }

    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    return { statusCode: 502, body: 'Upstream error' };
  }
};
