## Enter dcipher: Randomness That Actually Works

This is where all that threshold signature theory from Example 1 stops being theory and becomes useful.

Quick refresher: threshold schemes split cryptographic keys across multiple parties. You need a threshold number of them (say, 5 out of 9) to cooperate for any operation to work. No single party can do anything alone. The security isn't organizational, 
"we promise we're all independent and won't collude." 

It's mathematical. 

The cryptography itself enforces the distribution of power.

dcipher took that concept and pointed it at randomness generation.

Here's how it works. You request a random number. Multiple independent nodes jump into action. Each one contributes entropy (randomness input) that the others literally cannot predict. They run multi-party computation (MPC) protocols to collectively generate the final random value. No single node determines the outcome. They're all doing math together, and the result is something none of them could have produced or predicted alone.

The output is a threshold signature over your request. That signature gets verified cryptographically before your contract ever sees it. If the signature is valid, the randomness is legit. If someone tried to cheat, the signature verification fails and the whole thing gets rejected. Your contract never has to check anything, the math already proved the randomness is sound.

![Collaborative Randomness Generation](https://raw.githubusercontent.com/The-Web3-Compass/web3-compass-data-repository/refs/heads/main/examples/example-3/images/collaborative-randomness.png)

Now think about what it takes to attack this versus the old approaches. 

Want to manipulate a block hash? Control one miner. Takes money and maybe some technical skill, but people do it. 

Want to manipulate a timestamp? Same deal, control one miner. 

Want to compromise a centralized oracle? Harder, but you're targeting one service, one set of servers, one attack surface.

Want to manipulate threshold randomness? 
You need to simultaneously compromise multiple independent node operators meeting the threshold requirement. Not just bribe one person. Not just exploit one vulnerability. You need to coordinate a sophisticated attack across multiple independent systems running different infrastructure in different jurisdictions operated by different teams. And if the threshold is 7 out of 11, you need to compromise seven of them. Miss one? Attack fails. The math won't cooperate.

The security scales beautifully. 

Set a (5, 9) threshold → Attacker needs to corrupt five independent nodes. 
Set a (7, 11) threshold → Seven out of eleven. 

you get the gist right?

The attack cost grows exponentially while the defense cost grows linearly. That's the kind of asymmetric advantage you want in security.

Best part? You don't need to understand any of the cryptography to use it. You need to know how to call a function and implement a callback. 

That's it. 

dcipher handles the threshold coordination, the multi-party computation protocols, the signature aggregation, the verification, all the gnarly math. You write `_requestRandomnessPayInNative()` and implement `onRandomnessReceived()` (we will get to these in a bit). 

Everything else happens invisibly.

You focus on building your lottery, your game, your NFT project. dcipher focuses on making sure the randomness is actually random and nobody can cheat.

Let's build something.

---
