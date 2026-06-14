import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Alert, CircularProgress,
  Grid, Divider, Chip,
} from '@mui/material';

const ADMIN_UID = 'vqwpiGlbosQWkuSkfI5aFXdaAiZ2';

const daysAgo = (n) => {
  const d = new Date(Date.now() - n * 86400000);
  return d;
};

const SEED_ARTICLES = [
  {
    title: "The Adult Collector's Guide to Starting a Nostalgia Shelf",
    category: 'collector-guides',
    author: 'SimbaVerse',
    featured: true,
    tags: ['collecting', 'display', 'nostalgia', 'beginner'],
    postSummary: "You grew up with these characters. Now it's time to honor them properly — without it looking like a kid's bedroom.",
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

Floating shelves with LED backlighting have become the standard — they're clean, adjustable, and spotlight your pieces.

**What works:**
- IKEA KALLAX cubes (industry standard for a reason)
- LED strip lighting in warm white or purple tones
- Consistent acrylic risers to create depth
- One hero piece per shelf section — don't crowd it

### Step 4: The Rule of Three

Group items in odd numbers, particularly threes. A single card stand, a small figure, and a relevant piece of art creates a visual triangle the eye finds satisfying.

*Start small. Buy one great piece. See how it makes you feel. Then go from there.*`,
    imageUrl: '',
    imageAlt: 'A premium collector shelf with cards and figures',
    videoId: '',
    likes: 0,
  },
  {
    title: 'Why Fire-Type Starters Still Hit Different',
    category: 'power-rankings',
    author: 'SimbaVerse',
    featured: false,
    tags: ['pokemon', 'starters', 'power-rankings', 'fire-type'],
    postSummary: "Across every generation, fire starters have dominated the vote. The data doesn't lie — and neither does the nostalgia.",
    content: `## The Fire Starter Effect

Every few years, a new generation launches and the internet runs the same debate: which starter are you picking?

And every time, fire wins.

### The Numbers Don't Lie

In the original games, surveys consistently showed fire starters leading. The aggressive, visually distinct evolution lines and fire's offensive typing create a feedback loop: fire-types *feel* powerful to play, which means new players associate them with success early on. That association sticks for decades.

### The Charisma Factor

Fire starters have a design advantage. Compare the silhouettes:

- **Fire:** Dragons, tigers, wrestlers, wizards. Imposing.
- **Water:** Turtles, sea lions, sea otters. Charming, but passive.
- **Grass:** Frogs, monkeys, owls. Clever, but niche.

Fire starters are designed to look like *main characters*.

### The Toonami Connection

The Toonami era reinforced fire = strength. Every major shōnen protagonist from that period had fire energy — Goku's Super Saiyan aura, Naruto's Rasengan, Natsu who is literally made of fire. These characters defined what "powerful" meant for a generation.

When you picked a fire starter, you weren't just picking a type. You were picking the main character archetype you recognized from Saturday night TV.

### The Verdict

Fire starters win because they're designed to. Aggressive aesthetics + offensive typing + cultural reinforcement from the anime era = a preference that calcifies in childhood and never fully leaves.

*Which starter did you pick? Cast your vote in this week's Battle Debate.*`,
    imageUrl: '',
    imageAlt: 'Fire type starter comparison across generations',
    videoId: '',
    likes: 0,
  },
  {
    title: 'The Toonami Effect: Why 2000s Anime Still Owns Our Brains',
    category: 'nostalgia-vault',
    author: 'SimbaVerse',
    featured: true,
    tags: ['toonami', 'nostalgia', 'anime', '2000s', 'dbz'],
    postSummary: "It wasn't just a programming block. It was a shared cultural experience that shaped an entire generation's relationship with storytelling.",
    content: `## 9PM on a Saturday Night

You've just eaten dinner. You have roughly two hours before you're supposed to be in bed. You turn on Cartoon Network.

The iconic heartbeat intro drops. Tom's voice comes in low and cool.

If you were between 8 and 16 in the late 90s or early 2000s, your nervous system just responded to that description. That's the Toonami Effect.

### What Made It Different

Toonami wasn't just dubbed anime. It was *curated* — stories with actual consequences, character death, long-form arcs, and emotional weight that American Saturday morning cartoons almost never attempted.

**Dragon Ball Z** showed kids that training was a story. That effort and sacrifice meant something.

**Rurouni Kenshin** was a samurai who swore never to kill again. The tension of that vow was more sophisticated than most prime-time dramas.

**Gundam Wing** was five teenagers piloting weapons of mass destruction, questioning whether their side was even right.

This was not Looney Tunes.

### The Parasocial Bond

We grew up *alongside* these characters. You waited a week between episodes. You speculated in school. You argued at lunch about whether Gohan could beat Goku.

The scarcity created investment. The investment created identity.

### Why It Still Hits

Toonami-era anime dominates collector culture because it arrived at the exact developmental window when emotional memories form most powerfully — ages 8 to 16.

When you see a Piccolo figure on a shelf, you don't just see plastic. You see a Saturday night in your parents' house, before life got complicated.

That's not marketing. That's neuroscience.`,
    imageUrl: '',
    imageAlt: 'Toonami era anime collage',
    videoId: '',
    likes: 0,
  },
  {
    title: 'Graded Cards vs Raw Cards: What New Collectors Should Know',
    category: 'collector-guides',
    author: 'SimbaVerse',
    featured: false,
    tags: ['grading', 'psa', 'cards', 'tcg', 'beginner'],
    postSummary: "PSA 10 or raw near mint? The answer depends on why you're collecting — and how long you plan to hold.",
    content: `## The Grading Debate

Walk into any collector community and you'll find this argument on a loop: should you grade your cards?

The answer is "it depends" — but in a structured way.

### What Grading Actually Does

A graded card has been evaluated by a third-party service (PSA, BGS, CGC are the major ones) and encased in a tamper-evident slab with a numerical grade.

**What you're paying for:**
- Authentication (it's real)
- Condition assessment (1–10 scale)
- Protection (sealed, UV-resistant slab)
- Liquidity (graded cards trade more easily)

**What it costs:** PSA standard service is around $25–50 per card plus shipping. Turnaround: weeks to months.

### When to Grade

Grade a card when:
- It's worth more than $100 raw (the math makes sense)
- It's in genuinely near-mint to mint condition
- You're planning to sell eventually
- It's a personal grail piece you want protected forever

### When NOT to Grade

- The card is worth less than $50 (fees eat the margin)
- There's visible wear (a PSA 7 often sells for *less* than raw NM)
- You just want to enjoy it — raw cards in sleeves look great displayed

### The Short Answer

**For investment:** Grade the good stuff.

**For enjoyment:** Stay raw. The card is more yours that way.

Most serious collectors do both — and develop a personal threshold over time.`,
    imageUrl: '',
    imageAlt: 'PSA graded card next to raw card',
    videoId: '',
    likes: 0,
  },
  {
    title: 'The Psychology of Rare Drops: Why Collectors Chase Limited Editions',
    category: 'collector-guides',
    author: 'SimbaVerse',
    featured: false,
    tags: ['psychology', 'limited-edition', 'collecting', 'drops', 'scarcity'],
    postSummary: "Scarcity, identity, and the dopamine hit of the pull — the science behind why we chase things specifically because there aren't many of them.",
    content: `## The Pull

You open a pack. Your hands move slower than usual because you know this one might have it.

The holographic catches light before you've fully turned the card over. Your heart does something involuntary.

That's not just excitement. That's a deeply evolved response being triggered by a piece of foil-coated cardboard.

### Scarcity Creates Value (But Not the Way You Think)

The obvious answer is "rare things are worth more money." That's true, but it's downstream of something more fundamental: **scarcity creates psychological value before it creates monetary value.**

The moment you know something exists in limited quantity, your brain categorizes it differently. It becomes a *signal* — about taste, about access, about being someone who knows.

### Identity, Not Just Ownership

Collector culture isn't really about objects. It's about the story the objects tell about you.

A PSA 10 Charizard on your shelf says you take this seriously. A limited-edition art print says you have taste and connections. A sealed box from a discontinued set says you had the foresight to hold.

These objects function as **identity artifacts.**

### The Hunt Is The Point

Research consistently shows that the anticipation of a reward activates the dopamine system more strongly than the reward itself. The *hunt* — the pack opening, the drop countdown, the refresh at 11:59pm — is neurochemically distinct from the moment of acquisition.

This is why collectors who "complete" a set immediately start on the next one. The collection was never really the goal. The collecting was.

### What This Means Practically

1. **Separate emotional value from monetary value.** A card worth $12 can mean everything to you.
2. **Wait 48 hours** after discovering a piece before buying it.
3. **Limited doesn't always mean valuable.** Scarcity is manufactured.
4. **Your collection is for you.** Personal meaning wins over market value every time.`,
    imageUrl: '',
    imageAlt: 'Collector opening a rare pack',
    videoId: '',
    likes: 0,
  },
  {
    title: 'Power Levels, Pull Rates, and the Feeling of the Hunt',
    category: 'power-rankings',
    author: 'SimbaVerse',
    featured: false,
    tags: ['power-levels', 'pull-rates', 'cards', 'collecting', 'dbz'],
    postSummary: "From Scouters to pack percentages — the obsession with measuring power runs deeper than anime. It's in the cards too.",
    content: `## It's Over 9000

The Scouter scene from Dragon Ball Z is one of the most parodied moments in anime history. Vegeta destroys his scanner not because the reading is wrong, but because the number breaks his entire framework for understanding the world.

There's something deeply familiar about that reaction if you've ever pulled a PSA 10 on something you expected nothing from. The framework shifts.

### Power Levels as Cultural Framework

DBZ introduced the concept of quantified power to an entire generation. Before that, "strength" in stories was relative — the hero was stronger than the villain *because the plot required it.*

After DBZ, strength needed a number. A scale. A reason.

This echoes in collector culture. We don't just want a rare card — we want to know *how* rare. Not "this is good" but "PSA 10, pop 7, fourth highest print run variant."

### Pull Rate Mathematics

| Rarity | Approx. Pull Rate |
|--------|-----------------|
| Common | ~60% of pack |
| Rare | 1 in 3 packs |
| Ultra Rare | 1 in 12 packs |
| Secret Rare | 1 in 36 packs |
| Special Illustration | 1 in 72+ packs |

When you buy a booster box (36 packs), you're statistically "guaranteed" certain pulls by rarity distribution. But *which specific card* you pull is still random. That's the slot machine mechanic.

### The Number That Matters

Both power levels and pull rates serve the same function: they convert *feeling* into *metric.*

Feeling like a card is special becomes: PSA 10, population 4, current market $340.

Vegeta's Scouter breaking wasn't failure — it was paradigm shift.`,
    imageUrl: '',
    imageAlt: 'Dragon Ball Z power level concept',
    videoId: '',
    likes: 0,
  },
  {
    title: 'How to Build a Premium Display for Your Favorite Cards',
    category: 'display-setup',
    author: 'SimbaVerse',
    featured: false,
    tags: ['display', 'cards', 'setup', 'shelving', 'led'],
    postSummary: "Your grail card deserves better than a binder sleeve. Here's how to build a display that actually does it justice.",
    content: `## Your Cards Deserve Better Than a Binder

The binder is for bulk. The binder is for organization and transport. It is not where your PSA 10 first edition lives.

### The Hierarchy of Card Display

**Tier 1: The Grail Showcase**
For one or two hero pieces. A single card wall mount, acrylic UV frame, or backlit display case. This is the art print energy.

What you need: UV-protective acrylic frame ($15–30), floating wall mount, small LED puck light.

**Tier 2: The Gallery Wall**
For 6–12 cards displayed together. Matching frames, consistent spacing, intentional arrangement.

What you need: Matching magnetic one-touch cases, gallery wall template, consistent backdrop.

**Tier 3: The Shelf Section**
Cards integrated into a broader collector shelf alongside figures and art prints.

### The Lighting Rule

Every display looks better with lighting. Color temperature matters:
- **Warm white (2700K–3000K):** Rich, gallery feel. Makes gold holos pop.
- **Cool white (4000K–5000K):** Clean, modern. Makes rainbow holos sharp.
- **Purple/violet:** Looks incredible on dark shelves.

Avoid RGB rainbow cycling. It makes everything look like a gaming setup from 2016.

### The Finishing Touch

One plant. One small additional item from the same era — a figure, an art print, a themed coaster. Context makes the display feel intentional rather than just "a bunch of cards."

Your collection tells a story. The display is how you tell it.`,
    imageUrl: '',
    imageAlt: 'Premium card display shelf with LED lighting',
    videoId: '',
    likes: 0,
  },
  {
    title: "One Piece's Luffy vs Naruto: The Friendship Power Debate",
    category: 'battle-debate',
    author: 'SimbaVerse',
    featured: false,
    tags: ['one-piece', 'naruto', 'battle-debate', 'luffy', 'anime'],
    postSummary: "Two protagonists who win through the power of connection. But whose version hits harder? We put it to the community.",
    content: `## The Friendship Protagonist Archetype

Before we debate who wins in a fight (the answer is unanswerable), let's acknowledge what makes this matchup interesting:

Both Luffy and Naruto are connection-powered heroes. They don't win through discipline or raw talent. They win because people believe in them, and that belief becomes literal power.

### The Case for Luffy

Luffy's friendship power is passive. He doesn't try to inspire people — he just exists in a way that makes people want to follow him. Pirate crews, marine defectors, revolutionaries, kings — all showing up for a person who can't even swim.

His power ceiling has expanded to a cosmic level: Gear 5, Nika, the Sun God transformation — all canonically rooted in *the will of the people who want to be free.*

That's a different category than most shōnen power systems.

### The Case for Naruto

Naruto's journey is *earned* on screen in a way few protagonists match. We watched him be genuinely alone. We watched village kids avoid him, adults look away.

When his power comes from connection, we believe it — because we watched how hard he worked for every single one of those connections.

### The Community Verdict

Cast your vote in the Battle Debate poll on the homepage. The tally updates live.

*Who hits harder when they're fighting for the people they love?*`,
    imageUrl: '',
    imageAlt: 'Luffy and Naruto side by side',
    videoId: '',
    likes: 0,
  },
  {
    title: "Beginner's Map: Where to Start Collecting in 2024",
    category: 'beginner-guides',
    author: 'SimbaVerse',
    featured: false,
    tags: ['beginner', 'collecting', 'tcg', 'where-to-start'],
    postSummary: "The collector market is bigger and more complex than ever. Here's how to start without making the expensive mistakes.",
    content: `## Start With What You Actually Care About

Not what's trending. Not what has the highest market cap. What you actually cared about when you were 9 years old on a Saturday morning.

The collecting journey is long. If you're building a collection around market speculation rather than personal connection, you'll burn out or get burned.

Write a list. What shows do you actually remember? What characters meant something? Start there.

### Your First $100

Split it like this:

- **$50:** One quality single that represents your era. Buy raw, near-mint, from a reputable seller.
- **$30:** Storage supplies. Penny sleeves, toploaders, a small display case. Protect what you buy.
- **$20:** One sealed pack or small set experience. Just to feel it.

Don't spend your first $100 on a booster box. It almost never works out.

### Where to Actually Buy

**For singles:** TCGPlayer, eBay (verified sellers 98%+ ratings), Facebook groups for your fandom.

**For sealed product:** Local game stores for current sets. Support them.

**Avoid:** Amazon third-party for vintage (counterfeit risk is real). "Mystery boxes" on social media.

### The Patience Rule

The best collectors are patient buyers. Prices spike on release, settle post-hype, and either hold or crash based on actual demand.

Wait. Watch the card you want drop from $80 to $40 over six months and then buy it.

### The Community Is the Point

Find your people. Discord servers, subreddits, local game stores, Instagram accounts in your niche. The community is where you learn pull rates, find deals, and trade.

*Simba's first rule: collect what makes you feel something. Everything else follows from that.*`,
    imageUrl: '',
    imageAlt: "Beginner collector's setup with cards",
    videoId: '',
    likes: 0,
  },
  {
    title: 'Worth It or Overhyped? How to Read a Card Set Before You Buy',
    category: 'worth-it',
    author: 'SimbaVerse',
    featured: false,
    tags: ['tcg', 'card-sets', 'worth-it', 'pull-rates', 'value'],
    postSummary: "Not every hyped release lives up to the box price. We break down how to read a set before spending your money.",
    content: `## The Hype Cycle Is Real

Every new major set release follows the same arc:

1. **Reveal season:** Cards spoiled. Community speculates. Prices spike pre-release.
2. **Release week:** People buy boxes. Pull rates become known.
3. **Two weeks post-release:** Market corrects. Singles prices settle.
4. **Six months later:** The set's real legacy becomes clear.

Smart collectors buy at step 3. Everyone else pays the premium to be first.

### How to Actually Evaluate a Set

Before you spend money on a box, ask four questions:

**1. What's the pull rate for the top cards?**
This is public information. Check PokeBeach, Card Market, or community spreadsheets. If the hit you want is a 1-in-100 pull and boxes are $150, the singles market is almost always cheaper.

**2. What's the set's print run situation?**
Limited print runs create scarcity and maintain value. Mass print runs dilute the market.

**3. What's the floor value?**
What are the bulk commons worth? A set where even non-hits have collector value is a better experience than one where 90% of pulls are $0.25 cards.

**4. Is this nostalgia-driven or competitive-driven demand?**
Nostalgia sets tend to hold value better than competitive meta sets. Meta cards get banned or rotated.

### The Verdict Framework

**Worth It:** Exceptional art, honest pull rates, reasonable floor value.

**Overhyped:** Top card pull rate makes box buying statistically absurd, secondary prices collapse within 30 days.

**Buy the Singles:** Always the most efficient choice for specific cards. Packs are for the experience.

*The opening experience has real value. Just know you're paying a premium for it.*`,
    imageUrl: '',
    imageAlt: 'Trading card pack opening',
    videoId: '',
    likes: 0,
  },
];

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState('');
  const [seedError, setSeedError] = useState('');

  const isAdmin = currentUser?.uid === ADMIN_UID;

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    const fetchCounts = async () => {
      try {
        const [postSnap, dropSnap] = await Promise.all([
          getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'))),
          getDocs(collection(db, 'drops')).catch(() => ({ docs: [] })),
        ]);
        setArticles(postSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setDrops(dropSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, [isAdmin, navigate]);

  const handleSeedArticles = async () => {
    if (!window.confirm(`This will add ${SEED_ARTICLES.length} SimbaVerse sample articles to Firestore. Continue?`)) return;
    setSeeding(true);
    setSeedResult('');
    setSeedError('');
    let count = 0;
    try {
      for (let i = 0; i < SEED_ARTICLES.length; i++) {
        const article = SEED_ARTICLES[i];
        const createdAt = new Date(Date.now() - (i * 3 + 1) * 86400000);
        await addDoc(collection(db, 'posts'), {
          ...article,
          createdAt,
          updatedAt: createdAt,
        });
        count++;
      }
      setSeedResult(`✓ ${count} articles added successfully. Refresh the homepage to see them.`);
      // Refresh article list
      const snap = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc')));
      setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
      setSeedError(`Failed after ${count} articles: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Delete this article? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'posts', id));
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#8b5cf6' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ pt: { xs: 10, md: 12 }, pb: 8 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 5 }}>
          <Typography variant="overline" sx={{ color: '#8b5cf6', fontSize: '0.7rem', letterSpacing: '0.14em', display: 'block', mb: 1 }}>Admin</Typography>
          <Typography variant="h3" sx={{ color: '#f1f5f9', mb: 0.5 }}>Dashboard</Typography>
          <Typography sx={{ color: '#475569', fontSize: '0.875rem' }}>Logged in as {currentUser?.email}</Typography>
        </Box>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 5 }}>
          {[
            { label: 'Total Articles', value: articles.length, color: '#8b5cf6' },
            { label: 'Total Drops', value: drops.length, color: '#f59e0b' },
            { label: 'Featured Articles', value: articles.filter(a => a.featured).length, color: '#10b981' },
            { label: 'Live Drops', value: drops.filter(d => d.status === 'live').length, color: '#06b6d4' },
          ].map(stat => (
            <Grid item xs={6} md={3} key={stat.label}>
              <Box sx={{ background: '#0f0f1a', border: '1px solid #1e1e30', borderRadius: '14px', p: 2.5, textAlign: 'center' }}>
                <Typography sx={{ color: stat.color, fontFamily: '"Space Grotesk"', fontWeight: 800, fontSize: '2rem', lineHeight: 1 }}>{stat.value}</Typography>
                <Typography sx={{ color: '#64748b', fontSize: '0.8rem', mt: 0.5 }}>{stat.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Quick actions */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 6, flexWrap: 'wrap' }}>
          <Button component={Link} to="/admin/create" variant="contained" size="small">+ New Article</Button>
          <Button component={Link} to="/admin/drops/new" variant="contained" color="secondary" size="small">+ New Drop</Button>
        </Box>

        <Divider sx={{ borderColor: '#1e1e30', mb: 5 }} />

        {/* Seed section */}
        <Box sx={{ mb: 6, background: '#0f0f1a', border: '1px solid #1e1e30', borderRadius: '16px', p: 3 }}>
          <Typography sx={{ color: '#f1f5f9', fontFamily: '"Space Grotesk"', fontWeight: 700, mb: 0.75 }}>
            Seed Sample Articles
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.875rem', mb: 2.5, lineHeight: 1.65 }}>
            Adds {SEED_ARTICLES.length} on-theme SimbaVerse articles across all categories — power rankings, collector guides, nostalgia vault, battle debates, and more. Use this to populate the site with content, then edit each article to customize it (add images, update text, set as featured).
          </Typography>
          {seedResult && <Alert severity="success" sx={{ mb: 2 }}>{seedResult}</Alert>}
          {seedError && <Alert severity="error" sx={{ mb: 2 }}>{seedError}</Alert>}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={handleSeedArticles}
              disabled={seeding}
              sx={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
            >
              {seeding ? <><CircularProgress size={16} sx={{ color: '#fff', mr: 1 }} />Seeding…</> : `Seed ${SEED_ARTICLES.length} Articles`}
            </Button>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              {['collector-guides', 'power-rankings', 'nostalgia-vault', 'battle-debate', 'beginner-guides', 'display-setup', 'worth-it'].map(cat => (
                <Chip key={cat} label={cat} size="small" sx={{ background: '#14141f', color: '#475569', border: '1px solid #1e1e30', fontSize: '0.68rem' }} />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Article list */}
        <Box>
          <Typography sx={{ color: '#f1f5f9', fontFamily: '"Space Grotesk"', fontWeight: 700, mb: 2.5, fontSize: '1.1rem' }}>
            All Articles ({articles.length})
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {articles.map(a => (
              <Box
                key={a.id}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 2,
                  background: '#0f0f1a', border: '1px solid #1e1e30',
                  borderRadius: '12px', p: 2, flexWrap: 'wrap',
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {a.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                    {a.category && <Chip label={a.category} size="small" sx={{ background: '#14141f', color: '#64748b', border: '1px solid #1e1e30', fontSize: '0.65rem', height: 18 }} />}
                    {a.featured && <Chip label="⚡ Featured" size="small" sx={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)', fontSize: '0.65rem', height: 18 }} />}
                    <Typography sx={{ color: '#334155', fontSize: '0.72rem' }}>
                      {a.createdAt?.toDate?.()?.toLocaleDateString() || (a.createdAt instanceof Date ? a.createdAt.toLocaleDateString() : '—')}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button component={Link} to={`/articles/${a.id}`} size="small" sx={{ color: '#64748b', fontSize: '0.75rem', minWidth: 0, px: 1 }}>View</Button>
                  <Button component={Link} to={`/admin/edit/${a.id}`} size="small" sx={{ color: '#8b5cf6', fontSize: '0.75rem', minWidth: 0, px: 1 }}>Edit</Button>
                  <Button onClick={() => handleDeleteArticle(a.id)} size="small" sx={{ color: '#ef4444', fontSize: '0.75rem', minWidth: 0, px: 1 }}>Delete</Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
