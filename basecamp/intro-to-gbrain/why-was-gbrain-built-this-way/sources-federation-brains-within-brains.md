---
## **The Room of Requirement Problem**

You walk into your favorite library. It's a sprawling building with mahogany shelves, brass lamps, and the faint smell of old paper. You're researching something obscure—the mating habits of velvet worms, or the history of submarine patents, or maybe just trying to find that half-remembered quote about chaos from your college philosophy notes.

You approach the information desk. "I'd like to search your collection," you say.

The librarian blinks. "All of it? Even the physics journals? The elementary school yearbooks? My personal diary that I keep on the third shelf of the staff room?"

Of course not. You want the relevant stuff. But here's the kicker: *what counts as relevant depends on who you are and why you're here.* A graduate student wants everything cross-referenced. A journalist covering local sports wants strictly the newspaper archives. Your therapist (yes, this library has a weirdly broad collection) definitely does not want their case notes showing up when you search for "childhood anxiety" for your memoir.

This is the **Room of Requirement problem**. How do you build a knowledge system that can be both one unified brain *and* many separate brains at the same time?

## **Act 1: Brains Within Brains**

GBrain's answer is what the docs call **multi-source brains**. Think of it like this: you have one physical library building (the database), but inside it, you can configure multiple completely separate reading rooms—or open everything into one giant unified space.

Each **source** is "a logical brain-within-the-brain with its own slug namespace, its own sync state, and its own federation policy."

Let's break that down without the jargon:

A source is like a color-coded notebook. Your personal wiki might be the blue notebook. Your code documentation might be the red notebook. Your YC Media portfolio content might be the green notebook. They're all sitting on the same shelf (one database), but each has its own:

- **Namespace**: The naming system. Page slugs in your wiki won't collide with slugs in your code docs.
- **Sync state**: Each notebook tracks what's been updated independently.
- **Federation policy**: The rule that says whether this notebook's contents should appear in general searches, or stay isolated unless specifically requested.

The magic is that you don't need separate database instances to keep projects isolated. As one concept puts it: "You can store multiple completely separate knowledge domains in one database while maintaining strict boundaries or enabling cross-domain recall."

## **Act 2: The Federation Decision**

Here's where you make your choice. The docs describe this as the **federation flag** — a boolean stored in each source's configuration.

| Federation Setting | What It Means |
|-------------------|---------------|
| `true` | This source participates in unqualified searches. Ask a general question, get answers from here. |
| `false` (default) | This source stays isolated. It only responds when you explicitly call it by name. |

Picture the university library again. With **federated = true**, you've got open stacks. Search for "quantum mechanics" and you might get results from the physics department, the philosophy of science collection, and that weird science fiction zine someone donated. Everything blends together.

With **federated = false**, you've got separate reading rooms. Search for "quantum mechanics" from the physics wing, and you *only* get physics results. The philosophy section doesn't leak in. The sci-fi zine definitely doesn't leak in. To access them, you have to physically walk to that room and ask specifically.

The docs note that "the seeded `default` source is `federated=true`" — meaning if you've been using GBrain since before multi-source existed, everything still works the same. All your pages appear in search. The change only kicks in when you deliberately add a second source and decide how separate it should be.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing two scenarios: left side shows multiple sources with arrows flowing into a unified search bubble (federated), right side shows sources in separate boxes with no connecting arrows (isolated), with a small explicit-query bridge between them" width="600" height="350" /></p>

### **Two Real Patterns**

The documentation describes three canonical scenarios. Let's look at two that illustrate the federation choice:

**Unified Knowledge Recall (Wiki + GStack)**

This is the "everything belongs to me" setup. You have a personal wiki and a gstack checkout. Both are your knowledge. When you ask "what did I learn about X?" you want the best hit regardless of which room it's stored in. Here, you'd set both sources to `federated=true` so they share freely.

**Purpose-Separated Brains (YC Media + Garry's List)**

This is the "keep my worlds separate" setup. You run two completely different content pipelines. YC Media covers portfolio news and founder profiles. Garry's List is personal writing. The docs are explicit: "You explicitly DON'T want them mixed in search — YC portfolio content leaking into essay searches is a bug, not a feature."

Here, you'd keep both sources as `federated=false` (the default). Searching from the YC Media directory returns only YC Media hits. Searching from your personal writing directory returns only personal hits. 

Unless, of course, you *want* to cross the streams. The docs show how: you can explicitly search across them with a specific source list. Federation is opt-in, not leaked.

## **Act 3: Attribution and the Citation Format**

Once you have multiple sources, you need a way to say where information came from. This is the **Agent Citation Format for Multi-Source** — think of it like "color-coded sticky notes in a shared notebook."

The format is simple: `[source-id:slug]`

So when an agent responds to you, it might say:

> "You told me about the distillation protocol — see [wiki:topics/ai] and [gstack:plans/multi-repo] for where this came from."

Notice what's happening here. The citation tells you exactly which notebook (source-id) and which page (slug) provided the information. Even if you later rename a source for display purposes, the underlying source-id never changes — so citations keep working.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing an agent response with bracketed citations pointing to different source boxes, each containing document icons" width="600" height="350" /></p>

**⚠️ Watch Out For:**
- **Assuming all sources blend by default.** New sources are `federated=false` by default. If you add a source and wonder why nothing shows up in general search, you probably need to either federate it or explicitly query it by name.
- **Thinking source isolation requires multiple databases.** The whole point is that you get strict boundaries *within* a single database. Don't spin up separate instances just to keep projects separate — that's the old way of thinking.

## **How GBrain Decides Which Source to Use**

When you run a command, GBrain walks a priority list to figure out which source you're talking about:

1. Did you explicitly pass `--source <id>`? Use that.
2. Is there a `GBRAIN_SOURCE` environment variable set? Use that.
3. Is there a `.gbrain-source` dotfile in your current directory (or any parent)? Use that.
4. Are you inside a registered source's `local_path`? Use the source that matches your location (longest prefix wins if you're nested).
5. Is there a brain-level default set? Use that.
6. Fall back to the `default` source.

This means you can "attach" yourself to a source by running `gbrain sources attach <id>` in a directory, which creates that `.gbrain-source` dotfile. From then on, any GBrain commands in that directory automatically target the right source. It's like walking into a specific reading room and having the librarian know which collection you mean without you saying a word.

---

## **The Real-World Picture**

You're building an AI assistant that helps YC founders. You have one knowledge base for general startup advice, another for specific portfolio company updates, and a third for internal team documentation about your own processes. You federate the startup advice so it appears in every conversation. You keep portfolio updates unfederated — you don't want Company A's private metrics surfacing when someone asks about Company B. And you keep internal docs completely isolated, only accessible when your team explicitly queries them. One database, three isolation boundaries, zero risk of cross-contamination.

---

## **What You Now Know**

- How **source federation policies** let you configure whether knowledge repositories share content or remain isolated within a single database
- How the **federated flag** (`true`/`false`) controls whether a source appears in unqualified searches or requires explicit naming
- How **source resolution priority** determines which source GBrain uses when you don't specify one explicitly
- How **agent citation format** (`[source-id:slug]`) maintains provenance across multiple knowledge domains
- How to decide between unified recall (wiki + code docs) versus strict isolation (YC Media + personal writing) based on whether cross-contamination is a feature or a bug

## **Looking Ahead**

Now that you understand how to keep your knowledge organized into separate (or federated) rooms, we need to talk about how GBrain decides *which* room a new piece of information belongs in automatically. Next up: **The Resolver: Automatic Filing for Entities** — because manually sorting every thought into the right notebook doesn't scale.

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/guides/multi-source-brains.md