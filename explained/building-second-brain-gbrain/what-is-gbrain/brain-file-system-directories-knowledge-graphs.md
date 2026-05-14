---
## **The Meeting That Almost Went Wrong**

You're walking into a conference room. The calendar says "2:00 PM: Lena Kovac." You smile, shake hands, and realize with a sinking feeling that you have no idea who this person is. Did you meet her at that conference? Was she the one who emailed about... something? You nod along as she references your last conversation, praying she doesn't notice the panic behind your eyes.

This is relationship decay in action. The decay isn't dramatic enough to end friendships. It's silent, making you look unprofessional while you nod along pretending to remember. The human brain forgets. We meet hundreds of people, exchange thousands of emails, attend dozens of meetings. Without a system, we're just hoping context magically survives.

You just saw how **REWRITE** means full replacement—not appending contradictions like Dr. Elena's scattered pages—but what you didn't see yet is where that rewrite actually lives. Here, that foundation starts doing work: **how gbrain actually stores knowledge** so your agent can retrieve it instantly, enrich it continuously, and never let you walk into a room unprepared again.

---

## **Act 1: The Library That Never Forgets**

Picture an old library with a massive card catalog. Each drawer is labeled by category: "People," "Companies," "Meetings," "Concepts." Inside each drawer, individual cards hold everything known about a single entity. Every card has a standardized format. Header information sits at the top, history fills the middle, and references to related cards scribble the margins.

When a librarian needs to prepare you for a meeting, they don't flip through a chronological journal hoping to find mentions. They go straight to the "People" drawer, pull Lena Kovac's card, and instantly see her entire history with you: the X reply from last Tuesday, the email Wednesday morning, the mutual connections, what she's building.

That's how **gbrain's directory structure** works.

Instead of organizing by date like a diary, gbrain uses a **flat directory structure categorized by entity type**. People live in `people/`. Companies live in `companies/`. Meetings live in `meetings/`. Each entity is a markdown file. Not a database row, not a proprietary format, but a plain text file that any tool can read.

<figure align="center">
<img src="PLACEHOLDER" alt="Diagram showing flat directory structure with folders for people, companies, meetings, and concepts, each containing markdown files with YAML frontmatter" width="600" height="350" />
</figure>

The magic is in the structure of each file. Every markdown file has **YAML frontmatter** at the top. This structured header contains aliases (so "David Park" matches "david.park@company.com"), identifiers, and a **tier classification** indicating how deep the knowledge goes. Below the frontmatter, content sections hold timelines, relationships, beliefs, and assessments.

When your agent needs to find someone, it doesn't ask a database. It runs a search command looking through the appropriate directory. No results? The agent consults **resolution rules** to decide: Is this a person? A company? Something else? Then it creates the file in the right place, following the schema.

**⚠️ Watch Out For:**
- **Assuming files are organized chronologically.** They're not. A file for someone you met yesterday sits right next to someone you met five years ago. The timeline lives *inside* the file, not in the folder structure.
- **Thinking this requires manual data entry.** The whole point is that autonomous agents create and update these files from emails, meetings, social media, and calendar events. You never touch them directly.

---

## **Act 2: Knowledge That Compounds**

That card for Lena Kovac didn't appear fully formed. It grew over time through something called **tiered enrichment**.

When your social radar first detected Lena's reply on X, the agent created a thin file — **Tier 3** — with minimal data: her handle, the reply text, a note that she seems technical. Just enough to remember she exists.

When she emailed the next morning asking to chat, the agent found that existing file, upgraded it to **Tier 2**, and enriched it: web search for her background, social search for her public voice, cross-references to companies she mentioned. Now the file has substance — career history, what she's building, her beliefs about developer tooling.

When the calendar showed a meeting scheduled with her, the agent escalated to **Tier 1**: full network search, mutual connections, semantic search for her conference talks, everything saved in a structured format. By the time you walk into that room, the agent has compiled a complete intelligence assessment.

<figure align="center">
<img src="PLACEHOLDER" alt="Flow diagram showing entity progression from Tier 3 (minimal data from social mention) to Tier 2 (web enrichment after email) to Tier 1 (deep research before meeting)" width="600" height="350" />
</figure>

The documentation calls this the compound effect: "knowledge compounds autonomously when the plumbing is wired correctly." Each cron job — email monitor, social radar, executive assistant — feeds the enrichment pipeline. The pipeline feeds every future job. Your brain literally gets smarter while you sleep.

Files also cross-reference each other. When Lena mentions she's building something related to NovaTech, and NovaTech already exists in `companies/novatech.md`, the agent creates bidirectional references. Now NovaTech's file links to Lena, and Lena's file links to NovaTech. The knowledge graph emerges naturally from these relationships.

---

## **Act 3: Multiple Libraries Under One Roof**

Your personal library grows enormous. You have not just your own cards, but work projects, research notes, maybe even a shared team knowledge base. You could run separate databases for each — but that's overhead, syncing headaches, and fragmented search.

Instead, gbrain supports **multi-source architecture**.

Picture a university library with separate wings. Each wing — each **source** — maintains its own card catalog, its own checkout records, its own lending rules. The "Personal" wing has your private relationships. The "Work" wing has company projects and colleagues. The "Research" wing has deep dives on technical concepts. They all sit under one roof, sharing the same infrastructure, but strictly isolated when needed.

| Single Source | Multi-Source |
|---|---|
| One namespace for all entities | Each source has independent slug namespace |
| All knowledge blends together | Policy-controlled isolation between domains |
| Simple setup | Unified infrastructure, separate pipelines |
| Risk of cross-contamination | Search across sources or constrain to one |

**Sources** are logical partitions, not just folders. Each source maintains its own sync state, federation policies, and namespace. You can search across all sources when you want unified recall ("what do I know about AI infrastructure?"), or constrain to a single source when you need isolation ("only search my personal relationships, not work projects").

**⚠️ Watch Out For:**
- **Assuming sources automatically share search space.** They don't by default. You configure federation policies to control what crosses boundaries.
- **Thinking multi-source requires multiple databases.** It doesn't. One gbrain database hosts many sources. This eliminates infrastructure overhead while maintaining logical separation.

---

## **The Real-World Picture**

You're a founder with 50 active investor conversations, a team of 12, and a network of advisors scattered across three time zones. Without a system, every Monday is archaeology. You dig through email threads to remember where you left things with each person, which investor you promised an update to, which advisor mentioned a relevant hire.

With gbrain's directory structure, your agent maintains `people/` files for every investor, `companies/` files for every fund, `meetings/` files for every conversation. When Monday morning hits, the agent doesn't just give you a list of recent emails. It hands you a prepared brief: "You have four meetings this week. Here's what's changed with each person since you last spoke, what they care about right now, and what you promised to follow up on." The knowledge survived. The context compounded. You look like you remember everything — because your agent does.

---

## **What You Now Know**

- **How gbrain organizes knowledge** into flat directories by entity type (people, companies, meetings) rather than by date or project
- **How markdown files function as database records** with YAML frontmatter for metadata and content sections for timelines and relationships
- **How tiered enrichment works** — files start thin (Tier 3) and deepen automatically (Tier 2, Tier 1) as relationship signals strengthen
- **How cross-linking builds a knowledge graph** — entities reference each other, creating navigable connections without manual curation
- **How multi-source architecture enables isolation** — one database hosts multiple independent knowledge repositories, each with its own namespace and policies

---

## **Looking Ahead**

Now that you understand how knowledge is stored, the next question is: how does your agent actually *use* it? In **The Brain-Agent Loop: Read, Respond, Remember**, we'll walk through the complete cycle — how agents query the brain, what they do with what they find, and how every interaction makes the system smarter.

---

## **Sources**

- https://github.com/garrytan/gbrain/blob/main/docs/GBRAIN_RECOMMENDED_SCHEMA.md (Example 2: Email Triage, Example 3: The Compound Effect)
- https://github.com/garrytan/gbrain/blob/main/docs/guides/multi-source-brains.md (Multi-source brains, Unified knowledge recall)