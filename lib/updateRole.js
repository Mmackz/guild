import { privateKeyToAccount } from "viem/accounts";
import { guild, role } from "@guildxyz/sdk";
import { getAllowlistFromDune } from "./getAllowlist.js";
import dotenv from "dotenv";
dotenv.config();

const DUNE_TICKET_QUERY_ID = 3308995
const DUNE_QUEST_QUERY_ID = 3318483

const account = privateKeyToAccount(process.env.ETH_PRIVATE_KEY);
const walletAddress = account.address;
console.log(walletAddress);
const signerFunction = (message) => account.signMessage({ message });

const { roles: rhRoles } = await guild.get("rabbithole");
const { roles: boostRoles } = await guild.get("boost-protocol");
const questExploreRole = rhRoles.find((role) => role.name === "Quest Explore");
const questAdeptRole = rhRoles.find((role) => role.name === "Quest Adept");
const questChampionRole = rhRoles.find((role) => role.name === "Quest Champion");
const ticketHolderRole = rhRoles.find((role) => role.name === "Ticket Master");
const boostExploreRole = boostRoles.find((role) => role.name === "Boost Explore");

export async function updateRole() {
  try {
    const exploreAllowlist = await getAllowlistFromDune(DUNE_QUEST_QUERY_ID);
    const questAdeptAllowlist = await getAllowlistFromDune(DUNE_QUEST_QUERY_ID, 100);
    const questChampionAllowlist = await getAllowlistFromDune(DUNE_QUEST_QUERY_ID, 500);
    const ticketAllowlist = await getAllowlistFromDune(DUNE_TICKET_QUERY_ID);

    if (questExploreAllowlist) {
      await role.update(questExploreRole.id, walletAddress, signerFunction, {
        requirements: [
          {
            type: "ALLOWLIST",
            data: {
              addresses: exploreAllowlist
            }
          }
        ]
      });
      await role.update(boostExploreRole.id, walletAddress, signerFunction, {
        requirements: [
          {
            type: "ALLOWLIST",
            data: {
              addresses: exploreAllowlist
            }
          }
        ]
      });
      console.log("quest explore role updated");
      console.log("boost explore role updated");
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
