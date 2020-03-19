import {ShardingManager} from "discord.js"

require("dotenv").config()
const manager = new ShardingManager("./index.js", {token: process.env.TOKEN})
manager.spawn("auto", 15000, 1000000)
manager.on("shardCreate", (shard) => console.log(`Launching Shard ${shard.id}`))
