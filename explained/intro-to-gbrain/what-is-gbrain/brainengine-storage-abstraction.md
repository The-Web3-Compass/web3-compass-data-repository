---
## **The Moving Day That Broke Everything**

You've built something beautiful. Your personal knowledge base hums along perfectly on your laptop — thousands of notes, connections, and insights woven together. Then comes the moment every developer dreads: you need to move it to production.

Suddenly everything breaks. The embedded database that felt so convenient locally? It chokes on real data volume. The SQL dialect you used for convenience? It doesn't exist in the cloud service your team chose. Your "simple" app now requires three different database adapters, environment-specific code branches, and a 47-step migration guide that somehow still fails on step 38.

This is the tyranny of storage lock-in. You're forced to choose between two miserable options: optimize for zero-friction local development, or optimize for production scalability. Pick wrong, and you'll be rewriting core logic when you need to change your mind.

**BrainEngine exists to end this tyranny.** It's a universal interface that separates *what your brain does* from *how data gets stored*. Swap your storage backend — go from embedded WASM database to production Postgres — and your CLI, your skills, your MCP server, your entire application layer keeps working exactly the same way. Sounds like magic? It's actually just ruthless architectural discipline.

---

## **Act 1: The Universal Power Adapter**

Imagine you're traveling with a laptop. In the US, you need two flat prongs. In the UK, three chunky rectangles. In the EU, two round pins. Your laptop doesn't care — it just wants electricity. What saves you is the universal power adapter: a clean interface that accepts whatever the local infrastructure provides and delivers consistent power to your device.

**BrainEngine is that adapter for your knowledge base.** It's a standardized contract that says: "I don't care if you're running embedded Postgres via WASM or a managed Supabase instance with connection pooling. I speak slugs, I return SearchResults, and I handle my own internal translation."

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing BrainEngine as a middle layer: Application code on top, BrainEngine interface in middle, with PGLiteEngine and PostgresEngine as interchangeable plug-in modules below" width="600" height="350" /></p>

The interface exposes methods like "store this content" and "find related pages" without specifying *how* those operations happen. One engine might use recursive SQL CTEs for graph traversal. Another might use iterative depth tracking. The application calling `traverseGraph` never knows the difference — and shouldn't care.

**⚠️ Watch Out For:**
- **Thinking BrainEngine generates embeddings.** It doesn't. Embeddings are created by `src/core/embedding.ts` (external API calls to OpenAI), then handed to the engine for storage. The engine is a librarian, not a writer.
- **Assuming all engines use identical algorithms.** Only the *interface* is shared. Postgres uses recursive CTEs for graph traversal; SQLite would use application-layer loops. The contract matters, not the implementation.

---

## **Act 2: Street Addresses vs. GPS Coordinates**

Here's a subtle but crucial design choice: BrainEngine uses **slugs** — human-readable string identifiers like `"project-specs"` or `"meeting-notes-2024"` — rather than database-specific numeric IDs.

Think about it like addressing mail. GPS coordinates (37.7749° N, 122.4194° W) are precise but system-dependent — different datums, different projections, different precision models. A street address ("742 Evergreen Terrace, Springfield") works across any postal system, any mapping service, any country. It's portable because it's semantic, not structural.

When you call a BrainEngine method, you pass slugs. The engine maintains an internal mapping to resolve `"project-specs"` to row 47 in Postgres, or document ID `abc123` in some future DynamoDB engine. That resolution happens behind the curtain.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing slug 'project-specs' entering BrainEngine, with arrows splitting to show internal resolution: numeric ID 47 for Postgres, document ID abc123 for hypothetical future engine, both returning same SearchResult structure" width="600" height="350" /></p>

This decoupling is what makes hot-swapping possible. Migrate from embedded PGLite to production Supabase, and your CLI commands, your skills, your MCP server code — all of it stays identical. Only the engine configuration changes.

**⚠️ Watch Out For:**
- **Believing you need to manage numeric IDs.** You don't. The engine handles slug-to-ID resolution transparently. Never expose database IDs in your application logic.
- **Thinking switching engines requires refactoring consumer code.** The whole point of the slug contract is that CLI, MCP server, and skills remain unchanged when you swap backends.

---

## **Act 3: Two Engines, One Brain**

BrainEngine ships with two production-ready implementations, each optimized for different constraints:

| Factor | PGLiteEngine | PostgresEngine + Supabase |
|--------|--------------|---------------------------|
| **Setup** | `gbrain init` — zero-config | Account + connection string |
| **What it is** | Embedded Postgres 17.5 via WASM | Managed Postgres with pgvector |
| **Scale** | Good for < 1,000 files | Production-proven at 10K+ pages |
| **Multi-device** | Single machine only | Any device via remote MCP |
| **Cost** | Free | Supabase Pro ($25/mo) |
| **Concurrency** | Single process | Connection pooling via Supavisor |
| **Backups** | Manual file copy | Managed by Supabase |

**PGLiteEngine** (the v0.7+ default) runs entirely in-process via ElectricSQL's WASM compilation. No Docker. No server. No accounts. Your data lives at `~/.gbrain/brain.db` — a single file you can copy, version, or delete. It uses the exact same SQL as production Postgres (tsvector for keyword search, pgvector HNSW for vector similarity) because it *is* Postgres, just compiled for embedding.

**PostgresEngine** connects to managed Supabase instances. It gives you world-class search, horizontal scalability, and zero operational overhead. When your local brain outgrows your laptop, this is where you graduate.

The kicker? **`gbrain migrate --to supabase`** exports everything — pages, chunks, embeddings, links, tags, timeline — and imports it losslessly. Go the other direction with `gbrain migrate --to pglite`. Bidirectional. Your data is never trapped.

---

## **Act 4: The Clean Separation**

BrainEngine enforces a strict separation of concerns. Certain jobs are *engine* responsibilities; others belong to layers above.

**What the engine DOES:**
- Resolve slugs to internal IDs
- Execute backend-optimized searches (tsvector, pgvector HNSW)
- Return normalized `SearchResult[]` arrays
- Handle graph traversal via engine-appropriate algorithms

**What the engine does NOT do:**
- **Generate embeddings.** That's `src/core/embedding.ts` — external API calls to OpenAI. The engine only stores and searches vectors.
- **Chunk text.** That's `src/core/chunkers/` — shared across all engines. The engine persists chunks; it doesn't create them.
- **RRF fusion or deduplication.** That's `src/core/search/hybrid.ts` — engine-agnostic logic that operates on the normalized SearchResults coming from any backend.

<p align="center"><img src="PLACEHOLDER" alt="Layered architecture diagram: Chunkers and Embedding at top, Hybrid Search (RRF fusion) in middle, BrainEngine interface below, with two engine implementations at bottom showing they only handle raw keyword/vector search" width="600" height="350" /></p>

Only the raw keyword and vector searches are engine-specific. Everything above that line — multi-query expansion, reciprocal rank fusion, four-layer deduplication — works identically regardless of whether your data lives in WASM or the cloud.

**⚠️ Watch Out For:**
- **Expecting raw database rows from search.** The engine returns normalized `SearchResult` objects, not raw SQL rows. This normalization is what makes higher-level fusion possible.
- **Assuming chunking logic varies by backend.** Chunkers are shared infrastructure. All engines store the same chunks created by the same algorithms.

---

## **The Real-World Picture**

You're building a startup. Day one, you `gbrain init` and start dumping meeting notes, competitor research, and product specs into PGLiteEngine — zero friction, zero cost, works offline on planes. Six months later, you've got three co-founders, five thousand pages, and a remote team that needs access. You run `gbrain migrate --to supabase`, update one environment variable, and your entire knowledge base is now production-grade with connection pooling and managed backups. Your CLI scripts still work. Your MCP server still works. Your custom skills still work. The only thing that changed is where the bits live.

---

## **What You Now Know**

- How BrainEngine acts as a universal adapter between application logic and storage implementation
- Why slug-based APIs enable hot-swapping between embedded and cloud databases without code changes
- How the engine normalizes results to make higher-level operations (RRF fusion, deduplication) engine-agnostic
- When to choose PGLiteEngine (zero-config local development) versus PostgresEngine (production scale)
- How to execute bidirectional, lossless migration between storage backends

## **Looking Ahead**

Now that you understand how BrainEngine abstracts storage without trapping your data, the next lesson explores **The Iron Law: Content References Maintain the Graph** — how slugs don't just identify pages, they create the durable links that keep your knowledge web intact even when storage engines change.

---

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/ENGINES.md (The idea, Why this matters, Key design choices, How search works across engines, PostgresEngine, PGLiteEngine, Adding a new engine, What you DO need to implement, Future engine ideas)