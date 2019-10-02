import {ShardingManager} from "discord.js"

require("dotenv").config()
const manager = new ShardingManager("./index.js", {token: process.env.TOKEN})
manager.spawn("auto", 15000, 100000)
manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id + 1}`))
