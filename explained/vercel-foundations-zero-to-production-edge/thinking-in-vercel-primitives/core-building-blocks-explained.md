---
## **The Four Materials Every Vercel Project Is Built From**

You remember that Tokyo teammate from last time watching your app render instantly—frozen in amber exactly as you built it? You just saw how **ephemeral execution** in V8 isolates brings code to the user in microseconds—now that shows up here as just one of four building materials you can choose from. That moment wasn't just the runtime doing its magic—it happened because you unconsciously chose a specific building material for that part of your application. Every project on Vercel is essentially a construction job using just four distinct primitives. The art of deploying well is knowing which material to use for which job.

> **Vercel** is a developer platform that assembles web applications from four execution primitives: **Static files**, **Serverless Functions**, **Edge Functions**, and **Image Optimization**.

## **Act 1: The Museum Plaque (Static Files)**

**Static files** are the immutable artifacts of your application—HTML, CSS, JavaScript, and fonts that never change between deployments.

They're museum plaques, not whiteboards. A whiteboard (dynamic content) changes every time someone walks by. A museum plaque gets engraved, sealed behind glass, and shipped to every branch of the museum simultaneously. When your Tokyo teammate clicked that link, the HTML they received was a plaque. It was pre-built during deployment, distributed to hundreds of edge locations worldwide, and served in milliseconds without any code running.

The mechanism is straightforward. During the build process, Vercel generates these assets, fingerprints them for cache-busting, and pushes them to a global Content Delivery Network. Once there, they exist as pure data waiting for requests. No server wakes up. No container spins. The file simply travels the shortest physical distance to the user.

That immutability makes them fast because they bypass the entire "ephemeral execution" world entirely. But they can't react to who's asking. They're perfect for blog posts, marketing pages, and JavaScript bundles, but useless for checking a user's shopping cart.

## **Act 2: The Food Truck (Serverless Functions)**

When you need that whiteboard—something that reacts to user input, queries a database, or processes a payment—you reach for **Serverless Functions**.

Imagine a food truck that parks in a specific neighborhood. When hungry customers arrive (HTTP requests), the truck opens its window and serves food. But if nobody shows up for a while, the truck packs up and leaves to save money. The next customer has to wait while the truck unpacks and fires up the grill. That's the **cold start**, the latency penalty for waking up a dormant function.

**Serverless Functions** run in traditional Node.js (or Python, Go, etc.) containers located in specific geographic regions. When a request hits your deployment, Vercel checks if an instance is running warm. If yes, it executes immediately. If not, it provisions a container, loads your code, and runs it. That's the potential for multi-second delays on that first request. They can run for up to ten seconds (on the free tier) and have access to the full Node.js ecosystem, filesystem included.

The trade-off is power versus geography. You get a full runtime capable of heavy computation and database connections, but it lives in one region unless you manually replicate it. That Tokyo teammate? If your Serverless Function lives in Virginia, their request crosses the Pacific, executes, and returns. Physics becomes your bottleneck again.

## **Act 3: The Traffic Cop (Edge Functions)**

**Edge Functions** are the middle ground—code that runs instantly everywhere, but with strict constraints.

Picture a traffic cop standing at every single intersection in every city simultaneously. They can't perform surgery or cook a meal (no heavy computation), but they can glance at your driver's license and redirect you before you ever reach the hospital. Those cops are **V8 isolates**, the same lightweight JavaScript runtime you encountered in the previous lesson, running in microseconds across Vercel's entire global network.

Unlike Serverless Functions, Edge Functions don't wait in a specific region. They deploy everywhere at once. They execute before the cache so they can modify requests and responses on the fly. They might check authentication tokens, run A/B tests, or geolocate visitors. Because they run in V8 isolates rather than full containers, they start instantly with no cold starts or container provisioning.

But there's a ceiling. Edge Functions must return in milliseconds, not seconds. They can't access the Node.js filesystem or native modules. They're designed for logic, not heavy lifting. They're perfect for authentication middleware, bot detection, or personalization, but inadequate for generating PDFs or processing video.

| Feature | Serverless Functions | Edge Functions |
|---------|---------------------|----------------|
| **Runtime** | Full Node.js/Python/Go | V8 Isolate (JavaScript) |
| **Cold Start** | Yes (seconds possible) | No (microseconds) |
| **Geography** | Regional (user travels to code) | Global (code travels to user) |
| **Duration** | Up to 10s (free tier) | Milliseconds |
| **Best For** | Database queries, heavy compute | Auth, redirects, personalization |

## **Act 4: The Responsive Lens (Image Optimization)**

The fourth primitive isn't code at all—it's **Image Optimization**, a specialized transformation layer.

Imagine an optician who doesn't just hand you one pair of glasses, but stands at the door examining your eyes, the lighting conditions, and your intended activity, then crafts the perfect lens on the spot. When a browser requests an image, Vercel's primitive inspects the device's screen size, pixel density, and supported formats (WebP, AVIF), then generates and caches the optimal version automatically.

Unlike the other three primitives, this one specializes in a single media type. You don't deploy code. You point to source images, and Vercel creates variants at the edge. This prevents developers from shipping megabyte-sized PNGs to mobile devices or maintaining complex build pipelines for responsive images.

---

## **The Real-World Picture**

Consider an e-commerce checkout flow. The product page is **Static files**, built once, cached globally, instantly available. When the user clicks "Add to Cart," an **Edge Function** checks their JWT token at the edge to confirm they're logged in. This avoids the latency of a round-trip to Virginia. The add-to-cart action itself hits a **Serverless Function** that writes to the database and calculates inventory. You can wait 200ms for this because it's mutating state. Meanwhile, the product thumbnails load through **Image Optimization**, serving AVIF to modern browsers and JPEG to legacy ones, all converted from your single high-resolution source file.

## **⚠️ Watch Out For:**

**"Vercel only hosts static sites."** This myth dies hard because Vercel started as a static host. But with Serverless and Edge Functions, you're running full backend logic. The difference is execution model, not capability.

**"Everything runs on the Edge network."** Serverless Functions run in specific regions you select. Only Edge Functions and Static files enjoy the global distribution. If your database is in Oregon and your Serverless Function is in Frankfurt, expect lag.

**Git push auto-deploys to production.** By default, pushing to your main branch updates your live site immediately. Use Preview Deployments (those unique URLs for every Pull Request) to verify changes before they hit users.

**Environment variables require redeployment.** Unlike traditional servers where you can SSH in and change a config file, Vercel bakes environment variables into the deployment artifact. Change the variable? You must trigger a new build.

**Function timeout limits.** That free-tier 10-second limit applies to Serverless Functions. Edge Functions have stricter limits (typically sub-second). Attempting database migrations or video processing in either will result in hard cuts mid-execution.

---

## **What You Now Know**

- How **Static files** provide immutable speed by existing as pre-built artifacts rather than executed code
- Why **Serverless Functions** trade cold-start latency for computational power and regional database access  
- The distinction between **Edge Functions** (global, instant, lightweight) and **Serverless Functions** (regional, powerful, stateful-capable)
- How **Image Optimization** offloads responsive asset generation from build-time to request-time
- Why choosing the wrong primitive—like running database queries in Edge Functions or authentication in Serverless—creates architectural friction

## **Looking Ahead**

Now that you understand the four materials available in your toolkit, you need to learn how to organize them so teams don't accidentally overwrite each other's work. In "Isolated Projects and Team Spaces," we'll explore how Vercel separates concerns—turning these primitives into shared infrastructure that scales from solo developers to enterprise teams without chaos.