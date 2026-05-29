/* ================================================================
   DEVINE MUSIC — catalog.js
   Full piece catalog. Add, remove, or update pieces here.
   Field reference:
     title    — display title
     category — choral | guitar | congregational | vocal
     season   — general | advent | christmas | lent | easter
     price    — string, e.g. "4.99"
     year     — composition year
     voicing  — optional, e.g. "SATB", "SSA" (choral only)
     detail   — one-line descriptor shown on the card
     shopifyEmbed — leave blank until Shopify Buy Button is set up
   ================================================================ */

const CATALOG = [

  // ── CHORAL / HYMNS & BIBLICAL SETTINGS ───────────────────────

  { title: "All Creatures of Our God and King",        category: "choral",        season: "general",   price: "6.99", year: 2003, detail: "Up-beat hymn arrangement" },
  { title: "All Glory be to God on High",              category: "choral",        season: "general",   price: "6.99", year: 1997, detail: "Text: T. Dudley Smith" },
  { title: "A New Command",                            category: "choral",        season: "general",   price: "6.99", year: 1989, detail: "John 13:34–35" },
  { title: "A Purple Robe",                            category: "choral",        season: "lent",      price: "6.99", year: 2001, detail: "Text: T. Dudley Smith" },
  { title: "Had He Not Loved Us",                      category: "choral",        season: "general",   price: "6.99", year: 2001, detail: "Text: T. Dudley Smith" },
  { title: "Holy God, We Praise Your Name",            category: "choral",        season: "general",   price: "6.99", year: 1995, detail: "A cappella" },
  { title: "I Must Tell Jesus",                        category: "choral",        season: "general",   price: "6.99", year: 1993, detail: "Gospel choir setting" },
  { title: "I Sing the Mighty Power of God",           category: "choral",        season: "general",   price: "6.99", year: 2003, detail: "New music on hymn text" },
  { title: "Let All Mortal Flesh Keep Silence",        category: "choral",        season: "advent",    price: "6.99", year: 1997, detail: "4-part choral and women's 5-part" },
  { title: "Nothin' But the Blood",                    category: "choral",        season: "general",   price: "6.99", year: 1996, detail: "Upbeat vocal and choral setting" },
  { title: "Nothing But the Blood of Jesus",           category: "choral",        season: "general",   price: "6.99", year: 1994, detail: "A cappella" },
  { title: "O Come Redeemer of the Earth",             category: "choral",        season: "advent",    price: "6.99", year: 2009, detail: "Text: Ambrose of Milan · Choir with piano" },
  { title: "Of the Father's Love Begotten",            category: "choral",        season: "christmas", price: "6.99", year: 2008, detail: "" },
  { title: "Sweet Hour of Prayer",                     category: "choral",        season: "general",   price: "6.99", year: 1989, detail: "A cappella" },
  { title: "To a Virgin Meek and Mild",                category: "choral",        season: "christmas", price: "6.99", year: 2001, detail: "Spanish carol" },
  { title: "We Sing Praises",                          category: "choral",        season: "general",   price: "6.99", year: 2010, detail: "Psalm 47:6–7" },
  { title: "When I Survey the Wondrous Cross",         category: "choral",        season: "lent",      price: "6.99", year: 1990, detail: "A cappella · Text: Watts, Music: Schütz" },

  // ── VOCAL / ARRANGEMENTS ──────────────────────────────────────

  { title: "Amazing Grace",                            category: "vocal",         season: "general",   price: "5.99", year: 2003, detail: "Vocal or instrumental solo with guitar" },
  { title: "Fairest Lord Jesus",                       category: "vocal",         season: "general",   price: "5.99", year: 1985, detail: "Vocal or instrumental solo with guitar" },
  { title: "Had I Been There That Christmas Night",    category: "vocal",         season: "christmas", price: "5.99", year: 2012, detail: "Vocal solo with piano · Text: T. Dudley Smith" },
  { title: "Here Lord, I Come",                        category: "vocal",         season: "general",   price: "5.99", year: 2004, detail: "Vocal or instrumental solo with guitar · tune: The Water is Wide" },
  { title: "How Great Thou Art",                       category: "vocal",         season: "general",   price: "5.99", year: 1993, detail: "Chorale prelude for vocal solo" },
  { title: "I Have Decided to Follow Jesus",           category: "vocal",         season: "general",   price: "5.99", year: 1996, detail: "Vocal or instrumental solo with guitar" },
  { title: "I Know That My Redeemer Lives",            category: "vocal",         season: "general",   price: "5.99", year: 1990, detail: "Solo piano or with vocal/instrumental solo" },
  { title: "In the Bleak Midwinter",                   category: "vocal",         season: "christmas", price: "5.99", year: 2012, detail: "Vocal solo with guitar and synth · Rossetti/Holst" },
  { title: "Joys Are Flowing Like a River",            category: "vocal",         season: "general",   price: "5.99", year: 2002, detail: "Vocal or instrumental solo, duo, or trio" },
  { title: "Simple Gifts",                             category: "vocal",         season: "general",   price: "5.99", year: 2000, detail: "Solo and piano, or fiddle and guitar" },
  { title: "Song for Psalm 116",                       category: "vocal",         season: "general",   price: "5.99", year: 1994, detail: "Instrumental background for Psalm reading" },
  { title: "Take My Life and Let it be Consecrated",   category: "vocal",         season: "general",   price: "5.99", year: 1990, detail: "Vocal or instrumental solo with guitar" },
  { title: "This is My Father's World",                category: "vocal",         season: "general",   price: "5.99", year: 2008, detail: "Solo piano" },

  // ── SOLO SONGS ────────────────────────────────────────────────

  { title: "A Place in the Heart",                     category: "vocal",         season: "general",   price: "5.99", year: 1994, detail: "Solo or duo" },
  { title: "Always There",                             category: "vocal",         season: "general",   price: "5.99", year: 1997, detail: "A song for my father" },
  { title: "Best of Times",                            category: "vocal",         season: "general",   price: "5.99", year: 2005, detail: "A song for my mother" },
  { title: "Daniel",                                   category: "vocal",         season: "general",   price: "5.99", year: 2001, detail: "Song about the prophet" },
  { title: "Hiding Away",                              category: "vocal",         season: "general",   price: "5.99", year: 1996, detail: "Song for the homeless" },
  { title: "I Lift My Eyes",                           category: "vocal",         season: "general",   price: "5.99", year: 2007, detail: "Psalm 121 · Text: T. Dudley Smith" },
  { title: "Interlude",                                category: "vocal",         season: "general",   price: "5.99", year: 1997, detail: "Solo piano" },
  { title: "Just Say the Word",                        category: "vocal",         season: "general",   price: "5.99", year: 2011, detail: "Vocal solo or duet" },
  { title: "Little Wise One",                          category: "vocal",         season: "general",   price: "5.99", year: 1997, detail: "Solo piano" },
  { title: "Rondeau",                                  category: "vocal",         season: "general",   price: "5.99", year: 1997, detail: "Solo piano" },
  { title: "The Church is Not a Building",             category: "vocal",         season: "general",   price: "5.99", year: 1998, detail: "Children's song" },
  { title: "The Lamb",                                 category: "vocal",         season: "general",   price: "5.99", year: 1990, detail: "William Blake poem setting" },
  { title: "The Little Girl Inside",                   category: "vocal",         season: "general",   price: "5.99", year: 1990, detail: "Solo or duo" },
  { title: "This Life",                                category: "vocal",         season: "general",   price: "5.99", year: 1994, detail: "Vocal solo" },
  { title: "What Still Remains",                       category: "vocal",         season: "general",   price: "5.99", year: 1990, detail: "" },
  { title: "While the World Lay Still in Slumber",     category: "vocal",         season: "christmas", price: "5.99", year: 1998, detail: "Song of the Nativity" },

  // ── GUITAR SOLOS ─────────────────────────────────────────────

  { title: "All Creatures of Our God and King — Theme + 6 Variations", category: "guitar", season: "general",   price: "4.99", year: 2007, detail: "" },
  { title: "Be Still, My Soul",                        category: "guitar",        season: "general",   price: "4.99", year: 1997, detail: "Finlandia tune" },
  { title: "Bittersweet Dream",                        category: "guitar",        season: "general",   price: "4.99", year: 2007, detail: "" },
  { title: "Communion",                                category: "guitar",        season: "general",   price: "4.99", year: 2008, detail: "" },
  { title: "Coventry Carol",                           category: "guitar",        season: "christmas", price: "4.99", year: 2008, detail: "" },
  { title: "God, Who Made the Earth and Heaven",       category: "guitar",        season: "general",   price: "4.99", year: 2007, detail: "" },
  { title: "Had He Not Loved Us",                      category: "guitar",        season: "general",   price: "4.99", year: 2001, detail: "Solo guitar" },
  { title: "Hymn Set: There is a Fountain / Jesus Paid it All", category: "guitar", season: "general", price: "4.99", year: 2007, detail: "" },
  { title: "I Love You, Lord",                         category: "guitar",        season: "general",   price: "4.99", year: 1983, detail: "arr. of Laurie Klein" },
  { title: "In the Bleak Midwinter",                   category: "guitar",        season: "christmas", price: "4.99", year: 2012, detail: "Solo guitar · Rossetti/Holst" },
  { title: "In the Garden",                            category: "guitar",        season: "general",   price: "4.99", year: 2007, detail: "Guitar duo" },
  { title: "It is Well With My Soul",                  category: "guitar",        season: "general",   price: "4.99", year: 2007, detail: "" },
  { title: "Jesus, I Am Resting",                      category: "guitar",        season: "general",   price: "4.99", year: 2001, detail: "" },
  { title: "Jesus Loves Me",                           category: "guitar",        season: "general",   price: "4.99", year: 1990, detail: "" },
  { title: "Jesus, Thou Joy of Loving Hearts",         category: "guitar",        season: "general",   price: "4.99", year: 1994, detail: "" },
  { title: "Just a Closer Walk with Thee",             category: "guitar",        season: "general",   price: "4.99", year: 2008, detail: "Upbeat fingerstyle" },
  { title: "Leaning on the Everlasting Arms",          category: "guitar",        season: "general",   price: "4.99", year: 2011, detail: "Samba instrumental" },
  { title: "Marche",                                   category: "guitar",        season: "general",   price: "4.99", year: 2007, detail: "" },
  { title: "My Faith Has Found a Resting Place",       category: "guitar",        season: "general",   price: "4.99", year: 2001, detail: "" },
  { title: "My Jesus, I Love Thee",                    category: "guitar",        season: "general",   price: "4.99", year: 2001, detail: "" },
  { title: "O Little Town of Bethlehem",               category: "guitar",        season: "christmas", price: "4.99", year: 1988, detail: "" },
  { title: "O Sacred Head, Now Wounded",               category: "guitar",        season: "lent",      price: "4.99", year: 2007, detail: "" },
  { title: "Quodlibet of Two Familiar Hymn Tunes",     category: "guitar",        season: "general",   price: "4.99", year: 1994, detail: "\"Be Thou My Vision\" with \"How Firm a Foundation\"" },
  { title: "Shall We Gather at the River",             category: "guitar",        season: "general",   price: "4.99", year: 2007, detail: "" },
  { title: "Shannon's Smile",                          category: "guitar",        season: "general",   price: "4.99", year: 2007, detail: "" },
  { title: "Softly and Tenderly",                      category: "guitar",        season: "general",   price: "4.99", year: 2001, detail: "" },
  { title: "Suonata No. 12 in A",                      category: "guitar",        season: "general",   price: "4.99", year: 1990, detail: "S.L. Weiss Lute Suite, arr. for guitar" },
  { title: "Sweet By + By",                            category: "guitar",        season: "general",   price: "4.99", year: 2007, detail: "Fiddle and guitar" },
  { title: "The First Noel",                           category: "guitar",        season: "christmas", price: "4.99", year: 1994, detail: "" },
  { title: "The River",                                category: "guitar",        season: "general",   price: "4.99", year: 2007, detail: "" },
  { title: "Tis So Sweet to Trust in Jesus",           category: "guitar",        season: "general",   price: "4.99", year: 2001, detail: "" },
  { title: "Tranquillo",                               category: "guitar",        season: "general",   price: "4.99", year: 1985, detail: "Homage to G. Gershwin" },
  { title: "Victory in Jesus",                         category: "guitar",        season: "easter",    price: "4.99", year: 1996, detail: "Reggae/blues arrangement for fiddle and guitar" },
  { title: "Waltz",                                    category: "guitar",        season: "general",   price: "4.99", year: 2007, detail: "" },
  { title: "What Child is This",                       category: "guitar",        season: "christmas", price: "4.99", year: 2008, detail: "" },

  // ── CONGREGATIONAL SONGS ──────────────────────────────────────
  // Many have CCLI numbers — churches with CCLI licenses can use these legally.

  { title: "Be Thou My Vision",                        category: "congregational", season: "general",  price: "4.99", year: 1995, detail: "Unison" },
  { title: "Behold, How Good and Pleasant",            category: "congregational", season: "general",  price: "4.99", year: 1989, detail: "Psalm 133:1 · CCLI 675520" },
  { title: "Come to Me",                               category: "congregational", season: "general",  price: "4.99", year: 1990, detail: "Matthew 11:28 · CCLI 675575" },
  { title: "Draw Near to God",                         category: "congregational", season: "general",  price: "4.99", year: 1990, detail: "James 4:8 · CCLI 675609" },
  { title: "He is the Way",                            category: "congregational", season: "general",  price: "4.99", year: 1990, detail: "John 14:6 · CCLI 675654" },
  { title: "His Love is Everlasting",                  category: "congregational", season: "general",  price: "4.99", year: 1990, detail: "Psalm 118:1–4 · CCLI 675702" },
  { title: "Hosanna, Yeshua",                          category: "congregational", season: "general",  price: "4.99", year: 1990, detail: "CCLI 675764" },
  { title: "If You Love Me",                           category: "congregational", season: "general",  price: "4.99", year: 1990, detail: "John 14:15 · CCLI 675836" },
  { title: "In a Time of Praise",                      category: "congregational", season: "general",  price: "4.99", year: 1988, detail: "CCLI 272655" },
  { title: "In Eternity's Praise",                     category: "congregational", season: "general",  price: "4.99", year: 1990, detail: "CCLI 675898" },
  { title: "I Will Trust You",                         category: "congregational", season: "general",  price: "4.99", year: 1994, detail: "CCLI 1267188" },
  { title: "Jeremiah 9:23+24",                         category: "congregational", season: "general",  price: "4.99", year: 1990, detail: "CCLI 675915" },
  { title: "Jesus, My Sabbath",                        category: "congregational", season: "general",  price: "4.99", year: 1993, detail: "CCLI 1267195" },
  { title: "Lord, I Believe",                          category: "congregational", season: "general",  price: "4.99", year: 2003, detail: "" },
  { title: "May All the Peoples Praise You",           category: "congregational", season: "general",  price: "4.99", year: 2006, detail: "Psalm 67" },
  { title: "Now We See Through Shaded Glass",          category: "congregational", season: "general",  price: "4.99", year: 1990, detail: "CCLI 676000" },
  { title: "Our Lives are the Songs",                  category: "congregational", season: "general",  price: "4.99", year: 1990, detail: "CCLI 572104" },
  { title: "Psalm 19:14",                              category: "congregational", season: "general",  price: "4.99", year: 1990, detail: "CCLI 676079" },
  { title: "The Heavens are Telling",                  category: "congregational", season: "general",  price: "4.99", year: 1994, detail: "CCLI 1329428" },
  { title: "The Heavens Declare",                      category: "congregational", season: "general",  price: "4.99", year: 1993, detail: "Psalm 19 · CCLI 1267229" },
  { title: "Therefore My Heart is Glad",               category: "congregational", season: "general",  price: "4.99", year: 1990, detail: "Psalm 16:8–9 · CCLI 676048" },
  { title: "Trust in the Lord",                        category: "congregational", season: "general",  price: "4.99", year: 1996, detail: "Proverbs 3:5–6" },
  { title: "We Gather Here",                           category: "congregational", season: "general",  price: "4.99", year: 1994, detail: "CCLI 1682392" },
  { title: "We Gather Together",                       category: "congregational", season: "general",  price: "4.99", year: 1998, detail: "Unison" },
  { title: "We Worship You, Almighty God",             category: "congregational", season: "general",  price: "4.99", year: 1990, detail: "CCLI 675915" },

];
