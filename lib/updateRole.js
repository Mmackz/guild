import { privateKeyToAccount } from "viem/accounts";
import { guild, role } from "@guildxyz/sdk";
import { getAllowlistFromDune, getBoostAllowlist } from "./getAllowlist.js";
import dotenv from "dotenv";
dotenv.config();

const DUNE_TICKET_QUERY_ID = 3308995

const account = privateKeyToAccount(process.env.ETH_PRIVATE_KEY);
const walletAddress = account.address;
console.log(walletAddress);
const signerFunction = (message) => account.signMessage({ message });

const { roles } = await guild.get("boost-protocol");
const boostExploreRole = roles.find((role) => role.name === "Boost Explore");
const boostAdeptRole = roles.find((role) => role.name === "Boost Adept");
const boostChampionRole = roles.find((role) => role.name === "Boost Champion");
const ticketHolderRole = roles.find((role) => role.name === "Ticket Master");


export async function updateRole() {
  try {

    console.log("Updating roles at: UTC ", new Date().toLocaleString());

    const exploreAllowlist = await getBoostAllowlist();
    const adeptAllowlist = await getBoostAllowlist(100);
    const championAllowlist = await getBoostAllowlist(500);
    const ticketAllowlist = await getAllowlistFromDune(DUNE_TICKET_QUERY_ID);

    if (exploreAllowlist && exploreAllowlist.length) {
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
      console.log("boost explore role updated");
    }

    if (adeptAllowlist && adeptAllowlist.length) {
      await role.update(boostAdeptRole.id, walletAddress, signerFunction, {
        requirements: [
          {
            type: "ALLOWLIST",
            data: {
              addresses: adeptAllowlist
            }
          }
        ]
      });
      console.log("boost adept role updated");
    }

    if (championAllowlist && championAllowlist.length) {
      await role.update(boostChampionRole.id, walletAddress, signerFunction, {
        requirements: [
          {
            type: "ALLOWLIST",
            data: {
              addresses: championAllowlist
            }
          }
        ]
      });
      console.log("boost champion role updated");
    }

    if (ticketAllowlist && ticketAllowlist.length) {
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
