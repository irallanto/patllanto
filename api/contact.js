const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const { name = 'Anonymous', email = '', message = '' } = req.body || {};

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;
  const FROM_EMAIL = process.env.FROM_EMAIL || RECIPIENT_EMAIL;

  if (!SENDGRID_API_KEY || !RECIPIENT_EMAIL) {
    return res.status(500).json({ error: 'Server not configured (missing env vars)' });
  }

  const sgPayload = {
    personalizations: [{ to: [{ email: RECIPIENT_EMAIL }] }],
    from: { email: FROM_EMAIL },
    subject: `Portfolio inquiry from ${name}`,
    content: [{ type: 'text/plain', value: `Name: ${name}\nEmail: ${email}\n\n${message}` }]
  };

  try {
    const r = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sgPayload)
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(502).json({ error: `SendGrid error: ${r.status}`, details: text });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(502).json({ error: 'Upstream error' });
  }
};
