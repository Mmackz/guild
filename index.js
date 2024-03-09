import cron from "node-cron";
import { updateRole } from "./lib/updateRole.js";

cron.schedule("0 0 * * *", updateRole);

updateRole();
