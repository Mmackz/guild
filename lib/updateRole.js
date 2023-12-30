import { privateKeyToAccount } from "viem/accounts";
import { guild, role } from "@guildxyz/sdk";
import { getAllowlistFromDune } from "./getAllowlist.js";
import dotenv from "dotenv";
dotenv.config();

const GUILD_NAME = "rabbithole";
const DUNE_TICKET_QUERY_ID = 3308995
const DUNE_QUEST_QUERY_ID = 3318483

const account = privateKeyToAccount(process.env.ETH_PRIVATE_KEY);
const walletAddress = account.address;
console.log(walletAddress);
const signerFunction = (message) => account.signMessage({ message });

const { roles } = await guild.get(GUILD_NAME);
const questExploreRole = roles.find((role) => role.name === "Quest Explore");
const questAdeptRole = roles.find((role) => role.name === "Quest Adept");
const questChampionRole = roles.find((role) => role.name === "Quest Champion");
const ticketHolderRole = roles.find((role) => role.name === "Ticket Master");

export async function updateRole() {
  try {
    const questExploreAllowlist = await getAllowlistFromDune(DUNE_QUEST_QUERY_ID);
    const questAdeptAllowlist = await getAllowlistFromDune(DUNE_QUEST_QUERY_ID, 100);
    const questChampionAllowlist = await getAllowlistFromDune(DUNE_QUEST_QUERY_ID, 500);
    const ticketAllowlist = await getAllowlistFromDune(DUNE_TICKET_QUERY_ID);

    if (questExploreAllowlist) {
      await role.update(questExploreRole.id, walletAddress, signerFunction, {
        requirements: [
          {
            type: "ALLOWLIST",
            data: {
              addresses: questExploreAllowlist
            }
          }
        ]
      });
      console.log("quest explore role updated");
    }

    if (questAdeptAllowlist) {
      await role.update(questAdeptRole.id, walletAddress, signerFunction, {
        requirements: [
          {
            type: "ALLOWLIST",
            data: {
              addresses: questAdeptAllowlist
            }
          }
        ]
      });
      console.log("quest adept role updated");
    }

    if (questChampionAllowlist) {
      await role.update(questChampionRole.id, walletAddress, signerFunction, {
        requirements: [
          {
            type: "ALLOWLIST",
            data: {
              addresses: questChampionAllowlist
            }
          }
        ]
      });
      console.log("quest champion role updated");
    }

    if (ticketAllowlist) {
      await role.update(ticketHolderRole.id, walletAddress, signerFunction, {
        requirements: [
          {
            type: "ALLOWLIST",
            data: {
              addresses: ticketAllowlist
            }
          }
        ]
      });
      console.log("ticket role updated");
    }
  } catch (error) {
    console.error(error);
    console.log("There was an error updating the role");
  }
}
