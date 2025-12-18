### Enhanced Lottery Features

**Time-based rounds:**
Instead of organizer-triggered closing, add automatic round schedules. Daily draws at midnight. Weekly jackpots. Use block timestamps to enforce timing.

**Multiple ticket types:**
Different prices for different entry levels. Bulk discounts. VIP tickets with better odds. The `players` array naturally supports multiple entries per address.

**Recurring lotteries:**
After a winner is picked, automatically create a new round. Perpetual lottery system with scheduled draws. Compound the prize pool between rounds.

**Token-gated entry:**
Require NFT ownership or token balance to participate. Community-exclusive lotteries. Check ERC721/ERC20 balances in `buyTicket()`.

**Prize distribution splits:**
Instead of winner-takes-all, distribute to top 3 entries. Or split between multiple prize tiers. The random value can generate multiple indices.

---

## Troubleshooting Common Issues

**"Lottery is closed" when trying to buy ticket:**
