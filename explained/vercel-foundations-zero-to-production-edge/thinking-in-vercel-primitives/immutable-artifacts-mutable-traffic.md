---
## **Why Your Production Deployment Never Overwrites Itself**

You remember that Tokyo teammate from last time, the one who clicked the link that didn't exist thirty seconds ago? Here's the part of that sorcery we didn't unpack. Thirty days later, that same link still works exactly the same way. It didn't rot when you pushed to production. Your latest bugs never reached it. Instead, it sits there, frozen in amber, a perfect snapshot of that moment in time.

You just saw how the Build Output API acts as that universal translator between frameworks and infrastructure — now those deterministic outputs show up here crystallized as immutable artifacts. That's because the **Build Output API** doesn't just translate your code into infrastructure. It crystallizes it. Every deployment becomes an **immutable artifact**. It's a complete, read-only snapshot of your application at that exact commit. When you "deploy to production," you're not replacing what was there. You're building a new time capsule and sliding it onto the shelf.

> An **immutable deployment** is a build artifact that, once created, cannot be modified in place. Any change requires creating a new artifact entirely, leaving the original untouched.

This seems wasteful at first. Why keep yesterday's deployment when today is supposedly better? But this separation between what you build and what users see unlocks superpowers that mutable deployment models can't touch.

## **Act 1: The Overwrite Trap**

Imagine you're editing a shared Word document, the kind where fifteen people have the link. You open it, make changes, hit save. The old version is gone. Poof. If someone else was reading paragraph three while you deleted it, well, they just watched it vanish from under their cursor. That's how traditional server deployments used to work. You SSH'd in, uploaded new files, and overwrote the old ones while users were actively downloading them. Chaos.

**Mutable deployments** treat your application like that Word doc, one living location that gets constantly overwritten. **Immutable deployments** treat it like a photography darkroom. Every print gets its own negative, and you can hang as many prints on the wall as you want without destroying the previous ones.

| Mutable Model | Immutable Model |
|--------------|----------------|
| Single location updated in place | Unique URL per deployment |
| Risk of partial overwrites during upload | Atomic—all or nothing visibility |
| Rollback requires re-deployment | Rollback is instant pointer switch |
| "Works on my machine" vs production drift | Every environment identical to its snapshot |

The immutable approach means your Preview Deployment from last Tuesday isn't a temporary fake. It's a real deployment that happens to live at a different address. Production is just the deployment that currently owns the production domain.

## **Act 2: The Promotion Model**

So if every push creates a permanent snapshot, how do you actually ship to users? This is where **traffic routing** becomes a separate concern from **build artifacts**.

Think of your production domain as a spotlight. Right now, it's illuminating the deployment from yesterday. When you're ready to ship, you don't move the code. You move the light. The **promotion model** redirects that spotlight to point at your newest immutable artifact. The old deployment doesn't disappear. It just sits in the dark, waiting.

The Build Output API creates deterministic outputs. Your "staging" and "production" environments aren't different configurations. They're the same exact artifact accessed through different URLs. When you promote a Preview Deployment to production, nothing about the build changes. Not a byte shifts. You just update a routing table that says "example.com now points to deployment `abc123` instead of `xyz789`."

Separating build from release creates the **instant rollback**. Discover a critical bug? You don't frantically rebuild yesterday's code while sweating through your shirt. You swing that spotlight back to the previous deployment. Users see the fix in milliseconds because the old artifact was never deleted, only temporarily unloved.

## **Act 3: The Time Machine Effect**

Because immutable deployments preserve every state forever (well, until garbage collection kicks in), your deployment history becomes a time machine. That experimental branch your designer pushed three weeks ago? Still there. The version from before the database migration? Alive and serving traffic if you point a subdomain at it.

That changes how you think about "releases." A release isn't a build process. It's a routing decision. The artifact is the constant. The traffic is the variable.

### **⚠️ Watch Out For:**

**The "Deployment vs. Release" confusion.** Many developers think deploying and releasing are the same action. In an immutable world, deployment is "create a snapshot" and release is "route traffic to it." You can deploy fifty times a day without releasing once, or release the same artifact to five different regions at different times.

**The storage anxiety.** Yes, keeping every deployment sounds expensive. But these are static files, not running servers. The platform deduplicates common assets (that React bundle that didn't change between commits gets stored once, referenced twice). Still, old previews do eventually evaporate. Immutable doesn't mean "eternal," only "unchanging while it exists."

**The database migration trap.** Your code might be instantly rollback-able, but your database schema isn't. Rolling back the application while keeping the new database schema is like putting last year's engine in this year's chassis. It might fit, or it might spray oil everywhere. Immutable deployments handle your code. They don't absolve you from migration discipline.

---

## **The Real-World Picture**

Picture this: It's Black Friday. Your checkout flow is hemorrhaging money due to a race condition you introduced in yesterday's "simple" UI tweak. In a mutable world, you're reverting commits, waiting for CI to rebuild, praying the CDN cache clears correctly. Twenty minutes of lost sales. In the immutable model, you open your dashboard, see the deployment from 48 hours ago (the one with the stable checkout), and click "Promote to Production." The routing switches. The broken deployment is still there. You can debug it at your leisure via its permanent preview URL, but customers never touch it again. Total downtime: four seconds.

---

## **What You Now Know**

- How **immutable artifacts** separate the act of building from the act of releasing
- Why the **promotion model** turns rollbacks from rebuilds into routing table updates
- How **deterministic builds** from the Build Output API enable every deployment to be a potential production candidate
- Why Preview Deployments aren't simulations—they're real deployments wearing temporary URLs
- How immutable storage creates a time machine for your application state, enabling instant recovery from bad releases

## **Looking Ahead**

Now that you understand these frozen artifacts sitting on the shelf—each one a complete, unchanging snapshot of your application—we need to explore where they actually run. Next, we'll step inside **Life Inside the Edge Runtime**, where these immutable deployments wake up and handle requests across a global network without traditional servers.