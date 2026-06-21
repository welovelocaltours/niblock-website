// Vercel serverless function — receives the website quote/contact form and
// emails it to Niblock via Resend. No npm deps: uses the built-in fetch + Resend REST API.
//
// Required Vercel env var:  RESEND_API_KEY  (your Resend API key)
// Optional Vercel env vars:
//   MAIL_TO    — where enquiries are sent (default: info@niblocklogistics.co.uk)
//   MAIL_FROM  — verified-domain sender (default: onboarding@resend.dev).
//                Set this to an address on a domain you've verified in Resend,
//                e.g. "Niblock Website <noreply@niblocklogistics.co.uk>".

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body || '{}');
    if (!body || typeof body !== 'object') body = {};

    const name    = (body.name    || '').toString().trim();
    const email   = (body.email   || '').toString().trim();
    const phone   = (body.phone   || '').toString().trim();
    const service = (body.service || '').toString().trim();
    const message = (body.message || '').toString().trim();
    const company = (body.company || '').toString().trim(); // honeypot (hidden field)

    // Silently accept bot submissions (hidden honeypot field was filled)
    if (company) { res.status(200).json({ ok: true }); return; }

    if (!name || !email) {
      res.status(400).json({ error: 'Please provide your name and email.' });
      return;
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not set');
      res.status(500).json({ error: 'Email is not configured yet.' });
      return;
    }

    const to   = process.env.MAIL_TO   || 'info@niblocklogistics.co.uk';
    const from = process.env.MAIL_FROM || 'Niblock Website <onboarding@resend.dev>';

    const esc = (s) => String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
    const html = `
      <h2 style="font-family:Arial,sans-serif;color:#0c2c47">New quote enquiry</h2>
      <table style="font-family:Arial,sans-serif;font-size:15px;color:#1a2430;border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0"><b>Name</b></td><td>${esc(name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0"><b>Email</b></td><td>${esc(email)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0"><b>Phone</b></td><td>${esc(phone) || '—'}</td></tr>
        <tr><td style="padding:4px 12px 4px 0"><b>Service</b></td><td>${esc(service) || '—'}</td></tr>
      </table>
      <p style="font-family:Arial,sans-serif;font-size:15px;color:#1a2430"><b>Message</b><br>${esc(message).replace(/\n/g, '<br>') || '—'}</p>
      <hr style="border:none;border-top:1px solid #e5ebf1">
      <p style="font-family:Arial,sans-serif;font-size:12px;color:#8893a3">Sent from the niblocklogistics.co.uk contact form. Reply directly to this email to respond to the enquirer.</p>`;

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `New quote enquiry — ${name}`,
        html,
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      console.error('Resend error', resp.status, detail);
      res.status(502).json({ error: 'Could not send the email.' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unexpected server error.' });
  }
};
