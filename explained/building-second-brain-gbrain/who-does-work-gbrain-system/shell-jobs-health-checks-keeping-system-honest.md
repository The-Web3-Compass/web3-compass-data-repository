## **The Airport Security Problem**

You're rushing through LAX with a boarding pass burning a hole in your pocket. You've got your laptop, your liquids bag, your ID. You approach the TSA checkpoint and pull out your passport *and* your driver's license, holding them both up expectantly.

The agent stops you. "Pick one," they say. "Passport OR license. Never both."

You shrug, pick the passport, and start to walk through—only to realize your carry-on is a soft duffel bag, not a TSA-approved hard case. Another stop. Then they notice your shampoo bottle isn't clear. Another stop. Then they scan your boarding pass and realize you're not actually ticketed for this flight—you just walked in off the street.

This cascade of rejections isn't bureaucracy for bureaucracy's sake. It's a **security boundary** that catches problems before they become 30,000-foot emergencies.

Last time you saw how to use a security camera for routine detection and reserve the $500/hour forensic detective for deep judgment. Your gbrain system faces the exact same problem. When you ask it to run shell jobs (deterministic scripts that fetch data, refresh tokens, or scrape websites), you're essentially handing a boarding pass to a process that can touch your filesystem, your network, your secrets. The system needs to be just as paranoid as airport security. It validates everything upfront: one valid command format, proper containers, clear labels, and verified credentials.

Here's how gbrain keeps the bad stuff from getting to the gate.

---

## **Act 1: The Validation Gauntlet**

### **One ID, Please**

When you submit a shell job, you're describing how to spawn a process. The first rule is strict: **you must specify exactly one of `cmd` or `argv`**, never both, never neither.

You can think of `cmd` as giving directions "past the old bakery"—it allows shell interpolation, variables, and the whole expressive power of your shell. `argv` is more like GPS coordinates: precise, structured, and literal.

The validator enforces mutual exclusion between these two. Try to use both, and you get a hard stop. Leave both out, and you get the same. This isn't pedantry. It prevents ambiguity about how your command gets interpreted. When security matters, ambiguity is the enemy.

### **Absolute Paths Only**

Every shell job needs a **working directory** specified as an absolute path starting with `/`. No relative paths, no "just use whatever directory I'm in," no assumptions about context.

Imagine a surgeon asking for "that scalpel over there" instead of specifying exactly which instrument from exactly which tray. Relative paths are fragile. They change based on where the worker happens to be running. Absolute paths are invariant. The system demands this precision because shell jobs often run unattended, triggered by cron schedules or external events. There's no human nearby to course-correct if the context shifts.

### **Strings, Nothing But Strings**

Environment variables in shell jobs must be **string values only**. Pass a number like `3` instead of `"3"`, and the validator rejects it. Pass a boolean `true` instead of the string `"true"`, same result.

This constraint prevents a whole class of subtle bugs where type coercion goes sideways. JSON makes it easy to casually toss in a number. Shell environments make no such promises. They expect strings, and anything else risks unexpected behavior or injection vulnerabilities.

---

## **Act 2: Who's Allowed at the Gate?**

### **The MCP Boundary**

Shell jobs have strict access controls. **They cannot be submitted over MCP connections.** By design, they're CLI-only.

MCP (Model Context Protocol) is how remote agents and AI assistants connect to your gbrain. It works well for querying knowledge, but it also represents a potential attack vector. An external system could ask your computer to run arbitrary shell commands. The architects of gbrain looked at this and said: absolutely not.

If an MCP client tries to submit a shell job, it hits a hard permission denial. This is like the difference between asking a librarian where the books are and commanding the library's furnace to turn on. Information requests are one thing; code execution requires a different trust level entirely.

### **The Trust Token**

Even when submitting from the CLI, some contexts require an explicit opt-in. The system checks whether the submitter has **trusted privileges**—either running from a CLI context directly or explicitly passing the `allowProtectedSubmit` flag.

The result is a two-tier trust model. Routine operations flow through easily. Sensitive operations (the kind that spawn processes on your machine) require either direct terminal access or explicit acknowledgment that you understand what you're doing.

The documentation mentions that CLI and `submit_job` handle this automatically. The protection is there by default, invisible when you're operating normally, but actively blocking when something sketchy tries to slip through.

---

## **Act 3: Health Checks That Don't Slow You Down**

Shell jobs get validated at submission time. Health checks catch problems even earlier, when configurations drift, integrations fall behind, or your multi-source brain setup starts leaking knowledge where it shouldn't.

### **The Triage Nurse Pattern**

In the lesson on Model Selection, you learned to use **Sonnet for detection, Opus for judgment**. Health checks extend this philosophy into continuous monitoring.

A triage nurse in an emergency room takes your vitals quickly with basic equipment: a blood pressure cuff, thermometer, and pulse oximeter. These checks are fast, cheap, and happen to every patient. Only when something looks abnormal do they call in the specialist for expensive deep analysis.

Health verification should use fast, cheap pattern-matching that runs asynchronously on every message. Reserve expensive deep reasoning only when issues are detected.

The Integration Health Check DSL lets you define declarative rules that spawn lightweight **signal detectors** using cost-effective models. These run without blocking your main thread. You never wait 30-120 seconds for a response while the system performs surgery on itself.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing async health check flow: message arrives → signal detector runs on Sonnet (cheap, async) → if anomaly detected, escalate to Opus (expensive, permission-gated) → user approves → remediation executes" width="600" height="350" /></p>

When anomalies surface (available updates, sync failures, configuration drift), the system presents findings to you with specific explanations. It waits for explicit permission before proceeding. Only then does it trigger remediation workflows using heavy reasoning models, and only after approval.

**⚠️ Watch Out For:**
- **Using Opus for simple pattern detection.** It's tempting to have the smartest model handle everything, but running deep reasoning on every health check can cost $100+ more per month than using Sonnet-class models for detection. Detection is pattern-matching; judgment is reasoning. Match the tool to the task.
- **Running health checks synchronously.** If your user is waiting for a response while the system validates itself, you've misunderstood the architecture. Health checks should be fire-and-forget background processes that surface issues when found, not gatekeepers that block every interaction.

---

## **Act 4: Auditing Multi-Source Brains**

As discussed in the parallelism lessons, gbrain supports **multi-source configurations** where a single database holds multiple knowledge repos. Each source has its own namespace, sync state, and federation policy.

Health checks audit these boundaries to prevent **cross-contamination**. You might have YC Media content that should never leak into searches for your personal essays. Or you might have a unified wiki and gstack checkout that *should* recall across each other. The health checker validates these isolation boundaries match your intent.

The system walks a resolution priority list to determine which source applies where. Explicit flags beat environment variables, which beat dotfiles, which beat path-matching, which beat defaults. Health checks verify this resolution chain produces the results you expect. They catch cases where sources accidentally federate (or accidentally stay isolated) contrary to your design.

---

## **The Real-World Picture**

Imagine you're running a content pipeline that scrapes portfolio news from YC companies and ingests your personal essay drafts. Both feed into the same gbrain backend. Without health checks, a configuration drift could silently federate the YC source into your personal writing searches. Portfolio company mentions might surface when you're searching for your own creative ideas. Worse, a misconfigured shell job submitted via an MCP connection could expose your local filesystem to a compromised agent session. 

The validation constraints and health check DSL work together as defense-in-depth. Strict submission-time validation blocks the dangerous request. Continuous auditing catches the source federation misconfiguration before it pollutes your creative workflow.

---

## **What You Now Know**

- How shell jobs enforce **mutual exclusion** between `cmd` and `argv`, **absolute path requirements** for working directories, and **string-only constraints** for environment variables at the validation boundary
- Why **MCP clients are blocked by design** from submitting shell jobs, and how the **trust token system** (`allowProtectedSubmit`) gates privileged operations
- How to design **asynchronous health checks** that use cost-effective models for detection and expensive models only for judgment, never blocking the main thread
- How the **Integration Health Check DSL** audits multi-source brain configurations to prevent unintended knowledge leakage between logical repositories

---

## **Looking Ahead**

Now that you understand how to validate shell jobs and audit your system's health without slowing it down, you're ready to compose these primitives into something more powerful. In **Building Your Personal Mini-AGI: The Skillpack Pattern**, we'll explore how to bundle these capabilities—health checks, shell jobs, and intelligent routing—into reusable skillpacks that turn your gbrain from a knowledge store into an autonomous agent.

---

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/guides/minions-shell-jobs.md
- https://github.com/garrytan/gbrain/blob/main/docs/guides/multi-source-brains.md
- https://github.com/garrytan/gbrain/blob/main/docs/guides/operational-disciplines.md