Moving gbrain into production means your agent joins the real world of timezones, sleep schedules, and notification fatigue. Before we dive into specific patterns, consider this: a system that never sleeps can be as much a liability as an asset if it doesn't know when to stay quiet.

---

## **The 3 AM Notification That Cost a Deal**

Marcus had spent three weeks nurturing a lead in Singapore. His AI assistant was supposed to be helpful, monitoring emails, suggesting follow-ups, keeping his pipeline warm. Instead, at 3:17 AM local time, his prospect's phone buzzed with an automated "quick update" about a minor schema sync. The prospect disabled notifications. The deal went cold.

Meanwhile, across the hall, Priya's agent had just detected a critical upgrade to her knowledge base. It fired off a message listing seventeen changed files, three dependency updates, and a breaking change to the vector store API. She stared at the wall of text, felt a flicker of anxiety, and typed: "not now." She stayed on the old version for six more months, missing features that would have saved her hours each week.

Both failures came from the same blind spot: treating agent communication like system logs rather than human conversation. The fix isn't technical. It's psychological—though it builds on the same async detection patterns you just used for health checks, applied now to human attention rather than system boundaries.

## **Act 1: The Upgrade Message as Sales Pitch**

### **What You Can DO, Not What Changed**

Imagine your favorite fitness app announced a gym renovation by emailing you the brand names of their new treadmills. You'd delete it. Now imagine they said: *"You can now train twice as fast with AI-powered form correction."* Same renovation, different framing.

Your agent's upgrade message works the same way. When gbrain detects a new version, the temptation is to report what changed under the hood: the files, the migrations, the schema diffs. Resist this. Users upgrade when they see what they can **accomplish**, rather than what you modified.

The pattern is simple: lead with capability bullets that answer "What's in it for me?" The docs put it plainly: "Sell the upgrade. The user should feel 'hell yeah, I want that.'" Lead with what they can DO now that they couldn't before, rather than what files changed.

Here's the difference:

| The Wrong Way | The Right Way |
|-------------|-------------|
| "Updated 12 skill files, migrated vector DB schema, bumped version to 0.5.0" | "Your brain never falls behind. Live sync keeps your knowledge current automatically." |
| "Breaking change: deprecated legacy query format" | "New verification runbook catches silent failures before they bite you" |
| "Patch notes attached" | "Want me to upgrade? I'll update everything and refresh my playbook." |

**⚠️ Watch Out For:**
- **Version number syndrome:** Starting your message with "GBrain v0.5.0 is available" buries the lead. Mention the version parenthetically, not as the headline.
- **The silent killer:** Users who run `gbrain upgrade` but skip post-upgrade steps end up with "new code running with old agent behavior." The message must promise to handle the full flow: re-reading skills, running migrations, syncing schema. That way, the user knows saying "yes" actually completes the job.

### **Permission, Not Notification**

The best upgrade message doesn't just inform. It negotiates. After selling the benefits, present explicit options: **yes** to upgrade now, **not now** to skip, **weekly** to check less often, or **stop** to disable entirely. That respects attention as a finite resource and turns a broadcast into a conversation.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing the flow from async update detection through benefit-focused messaging to user permission prompt, then branching to full upgrade flow or deferral" width="600" height="350" /></p>

## **Act 2: Timezone-Aware Quiet Hours**

### **The Doorman Who Knows Your Schedule**

Picture a hotel doorman who sees your "Do Not Disturb" sign and holds all deliveries until morning. He doesn't knock at 3 AM with a package. He doesn't assume everyone in the building sleeps on UTC. He knows *your* timezone, *your* window, and acts accordingly.

**Quiet hours timezone gating** acts as that doorman for your agent. It pauses non-urgent notifications during each user's configured nighttime window, evaluated in their local timezone, not some global server time.

The mechanism is straightforward:
1. User configures their timezone and quiet hours (say, 10 PM to 7 AM)
2. System receives a notification trigger
3. System calculates current local time for that specific recipient
4. If local time falls within the window, hold the action
5. If outside, proceed immediately

That sounds obvious until you realize most automation systems treat the world as one 24-hour continuum. A signal fires at 2 PM UTC, and everyone gets pinged immediately, whether it's breakfast in New York or midnight in Tokyo.

**⚠️ Watch Out For:**
- **The emergency override myth:** Quiet hours don't block critical alerts. The system distinguishes between "hey, there's an upgrade available" and "your production database is on fire." One waits; the other breaks through.
- **Timezone amnesia:** Storing quiet hours without timezone context is worse than useless. "10 PM" means nothing without knowing *whose* 10 PM. Always store timezone + window together, or you'll wake people up at precisely the wrong moment.

## **Act 3: Cost-Optimized Detection**

### **The Async Signal Detector**

Here's where prior lessons about model selection click into place. Remember: **Sonnet, not Opus, for detection.** The docs warn this is "the most common mistake." Detection is pattern matching (checking if an update exists), not deep reasoning. Running this on Opus costs 5-10x more for zero benefit.

But there's a subtler trap: **blocking the main thread.** If your update detector runs synchronously, the user waits 30-120 seconds for every response. Entity detection blocks the reply. Instead, spawn the signal detector as an async sub-agent. The user sees a response immediately; the check happens in the background.

The cost math is multiplicative. Detection runs on every message. At 50 messages per day, using Opus instead of Sonnet costs an extra $100+ per month for a task that requires no reasoning at all.

## **The Real-World Picture**

Your personal mini-AGI just finished a 6-hour deep work session with you. It's 9:47 PM your time. A new skillpack version drops with features that would streamline tomorrow's research. The async detector, running on Sonnet and costing fractions of a penny, flags the update. The quiet hours gate checks your timezone, sees you're within your wind-down window, and holds the notification. At 7:15 AM, you get a message: *"You can now synthesize research across 50 documents simultaneously. Want me to upgrade?"* You reply **yes**. The agent executes the full flow (binary update, skill re-reading, migration execution, schema sync) and by 7:18 AM, you're running the new version with zero friction and zero sleep interrupted.

## **What You Now Know**

- How to compose upgrade messages that lead with user capabilities rather than technical changes, creating "hell yeah" momentum instead of version-number inertia
- How quiet hours timezone gating prevents notification fatigue by evaluating each user's local time before delivering non-urgent messages
- Why async signal detection on cost-appropriate models (Sonnet, not Opus) keeps systems responsive without ballooning API costs
- How the full upgrade flow (re-reading skills, running migrations, syncing schema) ensures new code actually produces new agent behavior

## **Looking Ahead**

Next up is **Disaster Recovery: When Things Go Wrong**, where we'll cover what happens when things don't go according to plan: how to recover gracefully when migrations fail, when integrations drop, or when your agent encounters a situation no skillpack anticipated.

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/guides/sub-agent-routing.md (Tricky Spots, How to Verify)
- https://github.com/garrytan/gbrain/blob/main/docs/guides/upgrades-auto-update.md (What the User Gets, The Upgrade Message, The Full Upgrade Flow, Migration Files, How to Verify)