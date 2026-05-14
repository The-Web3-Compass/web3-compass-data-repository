Then you try to buy coffee. Card declined. You check your banking app: zero balance. "But I just deposited a check!" you protest. The barista shrugs. "Has it cleared yet?"

Last time you learned how the auto-link post-hook parses markdown to extract entity references during every `put_page` call. In gbrain's world, those writes face a similar clearing delay: you write a brilliant page to your knowledge base, the write succeeds, and you immediately ask your agent to recall that information—it comes back blank, or worse, with outdated results. The knowledge exists, but it hasn't **synced** yet. Until it clears into your source's independent sync state, it might as well be invisible.

gbrain doesn't just have one knowledge base. It has many. Each one is a **logical brain-within-the-brain** called a **source**. Your personal wiki might be one source. Your code documentation might be another. Each has its own slug namespace and its own sync state. Crucially, each also has its own **federation policy** that determines whether it plays nicely with others or keeps strictly to itself.

Understanding this dance between writes, syncs, and federation is the difference between an agent that feels psychic and one that feels like it has amnesia.

---

## **Act 1: The Write That Disappeared**

Imagine you're a journalist with two notebooks. In your reporting notebook, you scribble notes from an interview. In your personal notebook, you journal about your day. Same backpack, same pens, same you, but the contents stay separate unless you explicitly choose to combine them.

**gbrain works the same way.** As the docs explain: "A single gbrain database can hold multiple knowledge repos. Each one is a source: a logical brain-within-the-brain with its own slug namespace, its own sync state, and its own federation policy."

When you write content to a source (say, adding a page to your wiki), that write lands in that source's dedicated space. The critical part: **writes are not instantly queryable across sources**. Each source maintains its own sync state. Until that sync process completes, the content lives in a kind of limbo. It's been written, but not indexed. Deposited, but not cleared.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing a write entering a source, then a sync process updating the source's independent sync state, then the content becoming available for queries. Show three distinct sources with their own sync state boxes." width="600" height="350" /></p>

The **Sync After Write Requirement** means your workflow becomes: write, sync, then query. Skip the sync step and you're essentially asking your agent to read from a book that hasn't been shelved yet.

### **⚠️ Watch Out For:**
- **Assuming immediate visibility.** Just because `put_page` succeeded doesn't mean a subsequent search will find it. You need that sync state update first.
- **Thinking all sources share one global sync state.** They don't. Each source tracks its own sync metadata independently. A write to your `wiki` source doesn't update the sync state for your `gstack` source.

---

## **Act 2: The Library With Movable Walls**

Now let's talk about how these sources relate to each other. Picture a university library stored in a single building. You can configure it two ways: open stacks where every department's books appear in one unified catalog, or separate reading rooms where the philosophy collection never mixes with the engineering collection. Same building, same infrastructure, different boundaries.

This is **Source Federation Policy** in action. As the docs note, every source stores `config.federated: boolean` in its configuration:

| Federation Setting | What It Means |
|---|---|
| `true` | This source participates in unqualified searches. Ask "what do I know about X?" and results from this source appear automatically. |
| `false` (default) | This source only appears when explicitly named. It's invisible to general queries unless you specifically ask for it. |

Consider the two canonical scenarios from the docs:

**Unified knowledge recall** is when you *want* blending. You have a personal wiki and a `gstack` checkout. Both belong to you. When you ask "what did I learn about deployment strategies?" you want the best hit, whether it lives in your wiki notes or in a gstack plan file. Federation here is your friend.

**Purpose-separated brains** is when you *don't* want blending. You run YC Media (portfolio news and founder profiles) and Garry's List (personal essays). YC portfolio content leaking into essay searches is a bug. Here, federation is explicitly disabled. Each source stays in its own lane.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing two configurations: Left side shows sources as blended/overlapping circles with unified search. Right side shows sources as isolated boxes with separate search scopes. Both configurations exist within the same database boundary." width="600" height="350" /></p>

**You don't need separate database instances to keep projects isolated.** Federation policy lets you enforce strict boundaries while sharing the same backend infrastructure. It's the difference between renting separate office buildings and simply putting locks on different doors in the same building.

### **⚠️ Watch Out For:**
- **Assuming sources automatically blend.** New sources default to `federated: false`. If you want unified search, you must explicitly opt in.
- **Thinking isolation requires multiple databases.** It doesn't. You can run completely separate knowledge domains from the same gbrain database, just unfederate them.

---

## **Act 3: Speaking the Language of Sources**

Your sources are configured, your sync states are current, and your agent is retrieving knowledge. But when it answers your question, how do you know *which* source provided which fact?

Enter the **Agent Citation Format for Multi-Source**, color-coded sticky notes for the digital age. When agents receive results, they cite pages in `[source-id:slug]` form:

> "You told me about the distillation protocol — see [wiki:topics/ai] and [gstack:plans/multi-repo] for where this came from."

Notice how the citation keys use `sources.id`, the immutable identifier, not the display name. You can rename a source via `gbrain sources rename` (changing "wiki" to "Personal Knowledge Base"). All existing citations keep working because they reference the underlying ID, not the pretty label.

Resolution priority determines which source you're actually writing to or reading from at any moment. gbrain walks a specific hierarchy to figure it out:

1. Explicit `--source <id>` flag (you shouted it)
2. `GBRAIN_SOURCE` environment variable (you set it)
3. `.gbrain-source` dotfile in your current directory or any parent (you left a note)
4. A registered source whose `local_path` contains your current directory (you're standing in its territory)
5. Brain-level default set via `gbrain sources default <id>` (the fallback)
6. The seeded `default` source (the ultimate fallback)

So if you're inside `~/.gstack/plans/` and that directory has a `.gbrain-source` file pointing to the `gstack` source, a `put-page` command implicitly writes there. Step outside with no environment variable set, and you're writing to the default source instead.

### **⚠️ Watch Out For:**
- **Accidentally writing to the wrong source.** If you're not paying attention to which directory you're in (and whether it has a `.gbrain-source` file), you might file notes in your code source instead of your wiki.
- **Thinking display names matter for citations.** They don't. The immutable `source-id` is what agents use and what gets stored in citations.

---

## **The Real-World Picture**

You're building an AI agent that helps founders prepare for YC interviews. You maintain two sources: `yc-knowledge` (general advice, past interviews, common questions) and `founder-profiles` (specific details about each company you're coaching). You keep them unfederated because you don't want generic advice polluting specific founder research.

A founder asks about their competitor, a company you researched last month. You search, find nothing, and panic. Then you remember: you wrote that research to `founder-profiles`, but you're searching from a directory that defaults to `yc-knowledge`. You run a cross-source query explicitly, or you sync and re-scope. The sync state catches up, the federation policy guides the search boundaries, and the citation format tells you exactly where that intel came from. Crisis averted, credibility intact.

---

## **What You Now Know**

- How writes to gbrain sources require synchronization to update that source's independent sync state before becoming queryable
- How federation policies act as boundary controllers, letting sources blend into unified search or remain strictly isolated within the same database
- How gbrain resolves which source to use via a clear priority hierarchy, from explicit flags to dotfiles to defaults
- How the `[source-id:slug]` citation format lets agents attribute facts to their origins without breaking when display names change

## **Looking Ahead**

Knowledge lands in sources and becomes available across them. Now we need to talk about what happens when you write to a page that already exists. In **APPEND vs REWRITE: The Two Operations That Matter**, we'll explore the fundamental choice every knowledge operation faces: adding to what's there, or replacing it entirely.

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/guides/multi-source-brains.md (Multi-source brains, Unified knowledge recall, Purpose-separated brains, Sync each independently, Federation flag, Resolution priority, Citation format for agents)