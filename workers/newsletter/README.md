# Newsletter signup (Cloudflare Worker + Resend)

The site's "Mailing list" form posts to this Worker, which adds the person to
Resend Contacts and sends one welcome email. Campaigns are sent by hand as
Resend **Broadcasts** (free plan: up to 1,000 contacts, unlimited broadcast
sends; Broadcasts add the unsubscribe link for you via `{{{RESEND_UNSUBSCRIBE_URL}}}`).

The form stays hidden on the site until `SITE.newsletter.endpoint` in
`js/config.js` is filled in, so this can merge before the Worker exists.

## One-time setup (about 15 minutes)

1. **Resend account** (free) → *Domains* → add `jeffdevinemusic.com`.
   Use *Auto configure* with Cloudflare, or copy the SPF/DKIM (and optional
   DMARC) records into Cloudflare DNS. Keep them DNS-only (grey cloud).
   These coexist with Cloudflare Email Routing; don't remove the MX records.
2. Resend → *API Keys* → create a key with **Full access** (contacts need it).
3. Resend → *Segments* → create "Website signups", copy its id into
   `RESEND_SEGMENT_ID` in `wrangler.toml` (optional, but keeps imports apart).
4. Fill `POSTAL_ADDRESS` in `wrangler.toml` (a PO box is fine).
5. Deploy:
   ```bash
   cd workers/newsletter
   npx wrangler login
   npx wrangler secret put RESEND_API_KEY
   npx wrangler deploy
   ```
6. In `js/config.js` set
   `newsletter.endpoint: "https://subscribe.jeffdevinemusic.com/subscribe"`,
   push to `main`, and test the form with your own address.

## Sending a campaign

Resend → *Broadcasts* → New → audience "Website signups" (or all contacts) →
paste the campaign HTML from `devine-music-tools/docs/outreach/` → send a test
to yourself → schedule. Include `{{{RESEND_UNSUBSCRIBE_URL}}}` and the postal
address in the footer.

**Do not import scraped or bought lists into Resend** — its terms only allow
mailing people who opted in, and high bounce/spam rates (over 4% / 0.08%) get
the account paused. Cold outreach to choir directors goes one-to-one from
Gmail (send-as jeff@jeffdevinemusic.com); anyone who replies asking for more
can then be added.

## Abuse protection

Origin allowlist + honeypot field. If bots get through, add a Cloudflare
*Rate limiting rule* on `subscribe.jeffdevinemusic.com` (free plan allows one)
or Turnstile.
