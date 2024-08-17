import { privateKeyToAccount } from "viem/accounts";
import { createGuildClient, createSigner } from "@guildxyz/sdk";
import { getAllowlistFromDune, getBoostAllowlist } from "./getAllowlist.js";
import dotenv from "dotenv";
dotenv.config();

const DUNE_TICKET_QUERY_ID = 3308995
const GUILD_ID = "boost-protocol";

const account = privateKeyToAccount(process.env.ETH_PRIVATE_KEY);
const walletAddress = account.address;
console.log(walletAddress);

const signerFunction = createSigner.custom(
  (message) => account.signMessage({ message }),
  walletAddress,
);

const {
  guild: { role: roleClient },
}  = createGuildClient("boost-roles");

const { requirement: requirementClient } = roleClient;

const roles =await roleClient.getAll(
  GUILD_ID,
  signerFunction,
);

const boostExploreRole = roles.find((role) => role.name === "Boost Explore").id;
const boostAdeptRole = roles.find((role) => role.name === "Boost Adept").id;
const boostChampionRole = roles.find((role) => role.name === "Boost Champion").id;
const ticketHolderRole = roles.find((role) => role.name === "Ticket Master").id;

export async function updateRole() {
  try {

    console.log("Updating roles at: UTC ", new Date().toLocaleString());

    const exploreAllowlist = await getBoostAllowlist();
    const adeptAllowlist = await getBoostAllowlist(100);
    const championAllowlist = await getBoostAllowlist(500);
    const ticketAllowlist = await getAllowlistFromDune(DUNE_TICKET_QUERY_ID);

    if (exploreAllowlist && exploreAllowlist.length) {
      await requirementClient.update(
        GUILD_ID, 
        boostExploreRole, 
        415327,
        { data: { addresses: exploreAllowlist } },
        signerFunction,
      )
      console.log("boost explore role updated");
    }

    if (adeptAllowlist && adeptAllowlist.length) {
      await requirementClient.update(
        GUILD_ID, 
        boostAdeptRole, 
        415328,
        { data: { addresses: adeptAllowlist } },
        signerFunction,
      )
      console.log("boost adept role updated");
    }

    if (championAllowlist && championAllowlist.length) {
      await requirementClient.update(
        GUILD_ID, 
        boostChampionRole, 
        415329,
        { data: { addresses: championAllowlist } },
        signerFunction,
      )
      console.log("boost champion role updated");
    }

    if (ticketAllowlist && ticketAllowlist.length) {
      await requirementClient.update(
        GUILD_ID, 
        ticketHolderRole, 
        415330,
        { data: { addresses: ticketAllowlist } },
        signerFunction,
      )
      console.log("ticket role updated");
    }
  } catch (error) {
    console.error(error);
    console.log("There was an error updating the role");
  }
}
