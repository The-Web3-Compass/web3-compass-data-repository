---
## **The Security Camera and the Detective**

Your front door gets fifty visitors a day. Some are friends. Some are delivery drivers. Some are people you definitely don't want inside.

Last time you learned how separating data collection from judgment creates a tiered system where Sonnet-class models filter noise and expensive models focus on reasoning. That same principle shows up here as a choice between two very different gatekeepers. You could hire a forensic detective to stand at your door. They'd examine shoes, analyze gait, and write psychological profiles before deciding whether to open the door. The detective is brilliant. The detective costs $500 an hour.

Or you could install a security camera with motion detection. It recognizes patterns (uniforms, packages, familiar faces) in milliseconds. It costs $50 a month.

That's the choice you're making every time your gbrain system processes a message. Most developers, without realizing it, are hiring the detective to watch the door.

## **Act 1: The Wrong Model for the Job**

Picture this: A message arrives in your system. Maybe it's a calendar invite, an email, or a Slack notification. Your gbrain needs to decide if this message contains an *entity* worth tracking: a person, a company, a project, a deadline.

So you spin up your smartest model. Opus. The reasoning powerhouse. It reads the message, ponders the implications, weighs the context, and eventually returns a judgment: "Yes, this mentions Acme Corp."

That takes 30 to 120 seconds.

Meanwhile, your user stares at a loading spinner. You just spent $0.10 to learn that an email contains a company name.

The docs are explicit about this: **"Detection is pattern matching, not deep reasoning."** When you use Opus for detection, you pay for philosophical contemplation when you only needed pattern recognition.

<p align="center"><img src="PLACEHOLDER" alt="Diagram comparing synchronous Opus detection (slow, expensive, blocking) versus async Sonnet detection (fast, cheap, non-blocking) with cost and time metrics" width="600" height="350" /></p>

### **Why Sonnet Wins at Detection**

**Sonnet** is Anthropic's middle-tier model: faster than Opus, dramatically cheaper, and more than capable of pattern-matching tasks. According to the docs, Sonnet runs **5-10x cheaper** than Opus while being "fast enough" for detection work.

The distinction matters:
- **Opus** ($15 per million tokens): Deep reasoning, complex analysis, judgment calls
- **Sonnet** ($3 per million tokens): Pattern matching, entity extraction, classification

When your detection sub-agent runs on Sonnet, the same entity detection finishes in under 5 seconds instead of 30-120. The user sees immediate responses. Your wallet breathes easier.

### **⚠️ Watch Out For:**

- **Using Opus for detection tasks** — The docs call this "the most common mistake." Pattern matching doesn't need reasoning depth. You're burning money for zero quality gain.
- **Running detection synchronously** — If your signal detector blocks the main thread, users wait 30-120 seconds *per message*. Spawn it asynchronously and "forget" it, letting the main session respond immediately.

## **Act 2: The Multiplicative Trap**

Here's where this gets expensive in a way that sneaks up on you.

You might think: "What's the difference between $3 and $15? It's twelve bucks. Who cares?"

But detection doesn't run once. It runs on **every single message**.

Let's do the math from the docs. At 50 messages per day:
- **Opus at $15/MTok**: $3-5 per day just for detection
- **Sonnet at $3/MTok**: $0.60-1.00 per day for the same work

That's a 5x daily difference. Multiply by 30 days. The wrong model choice costs you **$100+ per month** in unnecessary API spend.

The docs call this **"multiplicative" cost optimization**. It separates systems that scale gracefully from ones that silently bleed money. When an operation runs on every message, every cent of savings compounds into dollars. Every dollar compounds into hundreds.

| Model | Cost per MTok | Daily Cost (50 msgs) | Monthly Cost | Use Case |
|-------|---------------|----------------------|--------------|----------|
| Opus | $15 | $3-5 | $90-150 | Deep reasoning, main session |
| Sonnet | $3 | $0.60-1.00 | $18-30 | Pattern matching, detection |

The lesson goes beyond "cheaper is better." You need to **right-size your intelligence**. Reserve Opus for where it matters: the main session where reasoning quality determines user experience. Push detection, classification, and filtering to Sonnet, where speed and cost efficiency dominate.

## **Act 3: Building the Pipeline**

So how does this actually work in practice?

You already learned about async sub-agents in *Async Sub-Agents: Speed Through Parallelism*. Now we're adding model selection to that pattern.

The pipeline looks like this:

1. **Message arrives** — A signal hits your system (email, calendar event, tweet)
2. **Spawn detector asynchronously** — Fire up a sub-agent configured with Sonnet, hand it the detection task, and immediately return control to the main thread
3. **Main session continues** — Your Opus-powered main session responds to the user without waiting
4. **Detector reports back** — When Sonnet finishes pattern matching (seconds later), it updates entity pages or triggers follow-up actions

The docs emphasize: **"Spawn and forget. The user sees a response immediately."**

That combination uses two optimizations: the right model for the task, and the right execution model (async) for responsiveness. Either one alone helps. Together, they transform your system from a sluggish resource hog into a snappy, cost-efficient machine.

<p align="center"><img src="PLACEHOLDER" alt="Flow diagram showing message arriving, async Sonnet detector spawning in parallel with main Opus session processing, both completing independently with different timing" width="600" height="350" /></p>

### **⚠️ Watch Out For:**

- **Assuming expensive means better** — Opus *is* better at reasoning. But "better" is task-dependent. For pattern matching, Sonnet's accuracy is virtually identical at one-fifth the cost.
- **Thinking cost savings are linear** — They're not. They're multiplicative. Every per-message operation scales with volume. What looks like pocket change at low volume becomes real money at scale.

---

## **The Real-World Picture**

Imagine a customer support system processing 200 tickets daily. Each ticket needs entity detection (company names, product mentions, urgency signals) before routing to the right team. Using Opus synchronously adds two minutes to every response. It costs $12-20 per day in detection alone, or $360-600 monthly just to scan text for keywords. Switching to async Sonnet detection drops response time to under 5 seconds and cuts detection costs to $2.40-4

## **Looking Ahead**

In the next lesson, **Shell Jobs and Health Checks: Keeping the System Honest**, you'll learn how to monitor those async Sonnet detectors to ensure they actually complete their work instead of failing silently. Because "spawn and forget" only works if you have a reliable way to know when the system needs attention.