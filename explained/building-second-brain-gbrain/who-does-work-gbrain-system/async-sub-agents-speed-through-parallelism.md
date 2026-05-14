---
We've spent the last module ensuring your brain can evolve without losing its mind—migrating data gracefully as code changes beneath it. Now we shift focus to a different challenge: when the work actually happens, how do you organize the labor so your users never feel the strain?

## **The 120-Second Silence That Kills Conversations**

You send a message. The typing indicator blinks. Then... nothing.

Thirty seconds pass. A minute. You just saw how Sonnet-class models handle async update detection during migrations without blocking the flow. Here, we're facing the opposite problem: ninety seconds of dead air while somewhere in the cloud, an expensive AI model is scanning your message for mentions of "Sarah from accounting" or "that Denver client." You're staring at a frozen screen, wondering if the connection dropped, if the service is down, if you should refresh.

When the response finally arrives, you don't feel relief. You feel annoyance. The spell is broken. And if this happens on every single message, you'll stop using the tool entirely.

That's synchronous execution in action. Every time you speak to your AI assistant, it freezes you out for 30-120 seconds while it checks for entities, signals, and patterns. The docs put it bluntly: "If the signal detector runs synchronously, the user waits 30-120 seconds for every message while entity detection completes."

A better way exists. Actually, two better ways work together: **asynchronous sub-agents** that run in the background, and **model tiering** that puts cheap, fast models on grunt work while reserving expensive reasoning engines for judgment calls.

Here's how to keep your users engaged while your system does the heavy lifting behind the curtain.

---

## **Act 1: The Restaurant That Forgot How to Wait**

Imagine a restaurant where the waiter takes your order, then stands at your table silently until the kitchen finishes cooking. No water refill. No bread basket. No "it'll be right out." Just awkward eye contact for forty minutes while you wonder if you should leave.

That's synchronous execution. The "waiter" (your main agent) can't do anything else until the "kitchen" (your sub-agent) finishes.

Now picture a real restaurant: order taken, bread arrives immediately, water stays full, and your food comes when it's ready. The kitchen works in parallel. You perceive instant service even though your meal still takes twenty minutes to prepare.

**Asynchronous sub-agents** work the same way. When a message arrives, the main agent spawns a detection sub-agent with a "fire and forget" call. It immediately responds to the user in under five seconds. The sub-agent finishes its work in the background.

<p align="center"><img src="PLACEHOLDER" alt="Diagram comparing synchronous vs async execution: left side shows main thread blocked 30-120 seconds waiting for sub-agent; right side shows main thread responding immediately in 5 seconds while sub-agent processes in parallel background thread" width="600" height="350" /></p>

### Why "Fire and Forget" Changes Everything

The key insight from the docs: "Spawn and forget. The user sees a response immediately." That isn't just feel-good UX. It touches economics and survival.

When detection runs synchronously:
- Users abandon sessions after repeated freezes
- Every message triggers expensive blocking operations
- You burn through API credits while users stare at loading spinners

When detection runs asynchronously:
- The conversation flows naturally
- Sub-agents process using **Sonnet-class models** at $3/MTok instead of **Opus-class** at $15/MTok
- Costs drop 50-80% even as you run detection on every single message

**⚠️ Watch Out For:**
- **Thinking you need the response before replying.** The sub-agent's result can update state, trigger follow-ups, or enrich the next turn, you don't need it for the immediate acknowledgment.
- **Assuming async means "eventually consistent" in a bad way.** The user gets immediate value; the background processing adds additional value without blocking the core experience.

---

## **Act 2: The Triage Nurse and the Specialist**

Here's where it gets clever. Not only do we run sub-agents asynchronously, we also run them on cheaper, faster models.

Think of a hospital emergency room. The triage nurse checks your vitals, asks about symptoms, and routes you to the right department. This takes five minutes. The specialist doctor then spends their expensive time on cases that actually need their expertise.

Now imagine if the specialist doctor did triage. Every patient, no matter how minor, gets thirty minutes with a top cardiologist just to check their blood pressure. The waiting room backs up. Costs explode. Important cases get lost in the noise.

The docs warn specifically: "The most common mistake is running entity detection on Opus. Detection is pattern matching, not deep reasoning. Sonnet is 5-10x cheaper and fast enough."

| Task | Right Model | Wrong Model | Cost Impact |
|------|-------------|-------------|-------------|
| Entity detection, signal matching, pattern recognition | Sonnet ($3/MTok) | Opus ($15/MTok) | **$0.60-1.00/day** vs **$3-5/day** |
| Complex reasoning, judgment calls, nuanced synthesis | Opus ($15/MTok) | Sonnet ($3/MTok) | Quality degradation |
| Main conversation thread | Opus | Sonnet | Context loss, poor UX |

**Separate data collection from LLM judgment**: Use Sonnet-class models for the "triage" work, scanning messages, extracting entities, checking for signals. Reserve Opus-class models for the main session where reasoning quality actually matters.

### The Multiplicative Cost Trap

The docs emphasize: "Cost optimization is multiplicative." Entity detection runs on every single message. If you're processing 50 messages per day, the wrong model choice isn't a one-time mistake, it's a daily hemorrhage.

Run the math: Opus detection at $15/MTok across 50 messages/day equals $3-5 daily, or $90-150 monthly. Sonnet detection at $3/MTok brings that to $0.60-1.00 daily, or $18-30 monthly. That's a $100+ monthly difference for functionality that actually works *better* when it's faster and lighter.

<p align="center"><img src="PLACEHOLDER" alt="Data flow diagram showing: user message → main agent spawns async Sonnet sub-agent for detection → main agent responds immediately with Opus → Sonnet sub-agent completes background processing and updates state separately" width="600" height="350" /></p>

**⚠️ Watch Out For:**
- **Thinking detection requires "smart" models.** Detection is pattern matching, looking for "Sarah" or "Q3 budget" or "follow-up needed." Sonnet handles this beautifully; Opus is overkill.
- **Believing synchronous is "simpler."** The complexity of managing async state is far less painful than explaining to users why every message takes two minutes.

---

## **Act 3: How the Pipeline Actually Flows**

Putting it together, here's what happens when a user sends a message:

1. **Message arrives** at the main agent (running on Opus for quality reasoning)
2. **Main agent spawns** a signal detector sub-agent on Sonnet asynchronously, no waiting
3. **Main agent responds** to the user in under 5 seconds with acknowledgment or initial thoughts
4. **Sub-agent scans** the message for entities, patterns, and signals in the background
5. **Sub-agent completes** and updates state, creates brain pages, or flags items for follow-up
6. **Next interaction** benefits from the enriched context without ever having blocked the conversation

The user experiences a fluid conversation. The system experiences parallel processing. Your API bill experiences relief.

Cheap async detection feeding into expensive synchronous reasoning enables **gbrain** systems to feel responsive while actually doing *more* work behind the scenes, not less.

---

## **The Real-World Picture**

You're building a client relationship manager that processes emails, calendar invites, and Slack mentions. Without async sub-agents, every incoming message triggers a 45-second freeze while the system checks if "Acme Corp" is a new lead, an existing client, or a vendor. Your sales team stops using it after day three.

With async sub-agents on Sonnet, they get instant acknowledgments like "Noted, checking if Acme is in our system." A background process categorizes the entity and surfaces relevant history before their next message. The system feels psychic. The bill stays sane.

---

## **What You Now Know**

- How **asynchronous sub-agent spawning** eliminates user-facing latency by responding immediately while processing continues in the background
- Why **Sonnet-class models** are the right choice for detection tasks, saving 80% on costs compared to running pattern-matching on Opus
- How **separating data collection from judgment** creates a tiered system where cheap models filter noise and expensive models focus on reasoning
- That entity detection runs on every message, making model choice a **multiplicative cost decision**, not a one-time optimization
- How to verify async execution by checking that responses arrive in under 5 seconds, not 30-120 seconds

---

## **Looking Ahead**

Now that you understand *how* to run sub-agents asynchronously, the next question is *which model* to choose for each task. In **Model Selection: Sonnet for Detection, Opus for Judgment**, we'll map specific cognitive tasks to specific model classes, and build a decision framework for routing that saves money without sacrificing quality.

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/guides/sub-agent-routing.md (Tricky Spots, How to Verify)