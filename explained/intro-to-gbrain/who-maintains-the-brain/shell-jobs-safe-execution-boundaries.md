## **The Gate That Won't Open**

You've been trusted with the keys to the server room. It's 3 AM. A critical database backup failed, and you need to trigger an emergency script that lives on a worker machine halfway across the world. You draft a quick command, point it at the working directory, and hit submit.

Nothing happens.

Not a crash. Not an error message that screams at you. Just a polite, firm refusal from the system. The gate stays closed. Your command—perfectly valid in every other context—has been rejected at the boundary before it ever touched a shell.

This is the **shell job validator** doing exactly what it was designed to do. In a world where one malformed command can delete a database or expose a private key, the system treats every submission as potentially hostile until proven otherwise. The rejections feel frustrating until you realize they're saving you from yourself.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing shell job validation flow: command enters validation gate, checks for cmd vs argv mutual exclusion, absolute path verification, env string coercion, and privilege context before being allowed to worker execution with abort signal handling" width="600" height="350" /></p>

## **Act 1: The Airport Security Model**

Imagine you're at airport security. You can't present both your passport and your driver's license and let the agent pick—you must choose exactly one valid ID. Your liquids must be in clear bottles of a certain size. Your luggage must fit in the approved bins. And most importantly, only ticketed passengers with boarding passes can approach the gate.

**Shell jobs** work the same way. They treat configuration parameters as a **security boundary** rather than mere preferences. The validator enforces mutual exclusion between `cmd` (a shell-interpolated string) and `argv` (an array of structured arguments). Both absent? Rejected. Both present? Rejected. The system demands clarity to prevent ambiguity that could hide injection attacks.

The **working directory constraint** mirrors those TSA-approved containers: `cwd` must be present and must start with `/`. Relative paths are categorically denied. This blocks directory traversal attacks where a malicious actor might try to escape into sensitive system folders by chaining `../../../` sequences.

Then there's the **environment variable type check**. Every value in `env` must be a string. No numbers. No booleans. No nested objects. The validator coerces nothing—it rejects. This prevents type confusion bugs where a numeric port suddenly becomes a string mid-execution, or worse, where an object gets serialized into something executable.

## **Act 2: The Trust Token**

Here's where shell jobs get genuinely paranoid in the best way. Even if your command format is perfect, your path is absolute, and your environment variables are properly stringified—the system still asks: *who is submitting this?*

**Protected job submission** requires a trust token. The shell job type is classified as "protected" because it spawns actual operating system processes. Unlike safe, sandboxed operations, shell jobs can modify files, open network connections, and consume real resources. So the validator checks the **submitter context** before queuing anything for worker execution.

If you're using the CLI directly, you're granted this trust automatically. The CLI context implies physical access, human intent, and accountability. But if you're an MCP client—a remote agent trying to submit jobs through an API—the gate slams shut. **Shell jobs cannot be submitted over MCP by design.** This isn't an oversight; it's architectural immunology.

For programmatic use cases where remote submission is genuinely necessary, the system provides an explicit opt-in: the `allowProtectedSubmit` flag. You must pass this as the fourth argument to `MinionQueue.add()`, effectively signing a liability waiver that says, "I understand this is dangerous and I accept the consequences."

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing submission context validation: CLI path shows automatic approval, MCP path shows blocked with error message, programmatic path shows allowProtectedSubmit flag requirement" width="600" height="350" /></p>

### **The Abort Signal Safety Net**

Once a shell job passes all validation and enters execution, it doesn't run wild. The **worker abort signal** provides graceful termination with escalation. When cancellation is requested—whether from timeout, user action, deployment restart, or a lost lock—the child process first receives **SIGTERM**, giving it five seconds to clean up, close connections, and exit gracefully.

If the process ignores that grace period? **SIGKILL** follows immediately. No negotiation. No hanging jobs consuming resources indefinitely. The system prioritizes worker health over process politeness.

**⚠️ Watch Out For:**
- **Assuming MCP clients can submit shell jobs.** They can't, by design. If your remote agent needs to trigger shell execution, build a CLI wrapper or explicitly use `allowProtectedSubmit: true` with full awareness of the security implications.
- **Using relative paths for `cwd`.** The validator rejects them categorically. Always use absolute paths like `/home/user/projects/app` rather than `./app` or `~/app`.

## **Act 3: Reading the Rejection Letters**

When validation fails, the system returns specific error messages that tell you exactly which boundary you crossed. These aren't generic "something went wrong" responses—they're forensic reports.

| Error Message | What You Did Wrong | How to Fix It |
|---------------|-------------------|---------------|
| `shell: specify exactly one of cmd or argv` | Provided both `cmd` and `argv`, or neither | Choose `cmd` for shell-interpolated strings like `"echo $PATH"`, or `argv` for structured arguments like `["echo", "$PATH"]` |
| `shell: cwd is required and must be an absolute path` | Used relative path or omitted `cwd` entirely | Set `--params cwd=/absolute/path/to/working/directory` |
| `shell: env values must all be strings` | Passed a number, boolean, or object in environment | Stringify all values: `"env": {"PORT": "3000"}` not `"env": {"PORT": 3000}` |
| `permission_denied: shell jobs cannot be submitted over MCP` | Attempted submission from MCP client | Submit from CLI context only, or use a trusted operation handler |
| `protected job name 'shell' requires CLI or operation-local submitter` | Called `MinionQueue.add()` without trust flag | Pass `{ allowProtectedSubmit: true }` as the 4th argument |

The abort signals have their own vocabulary: `aborted: timeout` when your script ran too long, `aborted: cancel` when a user intervened, `aborted: shutdown` when the worker restarted, and `aborted: lock-lost` when a distributed lock expired. Each tells a story about why execution stopped.

---

## **The Real-World Picture**

Your team operates a data pipeline that runs hourly cleanup scripts. You've set up a cron job through the minions system to execute `find /data/temp -type f -mtime +7 -delete`. One night, a junior developer tries to add a second script through the MCP API, passing `argv` with a mix of strings and numbers for environment variables. The validator rejects it instantly with `shell: env values must all be strings`. Frustrated, they try switching to a relative path for `cwd` to make it "portable." Another rejection: `shell: cwd is required and must be an absolute path`. These refusals feel pedantic until you realize they've just prevented a cascading failure where malformed parameters could have deleted production data instead of temporary files.

---

## **What You Now Know**

- How shell jobs enforce **mutual exclusion** between `cmd` and `argv` to prevent ambiguous command parsing
- Why **absolute paths** are mandatory for `cwd` and how this blocks directory traversal attacks
- That **environment variables** must be strings, with automatic rejection of numeric or object types
- The distinction between **CLI submission** (trusted by default) and **MCP submission** (blocked by design)
- How to use **`allowProtectedSubmit: true`** when programmatic shell job submission is genuinely necessary
- The **abort signal lifecycle**: SIGTERM grace period followed by SIGKILL if the process doesn't exit cleanly

---

## **Looking Ahead**

Now that you understand how shell jobs enforce safe execution boundaries through strict validation, you're ready to explore how to schedule these jobs with temporal precision—ensuring they run only during appropriate windows and respect timezone-aware constraints.

---

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/guides/minions-shell-jobs.md (Errors and validation rules)