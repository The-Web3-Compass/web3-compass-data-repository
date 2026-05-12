## **The Gym Renovation Nobody Asked For**

Your favorite gym just closed for a month. When it reopens, you receive a letter:

*"Facility upgrade complete. We installed 12 Matrix T75 treadmills, replaced the flooring with Regupol Aktiv, and upgraded the HVAC to Carrier Infinity series."*

You stare at this. You don't know what any of that means. You don't care about treadmill brands. You wanted to know: can I finally run without my knees hurting? Will my workouts take less time? Do I get better results?

This is how most software talks to users about updates. **Version 3.2.1:** "Refactored the entity resolution module, updated dependencies, patched CVE-2024-8891." Cool. What can I do now that I couldn't before?

The docs excerpt captures the core problem: "GBrain ships updates but nobody knows. The user stays on an old version with stale skills and missing features." The solution isn't just telling people updates exist—it's making them *want* the upgrade.

## **Act 1: The Async Detective**

Before you can sell an upgrade, you need to know one exists. And here's where engineering instincts often sabotage the experience.

The natural impulse is: user sends a message, check for updates right then, respond when you know. But the docs warn us: "If the signal detector runs synchronously, the user waits 30-120 seconds for every message while entity detection completes."

Imagine calling customer service and hearing: "Let me check if we've updated our policies since yesterday. Please hold for 90 seconds." Before you even ask your question. Every single call.

The trick is **asynchronous signal detection**. Spawn a sub-agent that checks daily—using a lighter model, specifically Sonnet-class rather than Opus. The docs are emphatic here: "Detection is pattern matching, not deep reasoning. Sonnet is 5-10x cheaper and fast enough." This detective works in the background, invisible, until it finds something worth mentioning.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing main response thread running parallel to async signal detector sub-agent, with the detector checking for updates without blocking user messages" width="600" height="350" /></p>

**⚠️ Watch Out For:**
- **Blocking the main thread.** If your update check happens synchronously, users experience 30-120 second delays on every interaction. Spawn and forget.
- **Using expensive models for simple detection.** The docs note that using Opus instead of Sonnet for detection across 50 messages/day costs "$3-5/day just for detection" versus "$0.60-1.00/day"—a $100+/month mistake.

## **Act 2: Lead With the Superpower**

You found an update. Now you write the message. Most developers list what changed. Files, versions, modules. The docs give us a better template:

Lead with "what they can DO now that they couldn't before, not what files changed."

Compare:

| The Wrong Way | The Right Way |
|---------------|---------------|
| "GBrain v0.5.0 is available (you're on v0.4.0)" | "Your brain never falls behind" |
| "Updated vector DB sync module" | "Edits show up in search within minutes" |
| "Refactored verification pipeline" | "New verification runbook catches silent failures before they bite you" |
| "Deprecated manual setup script" | "New installs set up live sync automatically" |

The second version makes you feel something. The first makes you feel nothing.

The analogy holds: a fitness coach doesn't announce gym upgrades by listing equipment brands. They tell you how you'll train faster, recover better, hit goals sooner. Users upgrade when they see capability, not changelog.

The docs include this line: "Sell the upgrade. The user should feel 'hell yeah, I want that.'" That's the standard. Not "oh, okay." Not "maybe later." **Hell yeah.**

## **Act 3: The Permission Gateway**

Here's a subtle trap: detecting the update and wanting the upgrade aren't the same as *having permission* to execute it.

The upgrade flow is substantial. The docs outline it: update the binary, re-read all skills, run migrations, sync schema, report changes. This touches core infrastructure. Doing this without explicit consent would be like a contractor renovating your kitchen while you're at work because they noticed your appliances were old.

The pattern is explicit options: **yes** to upgrade, **not now** to skip, **weekly** to check less often, or **stop** to disable. Each choice respects user autonomy. The upgrade waits at the threshold until invited in.

<p align="center"><img src="PLACEHOLDER" alt="Flowchart showing update detection leading to benefit-focused message, then branching to user choices: yes triggers full upgrade flow, not now/weekly/stop update preferences, with full upgrade including binary update, skill re-read, migrations, and schema sync" width="600" height="350" /></p>

When the user says yes, the full sequence executes: upgrade command, skill re-reading, migration execution, schema sync suggestions, final summary. The docs warn about what happens without this: "someone runs `gbrain upgrade` but skips the post-upgrade steps, leaving new code with old agent behavior." The complete flow prevents this drift.

**⚠️ Watch Out For:**
- **Assuming consent from silence.** An update detected is not permission granted. Always wait for explicit yes.
- **Skipping post-upgrade steps.** New code with old agent behavior is worse than no upgrade at all—it's a silently broken state.

---

## **The Real-World Picture**

A product team ships a major release: their AI assistant can now process voice memos and automatically extract action items. They push the update notification: "Version 2.1.0 released. New audio processing pipeline implemented. Updated Whisper integration to v3." Adoption sits at 12% after two weeks. They pivot the messaging: "Your assistant now listens to voice memos and pulls out your to-dos while you drive. No more forgetting brilliant ideas in the car." They add explicit opt-in: "Want me to enable this? Reply yes, not now, or ask me weekly." Adoption jumps to 67% in a week. The difference wasn't the feature—it was the framing and the respect for user choice.

---

## **What You Now Know**

- How to structure upgrade detection asynchronously using cost-appropriate models that don't block user interactions
- How to compose messages that lead with user capabilities ("what you can DO") rather than technical changes ("what we changed")
- How to request and obtain explicit consent with clear, respectful options before executing multi-step upgrade flows
- How the full upgrade flow sequence prevents the "new code, old behavior" drift that plagues partial updates

---

## **Looking Ahead**

In the next chapter, we'll explore when the full machinery of GBrain is worth deploying versus when simpler patterns suffice—the art of matching tool complexity to problem complexity.

---

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/guides/sub-agent-routing.md
- https://github.com/garrytan/gbrain/blob/main/docs/guides/upgrades-auto-update.md