---

## **The Ghost in the Upgrade**

You download the latest version. The installer finishes. You launch the app expecting magic, and get the exact same experience as yesterday. New code is sitting on your drive, but nothing feels different. Your agent still responds the same way. Your data looks unchanged. Somewhere between "download complete" and "actually usable," something got lost.

This is the ghost update problem: new software haunts your system without ever possessing it.

Most of us have lived this. The app store shows "Version 2.0 installed," but the feature you wanted? Nowhere. The bug they fixed? Still biting you. Somewhere in the gap between code deployment and behavior refresh, the upgrade died quietly.

Last time you saw how entity pages automatically upgrade tiers when new signals arrive, evolving thin profiles into rich context without manual filing. GBrain brings that same hands-off philosophy to software changes with **migrations**: a deliberate choreography that bridges the moment new files arrive and the moment your agent actually becomes more capable. Picture a personal assistant who spots when a new appliance model drops and explains why it improves your kitchen. They install it, transfer your settings, train you on new features, and remove the old unit without you lifting a finger.

---

## **Act 1: Selling the Upgrade (Not the Changelog)**

Software updates usually announce themselves with technical throat-clearing: "Fixed buffer overflow in module X. Updated dependency Y to 3.2.1." Users shrug. They have no idea what that unlocks for them.

GBrain flips this. The update message leads with what you can *do* now that you couldn't before:

> Your brain never falls behind. Live sync keeps the vector DB current automatically, so edits show up in search within minutes. New verification runbook catches silent failures before they bite you.

The agent performs daily checks for available versions. When it finds one, it constructs a benefit-focused notification emphasizing new user capabilities instead of file changes. Then it presents explicit options: upgrade now, defer, check less often, or disable entirely.

This matters because users won't proactively run `gbrain upgrade` just because. They need to feel "hell yeah, I want that." The agent persists this update availability state across conversation sessions. It acts like a car dashboard that remembers your maintenance schedule between trips and reminds you when service is due.

**⚠️ Watch Out For:**
- **Focusing on what files changed rather than what users can now do.** Technical changelogs don't sell upgrades; capability descriptions do.
- **Assuming users will discover and install updates without proactive notification.** They won't. The agent must persist update awareness and prompt at the right moment.

---

## **Act 2: The Full Upgrade Flow**

When you finally say "yes," the migration orchestration begins. This isn't just running an installer. It's a six-step sequence that ensures new code actually becomes new behavior:

<p align="center"><img src="PLACEHOLDER" alt="[Flow diagram showing: Update binary → Re-read skills → Read production docs → Execute migrations → Schema sync → Report changes]" width="600" height="350" /></p>

First, the binary updates. Then the agent **re-reads all updated skills**, since updated skills equal better agent behavior. It refreshes its understanding of production reference documentation.

The critical step comes next: **version-specific migration directives**. The agent scans `skills/migrations/vX.Y.Z.md` files for every version between your old and new installation. Each migration contains step-by-step agent instructions (not raw scripts) that bridge the gap between new code and your existing environment. The agent reads these in version order and executes them sequentially, never skipping steps.

Finally, the agent synchronizes the vector database schema, suggesting new structures while respecting any you've previously declined, then reports exactly what changed.

Without these migration steps, the agent has new code but your environment hasn't transformed to match. It's like installing a new engine but keeping the old transmission. It runs, but not well.

**⚠️ Watch Out For:**
- **Updating source code alone without re-reading skills.** New files don't automatically update agent behavior; the agent must explicitly re-internalize its capabilities.
- **Skipping post-upgrade steps like schema syncing.** This leaves new code running with legacy database structures, creating subtle inconsistencies.

---

## **Act 3: Detection Without Disruption**

Here's where gbrain gets clever about resource management. Detecting updates shouldn't make you wait.

The system spawns an **async sub-agent on Sonnet-class models** to check for updates. This matters because detection is pattern matching, not deep reasoning. Using Opus for this would waste 5-10x in cost for zero benefit. As the docs note: "Reserve Opus for the main session where reasoning quality matters."

More importantly, this detection runs asynchronously. Spawn and forget. If it ran synchronously, you'd wait 30-120 seconds for every message while entity detection completed. Instead, you see responses immediately, and the agent remembers what it discovered for next time.

The cost optimization is multiplicative. Entity detection runs on every single message. Using Opus at $15/MTok across fifty messages daily costs $3-5 just for detection. Sonnet at $3/MTok brings that to $0.60-1.00. Over a month, the wrong model choice costs $100+ more than necessary for identical results.

---

## **Act 4: When Data Needs Repair**

Sometimes migrations don't add features. They fix what broke. Consider **JSONB string repair**: a process that identifies and fixes malformed string data stored in JSONB columns.

JSONB flexibility allows storing varied data structures. But without strict validation at write-time, subtle corruption propagates silently. It's like typos in a digital library card catalog that prevent the search system from properly indexing books. A repair migration forces cleanup: identify corrupted records, create backups, apply domain-specific repair heuristics, validate against the canonical schema, and commit.

This prevents application crashes, query failures, and data loss. Invalid JSON syntax or encoding mismatches accumulate over time otherwise.

**⚠️ Watch Out For:**
- **Assuming JSONB validates string syntax on insert.** It doesn't—it stores invalid text as-is until queried.
- **Running repair migrations without human review or backups.** Some corruptions require domain expertise to interpret correctly.

---

## **The Real-World Picture**

You're running gbrain v0.4.2 with 847 brain pages accumulated over months. v0.5.0 drops with live sync capabilities. Without the migration system, you might manually run `gbrain upgrade`, update the binary, and assume you're current. Yet your agent still operates from cached v0.4.2 skills. Your vector database lacks the new schema fields for live sync tracking. The verification runbook that catches silent failures never executes. Three weeks later, edits stop appearing in search and you can't figure out why. With proper migrations, the same upgrade sequence includes skill re-reading, migration file execution for the v0.5.0 schema changes, and automatic verification that everything works. This transforms a potentially broken partial upgrade into a seamless capability expansion.

---

## **What You Now Know**

- How the full upgrade flow sequence transforms new code into new capabilities through deliberate orchestration
- Why Sonnet-class models are the right choice for async update detection, and how much cost this saves
- How version-specific migration files bridge the gap between code updates and environment updates
- Why persisting update state across sessions prevents users from indefinitely remaining on stale versions
- How JSONB repair migrations enforce data integrity when flexible storage formats allow silent corruption

---

## **Looking Ahead**

Now that you understand how migrations orchestrate complex sequences without blocking your workflow, you're ready to explore **Async Sub-Agents: Speed Through Parallelism**—where we'll dive deeper into spawning lightweight workers that run independently, cut costs, and keep your main thread responsive.

---

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/guides/upgrades-auto-update.md
- https://github.com/garrytan/gbrain/blob/main/docs/guides/sub-agent-routing.md