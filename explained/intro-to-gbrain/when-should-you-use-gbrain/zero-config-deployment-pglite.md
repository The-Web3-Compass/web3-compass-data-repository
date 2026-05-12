---## **The Thirty-Second Setup That Isn't a Lie**

You know that moment when you find a promising new tool, and the README says "just run init and you're done"—but three hours later you're still wrestling with connection strings, environment variables, and a cloud dashboard that won't stop asking for your credit card? 

GBrain was built to eliminate that friction entirely. Not by simplifying the database, but by bringing the entire database with you. When you type `gbrain init`, you're not connecting to a remote server somewhere. You're unpacking a complete, honest-to-goodness **Postgres 17.5**—compiled to WebAssembly and packaged into a library smaller than most JPEGs. No Docker. No accounts. No "create a project and grab your connection string." Just a file on your computer that happens to contain one of the world's most battle-tested databases.

This is the **PGLiteEngine**, and it's the zero-config default that makes GBrain genuinely runnable in thirty seconds.

## **Act 1: The Battery Pack vs. The Grid**

Imagine you just bought a new electric drill. You have two options for powering it: wire your house into the electrical grid (hire an electrician, pull permits, wait for inspection), or pop in a battery pack and start drilling immediately.

**PGLite is that battery pack.** It's a **built-in storage engine** that lets GBrain run immediately using an embedded Postgres database via WebAssembly, requiring no external servers or configuration. The database lives inside your Node.js process, stores data in a local file at `~/.gbrain/brain.db`, and exposes the exact same SQL interface you'd get from a production Postgres cluster—including `tsvector` for full-text search, `pgvector` for embeddings, and HNSW indexes for fast similarity lookups.

<p align="center"><img src="PLACEHOLDER" alt="Diagram comparing PGLite as a self-contained battery pack inside the Node.js process versus PostgresEngine as a connection to external grid power, with both powering the same BrainEngine abstraction layer" width="600" height="350" /></p>

But here's the insight that makes this architecture special: **the storage backend is completely interchangeable.** You can start with embedded PGLite for zero friction and migrate to a production Postgres cluster later without touching a single line of application code. The BrainEngine abstraction sits between your operations and the storage layer, translating everything into engine-specific calls while presenting a uniform interface above.

## **Act 2: This Is Not a Toy Database**

When developers hear "embedded database," they often picture SQLite—simplified, stripped down, speaking a different dialect. PGLite subverts that expectation entirely. This is **actual Postgres 17.5 compiled to WebAssembly**, not a reimplementation. The same query planner. The same type system. The same extension ecosystem.

At under 3MB gzipped, ElectricSQL's PGLite fits in your pocket—but it runs the real thing. When GBrain performs a hybrid search, PGLite executes the same `tsvector` queries for keywords and `pgvector` HNSW indexes for embeddings that a production Supabase instance would run. The SQL doesn't change. The behavior doesn't change. Only the location changes: instead of crossing a network to reach a server, your queries travel a few nanoseconds to the WebAssembly runtime living inside your process.

<p align="center"><img src="PLACEHOLDER" alt="Flow diagram showing consumer code calling BrainEngine with content slugs, PGLiteEngine resolving to IDs and executing SQL queries via WASM-compiled Postgres, then results passing through the engine-agnostic hybrid layer for RRF fusion and deduplication" width="600" height="350" /></p>

Here's how the data actually flows: Your consumer code calls BrainEngine methods using content **slugs**—human-readable identifiers like `"meeting-notes-january"`. The engine resolves these to internal IDs using its specific SQL dialect. PGLite executes queries using local WASM-compiled Postgres, storing embeddings and chunks while performing raw keyword and vector searches. Those results then pass through the engine-agnostic hybrid layer for RRF fusion and deduplication, returning uniform `SearchResult` arrays regardless of which engine is active.

The heavy lifting—ranking, fusing, deduplicating—happens **above** the engine layer. The engine just handles raw retrieval. This means hybrid search behaves identically whether you're on PGLite or PostgresEngine, because the intelligence lives in a shared layer that doesn't care where the data came from.

## **Act 3: Knowing When to Stay vs. When to Migrate**

PGLite is perfect for getting started, open-source hacking, or single-machine workflows. But it's not infinite. The tradeoffs are honest and well-defined:

| Factor | PGLiteEngine | PostgresEngine + Supabase |
|--------|--------------|--------------------------|
| **Setup** | `gbrain init` (zero-config) | Account + connection string |
| **Scale** | Good for < 1,000 files | Production-proven at 10K+ |
| **Multi-device** | Single machine only | Any device via remote MCP |
| **Cost** | Free | Supabase Pro ($25/mo) |
| **Concurrency** | Single process | Connection pooling |
| **Backups** | Manual (file copy) | Managed by Supabase |

The beautiful part? You're not locked into either choice. **`gbrain migrate --to supabase`** exports everything—pages, chunks, embeddings, links, tags, timeline—and imports it into Supabase. **`gbrain migrate --to pglite`** goes the other direction. Bidirectional, lossless, and seamless because the BrainEngine interface abstracts all differences. Only the connection configuration changes; your application code stays identical.

**⚠️ Watch Out For:**

- **Thinking PGLite is a simplified database.** It is actual Postgres 17.5 compiled to WebAssembly, not a reimplementation. Don't assume you can skip proper indexing or query optimization just because it runs locally.

- **Believing search ranking varies by engine.** RRF fusion and deduplication happen above the engine layer; only raw keyword and vector retrieval is engine-specific. If your search results look different between engines, the issue is in the data or the hybrid layer—not the storage backend.

- **Assuming the engine generates embeddings.** The engine only stores and queries vectors. Embedding generation happens externally in `src/core/embedding.ts`, which means all engines share the same embedding service regardless of storage backend.

---

## **The Real-World Picture**

A researcher at a small biotech startup wants to build a personal knowledge base of academic papers and meeting notes. She doesn't have a DevOps team, doesn't want to manage cloud credentials, and isn't sure if GBrain will stick in her workflow. She runs `gbrain init`, PGLite spins up instantly, and she's indexing PDFs within minutes. Six months later, her brain has grown to 8,000 papers and she needs to access it from both her lab workstation and her laptop. She runs `gbrain migrate --to supabase`, waits for the transfer to complete, updates one configuration line, and keeps working. The search queries she wrote on day one still work exactly the same on day one hundred eighty.

## **What You Now Know**

- How PGLite provides zero-config deployment by embedding Postgres 17.5 via WebAssembly inside the Node.js process
- Why the BrainEngine abstraction makes storage backends interchangeable without application code changes
- How search actually flows through the system—from slug-based API calls through engine-specific raw retrieval to the engine-agnostic hybrid fusion layer
- When to use PGLite (quick starts, single machines, <1,000 files) versus when to migrate to PostgresEngine (scale, multi-device access, managed backups)
- That bidirectional migration is lossless and handles all data types including embeddings, links, and timeline entries

## **Looking Ahead**

You've got GBrain running, but how do you know it's healthy? In **Daily Operations: Health Checks and Recovery**, we'll explore how to monitor your brain's vital signs, detect when something's gone wrong, and recover gracefully—whether you're running on PGLite or a production Postgres cluster.

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/ENGINES.md
- https://pglite.dev/ (PGLite bundle size and WebAssembly details)
- https://github.com/prisma/postgres-pglite (Postgres 17.5 WASM compilation)