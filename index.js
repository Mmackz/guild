import cron from "node-cron";
import { updateRole } from "./lib/updateRole.js";

cron.schedule("0 */6 * * *", updateRole);
updateRole()