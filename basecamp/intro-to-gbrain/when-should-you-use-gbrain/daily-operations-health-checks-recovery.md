---
## **The 3 AM Wake-Up Call**

The notification arrives at the worst possible moment: three in the morning, the night before a major demo. "Search returned stale results," it reads. "Missing links in the founder dossier. Timeline events orphaned."

You stare at the ceiling. Yesterday, everything worked. But something happened between yesterday's passing tests and now. A configuration drift. A subtle collision between two shell jobs you added last week. A path that was absolute when you tested it locally, but somehow became relative in production.

Every knowledge system faces this problem: entropy happens. Configuration rots. The links you carefully crafted last month are now pointing into the void because the entity names changed. The question isn't *whether* things will break — it's *when* you'll notice, and how fast you can recover.

Modern knowledge brains need immune systems: automatic diagnostics that run daily to catch infections before they become fevers, and auto-healing mechanisms that rebuild broken connections without human surgery.

Let's build that immune system.

## **Act 1: The Morning Checkup**

There's a moment every pilot loves: the pre-flight walkaround. It's meditative. You run your hand along the fuselage, check the fuel caps, inspect the landing gear. Not because you expect to find something wrong every time — but because finding a problem on the ground is infinitely preferable to discovering it at 10,000 feet.

**gbrain doctor** works the same way. It's a diagnostic routine that audits your brain's configuration before the day's operations begin, catching shell job misconfigurations and multi-source conflicts while they're still just theoretical problems.

Imagine your brain as a kitchen. You've got multiple prep stations (**sources**) — one for YC portfolio work, one for personal writing. Each station has its own rules. Some ingredients need refrigeration (absolute paths). Some tools can't be mixed — you either use a **cmd** string (shell-interpolated) or an **argv** array (structured arguments), never both in the same recipe.

The doctor's appointment checks each system:

| System Checked | What Goes Wrong | The Fix |
|---|---|---|
| **Parameter conflicts** | Specifying both `cmd` and `argv` in a shell job | Choose one format; they're mutually exclusive |
| **Path validation** | Relative paths or missing `cwd` in shell jobs | All working directories must be absolute, starting with `/` |
| **Type constraints** | Environment variables as numbers or booleans | String-ify everything: `"3"` not `3` |
| **Permission boundaries** | MCP clients trying to submit shell jobs | Shell execution is CLI-only by design |
| **Source isolation** | Unintended knowledge leakage between federated sources | Audit whether separation is intentional |

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing gbrain doctor scanning a brain with multiple sources (wiki, gstack) and checking shell job configurations for errors, with arrows pointing to detected issues like type mismatches and permission violations" width="600" height="350" /></p>

**⚠️ Watch Out For:**
- **The "both at once" trap.** You might think combining `cmd` and `argv` gives you flexibility. It doesn't — it breaks immediately. The system enforces this at the validation layer, so your job never even starts.
- **MCP overreach.** If you're building integrations where external agents trigger actions, remember: shell jobs are **CLI-only by design**. An MCP client attempting to submit one isn't being blocked arbitrarily — it's hitting a security boundary. Submit from CLI or trusted operation handlers only.

## **Act 2: The Self-Healing Graph**

Now let's talk about a different kind of problem. You've been building your wiki for months — founder profiles, meeting notes, company dossiers. You remember writing about Alice's background somewhere. Was it in the YC alumni page? Or her dedicated profile?

You search. You find the page. But the connections are wrong. The timeline doesn't show her company founding. The "people" sidebar doesn't list her as a portfolio founder. The relationships exist in your *head*, but not in the graph.

This is where **auto-link reconciliation** changes the game. Instead of maintaining a separate database of relationships — manually calling link commands every time you edit content — the system treats your markdown as the single source of truth.

Think of it like an automatic index card system in a library. The moment you edit a book — adding a reference to Alice, noting she works at AcmeCorp — the index cards update themselves. New cross-references appear. Obsolete connections disappear. The librarian doesn't lift a finger.

Here's the mechanism: every time **put_page** executes, a post-hook scans the content for entity references like `[Alice](people/alice)`. It infers relationship types from context — *attended*, *works_at*, *founded* — and writes new entries to the links table. Then it performs a full reconciliation: any links no longer present in the text are automatically removed.

<p align="center"><img src="PLACEHOLDER" alt="Flow diagram showing markdown page content with entity references triggering auto-link extraction, writing to links table, and stale link removal, with output showing auto_links summary response" width="600" height="350" /></p>

The response tells you exactly what changed: created links, removed links, any errors. The graph stays synchronized with the text. Your knowledge structure becomes self-healing.

**⚠️ Watch Out For:**
- **Timeline confusion.** Auto-link reconciliation only handles graph relationships — it doesn't create timeline entries automatically. Dated events still need explicit `timeline-add` calls. Don't expect your put_page to generate history entries just because you mentioned a date.
- **The manual fallback myth.** You might think auto-links are incomplete, that you need manual `gbrain link` calls to supplement them. Not true. Manual calls are reserved only for relationships that *cannot* be expressed in markdown content. If you can write `[Entity](path)`, you don't need a manual link.

## **Act 3: Multi-Source Hygiene**

Modern brains rarely contain just one type of knowledge. You might have your personal wiki and a GStack project repository. You might run two completely different content pipelines — YC Media coverage and personal essays — that should never, ever mix in search results.

This is the **multi-source brain** architecture: logical brains-within-brains, each with its own slug namespace and **federation** policy.

| Scenario | Federation Setting | Behavior |
|---|---|---|
| **Unified recall** | `federated=true` | Wiki + GStack results appear together; searching "demand gen" finds hits from both |
| **Purpose-separated** | `federated=false` (default) | YC Media content never leaks into Garry's List searches; explicit `--source` required to cross boundaries |

The resolution priority matters here. When gbrain picks a source, it walks this chain: explicit flag → environment variable → `.gbrain-source` dotfile → registered source path → default setting → fallback default. If you're inside a GStack checkout with a `.gbrain-source` file, `put_page` implicitly writes to the right place. Step outside, and you're back to the default.

**⚠️ Watch Out For:**
- **Implicit federation surprises.** New sources default to `federated=false`. If you expect content to appear in unqualified searches but it doesn't, check the federation flag. The seeded `default` source is `federated=true` for backward compatibility, but anything you add later requires explicit opt-in.

---

## **The Real-World Picture**

You're running a portfolio operations team. Every morning, a cron job runs `gbrain doctor` before the first meeting. It catches a shell job misconfiguration in your founder-onboarding pipeline — someone pushed a change using relative paths for the working directory. The diagnostic fails before the job runs, before it corrupts data, before anyone has to wake up at 3 AM. Meanwhile, your wiki auto-links are rebuilding relationship graphs as analysts update company profiles, ensuring that when you ask about "Series A SaaS founders," the graph returns exactly who you're looking for, with connections that reflect yesterday's edits, not last month's.

---

## **What You Now Know**

- How `gbrain doctor` acts as an immune system, catching configuration errors at validation time rather than runtime
- How auto-link reconciliation treats markdown content as the source of truth for graph relationships, eliminating manual link maintenance
- How multi-source brains use federation flags to control knowledge boundaries and prevent cross-contamination
- How to interpret the resolution priority when determining which source receives a write or query
- How to distinguish auto-link capabilities (relationship management) from timeline creation (event logging)

---

## **Looking Ahead**

Now that your daily operations are running smoothly and your brain is self-healing, it's time to think about communication. In the next lesson, we'll explore how to message system upgrades to your team with benefit-focused language that gets buy-in rather than resistance.

---

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/guides/minions-shell-jobs.md
- https://github.com/garrytan/gbrain/blob/main/docs/guides/multi-source-brains.md
- https://github.com/garrytan/gbrain/blob/main/docs/guides/operational-disciplines.md