import { privateKeyToAccount } from "viem/accounts";
import { guild, role } from "@guildxyz/sdk";
import { getAllowlist } from "./getAllowlist.js";
import dotenv from "dotenv";
dotenv.config();

const GUILD_NAME = "rabbithole";
const ROLE_NAME = "Quest Explore";

const account = privateKeyToAccount(process.env.ETH_PRIVATE_KEY);
const walletAddress = account.address;
console.log(walletAddress);
const signerFunction = (message) => account.signMessage({ message });

const { roles } = await guild.get(GUILD_NAME);
const guildRole = roles.find((role) => role.name === ROLE_NAME);

export async function updateRole() {
   try {
      const allowlist = await getAllowlist();

      if (allowlist) {
         await role.update(guildRole.id, walletAddress, signerFunction, {
            requirements: [
               {
                  type: "ALLOWLIST",
                  data: {
                     addresses: allowlist
                  }
               }
            ]
         });
         console.log("role updated");
      }
   } catch (error) {
      console.error(error);
      console.log("There was an error updating the role");
   }
}
