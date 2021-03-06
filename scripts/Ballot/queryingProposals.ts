import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
import { Ballot } from "../../typechain";

async function main() {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
  const provider = ethers.providers.getDefaultProvider("ropsten"),signer = wallet.connect(provider);
  console.log(`Using address ${wallet.address}`);
  if (process.argv.length < 3) throw new Error("Address of ballot is missing");
  const ballotAddress = process.argv[2];
  console.log(
    `Attaching ballot contract interface to address ${ballotAddress}`
  );
  const ballotContract = new Contract(
    ballotAddress,
    ballotJson.abi,
    signer
  ) as Ballot;

  let ProposalsLeft = true, count = 0;
  while (ProposalsLeft) {
    try {
      const proposal = await ballotContract.proposals(count);
      const proposalName = ethers.utils.parseBytes32String(proposal.name);
      console.log(
        `Proposal Number: ${
          count + 1
        }: ${proposalName} - Votes: ${proposal.voteCount.toNumber()}`
      );
      count++;
    } catch (err) {
        ProposalsLeft = false;
      }
    }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});