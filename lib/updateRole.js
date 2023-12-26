import { privateKeyToAccount } from "viem/accounts";
import { guild, role } from "@guildxyz/sdk";
import { getQuesterAllowlist } from "./getQuesterAllowlist.js";
import { getTicketAllowlist } from "./getTicketAllowlist.js";
import dotenv from "dotenv";
dotenv.config();

const GUILD_NAME = "rabbithole";

const account = privateKeyToAccount(process.env.ETH_PRIVATE_KEY);
const walletAddress = account.address;
console.log(walletAddress);
const signerFunction = (message) => account.signMessage({ message });

const { roles } = await guild.get(GUILD_NAME);
const questExploreRole = roles.find((role) => role.name === "Quest Explore");
const ticketHolderRole = roles.find((role) => role.name === "Ticket Master");

export async function updateRole() {
  try {
    const questerAllowlist = await getQuesterAllowlist();
    const ticketAllowlist = await getTicketAllowlist();

    if (questerAllowlist) {
      await role.update(guildRole.id, walletAddress, signerFunction, {
        requirements: [
          {
            type: "ALLOWLIST",
            data: {
              addresses: questerAllowlist
            }
          }
        ]
      });
      console.log("quester role updated");
    }
    if (ticketAllowlist) {
      await role.update(guildRole.id, walletAddress, signerFunction, {
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
