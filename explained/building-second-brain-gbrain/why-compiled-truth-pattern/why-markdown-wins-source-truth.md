Your grandmother has a recipe box. Each card holds a treasure—her Bolognese, the Christmas cookies, that weird Jello thing nobody eats but everyone expects. But here's the problem: some cards are just ingredients and instructions. Others have notes scribbled in the margins about which cousin is allergic to walnuts. One has a wine stain that happens to cover the baking temperature. And good luck finding "that one soup" when you need it—the cards aren't organized, labeled, or searchable.

Now imagine handing that box to a cooking robot. It opens a card, reads "Preheat to 375°F," and confidently sets your oven to 375°... Celsius. Smoke ensues. The robot needed context (metadata) that simply wasn't there. Or worse, the metadata was there ("*American oven*") but mixed into the instructions where the robot couldn't distinguish configuration from content.

You just saw how the Two-Layer Page Architecture separates auto-reconciled relationship links from explicitly-managed timeline entries. That same split—between what the system derives automatically and what you declare upfront—shows up here in how gbrain structures its source files.

That's the exact problem gbrain solves with its **compiled truth pattern**. The secret weapon is a humble text format that's been around since 2004: Markdown with YAML frontmatter.

## **Act 1: The Nutrition Facts Label**

Ever flip over a cereal box? There's the fun side: cartoon mascot, colorful shapes, promises of adventure. Then there's the back: nutrition facts, ingredient list, allergen warnings. Same product. Two layers. The manufacturer doesn't mix "Contains wheat" into the mascot's speech bubble. They separate presentation from specification.

**YAML frontmatter** works exactly like that nutrition label. In gbrain, every recipe file starts with a block of structured metadata between triple-dash delimiters:

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing a markdown file split into two parts: YAML frontmatter block between triple dashes at top, containing id, name, version fields; and the body content below with setup instructions" width="600" height="350" /></p>

The parser scans for that opening `---`, grabs everything until the closing `---`, and converts it into a structured data object. What's left, the body, is pure human-readable instructions. The agent reads the frontmatter to understand *what* this recipe is, *what* it needs, and *how* to verify it works. Then it reads the body to learn *how* to set it up.

From the docs: "The recipe IS the installer. Your agent reads the markdown body and executes the setup steps."

This separation matters. A recipe can declare it needs `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` in its frontmatter. It can specify exactly where to get them ("https://console.twilio.com") and define health checks to verify they're valid. All of this happens without polluting the actual setup instructions. Automated systems can filter recipes by category, check dependencies, validate required secrets, and route them appropriately... all without parsing natural language.

### **⚠️ Watch Out For:**

- **Assuming frontmatter is optional.** While not every markdown file needs it, recipes without frontmatter are invisible to gbrain's automated routing. The system can't categorize what it can't parse.
- **Thinking frontmatter errors crash everything.** A syntax error in the YAML block doesn't explode the application; the parser handles it gracefully. But it does mean that file won't be recognized as a valid recipe until fixed.

## **Act 2: Street Addresses vs. GPS Coordinates**

Picture two ways to tell someone where you live:

**Option A:** "I'm at 40.7589° N, 73.9851° W."
**Option B:** "350 Fifth Avenue, New York."

Both locate the same building. But Option A uses coordinates specific to one mapping system (WGS84 datum). Feed those numbers into a 1920s paper map, and you're lost. Option B uses a **slug**, a human-readable, system-agnostic identifier that works across any postal service, any era, any technology.

gbrain's **BrainEngine interface** uses exactly this principle. The engine doesn't expose database-specific numeric IDs. That would lock you into Postgres, SQLite, or whatever backend you're using today. Instead, it accepts portable string slugs like `voice-to-brain` or `project-specs`.

Here's how it works:

| Layer | What It Knows | What It Doesn't Know |
|-------|--------------|---------------------|
| **Your code / CLI** | Slugs (`voice-to-brain`) | Database IDs, storage engine type |
| **BrainEngine interface** | Public contract (slugs in, results out) | How Postgres differs from PGLite |
| **Engine implementation** | How to resolve slugs to internal IDs | What the CLI is asking for |
| **Storage backend** | Native IDs, tsvector, pgvector | That slugs even exist |

When you call `gbrain get voice-to-brain`, here's what happens behind the curtain:

1. The CLI passes the slug `voice-to-brain` to BrainEngine
2. The engine resolves that slug to its internal numeric ID (say, `47` in Postgres)
3. The engine executes the query using native storage (tsvector keyword search, pgvector similarity, whatever the backend supports)
4. The engine returns standardized `SearchResult` objects, not raw database rows
5. Your code processes those results uniformly, whether you're running embedded PGLite locally or Supabase in production

The result? You can start with **PGLiteEngine** (zero-config, embedded, perfect for beginners). Later, you can migrate to **PostgresEngine** (production Supabase, scale-ready) with a single command: `gbrain migrate --to supabase`. The CLI doesn't change. Your skills don't change. Your application logic doesn't change. Only the engine implementation swaps out, like switching from a local file to a cloud database without touching any code that uses it.

### **⚠️ Watch Out For:**

- **Thinking you manage numeric IDs.** You never see them. The engine handles slug-to-ID resolution transparently. If you're debugging and seeing IDs, you're looking at internal engine logs, not the public API.
- **Believing chunking varies by backend.** Chunkers—the logic that splits documents into searchable pieces—are shared across all engines. Only the raw storage and search mechanisms differ. Don't duplicate chunking logic when switching databases.

---

## **The Real-World Picture**

Imagine you're building an AI assistant for a small consultancy. You start with gbrain's embedded PGLite engine. It's zero setup; your intern can run it on a laptop. Recipes live in markdown files with YAML frontmatter. This declares their category (`sense` for inputs, `reflex` for automated responses), required secrets, and health check DSL. Your agent reads these files, walks users through setup, and validates each integration with typed health checks defined in frontmatter.

Six months later, you land an enterprise client. Their security team requires dedicated Postgres with RLS policies. With a slug-based API, you run `gbrain migrate --to supabase`. The exact same skills, CLI commands, and recipe files work unchanged. The slugs `email-to-brain`, `calendar-to-brain`, `voice-to-brain` resolve to new internal IDs in the new database, but your code never knew the difference. The frontmatter that declared health checks still validates. The compiled truth pattern still separates configuration from content. The system scaled without a rewrite. You built on portable abstractions, so you didn't need to predict the future.

---

## **What You Now Know**

- How YAML frontmatter acts as a machine-readable nutrition label for markdown files, separating configuration from content
- How the frontmatter parser extracts metadata between triple-dash delimiters, enabling automated filtering and routing without parsing natural language
- How slug-based APIs decouple public contracts from internal storage, making database backends hot-swappable
- How BrainEngine resolves portable slugs to native IDs transparently, keeping CLI, skills, and application logic unchanged across migrations
- How chunking, embedding generation, and search fusion remain engine-agnostic layers above backend-specific storage

---

## **Looking Ahead**

Now that you understand how markdown serves as the portable source of truth and slugs make storage backends interchangeable, you're ready to see how **BrainEngine: One Interface, Many Backends** actually implements this dance—how the same `query` method runs hybrid search (vector + keyword + RRF) whether you're on embedded WASM or production Postgres, and why that matters for building systems that grow with you.

---

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/integrations/README.md ("How to Read a Recipe", "Self-Installing Recipes", "Recipe trust boundary")
- https://github.com/garrytan/gbrain/blob/master/docs/GBRAIN_V0.md ("All operations go through BrainEngine")
- https://www.everydev.ai/tools/gbrain ("Pluggable engine architecture — Swap between PGLiteEngine and PostgresEngine")