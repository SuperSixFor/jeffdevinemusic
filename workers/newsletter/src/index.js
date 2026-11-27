/**
 * Devine Music — newsletter signup Worker (Cloudflare Workers + Resend)
 *
 * POST /subscribe  { email, firstName?, interest?, website? }
 *   - website is a honeypot: bots fill it, people never see it.
 *   - Adds the person as a Resend contact (global contacts; optionally
 *     into RESEND_SEGMENT_ID), then sends one welcome email.
 *   - Only accepts browser requests from ALLOWED_ORIGINS.
 *
 * Secrets (wrangler secret put …):  RESEND_API_KEY
 * Vars (wrangler.toml):              ALLOWED_ORIGINS, FROM_EMAIL,
 *                                    RESEND_SEGMENT_ID, SEND_WELCOME
 *
 * Nothing here sends to anyone but the person who just signed up.
 * Campaigns go out as Resend Broadcasts, sent by hand from the dashboard.
 */

const RESEND = 'https://api.resend.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INTERESTS = new Set(['choir-director', 'church-musician', 'instrumentalist', 'other', '']);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    const cors = allowed.includes(origin)
      ? { 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin' }
      : {};

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: { ...cors, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400' },
      });
    }
    if (url.pathname !== '/subscribe' || request.method !== 'POST') {
      return json({ ok: false, error: 'Not found' }, 404, cors);
    }
    if (!allowed.includes(origin)) {
      return json({ ok: false, error: 'Forbidden' }, 403, cors);
    }

    let body;
    try { body = await request.json(); } catch { return json({ ok: false, error: 'Bad request' }, 400, cors); }

    // Honeypot: pretend success so bots learn nothing.
    if (body.website) return json({ ok: true }, 200, cors);

    const email = String(body.email || '').trim().toLowerCase().slice(0, 254);
    const firstName = String(body.firstName || '').trim().slice(0, 80);
    const interest = String(body.interest || '').trim();
    if (!EMAIL_RE.test(email)) return json({ ok: false, error: 'Please enter a valid email address.' }, 400, cors);
    if (!INTERESTS.has(interest)) return json({ ok: false, error: 'Bad request' }, 400, cors);

    const contact = { email, unsubscribed: false };
    if (firstName) contact.first_name = firstName;
    if (env.RESEND_SEGMENT_ID) contact.segments = [{ id: env.RESEND_SEGMENT_ID }];
    // Requires an "interest" contact property created in the Resend dashboard.
    if (interest && env.USE_INTEREST_PROPERTY === 'true') contact.properties = { interest };

    const created = await resend(env, '/contacts', contact);
    const already = created.status === 409 || /already exists/i.test(created.text);
    if (!created.ok && !already) {
      console.error('create contact failed', created.status, created.text);
      return json({ ok: false, error: 'Sorry, something went wrong. Please try again later.' }, 502, cors);
    }

    // Welcome email (transactional; counts toward 100/day on the free plan).
    if (env.SEND_WELCOME === 'true' && !already) {
      const sent = await resend(env, '/emails', welcomeEmail(env, email, firstName));
      if (!sent.ok) console.error('welcome email failed', sent.status, sent.text);
    }

    return json({ ok: true, already }, 200, cors);
  },
};

async function resend(env, path, payload) {
  const res = await fetch(RESEND + path, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return { ok: res.ok, status: res.status, text: await res.text() };
}

function welcomeEmail(env, to, firstName) {
  const hi = firstName ? `Hi ${escapeHtml(firstName)},` : 'Hello,';
  const site = 'https://jeffdevinemusic.com';
  const unsub = `mailto:${env.REPLY_TO}?subject=Unsubscribe`;
  return {
    from: env.FROM_EMAIL,
    to: [to],
    reply_to: env.REPLY_TO,
    subject: 'Welcome — new music from Jeff Devine',
    headers: { 'List-Unsubscribe': `<${unsub}>` },
    html: `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.6;color:#222;max-width:560px">
<p>${hi}</p>
<p>Thank you for signing up. A few times a year I'll send a short note with new pieces and seasonal music for Advent, Christmas, Lent and Easter — never more than that.</p>
<p>The full catalog, with score previews and audio, is at <a href="${site}/catalog.html">jeffdevinemusic.com</a>. If you direct a choir and would like a perusal score of anything, just reply to this email.</p>
<p>Grace and peace,<br>Jeff Devine</p>
<hr style="border:none;border-top:1px solid #ddd;margin:24px 0">
<p style="font-size:12px;color:#777">You're receiving this because you signed up at jeffdevinemusic.com. Don't want these? <a href="${unsub}">Unsubscribe</a>.<br>${escapeHtml(env.POSTAL_ADDRESS || '')}</p>
</div>`,
  };
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...headers } });
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
