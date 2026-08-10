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
  theme: "theme-ember-light.css",

  // ── META (SEO) ────────────────────────────────────────────────
  meta: {
    home:    "Sacred choral works and solo classical guitar by Jeff Devine. Sheet music, scores, and recordings.",
    music:   "Stream solo classical guitar recordings by Jeff Devine on Spotify and Apple Music.",
    shop:    "Sheet music and scores by Jeff Devine. Choral works and solo guitar, instant PDF download.",
    about:   "Biography and background of composer and guitarist Jeff Devine.",
    contact: "Contact Jeff Devine for licensing, scores, or general correspondence.",
  },

  // ── NAVIGATION ────────────────────────────────────────────────
  // NOTE: not currently wired up — main.js never reads SITE.nav.
  // The real nav/footer links are hand-duplicated in every HTML page's
  // <ul class="nav__links">/<ul class="footer__links"> markup (and in
  // catalog-tool/10_site_sync/sync_catalog.py's piece-page template).
  // Kept in sync here for documentation; edit order in all of those
  // places, not just here, until this is made the actual source of truth.
  nav: [
    { label: "About",   href: "about.html" },
    { label: "Music",   href: "music.html" },
    { label: "Shop",    href: "shop.html" },
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

    spotifyEmbedUri: "", // e.g. "spotify:artist:XXXX" — leave blank until ready

    // About strip (homepage excerpt — keep short)
    aboutExcerpt: `Guitarist, arranger, and composer of sacred choral works.
    Published by the Royal College of Church Music and Mel Bay Publications.`,
    aboutExcerptNote: "",
  },

  // ── ABOUT PAGE ────────────────────────────────────────────────
  about: {
    headshotSrc: "assets/images/headshot.png",   // swap filename here to change headshot
    headshotAlt: "Jeff Devine",

    // Bio paragraphs — each string is one <p>. Edit freely.
    bio: [
      'Jeff served for many years as Worship and Music pastor at churches in California and Texas, where his music was written for, and shaped by, active choral programs. He also taught guitar as an adjunct faculty member at several colleges and universities in California. His choral catalog ranges from accessible congregational settings, to extended SATB works, and is distributed directly through this site and other publishers.',
    ],

    // Published works — shown on About, Home, and Music pages.
    // song: individual piece within a collection (renders as "Song" in *Book*)
    // Set url to "" to show the title without a link.
    publications: [
      {
        publisher: "Hinshaw Music",
        title:     "Cross of Jesus, Cross of Sorrow",
        url:       "",
        note:      "October 2026",
      },
      {
        publisher: "Mel Bay Publications",
        title:     "Fingerpicking Hymns",
        url:       "https://www.melbay.com/Products/99969BCDEB/fingerpicking-hymns.aspx",
        note:      "In print",
      },
      {
        publisher: "Royal School of Church Music",
        song:      "The Humble Hold Your Kingdom's Key",
        title:     "Light on the Way",
        url:       "https://www.rscmshop.com/books/9780854022892/light-on-the-way",
        note:      "In Print",
      },
      {
        publisher: "Maranatha! Music",
        song:      "In a Time of Praise",
        title:     "Songs for the Congregation",
        url:       "",
        note:      "1988",
      },
    ],

    // Credentials list — edit, reorder, add as needed
    credentials: [
      "Biola University - Bachelor of Music",
      "Cal State Fullerton- Master of Music",
      "Worship and Music Pastor, Retired",
      "Adjunct College/University Faculty Member, Retired",
      "CCLI Member",
    ],
  },

  // ── MUSIC PAGE ────────────────────────────────────────────────
  music: {
    guitarHeading:  "Recordings",
    guitarSubhead:  "Solo Classical Guitar",
    guitarBody:     "Solo guitar works available on major streaming platforms.",

    choralHeading:  "Sheet Music",
    choralSubhead:  "Choral Works",
    choralBody:     `Choral compositions are available as PDF scores through the shop.
                     SATB and additional voicings for sacred/liturgical settings.
                     Some studio recordings available.`,
    choralCTA:      { label: "Browse Scores", href: "shop.html" },
  },

  // ── SHOP PAGE ─────────────────────────────────────────────────
  shop: {
    licenseNote: "Purchase includes a performance license for one ensemble for one performance season. TBD",
    footerNote:  `All purchases are PDF downloads delivered instantly. Choral scores include
                  a performance license for one ensemble for one performance season.
                  For bulk or institutional licensing, <a href="contact.html">get in touch</a>.`,

    // Filter categories — edit label/value pairs to add/remove filters.
    // value must match the category field in js/catalog.js (one of the
    // 6 canon_archive directories: tds/cha/vco/he/pha/goa).
    filters: [
      { label: "All",                                value: "all" },
      { label: "Timothy Dudley-Smith",                value: "tds" },
      { label: "Choral Hymns and Arrangements",       value: "cha" },
      { label: "Vocal and Choral Originals",          value: "vco" },
      { label: "Hymn Ensembles",                      value: "he" },
      { label: "Piano Hymns and Arrangements",         value: "pha" },
      { label: "Guitar Originals and Arrangements",    value: "goa" },
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
    ascapNote:  "All compositions registered with ASCAP, CCLI.",
    melBayNote: "Select solo guitar works published by Mel Bay Publications.",
    futureNote: "",
  },

};
