
The lottery has already been closed by the organizer. Check `isLotteryOpen()` state. Frontends should disable the buy button when `isOpen === false`.

**"Only organizer can close lottery":**

You're attempting to close with a different address than the one that deployed. Only the deployer can close. Check the `organizer` state variable to confirm who can close.

**"Incorrect ticket price":**

You must send exactly the ticket price. Not more, not less. Check `ticketPrice()` and send that exact amount in wei. The frontend handles this automatically via the hook.

**Callback never arrives:**

Extremely rare, but if randomness doesn't come:

- Verify you sent enough ETH for callback gas (at least 0.001 ETH)
- Check dcipher's status page for network issues
- Wait the full timeout period (1 hour)
- After timeout, call `cancelAndRefund()` to return funds

**"Invalid request ID" in callback:**

This shouldn't happen in normal operation. Indicates the callback is responding to a different request than expected. Don't manually call randomness functions. Let the lifecycle run normally.

**Gas estimation fails:**

Complex operations (many players, large calculations) need more gas. The default callback gas limit is 200,000. If you have 100+ players or add extra logic, increase this in `closeLotteryAndRequestRandomness()`.

**Frontend shows stale data:**

wagmi hooks auto-refresh but take a few seconds to poll. Be patient. If data seems truly stuck:

- Check the actual contract state in a block explorer
- Verify your RPC provider is responding
- Try refreshing the page
- Check console for errors

**Can't see winner immediately after closing:**

The randomness callback takes 10-30 seconds after the lottery closes. This is normal. The dcipher network needs time to:

- Detect the request
- Generate partial signatures
- Aggregate them
- Submit the callback

The frontend updates automatically when the callback completes. The "Awaiting randomness..." status indicates this phase.

**Winner is selected but prize not distributed:**

Check the transaction that called `onRandomnessReceived()`. If transfers failed:

- Winner address might not accept ETH (contract without receive function)
- Organizer address might be problematic
- Gas limit might have been too low

The contract requires both transfers to succeed or it reverts.

---

## Final Thoughts

