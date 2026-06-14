/**
 * SimbaVerse Article Seed Script
 *
 * Adds 10 on-theme sample articles to Firestore.
 * Run once: node seed-articles.js
 *
 * Requires: serviceAccountKey.json in root (already present)
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const now = admin.firestore.Timestamp.now();
const daysAgo = (n) =>
  admin.firestore.Timestamp.fromDate(new Date(Date.now() - n * 86400000));

const articles = [
  {
    title: "The Adult Collector's Guide to Starting a Nostalgia Shelf",
    category: 'collector-guides',
    author: 'SimbaVerse',
    featured: true,
    tags: ['collecting', 'display', 'nostalgia', 'beginner'],
    postSummary:
      'You grew up with these characters. Now it\'s time to honor them properly — without it looking like a kid\'s bedroom.',
    content: `## Starting Your Nostalgia Shelf the Right Way

There's a difference between *hoarding* and *collecting*. One is chaos. The other is curation.

If you grew up in the 90s and 2000s, you already have a mental list of the figures, cards, and pieces that meant something to you. The hard part isn't finding them — it's building a display that actually looks good in your home as an adult.

### Step 1: Define Your Era

Don't try to collect everything. Pick one era and go deep:
- **Gen 1 (1996–2001):** The originals. Base Set cards, first-generation figures.
- **Toonami Era (1997–2008):** DBZ, Naruto, Bleach, One Piece.
- **Saturday Morning (1989–1999):** Transformers, GI Joe, TMNT.

Depth beats width every time. A focused collection tells a story.

### Step 2: Quality Over Quantity

One graded PSA 9 card displayed in a UV-blocking frame hits differently than a shoebox of randoms. Prioritize:

- **Graded cards** in magnetic one-touch cases or acrylic stands
- **Figures** with original packaging if you can find them
- **Prints and art** from independent creators who work in this space

### Step 3: The Display Itself

Floating shelves with LED backlighting have become the standard for a reason — they're clean, adjustable, and spotlight your pieces.

**What works:**
- IKEA KALLAX cubes (industry standard for a reason)
- LED strip lighting in warm white or purple tones
- Consistent acrylic risers to create depth
- One hero piece per shelf section — don't crowd it

### Step 4: The Rule of Three

Group items in odd numbers, particularly threes. A single card stand, a small figure, and a relevant piece of art creates a visual triangle that the eye finds satisfying.

### Step 5: Photography

Once your shelf is built, photograph it. Post it. The collecting community is genuinely supportive, and sharing your setup is part of the culture.

---

*Start small. Buy one great piece. See how it makes you feel. Then go from there.*`,
    imageUrl: '',
    imageAlt: 'A premium collector shelf with cards and figures',
    videoId: '',
    likes: 0,
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    title: 'Why Fire-Type Starters Still Hit Different',
    category: 'power-rankings',
    author: 'SimbaVerse',
    featured: false,
    tags: ['pokemon', 'starters', 'power-rankings', 'fire-type'],
    postSummary:
      'Across every generation, fire starters have dominated the vote. The data doesn\'t lie — and neither does the nostalgia.',
    content: `## The Fire Starter Effect

Every few years, a new generation of games launches and the internet runs the same debate: which starter are you picking?

And every time, fire wins.

It's not even close.

### The Numbers Don't Lie

In the original games, surveys consistently showed fire starters leading. The aggressive, visually distinct evolution lines and fire's offensive typing create a feedback loop: fire-types *feel* powerful to play, which means new players associate them with success early on.

That association sticks for decades.

### The Charisma Factor

Fire starters have a design advantage. Compare the silhouettes:

- **Fire:** Dragons, tigers, wrestlers, wizards. Imposing.
- **Water:** Turtles, sea lions, sea otters. Charming, but passive.
- **Grass:** Frogs, monkeys, owls. Clever, but niche.

Fire starters are designed to look like *main characters*. Their final forms are often bipedal, battle-ready, and visually aggressive in a way that reads as "powerful" to a child — and "nostalgic" to an adult.

### The Toonami Connection

The Toonami era reinforced fire = strength. Every major shōnen protagonist from that period had fire energy — Goku's Super Saiyan aura, Naruto's Rasengan, Natsu from Fairy Tail who is literally made of fire. These characters defined what "powerful" meant for a generation.

When you picked a fire starter, you weren't just picking a type. You were picking the main character archetype you recognized from Saturday night TV.

### The Verdict

Fire starters win because they're designed to. The combination of aggressive aesthetics, offensive typing that rewards new players, and cultural reinforcement from the anime era creates a preference that calcifies in childhood and never fully leaves.

It's not nostalgia bias. It's pattern recognition.

---

*Which starter did you pick? Drop your answer in the Battle Debate poll.*`,
    imageUrl: '',
    imageAlt: 'Fire type starter comparison across generations',
    videoId: '',
    likes: 0,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    title: 'The Toonami Effect: Why 2000s Anime Still Owns Our Brains',
    category: 'nostalgia-vault',
    author: 'SimbaVerse',
    featured: true,
    tags: ['toonami', 'nostalgia', 'anime', '2000s', 'dbz'],
    postSummary:
      'It wasn\'t just a programming block. It was a shared cultural experience that shaped an entire generation\'s relationship with storytelling.',
    content: `## 9PM on a Saturday Night

You've just eaten dinner. You have roughly two hours before you're supposed to be in bed.

You turn on Cartoon Network.

The iconic heartbeat intro drops. The laser sweeps across a spaceship. Tom's voice comes in low and cool: *"The Toonami Total Immersion Event begins now."*

If you were between the ages of 8 and 16 in the late 90s or early 2000s, your nervous system just responded to that description.

That's the Toonami Effect.

### What Made It Different

Toonami wasn't just anime dubbed into English. It was *curated* anime — stories with actual consequences, character death, long-form arcs, and emotional weight that American Saturday morning cartoons almost never attempted.

**Dragon Ball Z** showed kids that training was a story. That effort and sacrifice meant something. That the underdog could win, but only if the cost was real.

**Rurouni Kenshin** was a samurai who swore never to kill again. The tension of that vow, and what it cost him, was more sophisticated than most prime-time dramas.

**Gundam Wing** was five teenagers piloting weapons of mass destruction in a war they barely understood, questioning whether their side was even right.

This was not Looney Tunes.

### The Parasocial Bond

We grew up *alongside* these characters in a way that serialized streaming content hasn't replicated. You waited a week between episodes. You speculated in school. You argued at lunch about whether Gohan could beat Goku.

The scarcity created investment. The investment created identity.

You weren't just a fan. You were on a team.

### Why It Still Hits

The reason Toonami-era anime dominates collector culture, meme culture, and nostalgia commerce in 2024 is simple: it arrived at the exact developmental window when emotional memories are forming most powerfully, between ages 8 and 16.

The music, the animation style, the specific emotional notes of those shows are literally encoded into how some of us process "this matters."

When you see a Piccolo figure on a shelf, you don't just see plastic. You see a Saturday night in your parents' house, before life got complicated.

That's not marketing. That's neuroscience.

---

*What was your Toonami show? Cast your vote in this week's Battle Debate.*`,
    imageUrl: '',
    imageAlt: 'Toonami era anime collage',
    videoId: '',
    likes: 0,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    title: 'Graded Cards vs Raw Cards: What New Collectors Should Know',
    category: 'collector-guides',
    author: 'SimbaVerse',
    featured: false,
    tags: ['grading', 'psa', 'bgs', 'cards', 'tcg', 'beginner'],
    postSummary:
      'PSA 10 or raw near mint? The answer depends on why you\'re collecting — and how long you plan to hold.',
    content: `## The Grading Debate

Walk into any collector community and you'll find this argument running on a loop: should you grade your cards?

Like most collector debates, the answer is "it depends" — but in a way that actually has some structure to it.

### What Grading Actually Does

A graded card has been evaluated by a third-party service (PSA, BGS, CGC are the major ones) and encased in a tamper-evident slab with a numerical grade.

**What you're paying for:**
- Authentication (it's real)
- Condition assessment (standardized 1–10 scale)
- Protection (sealed, UV-resistant slab)
- Liquidity (graded cards trade more easily at auction)

**What it costs:**
- PSA standard service: currently around $25–50 per card + shipping
- Turnaround time: weeks to months depending on service level
- It's permanent — once slabbed, cracking it out lowers perceived value

### When to Grade

Grade a card when:
- It's worth more than $100 raw (the math starts to make sense)
- It's in genuinely near-mint to mint condition
- You're planning to sell eventually
- It's a personal grail piece you want protected forever

### When NOT to Grade

Don't grade when:
- The card is worth less than $50 (fees eat the margin)
- There's visible wear (a PSA 7 often sells for *less* than a raw NM copy)
- You just want to enjoy it — raw cards in sleeves and toploaders look great displayed

### The Pop Report Factor

Every PSA grade has a "population report" — how many copies exist at each grade level. A PSA 10 with a pop of 3 is very different from a PSA 10 with a pop of 4,000.

Always check the pop before submitting. It tells you whether a 10 will actually move the value needle.

### The Raw Case

There's a growing movement of collectors who prefer raw cards specifically *because* they can handle them. The tactile experience of holding a card, the ability to look at it in different light, the absence of slab glare — these are real.

A raw Near Mint card in a penny sleeve, toploader, and team bag is protected well enough for 99% of collectors.

### The Short Answer

**For investment:** Grade the good stuff. A PSA 10 on the right card is its own asset class.

**For enjoyment:** Stay raw. The card is more yours that way.

Most serious collectors do both — and slowly develop a personal threshold based on what they've seen sell.`,
    imageUrl: '',
    imageAlt: 'PSA graded card in slab next to raw card',
    videoId: '',
    likes: 0,
    createdAt: daysAgo(7),
    updatedAt: daysAgo(7),
  },
  {
    title: 'The Psychology of Rare Drops: Why Collectors Chase Limited Editions',
    category: 'collector-guides',
    author: 'SimbaVerse',
    featured: false,
    tags: ['psychology', 'limited-edition', 'collecting', 'drops', 'scarcity'],
    postSummary:
      'Scarcity, identity, and the dopamine hit of the pull — the science behind why we chase things specifically because there aren\'t many of them.',
    content: `## The Pull

You open a pack. Your hands move slower than usual because you know this one might have it.

The holographic catches light before you've fully turned the card over. Your heart does something involuntary.

That's not just excitement. That's a deeply evolved response being triggered by a piece of foil-coated cardboard. And understanding *why* that happens makes you a smarter collector.

### Scarcity Creates Value (But Not the Way You Think)

The obvious answer is "rare things are worth more money." That's true, but it's downstream of something more fundamental: **scarcity creates psychological value before it creates monetary value.**

The moment you know something exists in limited quantity, your brain categorizes it differently. It becomes a *signal* — about taste, about access, about being someone who knows.

This is the same mechanism that makes streetwear drops work, that makes first-edition books command premiums, that made holographic cards the object of every 10-year-old's obsession in 1999.

### Identity, Not Just Ownership

Collector culture isn't really about objects. It's about the story the objects tell about you — to yourself and to others.

A PSA 10 Charizard on your shelf says you're someone who takes this seriously. A limited-edition art print from an independent creator says you have taste and connections. A sealed booster box from a discontinued set says you had the foresight to hold.

These objects function as **identity artifacts.** They're physical proof of who you are, what you care about, and what you were willing to do to acquire them.

### The Hunt Is The Point

Research consistently shows that the anticipation of a reward activates the dopamine system more strongly than the reward itself. The *hunt* — the pack opening, the drop countdown, the refresh at 11:59pm — is neurochemically distinct from the moment of acquisition.

This is why collectors who "complete" a set often immediately start on the next one. The collection was never really the goal. The collecting was.

### What This Means Practically

Understanding this lets you make smarter decisions:

1. **Separate emotional value from monetary value.** A card can be worth $12 and mean everything to you. That's fine. Know which is which.

2. **The excitement of the hunt fades.** Wait 48 hours after discovering a piece before buying it. If you still want it, it's not just the dopamine talking.

3. **Limited doesn't always mean valuable.** Scarcity is manufactured. Edition sizes are marketing decisions. The question is whether the underlying piece is worth wanting.

4. **Your collection is for you.** The best collector setups are built around personal meaning, not market value. Those two things sometimes overlap. When they don't, personal meaning wins every time.`,
    imageUrl: '',
    imageAlt: 'Collector opening a rare pack',
    videoId: '',
    likes: 0,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(10),
  },
  {
    title: 'Power Levels, Pull Rates, and the Feeling of the Hunt',
    category: 'power-rankings',
    author: 'SimbaVerse',
    featured: false,
    tags: ['power-levels', 'pull-rates', 'cards', 'collecting', 'dbz'],
    postSummary:
      'From Scouters to pack percentages — the obsession with measuring power runs deeper than anime. It\'s in the cards too.',
    content: `## It Over 9000

The Scouter scene from Dragon Ball Z is one of the most parodied moments in anime history. Vegeta destroys his scanner not because the reading is wrong, but because the number breaks his entire framework for understanding the world.

There's something deeply familiar about that reaction if you've ever pulled a PSA 10 on something you bought expecting nothing. The framework shifts.

### Power Levels as a Cultural Framework

DBZ introduced the concept of quantified power to an entire generation. Before that, "strength" in stories was relative — the hero was stronger than the villain *because the plot required it.*

After DBZ, strength needed a number. A scale. A reason.

This has interesting echoes in collector culture. We don't just want a rare card — we want to know *how* rare. Not just "this is good" but "this is a PSA 10, pop 7, the fourth highest print run variant."

The Scouter logic: if you can't measure it, it doesn't fully exist.

### Pull Rate Mathematics

Here's what the math actually looks like for a typical modern TCG set:

| Rarity | Approx. Pull Rate |
|--------|-----------------|
| Common | ~60% of pack |
| Uncommon | ~30% of pack |
| Rare | 1 in 3 packs |
| Ultra Rare | 1 in 12 packs |
| Secret Rare | 1 in 36 packs |
| Special Illustration | 1 in 72+ packs |

When you buy a booster box (typically 36 packs), you're statistically "guaranteed" certain pulls by rarity distribution. But within those tiers, which specific card you pull is still random.

That's the slot machine mechanic. That's the dopamine architecture.

### The Skill Component

What separates serious collectors from casual buyers is knowing how to *work around* the randomness:

- **Box arbitrage:** Sealed boxes from sets with known high-value pull distributions
- **Singles buying:** Skip the packs, buy the specific card you want — usually cheaper overall
- **Set analysis:** Some sets have notoriously bad pull rates. Others are generous. This is public knowledge.

The collectors who consistently come out ahead treat pack buying as entertainment, not investment, and buy singles when they actually want specific cards.

### The Number That Matters

Ultimately, both power levels and pull rates serve the same psychological function: they convert *feeling* into *metric.*

Feeling like a card is special becomes: it's a PSA 10, population 4, current market value $340.
Feeling like a character is strong becomes: his power level is 150 million, double the last arc's final boss.

We needed the number because it made the feeling *real.*

Vegeta understood that. His Scouter breaking wasn't failure — it was paradigm shift.`,
    imageUrl: '',
    imageAlt: 'Dragon Ball Z power level scouter meme',
    videoId: '',
    likes: 0,
    createdAt: daysAgo(14),
    updatedAt: daysAgo(14),
  },
  {
    title: 'How to Build a Premium Display for Your Favorite Cards',
    category: 'display-setup',
    author: 'SimbaVerse',
    featured: false,
    tags: ['display', 'cards', 'setup', 'shelving', 'led'],
    postSummary:
      'Your grail card deserves better than a binder sleeve. Here\'s how to build a display that actually does it justice.',
    content: `## Your Cards Deserve Better Than a Binder

The binder is for bulk. The binder is for organization and transport. The binder is not where your PSA 10 first edition lives.

If you've got cards you genuinely care about — graded or raw — here's how to display them the way they deserve.

### The Hierarchy of Card Display

**Tier 1: The Grail Showcase**
For one or two hero pieces. A single card wall mount, acrylic UV frame, or backlit display case. This is the art print energy. The card is the art. Treat it that way.

What you need:
- UV-protective acrylic frame (Golden State Art or similar, ~$15–30)
- Floating wall mount
- Small spotlight or LED puck light aimed at the card

**Tier 2: The Gallery Wall**
For 6–12 cards displayed together as a collection. Matching frames, consistent spacing, intentional arrangement. Looks genuinely impressive.

What you need:
- Matching magnetic one-touch cases (35pt for standard cards)
- Gallery wall arrangement template (tape on floor first)
- Consistent wall color or backdrop

**Tier 3: The Shelf Section**
Cards integrated into a broader collector shelf alongside figures, art prints, and thematic items.

What you need:
- Acrylic card stands (stackable, adjustable angle)
- Card risers to create depth variation
- A single LED strip running behind the shelf back

### The Lighting Rule

Every display looks better with lighting. The color temperature matters:
- **Warm white (2700K–3000K):** Rich, gallery feel. Makes gold holos pop.
- **Cool white (4000K–5000K):** Clean, modern. Makes holographic rainbow cards look sharp.
- **Purple/violet:** SimbaVerse energy. Looks incredible on dark shelves.

Avoid RGB rainbow cycling. It makes everything look like a gaming setup from 2016.

### Protecting What You Display

Display doesn't mean exposed. All displayed cards should be:
- Sleeved in a penny sleeve (raw cards)
- In a toploader or magnetic one-touch (raw/near mint)
- Slabbed (PSA/BGS for grails)

UV-protective frames and cases prevent the single biggest threat to long-term card condition: light fade.

### The Finishing Touch

One plant. One small additional item from the same era — a small figure, a relevant art print, a themed coaster. Context makes the display feel intentional rather than just "a bunch of cards."

Your collection tells a story. The display is how you tell it.`,
    imageUrl: '',
    imageAlt: 'Premium card display shelf with LED lighting',
    videoId: '',
    likes: 0,
    createdAt: daysAgo(18),
    updatedAt: daysAgo(18),
  },
  {
    title: 'Worth It or Overhyped? Breaking Down the Most Hyped Card Sets',
    category: 'worth-it',
    author: 'SimbaVerse',
    featured: false,
    tags: ['tcg', 'card-sets', 'worth-it', 'pull-rates', 'value'],
    postSummary:
      'Not every hyped release lives up to the box price. We break down which sets actually deliver and which ones are riding the hype cycle.',
    content: `## The Hype Cycle Is Real

Every new major set release follows the same arc:

1. **Reveal season:** Cards spoiled. Community speculates wildly. Prices on secondary market spike before the set releases.
2. **Release week:** People buy boxes. Streamers open packs. Pull rates become known.
3. **Two weeks post-release:** Market corrects. Single prices settle. Box prices reflect actual pull rates.
4. **Six months later:** The set's real legacy becomes clear.

Smart collectors buy at step 3. Everyone else pays the premium to be first.

### How to Actually Evaluate a Set

Before you spend money on a box, ask four questions:

**1. What's the pull rate for the top cards?**
This is public information. Check PokeBeach, Card Market, or community spreadsheets. If the hit you want is a 1-in-100 pull and boxes are $150, you need to buy 100 boxes to statistically hit it. The singles market is almost always cheaper.

**2. What's the set's print run situation?**
Limited print runs create scarcity and maintain value. Mass print runs dilute the market. Look at the publisher's statements and track secondary market prices three months post-release.

**3. What's the floor value?**
What are the bulk commons and uncommons worth? A set where even the non-hits have collector value is a better box-opening experience than one where 90% of pulls are $0.25 cards.

**4. Is this nostalgia-driven or competitive-driven demand?**
Nostalgia sets (anything featuring original-era designs, anniversary sets) tend to hold value better than competitive meta sets. Meta cards get banned, rotated, or replaced. Nostalgic cards just get older.

### The Verdict Framework

**Worth It:** When the art is genuinely exceptional, the pull rates are honest, and the floor value is reasonable. You're buying an experience and the math doesn't completely punish you.

**Overhyped:** When the top card's pull rate makes box buying statistically absurd, the art is uninspired, and secondary market prices collapse within 30 days.

**Buy the Singles:** Always the most efficient choice for specific cards. The only reason to buy packs is if you actually enjoy the opening experience — and there's nothing wrong with admitting that.

---

*The opening experience has real value. Just know you're paying a premium for it.*`,
    imageUrl: '',
    imageAlt: 'Trading card pack opening with cards spread',
    videoId: '',
    likes: 0,
    createdAt: daysAgo(21),
    updatedAt: daysAgo(21),
  },
  {
    title: "One Piece's Luffy vs Naruto: The Friendship Power Debate",
    category: 'battle-debate',
    author: 'SimbaVerse',
    featured: false,
    tags: ['one-piece', 'naruto', 'battle-debate', 'luffy', 'anime'],
    postSummary:
      "Two protagonists who win through the power of connection. But whose version of friendship-fueled power hits harder? We put it to the community.",
    content: `## The Friendship Protagonist Archetype

Before we debate who wins in a fight (the answer is unanswerable and irrelevant), let's acknowledge what makes this matchup interesting:

Both Luffy and Naruto are examples of the same protagonist archetype — the *connection-powered hero*. They don't win through discipline, intelligence, or raw talent. They win because people believe in them, and that belief becomes literal power.

This is unusual in fiction. Most protagonists win because they work harder or were born with something special. Luffy and Naruto win because they refused to stop caring about people around them even when it made zero tactical sense.

### The Case for Luffy

Luffy's friendship power is passive. He doesn't try to inspire people — he just exists in a way that makes people want to follow him. Entire pirate crews, marine defectors, revolutionaries, kings — all of them show up for a person who can't even swim.

His power ceiling has expanded to a cosmic level: Gear 5, Nika, the Sun God transformation — all of it is canonically rooted in *the will of the people who want to be free.* His power is literally collective unconscious joy.

That's a different category than most shōnen power systems.

### The Case for Naruto

Naruto's friendship journey is *earned* on screen in a way few protagonists match. We watched him be genuinely alone. We watched village kids avoid him, adults look away, and the person he most wanted to acknowledge him almost die without ever doing it.

When Naruto's power comes from connection, we believe it — because we watched how hard he worked for every single one of those connections.

The Nine-Tails seal, Sage Mode, Six Paths chakra — all of it is empowered at critical moments by the literal chakra of people he's helped. That's not metaphor. That's mechanical.

### The Community Verdict

This is the kind of debate that doesn't have a right answer — which is exactly why it works.

Cast your vote in the Battle Debate poll on the homepage. The tally updates live.

*Who hits harder when they're fighting for the people they love?*`,
    imageUrl: '',
    imageAlt: 'Luffy and Naruto side by side comparison',
    videoId: '',
    likes: 0,
    createdAt: daysAgo(25),
    updatedAt: daysAgo(25),
  },
  {
    title: 'Beginner\'s Map: Where to Start Collecting in 2024',
    category: 'beginner-guides',
    author: 'SimbaVerse',
    featured: false,
    tags: ['beginner', 'collecting', 'tcg', 'figures', 'where-to-start'],
    postSummary:
      "The collector market in 2024 is bigger, more complex, and more expensive than ever. Here's how to start without making the expensive mistakes.",
    content: `## The Best Time to Start Is Now (But There Are Traps)

The collector market never sleeps. Right now, there are cards, figures, and limited pieces across every fandom, price point, and era — more availability than any previous generation of collectors had.

There's also more marketing dressed as collecting advice, more hype cycles, and more ways to overpay for something that loses value in three months.

Here's what we wish someone had told us early.

### Start With What You Actually Care About

Not what's trending. Not what has the highest market cap. What you actually cared about when you were 9 years old and it was Saturday morning.

The collecting journey is long. If you're building a collection around market speculation rather than personal connection, you'll burn out or get burned. Usually both.

Write a list. What shows do you actually remember? What characters meant something? Start there.

### Your First $100

Split it like this:

- **$50:** One quality single that represents your era. Buy raw, near-mint condition, from a reputable seller (eBay with seller ratings, COMC, TCGPlayer).
- **$30:** Storage supplies. Penny sleeves, toploaders, a binder or small display case. Protect what you buy.
- **$20:** One sealed pack or small set experience. Just to feel it. Don't chase anything specific.

Don't spend your first $100 on a booster box. It almost never works out mathematically.

### Where to Actually Buy

**For singles:**
- TCGPlayer (cards)
- eBay (verified sellers with 98%+ ratings and photos)
- Facebook groups for your specific fandom (often better prices, more community)

**For sealed product:**
- Local game stores for current sets (support them)
- Big box stores (Target, Walmart) for current releases

**For vintage and graded:**
- PWCCMarketplace
- Goldin
- COMC

**Avoid:**
- Amazon third-party sellers for vintage (counterfeit risk is real)
- "Mystery boxes" on social media (almost always engineered to disappoint)

### The Patience Rule

The best collectors are patient buyers. The market has cycles. Prices spike on release, settle post-hype, and either hold or crash based on actual demand.

The collectors who consistently come out ahead wait. They watch a card they want drop from $80 to $40 over six months and then buy it. The collectors who consistently lose buy at the peak of hype.

You have time. The collection doesn't need to be complete this month.

### The Community Is the Point

Find your people. Discord servers, subreddits, local game stores, Instagram accounts in your niche. The community is where you learn pull rates, get advance notice on sets, find deals, and trade.

The best things in collector culture are shared. A solo collection in a vacuum misses the point.

---

*Simba's first rule: collect what makes you feel something. Everything else follows from that.*`,
    imageUrl: '',
    imageAlt: "Beginner collector's setup with cards and guides",
    videoId: '',
    likes: 0,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(30),
  },
];

async function seedArticles() {
  console.log(`\n⚡ SimbaVerse — Seeding ${articles.length} articles...\n`);

  for (const article of articles) {
    try {
      const ref = await db.collection('posts').add(article);
      console.log(`✓ "${article.title.substring(0, 50)}..." → ${ref.id}`);
    } catch (err) {
      console.error(`✗ Failed: ${article.title}`, err.message);
    }
  }

  console.log('\n✅ Done. Refresh your site to see the new articles.\n');
  process.exit(0);
}

seedArticles().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
