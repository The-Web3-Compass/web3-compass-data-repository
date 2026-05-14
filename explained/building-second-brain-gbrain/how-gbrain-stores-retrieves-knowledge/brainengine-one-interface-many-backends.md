---
Storing knowledge is only half the battle—retrieving it without locking yourself into a specific database is where the real architecture begins. This module explores how gbrain stores and retrieves your second brain portably, scalably, and without rewriting code when you move from laptop to cloud.

## **The Universal Power Adapter for Your Brain**

You're at a café in Tokyo, ready to work on your knowledge base. You open your laptop, fire up your brain, and... nothing. The app demands connection strings, environment variables, and a Postgres instance that only exists on your home server. Your choices are bleak: either you configured everything for cloud production (and now can't work offline), or you optimized for local development (and now can't deploy without rewriting half your app).

Database-driven applications force this choice on you eventually. Last time you learned how slug-based APIs decouple public contracts from internal storage, making database backends hot-swappable—here, you'll see exactly how that hot-swapping works in practice.

But what if you didn't have to choose? What if the same code that powers your personal, offline brain could suddenly connect to a production-grade cloud cluster handling ten thousand pages, and not a single line of code changes?

## **Act 1: The Interface That Hides the Wires**

Imagine traveling with a universal power adapter. Your laptop works identically in Tokyo, London, or New York. You don't rewire the motherboard when you land. You don't swap out the power supply. You just... plug in. The adapter handles the ugly details of local voltage and socket shapes. Your device remains blissfully ignorant.

**BrainEngine** is that universal adapter for gbrain. It's a standardized interface that separates what the brain does from how the system stores data. As the docs put it: "The engine is the contract between 'what the brain can do' and 'how it's stored.' Swap the engine, keep everything else."

Here's the trick: your application code speaks only in **content slugs**, which are those human-readable string identifiers like `people/alice-chen` or `projects/website-redesign`. It never touches database IDs. The engine internally resolves slugs to whatever primary keys or row IDs its specific backend demands. Postgres might use big integers. PGLite might use something else. Your code doesn't care.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing BrainEngine as a middle layer: Consumer code calls BrainEngine methods with slugs on the left; BrainEngine resolves to different backends (PGLite, Postgres, etc.) on the right; both sides connect through a standardized interface box labeled 'BrainEngine API'" width="600" height="350" /></p>

The engine returns **normalized SearchResult objects**, not raw database rows. This means hybrid search, RRF fusion, and deduplication all happen in a shared layer above the engine. Whether PGLite or Postgres did the actual searching, the results look identical to the rest of the system.

### **⚠️ Watch Out For:**
- **Thinking BrainEngine generates embeddings.** It doesn't. Embedding generation happens externally in `src/core/embedding.ts`. The engine only stores and queries vectors; creation is someone else's job.
- **Believing graph traversal uses the same algorithm everywhere.** Only the interface is shared. Postgres uses recursive CTEs for graph traversal. SQLite would use iterative depth tracking. The results match, but the path there differs wildly.

## **Act 2: Two Engines, One Brain**

Since v0.7, gbrain ships with two production-ready engines. You choose based on your constraints, not your codebase.

| Factor | PGLiteEngine | PostgresEngine + Supabase |
|--------|--------------|---------------------------|
| **Setup** | `gbrain init` (zero-config) | Account + connection string |
| **What it is** | Embedded Postgres 17.5 via WASM | Managed cloud Postgres cluster |
| **Scale** | Good for < 1,000 files | Production-proven at 10K+ pages |
| **Multi-device** | Single machine only | Any device via remote MCP |
| **Cost** | Free | Supabase Pro ($25/mo) |
| **Concurrency** | Single process | Connection pooling via Supavisor |
| **Backups** | Manual (file copy) | Managed by Supabase |

**PGLiteEngine** compiles actual Postgres 17.5 to WebAssembly and runs it inside your Node.js process. It is neither a toy database nor a simplified reimplementation. You get `tsvector` full-text search, `pgvector` HNSW indexes for cosine similarity, and `pg_trgm` fuzzy matching, just like standard Postgres. The data lives in a local file at `~/.gbrain/brain.db`. No Docker. No accounts. No servers.

**PostgresEngine** connects to a hosted Postgres cluster (typically Supabase). It brings connection pooling, multi-user support, Row Level Security, and managed backups. The features (`tsvector`, `pgvector`, recursive CTEs) all work identically because it's the same SQL dialect.

**You can swap the storage backend completely.** Start hacking with PGLite on your laptop, hit a growth wall, and migrate to Supabase production. The command `gbrain migrate --to supabase` exports everything (pages, chunks, embeddings, links, tags, timeline) and imports it losslessly. Go the other direction with `gbrain migrate --to pglite`. Bidirectional. Zero code changes.

## **Act 3: What's Not in the Box**

The engine abstraction works precisely because it limits its responsibilities ruthlessly.

**Embedding is NOT in the engine.** When you need to turn text into vectors, that external API call to OpenAI happens in `src/core/embedding.ts`. All engines share the same embedding service; none of them generate vectors internally.

**Chunking is NOT in the engine.** Text splitting logic lives in `src/core/chunkers/`. The engine persists chunks and retrieves them, but doesn't decide where to slice.

**Search ranking is NOT engine-specific.** Raw keyword searches (using `tsvector` and `ts_rank`) and raw vector searches (using `pgvector` HNSW) vary by backend. But once those raw results return, they become plain `SearchResult[]` arrays. The RRF fusion, multi-query expansion, and four-layer deduplication happen in `src/core/search/hybrid.ts`, above the engine layer, shared by everyone.

<p align="center"><img src="PLACEHOLDER" alt="Flowchart showing search pipeline: hybrid.ts at top receives query, branches to engine.searchKeyword and engine.searchVector, each connects to backend-specific implementations (Postgres tsvector or PGLite tsvector, Postgres pgvector HNSW or PGLite pgvector HNSW), all return to hybrid.ts for RRF fusion and dedup, then output final SearchResult array" width="600" height="400" /></p>

The separation matters. If someone builds a `DuckDBEngine` tomorrow for analytical workloads, they don't need to reinvent ranking algorithms. They implement raw search, return the standard shape, and inherit the rest.

### **⚠️ Watch Out For:**
- **Assuming PGLite is a simplified database.** It isn't. It's actual Postgres 17.5 compiled to WebAssembly. Same SQL dialect. Same indexes. Same behavior.
- **Thinking search returns raw database rows.** It doesn't. The engine normalizes everything to `SearchResult` arrays before handing results upward. Schema details never leak into application code.

---

## **The Real-World Picture**

You're building a startup with three founders. One lives in Berlin with flaky internet. One travels constantly. One works from a San Francisco office with fiber. Your knowledge base needs to work for all of them. The Berlin founder shouldn't need a cloud connection; the SF founder shouldn't wait for SQLite locks. With BrainEngine, you ship the same application everywhere. The Berlin founder runs `gbrain init` and works offline with PGLite. The SF founder connects to Supabase and scales to thousands of pages. When the startup hits product-market fit and hires a team, you run one migration command. Nobody rewrites a single import statement.

---

## **What You Now Know**

- How **BrainEngine** acts as a universal adapter, letting the same application code speak to embedded PGLite or cloud Postgres without modification
- How **slug-based APIs** hide database-specific IDs, keeping the interface portable across storage backends
- How **normalized SearchResult types** allow engine-agnostic hybrid search, RRF fusion, and deduplication
- Which responsibilities live **outside** the engine (embedding generation, chunking logic) versus inside it (storage, raw search, graph traversal)
- How **bidirectional migration** eliminates the "local vs production" forced choice that traps most database applications

## **Looking Ahead**

Now that you understand how knowledge gets stored and retrieved without vendor lock-in, it's time to explore how that knowledge connects together. In **The Iron Law: Every Mention Creates a Back-Link**, you'll learn why bidirectional links aren't just a feature—they're the fundamental contract that keeps a growing brain from becoming a graveyard of orphaned pages.

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/ENGINES.md (The idea, Why this matters, Key design choices, How search works across engines, PGLiteEngine, PostgresEngine, Adding a new engine)