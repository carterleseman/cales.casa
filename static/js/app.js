import { initPrograms } from "./program.js";
import { updateTime } from "./taskbar.js";
import { minecraftModal } from "./modals/minecraft.js";

initPrograms();

// Update the time every minute
setInterval(updateTime, 1000);

updateTime();

minecraftModal();