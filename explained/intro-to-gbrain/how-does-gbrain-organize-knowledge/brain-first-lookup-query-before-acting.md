---
## **The Memory Palace of a Forgetful Genius**

Picture a brilliant architect who's designed hundreds of buildings. She remembers every structural detail, every client conversation, every lesson learned from past failures. But here's the catch: she can't access any of it when she needs it. She walks into a meeting about a museum project and starts explaining airport acoustics. She pulls up notes on a bridge's load-bearing capacity when asked about residential insulation. The knowledge exists—somewhere—but there's no system for retrieving the *right* knowledge at the *right* time.

This is what happens when AI agents act without looking first. They charge ahead, confident and capable, but contextually blind. They shell out commands, generate plans, make assertions—all without checking if the answer was already written down, if the decision was already made, if the pattern was already learned.

The **Brain-First Lookup Pattern** fixes this. Before your agent does *anything*, it asks: "What do I already know about this?" And it gets the right answer because gbrain organizes knowledge into **sources**—distinct, queryable domains that can be federated together or kept strictly apart.

---

## **Act 1: The Brain Within the Brain**

A single gbrain database doesn't just hold one knowledge repository. As the docs note: "A single gbrain database can hold multiple knowledge repos. Each one is a source: a logical brain-within-the-brain with its own slug namespace, its own sync state, and its own federation policy."

Think of it like a university library system. There's the main catalog that searches across all collections—biology, history, engineering, poetry. But there's also the medical library, where doctors don't want anatomy textbooks mixed up with drama criticism. Same building. Same database. Completely different search boundaries depending on what you're doing.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing a single gbrain database containing multiple source bubbles (wiki, gstack, yc-media, garrys-list) with federation arrows showing unified recall vs isolation boundaries" width="600" height="350" /></p>

### Unified vs. Purpose-Separated

Two scenarios illustrate this perfectly:

| Pattern | Use Case | Behavior |
|---------|----------|----------|
| **Unified Recall** | Personal wiki + project plans | Search "authentication" returns hits from both sources |
| **Purpose-Separated** | YC Media (portfolio news) + personal essays | Search from YC directory returns *only* YC content |

The docs are explicit here: "You explicitly DON'T want them mixed in search — YC portfolio content leaking into essay searches is a bug, not a feature."

**⚠️ Watch Out For:**
- **Assuming federation is automatic.** New sources default to `federated: false`. You must explicitly opt them into cross-source search with `gbrain sources federate <id>` or they remain isolated.
- **Thinking writes are instantly visible.** As noted in the operational disciplines: the system "leaves search results stale after writes" without proper sync discipline.

---

## **Act 2: The Resolution Dance**

When your agent queries the brain, how does gbrain know which source to check? It walks a priority list—highest first:

1. Explicit `--source <id>` flag
2. `GBRAIN_SOURCE` environment variable
3. `.gbrain-source` dotfile in current or ancestor directory
4. Registered source whose `local_path` contains the current directory
5. Brain-level default via `gbrain sources default <id>`
6. The seeded `default` source

This means you can write context-aware agents. Inside your `~/.gstack/plans/` directory, searches automatically hit the `gstack` source. Step outside, and you're back to the default. No configuration drama. No accidental cross-contamination.

The key insight: **each source maintains independent sync state.** A write to `yc-media` doesn't immediately appear in `garrys-list` queries, even if both are federated. Each source has its own timeline, its own slug namespace, its own federation policy governing how writes propagate to the queryable index.

<p align="center"><img src="PLACEHOLDER" alt="Flowchart showing resolution priority: flag → env → dotfile → path matching → default → fallback, with each branch labeled" width="600" height="350" /></p>

---

## **Act 3: Write, Then Wait (The Sync After Write Requirement)**

Here's a pattern that trips up beginners: your agent writes knowledge to the brain, then immediately queries for it—and gets nothing. Not because the write failed, but because the **sync state** hasn't updated yet.

The analogy works like a bank deposit. You hand the check to the teller. The money exists in the bank's possession. But until it clears and appears in your account balance, you can't spend it. Same with gbrain sources.

Each source tracks its own sync state independently within the shared database. When you write to a knowledge repo, you must synchronize that source before the content is available for cross-source queries:

```bash
gbrain sync --source yc-media
gbrain sync --source garrys-list
```

**⚠️ Watch Out For:**
- **Querying across sources immediately after a write.** If your workflow is "write to wiki, then search wiki+gstack," you'll miss the fresh content unless you synced the wiki source first.
- **Assuming sync failures are query failures.** If search returns stale results, check `gbrain sources list` to see sync states, not your query syntax.

---

## **The Real-World Picture**

You're building an agent that helps manage a venture portfolio. It needs to recall founder backgrounds from your YC Media source when drafting portfolio updates, but should *never* pull from your personal essay source when writing those updates—that's a context leak that would confuse readers and embarrass you. Your agent's workflow becomes: detect the task domain (portfolio update), resolve to the `yc-media` source via the `.gbrain-source` dotfile in your portfolio directory, query for relevant founder context, *then* generate content. If you later need to cross-reference with your personal research wiki, you explicitly federate: `gbrain search "scaling benchmarks" --source yc-media,wiki`. The brain-first lookup ensures you never act in ignorance, and source isolation ensures you never act with contaminated context.

---

## **What You Now Know**

- How gbrain's multi-source architecture lets multiple knowledge repositories coexist in one database with independent namespaces and sync states
- How to design agents that resolve the correct source via flags, environment variables, dotfiles, or path matching
- Why the **Sync After Write Requirement** means fresh content isn't queryable until its source's sync state updates
- When to use unified recall (federated sources) versus strict purpose-separated lookup (explicit `--source` targeting)
- How federation policies prevent information leakage between unrelated knowledge domains

## **Looking Ahead**

Now that you understand how to query organized knowledge before acting, the next lesson explores **Async Sub-Agents: Speed Without Blocking**—how to parallelize brain lookups and other operations so your agent doesn't wait idle while knowledge retrieval happens.

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/guides/multi-source-brains.md
- https://github.com/garrytan/gbrain/blob/main/docs/guides/operational-disciplines.md
- https://github.com/garrytan/gbrain/blob/main/docs/guides/minions-shell-jobs.md