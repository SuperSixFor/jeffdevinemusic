/**
 * DEVINE MUSIC — SITE CONFIG
 * ─────────────────────────────────────────────────────────────
 * This is the ONLY file you need to edit for content updates.
 * All text, links, and metadata across every page pulls from here.
 * ─────────────────────────────────────────────────────────────
 */

const SITE = {

  // ── IDENTITY ─────────────────────────────────────────────────
  name:     "Jeff Devine",
  dba:      "Devine Music",
  tagline:  "Composer · Guitarist · Publisher",
  location: "Weatherford, TX",
  email:    "jeff@jeffdevinemusic.com",   // update when domain is live
  url:      "https://jeffdevinemusic.com",

  // ── THEME ──────────────────────────────────────────────────
  // Swap filename to change the visual theme. Drop any .css file
  // into css/themes/ and reference it here.
  // Included: theme-default.css · theme-dark.css · theme-editorial.css
  theme: "theme-default.css",

  // ── META (SEO) ────────────────────────────────────────────────
  meta: {
    home:    "Sacred choral works and solo classical guitar by Jeff Devine. Sheet music, scores, and recordings.",
    music:   "Stream solo classical guitar recordings by Jeff Devine on Spotify and Apple Music.",
    shop:    "Sheet music and scores by Jeff Devine. Choral works and solo guitar, instant PDF download.",
    about:   "Biography and background of composer and guitarist Jeff Devine.",
    contact: "Contact Jeff Devine for licensing, scores, or general correspondence.",
  },

  // ── NAVIGATION ────────────────────────────────────────────────
  nav: [
    { label: "Music",   href: "music.html" },
    { label: "Shop",    href: "shop.html" },
    { label: "About",   href: "about.html" },
    { label: "Contact", href: "contact.html" },
  ],

  // ── STREAMING / SOCIAL LINKS ──────────────────────────────────
  links: {
    spotify:    "https://open.spotify.com/artist/0Ug2TS3EwRh4DOZtF55IQQ",   // paste Spotify artist URL when ready
    appleMusic: "https://music.apple.com/us/artist/jeff-devine/413666593",   // paste Apple Music artist URL when ready
  },

  // ── HOMEPAGE ──────────────────────────────────────────────────
  home: {
    heroHeading: "Jeff Devine",
    heroSub:     "Sacred choral works & solo classical guitar",
    heroCTA:     { label: "Explore the Catalog", href: "shop.html" },

    // Up to 3 featured pieces shown on homepage. href links to shop.
    featuredPieces: [
      { title: "Let All Mortal Flesh Keep Silence", voicing: "SATB · A Cappella", season: "Advent",   href: "shop.html" },
      { title: "Holy God, We Praise Your Name",     voicing: "SATB · A Cappella", season: "General",  href: "shop.html" },
      { title: "It is Well With My Soul",           voicing: "Solo Guitar",       season: "General",  href: "shop.html" },
    ],

    // Publisher/partner highlights on homepage.
    publishers: [
      {
        name:  "Mel Bay Publications",
        title: "Fingerpicking Hymns",
        desc:  "Solo guitar arrangements of beloved hymns",
        url:   "https://www.melbay.com/Products/99969BCDEB/fingerpicking-hymns.aspx",
        note:  "In print",
      },
    ],

    spotifyEmbedUri: "", // e.g. "spotify:artist:XXXX" — leave blank until ready

    // About strip (homepage excerpt — keep short)
    aboutExcerpt: `Guitarist, arranger, and composer of sacred choral works.
    Published by the Royal College of Church Music and Mel Bay Publications.
    ASCAP member.`,
    aboutExcerptNote: "Bio in progress. Full story on the About page.",
  },

  // ── ABOUT PAGE ────────────────────────────────────────────────
  about: {
    headshotSrc: "assets/images/headshot.png",   // swap filename here to change headshot
    headshotAlt: "Jeff Devine",

    // Bio paragraphs — each string is one <p>. Edit freely.
    bio: [
      `Jeff Devine, a graduate of Biola University and California State University
       at Fullerton, is an accomplished guitarist, arranger, and composer.`,

      `He especially enjoys setting quality hymn texts to original music, and is
       currently in print with the Royal College of Church Music (RSCM) and
       Mel Bay Publications.`,

      `Devine served for many years as Worship & Music Pastor at Calvary Baptist
       Church in Vandenberg Village, CA, where his compositions were written for
       and shaped by an active choral program. He has also taught guitar as
       adjunct faculty at Allan Hancock College and held a faculty position at
       Westmont College.`,

      `His choral catalog — ranging from accessible congregational settings to
       extended SATB works — is distributed directly through this site and
       through JW Pepper and Sheet Music Plus.`,

      `His recordings include “Simple Gifts” (2007) and “Softly + Tenderly: Hymns for Guitar” (2001),
       both available on major streaming platforms.`,
    ],

    // Published works — shown in a dedicated section on the About page.
    // Set url to "" to show the title without a link.
    publications: [
      {
        publisher: "Mel Bay Publications",
        title:     "Fingerpicking Hymns",
        url:       "https://www.melbay.com/Products/99969BCDEB/fingerpicking-hymns.aspx",
        note:      "In print",
      },
      {
        publisher: "Royal College of Church Music",
        title:     "",   // confirm titles with Jeff
        url:       "",
        note:      "",
      },
    ],

    // Credentials list — edit, reorder, add as needed
    credentials: [
      "ASCAP Member",
      "Published by the Royal College of Church Music (RSCM)",
      "Published by Mel Bay Publications (“Fingerpicking Hymns”)",
      "Biola University — B.A.",
      "California State University, Fullerton — M.A.",
      "Worship & Music Pastor, Calvary Baptist Church (ret.)",
      "Adjunct Faculty, Allan Hancock College",
      "Faculty, Westmont College",
    ],
  },

  // ── MUSIC PAGE ────────────────────────────────────────────────
  music: {
    guitarHeading:  "Recordings",
    guitarSubhead:  "Solo Classical Guitar",
    guitarBody:     "Solo guitar works available on major streaming platforms. Published by Mel Bay Publications.",

    choralHeading:  "Sheet Music & Scores",
    choralSubhead:  "Choral Works",
    choralBody:     `Choral compositions are available as PDF scores through the shop —
                     SATB, SSA, and additional voicings for sacred and liturgical settings.
                     Streaming recordings coming soon.`,
  },

  // ── SHOP PAGE ─────────────────────────────────────────────────
  shop: {
    licenseNote: "Purchase includes a performance license for one ensemble for one performance season.",
    footerNote:  `All purchases are PDF downloads delivered instantly. Choral scores include
                  a performance license for one ensemble for one performance season.
                  For bulk or institutional licensing, <a href="contact.html">get in touch</a>.`,

    // Filter categories — edit label/value pairs to add/remove filters.
    // value must match category or season fields in js/catalog.js
    filters: [
      { label: "All",           value: "all" },
      { label: "Choral",        value: "choral" },
      { label: "Guitar",        value: "guitar" },
      { label: "Congregational",value: "congregational" },
      { label: "Vocal",         value: "vocal" },
      { label: "Advent",        value: "advent" },
      { label: "Christmas",     value: "christmas" },
      { label: "Lent",          value: "lent" },
      { label: "Easter",        value: "easter" },
      { label: "General",       value: "general" },
    ],
  },

  // ── CONTACT PAGE ──────────────────────────────────────────────
  contact: {
    intro:       "For licensing inquiries, ensemble scores, bulk orders, or general correspondence. Responses typically within 2–3 business days.",
    formAction:  "https://formspree.io/f/REPLACE_WITH_YOUR_ID",  // sign up at formspree.io
    subjects: [
      "Licensing inquiry",
      "Bulk / institutional order",
      "Performance inquiry",
      "General",
    ],
  },

  // ── FOOTER ────────────────────────────────────────────────────
  footer: {
    ascapNote:  "All compositions registered with ASCAP.",
    melBayNote: "Select solo guitar works published by Mel Bay Publications.",
  },

};
