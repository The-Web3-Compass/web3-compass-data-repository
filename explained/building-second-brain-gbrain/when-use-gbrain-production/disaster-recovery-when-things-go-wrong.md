---
## **The Night the Horizontal Rules Ate My Wiki**

Imagine running a library where, for months, a silent shredder has been eating the second half of every book that contains a decorative line break. Not the dramatic kind of shredding with lights and alarms. This one was polite, almost apologetic. Books looked fine on the shelf. Covers stayed intact. First chapters looked pristine. Anything after a simple decorative divider was gone. Poof. Into the void.

You only discover this when a researcher asks about a meeting note you distinctly remember writing. It was something about Alice founding a company in 2019. You check the file. The meeting summary is there, but the timeline section ends abruptly after a horizontal rule. The rest? Shredded by a parsing quirk you never knew existed.

You just saw how the full upgrade flow ensures new code actually produces new agent behavior—but upgrades can also ship with dormant bugs that wait months to strike. That scenario isn't a nightmare. For gbrain users on versions before v0.12.2, this was Tuesday.

## **Act 1: The Separator That Wasn't**

Every wiki system needs a way to distinguish **body content** (the narrative, the story, the prose) from **timeline content** (dated events, chronological facts). gbrain handles this separation with a function called **splitBody**.

For a long time, splitBody used a simple heuristic. It saw a line containing just `---` and assumed that was the timeline separator. Everything after belonged in the chronology.

Sounds reasonable, right? `---` is also valid **markdown**. It functions as a horizontal rule, a decorative divider authors use to separate sections of prose. Writers used it constantly. They didn't realize the parser was silently reinterpreting anything after that line as timeline data and often truncating it.

The docs put it bluntly: *"If your brain imported wiki-style markdown before v0.12.2, some pages were silently truncated (the parser treated any standalone `---` in body content as a timeline separator)."*

**⚠️ Watch Out For:**
- **Assuming truncation would throw errors.** It didn't. The system failed silently—pages looked fine, they just ended early.
- **Thinking backups would help.** Your source files were fine; the corruption happened during ingestion. The original markdown files still contained all the content—you just needed to re-parse them correctly.

## **Act 2: The Recovery Protocol**

When you discover half your wiki has been eaten by overeager parsing, panic is natural. But recovery is surprisingly mechanical. You don't need to rewrite anything. You don't even need to hunt through backups.

You run a **full sync**.

The `gbrain sync --full` command re-imports everything from source, but this time with the corrected splitBody logic. Picture running every book back through the scanner with better software. The new parser recognizes that `---` in the middle of a narrative isn't a timeline marker. It's just a horizontal rule. Content stays where it belongs.

<p align="center"><img src="PLACEHOLDER" alt="Diagram showing wiki page content flow: raw markdown enters splitBody parser, which now uses explicit timeline sentinels to separate body from timeline, outputting complete compiled_truth without truncation" width="600" height="350" /></p>

Here's what happens during recovery:

1. **Re-ingestion begins.** Every page gets re-scanned from its original source.
2. **splitBody applies the new contract.** The parser now looks for explicit **timeline sentinels**. It uses these to decide where body ends and timeline begins.
3. **compiled_truth rebuilds correctly.** Content that was previously truncated now stays in the body where authors originally placed it.

The fix is **idempotent**—run it once or five times, you get the same correct result. No harm, no duplication, no fuss.

## **Act 3: The New Contract**

Prevention beats cure. The v0.12.2 update introduces a stricter **splitBody contract** that requires explicit markers. No more guessing. No more heuristics that mistake formatting for structure.

The recognized timeline sentinels (in priority order) are:

| Sentinel | What It Means |
|----------|---------------|
| `<!-- timeline -->` | Preferred. Unambiguous HTML comment. |
| `--- timeline ---` | Decorated separator. Clearly labeled. |
| `---` before `## Timeline` or `## History` | Backward compatibility. The `---` must immediately precede these specific headings. |

A bare `---` floating in body text? That's now just a **markdown horizontal rule**. The parser ignores it for structural purposes.

**⚠️ Watch Out For:**
- **Using bare `---` as a timeline delimiter in new content.** If your agent writes pages with standalone `---` to separate body from timeline, those pages won't parse correctly. Migrate to `<!-- timeline -->`—the `serializeMarkdown` helper already does this automatically.
- **Assuming all timeline entries need the sentinel.** The sentinel separates body from timeline *section*—individual dated events within the timeline still use their own date formatting.

## **The Rebuilt Web**

Recovery has a certain rhythm. When you run that full sync, you fix truncated text and reactivate the **auto-link** system. This is gbrain's automatic graph builder. It scans content for entity references like `[Alice](people/alice)` and rebuilds relationship connections.

The content and the graph heal together. The markdown becomes the single source of truth again. Relationships re-form like calcium knitting a broken bone.

The put_page response even includes an `auto_links` field showing `{ created, removed, errors }`. This is a status report on what connections were rebuilt during recovery. This status report is the system's way of saying: "I found the references. The web is whole again."

---

## **The Real-World Picture**

You're migrating a 2,000-page founder knowledge base from Notion to gbrain. During bulk import, dozens of investment memos contain horizontal rules separating executive summary from detailed analysis. Without the v0.12.2 fix, every memo truncates at that rule. You lose the market analysis, the competitive landscape, and the team assessment. The recovery protocol lets you re-run the import with confidence. The auto-link reconciliation means every `[Founder Name](people/slug)` reference automatically rebuilds the investment-to-founder relationships in your graph. No manual linking required, no truncated memos, no lost institutional knowledge.

---

## **What You Now Know**

- How the pre-v0.12.2 splitBody parser silently truncated wiki content at bare `---` separators
- How to execute a full recovery using `gbrain sync --full` to re-import from source with corrected parsing
- The three valid timeline sentinels that prevent future truncation
- Why auto-link reconciliation runs concurrently with recovery, rebuilding graph relationships as content heals
- That splitBody is now deterministic—explicit markers only, no heuristic guessing

## **Looking Ahead**

With your wiki whole and your graph relationships automatically maintained, you now have the safety protocols to run gbrain in production with confidence. The next time you deploy a schema change or migration, you'll know exactly how to recover if something goes sideways—and how to verify that your auto-links rebuilt correctly as your content healed.

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/UPGRADING_DOWNSTREAM_AGENTS.md