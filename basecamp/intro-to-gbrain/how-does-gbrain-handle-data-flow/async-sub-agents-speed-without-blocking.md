---
## **The Wait That Kills the Vibe**

You're at a trendy restaurant. The kind with exposed brick and a menu that's just a list of ingredients separated by em-dashes. Your server approaches, pen poised, and you order the seasonal tasting menu. Then they pull up a chair.

"I'm going to sit here while the kitchen prepares every course," they say, smiling. "We find it ensures quality."

You stare at them. Twenty minutes pass. Forty. The server just... sits there. Smiling. You can't ask for water. You can't flag down the manager. The restaurant's entire operation has frozen because your meal is being prepared.

This is exactly what happens when AI agents run every task synchronously. The user sends a message. The agent detects entities. Runs analysis. Checks for signals. Each operation blocks the next. Somewhere around second forty-five, the user closes the tab. You've lost them. Not because your agent was wrong—but because it was rude.

---

## **Act 1: The Spawn-and-Forget Revelation**

### **The Bread-and-Butter Pattern**

There's a better way. In fact, there's an obvious way, once you see it.

Think of the restaurant again—but this time, imagine how it actually works. Your server takes your order, immediately brings bread and water, and disappears. The kitchen fires up in parallel. You're engaged, attended to, *served*—while the real work happens out of sight. Your food arrives when it's ready, not a moment before, and you never felt abandoned.

**Asynchronous sub-agent execution** works the same magic. When a user sends a message, your main agent doesn't hang around waiting for entity detection to finish. It spawns a lightweight **sub-agent** to handle pattern-matching in the background, immediately returns a response, and keeps the conversation flowing. The user sees under-five-second responses while the heavy lifting happens in parallel.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing user message splitting into two paths: main agent responding immediately on one track, sub-agent processing in background on parallel track, with both converging on the brain database" width="600" height="350" /></p>

The technical term for this is "**spawn and forget**." The main session creates the sub-agent, hands off the work, and never waits for a return value. The sub-agent completes independently, updating state or triggering workflows when it finishes.

### **The Cost Multiplication Problem**

Here's where beginners bleed money without realizing it.

Entity detection runs on *every single message*. If you're processing fifty messages per day and using an **Opus-class model** at $15 per million tokens for detection, you're spending $3–5 daily just on pattern matching. That's $100+ per month on what is essentially keyword scanning.

The docs are unambiguous on this point: "Detection is pattern matching, not deep reasoning."

| What You're Doing | Wrong Model | Cost per Day | Right Model | Cost per Day |
|-------------------|-------------|--------------|-------------|--------------|
| Entity detection (pattern matching) | Opus ($15/MTok) | $3–5 | Sonnet ($3/MTok) | $0.60–1.00 |
| Deep reasoning, complex decisions | Sonnet | Unnecessary limitations | Opus | Appropriate spend |

**Sonnet-class models** at $3/MTok are five to ten times cheaper and fast enough for detection tasks. Reserve Opus for the main session where reasoning quality actually matters. Cost optimization isn't about cutting corners—it's about matching the tool to the job.

---

## **Act 2: The Signal-to-Brain Pipeline**

### **Triage at Scale**

Picture an emergency room. Patients arrive constantly—some with splinters, some with chest pain. The hospital doesn't stop treating the person with the splinter to run a full cardiac workup on everyone who walks in. Instead, a triage nurse performs rapid pattern matching: breathing rate, pain level, visible symptoms. Critical cases get escalated immediately. Stable patients wait their turn.

The **Signal-to-Brain Data Pipeline** is your triage system.

When a message arrives, the system spawns a **signal detector sub-agent** using a lightweight model. This detector scans for specific patterns, entities, or trigger signals while the main agent composes its response. If the detector finds something—a mention of an upgrade, a schema change request, a critical entity—it routes that signal to the brain for action. The main agent never stalls. The detection never blocks.

### **The Async Flow**

The sequence works like this:

1. User sends a message to the main agent
2. Main agent spawns a sub-agent asynchronously to handle entity detection
3. Main agent immediately begins generating its response
4. Sub-agent processes using Sonnet-class models for cost-efficient scanning
5. User receives response in under five seconds
6. Sub-agent completes independently, updating state or triggering follow-ups

The key insight? **Perceived responsiveness matters more than total processing time.** The user experiences a snappy conversation while sophisticated analysis happens behind the scenes.

<p align="center"><img src="PLACEHOLDER" alt="Timeline diagram showing synchronous path taking 90+ seconds versus asynchronous path showing 4-second user response with background processing continuing afterward" width="600" height="350" /></p>

**⚠️ Watch Out For:**

- **The Synchronous Trap:** If your responses are taking 30–120 seconds, your signal detector is running synchronously and blocking the main thread. Check your execution model—true async feels instant.
  
- **The Opus-for-Everything Habit:** Using expensive reasoning models for pattern matching is like hiring a brain surgeon to take your blood pressure. The docs warn that this mistake alone costs "$100+ more than necessary" over a month.

---

## **Act 3: Verification and Reality Checks**

### **How to Know You're Doing It Right**

The documentation provides three verification steps that tell you whether your async routing is actually working.

First, check the model. Send a test message and verify your sub-agent spawned on Sonnet-class, not Opus. The model field in your logs should confirm this.

Second, measure your response time. True async execution returns a response in under five seconds. If you're consistently seeing thirty-plus seconds, something is blocking.

Third, watch your costs. After running with proper sub-agent routing for a day, compare API costs against the previous synchronous day. You should see a 50–80% reduction in total spend.

### **The Real Architecture**

This pattern enables something powerful: continuous background enrichment without user-facing latency. Your main agent handles the conversation. Your sub-agents handle detection, entity extraction, signal routing, and state updates. Each operates at the appropriate cost tier and compute level.

The result is a system that feels alive—responsive, attentive, immediate—while performing sophisticated analysis on every interaction.

<p align="center"><img src="PLACEHOLDER" alt="Architecture diagram showing main agent thread on top with quick response path, sub-agent pool below handling various detection tasks asynchronously, both feeding into shared brain storage" width="600" height="350" /></p>

---

## **The Real-World Picture**

Imagine you're building a customer support agent that needs to check for upsell opportunities, security risks, and account changes in every conversation. Synchronous detection would turn a simple password reset into a ninety-second ordeal. With async sub-agents, the user gets "I've reset your password" in three seconds while a Sonnet-class detector scans for upgrade signals in the background. The sales team gets their lead. The security team gets their alert. The customer gets their fast response. Everyone wins, and your API bill dropped from $150 to $30 this month.

---

## **What You Now Know**

- How to spawn sub-agents asynchronously using the "spawn and forget" pattern to eliminate user-facing latency
- Why entity detection should use cost-optimized Sonnet-class models ($3/MTok) rather than expensive Opus-class models ($15/MTok)
- How to trace the signal-to-brain pipeline from incoming message through lightweight detection to downstream action
- How to verify proper async execution through response time measurements and daily cost tracking
- The multiplicative cost impact of model selection when detection runs on every message

---

## **Looking Ahead**

Now that you understand how to keep responses snappy with async sub-agents, the next question is: how do you decide which model to use for each task? In **Cost-Optimized Model Selection: Sonnet for Detection, Opus for Reasoning**, we'll dive into the decision framework for matching computational resources to cognitive requirements—ensuring you never waste money on overkill while preserving quality where it counts.

---

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/guides/sub-agent-routing.md (Tricky Spots, How to Verify)