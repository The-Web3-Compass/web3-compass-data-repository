## The UI Components (What Makes It Look Good)

We built a custom design system for this. No Tailwind. Just vanilla CSS with custom properties and utility classes.

Look at `src/index.css`:

```css
:root {
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}

.card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
```

This gives us a consistent design system across the entire app. Cards have the same shadow and hover effects. Buttons have the same gradient and transitions. Everything feels cohesive.

We also use gradients heavily for visual interest:

```css
.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

This makes headings and important text pop without being obnoxious.

The key components:

**ListingCard** - Shows item details, bid status, countdown timers, and action buttons. Has hover effects and smooth transitions.

**BidModal** - Handles bid input, encryption, and submission. Shows real-time validation and error messages.

**PaymentButton** - Handles both same-chain and cross-chain payments with a clean UI for chain selection.

**MyBids** - Shows all user bids with status indicators (Sealed, Revealed, Winning, Lost, Won).

**MyListings** - Shows all user listings with bid counts and winner information.

All of these use the same design system, so the entire app feels unified.

---
