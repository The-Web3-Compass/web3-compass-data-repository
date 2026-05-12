---
## **The Night Watch Nobody Signed Up For**

It's 3 AM. Your integration with the outside world stopped syncing six hours ago. Nobody knows. The system hums along happily, serving stale data, missing new signals, creating a slowly widening gap between reality and your brain's understanding of it. This is the horror of silent failure—things break not with a crash, but with a whisper.

Every complex system faces this. You build something beautiful: pipes that carry data from email, voice calls, social feeds, calendar events into your central brain. You celebrate the setup. Then you forget about it. Days pass. Weeks. Until one day you search for something that definitely happened and... it's not there. The sync broke. The tunnel collapsed. The credentials expired. And nobody was watching.

This is where **signal detection** enters the story—not as a luxury feature, but as the immune system your brain desperately needs. The trick isn't just detecting problems; it's doing it cheaply, continuously, and without slowing everything down. Let's unpack how.

## **Act 1: The Nutrition Label for Recipes**

Imagine picking up a cookbook where the ingredient list, prep time, and dietary tags were mixed into the cooking instructions. You'd have to read three paragraphs of prose before discovering the recipe requires shellfish you're allergic to. Chaos.

Integration recipes face the same problem. They need to declare things like version, dependencies, required secrets, and health check rules—but these declarations shouldn't clutter the actual setup instructions humans follow.

Enter **YAML frontmatter**—the practice of putting structured metadata between triple-dash delimiters at the very top of a recipe file, before the human-readable content begins. Think of it as the nutrition facts label on a food package: a machine-readable summary that sits above the actual content.

When your system parses a recipe, it scans for that opening delimiter, extracts everything until the closing delimiter, converts that YAML block into a structured data object, and returns both the metadata and the remaining content body separately. This separation is elegant: the metadata drives automation while the body guides humans through setup.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing a recipe file with the YAML frontmatter section highlighted at the top between triple-dash delimiters, with an arrow pointing to a structured metadata object on the left and the remaining content body on the right" width="600" height="350" /></p>

**⚠️ Watch Out For:**
- **Thinking frontmatter must exist in every file.** It doesn't. Some recipes are simple enough to skip it entirely.
- **Assuming syntax errors crash everything.** A robust parser should gracefully handle malformed frontmatter without bringing down the whole system.

## **Act 2: The Triage Nurse Pattern**

Now that recipes can declare their needs through frontmatter, we face a harder question: how do we verify integrations stay healthy without bankrupting ourselves or annoying users?

The naïve approach runs deep health analysis on every single check, using the most powerful reasoning models available, synchronously blocking everything until it completes. Users wait 30-120 seconds per message. Your API bill balloons to $100+ per month just for detection. This is like having a surgeon examine every patient who walks into the clinic for a routine checkup.

The smarter approach treats health verification like a triage nurse: quick, cheap pattern-matching that happens asynchronously while the main conversation flows uninterrupted. The docs excerpt doesn't cover the exact model names, but it emphasizes that detection is pattern matching, not deep reasoning—meaning you want fast, cost-effective models for the initial scan, reserving heavy reasoning only when anomalies are actually found.

This is the **Integration Health Check DSL**—a declarative syntax for writing rules that spawn lightweight **signal detectors**. These sub-agents run on cheaper, faster models, continuously monitoring for anomalies like available updates, sync failures, or configuration drift. When they spot something, they don't auto-fix it. Instead, they surface specific, benefit-focused findings to the user and wait for explicit permission before proceeding.

The flow works like this: First, define health indicators using lightweight pattern-matching rules. Configure signal detectors to run asynchronously without blocking the main thread. They continuously monitor for anomalies. When found, they present findings to users with clear explanations. Only after receiving explicit permission do they trigger remediation workflows—using heavier reasoning models at that point, when the cost is justified.

**⚠️ Watch Out For:**
- **Using expensive reasoning models for simple pattern detection.** The docs specifically warn this is the most common mistake. Detection is pattern matching; save the heavy lifting for when issues are actually detected.
- **Running checks synchronously.** If users are waiting 30+ seconds for responses, your signal detector is blocking the main thread. Spawn and forget. Response time should stay under 5 seconds.

| Synchronous Approach | Asynchronous Approach |
|---------------------|----------------------|
| Blocks user while checking | User gets immediate response |
| 30-120 second delays | Under 5 second response time |
| One expensive model tier for everything | Cheap models for detection, expensive only when needed |
| Higher costs, worse experience | 50-80% cost reduction, smooth UX |

## **Act 3: The Trust Boundary**

Not all recipes should have equal power. The docs make this clear: only recipes shipped inside the core package itself are fully trusted. Recipes discovered at runtime from user directories are marked untrusted and restricted—they can't run command health checks, can't run HTTP health checks (SSRF defense), and must use simpler verification methods.

This trust boundary matters because health checks often need to poke at external services. You don't want a random recipe you downloaded from the internet making arbitrary HTTP requests to internal systems. The frontmatter parsing enables this security model: the system can read the metadata, see what health checks are declared, and enforce boundaries based on where the recipe came from.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing two recipe files—one labeled 'trusted' with full health check capabilities including HTTP and command checks, and another labeled 'untrusted' restricted to env_exists checks only" width="600" height="350" /></p>

---

## **The Real-World Picture**

Picture a production GBrain instance handling fifty messages per day across multiple integrations. Without signal detection, you're running blind—hoping email sync still works, hoping the ngrok tunnel hasn't collapsed, hoping credentials haven't expired. With proper signal detection configured in recipe frontmatter, lightweight sub-agents continuously verify each integration's health using cost-effective models. When the calendar sync starts lagging or a new version becomes available, the system surfaces a clear, benefit-focused message: "Your brain never falls behind. Live sync keeps the vector DB current automatically." The user says yes, and the heavy-lifting upgrade flow kicks in—updating binaries, re-reading skills, running migrations, syncing schema—all orchestrated through the DSL rules declared in that YAML frontmatter.

---

## **What You Now Know**

- How YAML frontmatter separates machine-readable configuration from human-readable content in recipe files
- Why detection should use fast, cheap pattern-matching models while remediation reserves heavy reasoning for when it's actually needed
- How asynchronous signal detectors prevent the main thread from blocking while continuously monitoring integration health
- The cost implications of model selection when detection runs on every message
- How trust boundaries restrict what health checks untrusted recipes can perform

---

## **Looking Ahead**

Signal detection tells you when something's wrong—but how do you safely execute the fixes without exposing your system to arbitrary command injection? Next up: **Shell Jobs: Safe Execution Boundaries**, where we'll explore how to containerize remediation actions so they can't accidentally (or maliciously) damage the host system.

---

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/guides/sub-agent-routing.md (Tricky Spots, How to Verify)
- https://github.com/garrytan/gbrain/blob/main/docs/guides/upgrades-auto-update.md (What the User Gets, The Upgrade Message, The Full Upgrade Flow, Migration Files, How to Verify)
- https://github.com/garrytan/gbrain/blob/main/docs/integrations/README.md (How Data Flows In, Self-Installing Recipes, How to Read a Recipe, Recipe trust boundary)