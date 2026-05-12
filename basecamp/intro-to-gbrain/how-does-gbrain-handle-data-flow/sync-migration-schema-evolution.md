---
## **The Ghost in the Upgrade**

Your phone buzzes with an app update notification. You tap "Update," watch the progress bar fill, and... nothing seems different. The icon looks the same. The buttons are in the same places. But somewhere under the hood, something broke. A setting got reset. A feature you used yesterday has vanished. Or worse — the app crashes now, and you have no idea why.

Software updates are haunted. They carry the baggage of everything that came before — old data formats, deprecated settings, assumptions about how things used to work. Without a careful guide to shepherd them across the boundary between versions, even "successful" updates leave users stranded in a weird limbo where new code runs with old bones.

GBrain solves this by treating updates not as file transfers, but as carefully orchestrated journeys. The agent doesn't just download new code — it remembers that updates exist, sells you on why you want them, and walks through every step of transformation needed to make the new version actually work.

---

## **Act 1: The Persistent Reminder**

### **What It Means to Remember**

Imagine you visit a mechanic who notices your brake pads are worn. He mentions it, you say "not today," and you drive away. Six months later, you're back — and he has no idea you ever talked about brakes. He never wrote it down. He never followed up. The information vanished into the ether between visits.

That's how most software handles updates: it checks once, mentions it once, and immediately forgets. Users stay on stale versions not because they rejected the update, but because the moment passed and nobody reminded them.

**Persisting update state across sessions** means the agent remembers between conversations that updates are available. Like a car dashboard that remembers your maintenance schedule between trips, it prompts you at the right time instead of hoping you'll check the odometer yourself.

<p align="center"><img src="PLACEHOLDER" alt="[Diagram showing: Signal Detector (Sonnet-class, async) → Update State File → User Prompt → Full Upgrade Flow. Arrows showing state persists across multiple conversation bubbles]" width="600" height="350" /></p>

The mechanism is deliberately lightweight. The system spawns an async **signal detector** using a Sonnet-class model — not Opus — because detection is pattern matching, not deep reasoning. As the docs note: "Sonnet is 5-10x cheaper and fast enough." This runs without blocking the main thread, so you get your response immediately while the update check happens in the background.

**⚠️ Watch Out For:**
- **Using Opus for detection.** This wastes 5-10x cost since detection is pattern matching, not deep reasoning. Over a month, the wrong model choice costs $100+ more than necessary.
- **Running checks synchronously.** If the signal detector blocks the main thread, the user waits 30-120 seconds for every message. Always spawn and forget.

When an update is found, the agent doesn't just say "new version available." It crafts a punchy message selling what you can DO now that you couldn't before — "Your brain never falls behind. Live sync keeps the vector DB current automatically" — and waits for explicit permission before proceeding.

---

## **Act 2: The Complete Journey**

### **From Code to Capability**

Downloading new files is the easy part. The hard part is bridging the gap between "new code exists" and "new capabilities work." Without explicit steps, you get the nightmare scenario: new code running with old agent behavior because the agent never re-read its skills.

Think of it like renovating a kitchen. You can install a new oven, but if nobody tells the chef how to use convection mode, or moves the old pots to accessible shelves, or updates the recipe cards for the new temperature settings — you've got new hardware with old workflows.

**Create Version-Specific Migration Instructions** is the process that automatically detects updates, communicates benefits, and executes guided steps to ensure new code is accompanied by updated agent behaviors and schema. Like a personal assistant who not only tells you when a new appliance is available but installs it, transfers your settings, trains you on features, and removes the old unit.

<p align="center"><img src="PLACEHOLDER" alt="[Flowchart: gbrain upgrade → Re-read Skills → Re-read Reference Docs → Execute Version-Specific Migrations → Schema Sync → Report to User]" width="600" height="350" /></p>

The full upgrade flow follows a strict sequence:

1. **Update the binary** — new code arrives
2. **Re-read all skills** — the agent re-internalizes every SKILL.md file
3. **Re-read production reference docs** — playbook and schema knowledge refreshes
4. **Execute version-specific migrations** — step-by-step instructions for transformations
5. **Sync schema** — suggest new structures, respect previously declined choices
6. **Report what changed** — transparency builds trust

Migration files live at `skills/migrations/vX.Y.Z.md` and contain **agent instructions, not scripts**. The agent reads them in version order and executes step by step. Without this, the agent has new code but the user's environment hasn't changed.

**⚠️ Watch Out For:**
- **Focusing on what files changed rather than what users can now do.** Technical changelogs don't sell upgrades; capability descriptions do.
- **Skipping post-upgrade steps.** New code with old agent behavior is worse than no update at all.

---

## **Act 3: Cleaning Up the Archive**

### **When Data Goes Bad**

Not all migrations add features. Sometimes they repair damage that accumulated quietly in the dark corners of your database.

JSONB columns are wonderfully flexible — they store nested objects, arrays, arbitrary structures without rigid schema. But that flexibility has a cost: without strict validation at write-time, malformed data can slip in and sit there, a ticking time bomb. A missing quote here, an encoding mismatch there, and suddenly your queries start failing on records that "should" be valid.

**JSONB string repair migration** is a database process that identifies and fixes malformed string data stored in JSONB columns. Like correcting typos in a digital library card catalog so the search system can properly index every book.

The process follows careful steps:

1. **Identify corruption** using schema validation or parse attempts
2. **Create a full backup** before touching anything
3. **Execute repair logic** to transform malformed strings into valid JSONB
4. **Validate all repaired records** against the canonical schema
5. **Commit and prevent regression** by updating validation rules

**⚠️ Watch Out For:**
- **Assuming JSONB validates automatically.** It stores invalid text as-is until queried.
- **Running repair without backup.** Domain-specific repair heuristics sometimes need human review.

---

## **The Real-World Picture**

A sales team has been using GBrain for six months, accumulating thousands of contact records. A new release adds automatic company enrichment — but the update also includes a migration that fixes malformed phone numbers stored as nested JSON strings instead of clean arrays. Without the persistent update system, they'd never know about the release. Without the full upgrade flow, the new enrichment feature wouldn't activate because the agent never re-read its skills. Without the JSONB repair, the enrichment would crash on malformed records. The orchestrated update handles all three: prompting the team lead, executing the upgrade, repairing the data, and surfacing enriched company profiles the next morning.

---

## **What You Now Know**

- **How update state persistence works** — lightweight async detection on cost-effective models, with state remembered across sessions to prompt at the right moment
- **Why the full upgrade flow matters** — new code requires skill re-reading, migration execution, and schema sync to actually deliver new capabilities
- **When JSONB repair becomes necessary** — flexible storage without strict validation allows silent corruption that targeted migrations must clean up
- **How to communicate updates effectively** — sell benefits and new capabilities, not technical file changes

---

## **Looking Ahead**

Now that you understand how GBrain orchestrates updates and maintains data integrity, the next lesson explores **Signal Detection: Automating the Watchers** — how the system continuously monitors incoming data streams and decides what deserves your attention versus what can wait.

---

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/guides/sub-agent-routing.md
- https://github.com/garrytan/gbrain/blob/main/docs/guides/upgrades-auto-update.md
- https://github.com/garrytan/gbrain/blob/main/docs/integrations/README.md
- https://aws.amazon.com/blogs/database/postgresql-as-a-json-database-advanced-patterns-and-best-practices/