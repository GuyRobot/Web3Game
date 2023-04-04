import console from "console"
const hre = require("hardhat")

// Define the NFT
const _metadataUri = 'https://gateway.pinata.cloud/ipfs/https://gateway.pinata.cloud/ipfs/QmX2ubhtBPtYw75Wrpv6HLb1fhbJqxrnbhDo1RViW3oVoi';

async function main() {
  await hre.run("verify:verify", {
    address: "0x8ED0E7c6C15Aeb004E6933b01c1725Bb5cB5F3B5",
    constructorArguments: [_metadataUri],
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })