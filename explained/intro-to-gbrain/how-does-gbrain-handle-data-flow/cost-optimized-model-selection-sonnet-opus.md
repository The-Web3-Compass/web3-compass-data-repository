---
## **The $100 Mistake Hiding in Every Message**

Your agent just got its first hundred users. The product team is thrilled. You're celebrating until the AWS bill arrives—and the API costs have *quadrupled* overnight.

You trace the problem: every incoming message triggers **entity detection**, a pattern-matching task that runs on Claude Opus at $15 per million tokens. Your agent was designed for quality, so you used the smartest model for everything. But detection isn't reasoning—it's just looking for names, dates, and trigger phrases. You're running a forensic investigator's brain to do a security camera's job, and it's costing you $3-5 per day. That's $100+ per month just for detection, multiplied across every high-frequency operation.

There's a better way. And it starts with understanding that **not every task deserves your best model**.

---

## **Act 1: The Triage Principle**

### **The Hospital Analogy**

Picture a busy emergency room. Patients arrive constantly—some with paper cuts, some with chest pain. The hospital doesn't send every person straight to the cardiac surgeon. Instead, a triage nurse checks vitals quickly, sorts cases by urgency, and only escalates the complex cases to specialists.

This is exactly how your agent should work.

The **signal detector** is your triage nurse. Its job is pattern matching: "Does this message contain a person's name? A company? A date that looks like a deadline?" These are quick checks. They don't require deep reasoning about *why* something matters—just *whether* it matches a pattern.

Reserve your **expensive reasoning model** (Opus) for the specialist work: the judgment calls, the nuanced analysis, the synthesis that actually requires deep thinking. This separation—**using Sonnet for detection, Opus for reasoning**—is the foundation of cost-efficient agent architecture.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing a message entering at top, splitting left to Sonnet detector (async, cheap) and right to main agent Opus (synchronous, expensive), with detector feeding results back to main agent only when signals found" width="600" height="350" /></p>

### **Why Detection Isn't Reasoning**

According to the GBrain routing guide: "Detection is pattern matching, not deep reasoning. Sonnet is 5-10x cheaper and fast enough. Reserve Opus for the main session where reasoning quality matters."

Think about it: recognizing that "Sarah Chen" is a person requires matching a pattern against known entity types. It doesn't require understanding Sarah's motivations, her relationship to the user, or whether her mention is significant. That's the job of your main agent, running on Opus, which you invoke *only after* the detector has flagged something worth investigating.

**⚠️ Watch Out For:**
- **Using Opus for detection tasks.** It's overkill for pattern matching and silently burns 5-10x more money.
- **Assuming expensive equals better regardless of context.** A limousine gets you to the grocery store, but a taxi costs 5x less per ride—and over a month, that multiplies into real money.

---

## **Act 2: The Async Handoff**

### **Don't Make Users Wait**

Here's where architecture meets user experience. If your signal detector runs synchronously—meaning the main thread *waits* for detection to complete before responding—your users will stare at a loading spinner for 30-120 seconds on every message. They'll think your agent is broken.

Instead, **spawn the detector asynchronously**. Fire it off in the background and respond to the user immediately. The detector does its pattern matching on Sonnet while the main thread, running Opus, handles the conversation. If the detector finds something, it feeds that signal back to the main agent for deeper analysis on the next interaction.

The routing docs are explicit: "If the signal detector runs synchronously, the user waits 30-120 seconds for every message while entity detection completes. Spawn and forget. The user sees a response immediately."

<p align="center"><img src="PLACEHOLDER" alt="Timeline diagram comparing synchronous (user waits 45s) vs asynchronous (user gets response in 3s, detection continues in background)" width="600" height="350" /></p>

### **The Flow**

When a message arrives:

1. The main thread (Opus) acknowledges the user in under 5 seconds.
2. A **sub-agent** configured with Sonnet spawns asynchronously to scan for entities and patterns.
3. The detector runs its pattern-matching pass in the background.
4. If signals are detected, the main agent uses Opus for deep reasoning on the next turn.
5. Costs stay low because detection—the operation that runs on *every* message—used the cheap model.

**⚠️ Watch Out For:**
- **Running detection synchronously.** This blocks users for 30-120 seconds when they could have a response in under 5.
- **Forgetting to verify async execution.** Measure response time: if it's over 5 seconds, your detector is blocking the main thread.

---

## **Act 3: The Multiplicative Trap**

### **Why Per-Message Costs Explode**

Here's the math that surprises every developer. Entity detection runs on *every single message*. If you're processing 50 messages per day, that's 1,500 detection passes per month. At Opus rates ($15/MTok), that's $3-5 per day. At Sonnet rates ($3/MTok), it's $0.60-1.00 per day.

The difference isn't additive. It's **multiplicative**.

| Model | Rate | Daily Cost (50 msgs) | Monthly Cost | Annual Cost |
|-------|------|---------------------|--------------|-------------|
| Opus | $15/MTok | ~$4.00 | ~$120 | ~$1,440 |
| Sonnet | $3/MTok | ~$0.80 | ~$24 | ~$288 |

That's a $100+ monthly difference—per detection task—just from choosing the right model. And most agents have multiple detection tasks running.

The routing guide puts it bluntly: "If you use Opus at $15/MTok for detection across 50 messages/day, that's $3-5/day just for detection. Over a month, the wrong model choice costs $100+ more than necessary."

<p align="center"><img src="PLACEHOLDER" alt="Bar chart comparing monthly costs: Opus at $120 vs Sonnet at $24 for detection operations" width="600" height="350" /></p>

### **Verification Checklist**

After implementing this pattern, verify it actually worked:

1. **Check the model.** Send a message and verify the sub-agent spawned on Sonnet-class, not Opus. Check logs or configuration.
2. **Measure cost reduction.** Compare total API costs after a day of running with sub-agent routing. You should see 50-80% reduction.
3. **Time the response.** Messages should arrive in under 5 seconds. If it's 30+, your detector is synchronous.

---

## **The Real-World Picture**

Imagine a customer support agent that processes 200 tickets daily. Without model separation, every ticket triggers entity detection on Opus—burning through $12-16 per day just for pattern matching. The CTO assumes AI costs are unavoidable overhead. Then an engineer implements Sonnet-based detection with async sub-agents. Response times drop from 45 seconds to 3 seconds. The monthly API bill falls from $480 to under $100. The same agent now handles 50% more volume without a cost increase. The "expensive AI" narrative flips to "efficient infrastructure"—all because someone asked whether every task actually needed a reasoning model, or just a fast pattern matcher.

---

## **What You Now Know**

- **How to separate concerns** by using Sonnet for pattern-matching detection and reserving Opus for deep reasoning.
- **How to spawn sub-agents asynchronously** so detection runs in the background without blocking user responses.
- **How per-message costs multiply** across daily volume, turning a small per-operation savings into $100+ monthly differences.
- **How to verify your implementation** by checking model selection, measuring cost reduction, and timing responses.

---

## **Looking Ahead**

Now that your data flows efficiently and cost-effectively, what happens when your schema needs to change or your knowledge base grows stale? In the next lesson—**Sync, Migration, and Schema Evolution**—we'll explore how GBrain keeps your agent's understanding current without manual intervention.