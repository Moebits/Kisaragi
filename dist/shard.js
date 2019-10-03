"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
require("dotenv").config();
const manager = new discord_js_1.ShardingManager("./index.js", { token: process.env.TOKEN });
manager.spawn(1, 15000, 100000);
manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id + 1}`));
//# sourceMappingURL=shard.js.map