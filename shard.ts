import {ShardingManager} from "discord.js"
import * as config from "./config.json"

require("dotenv").config()
const token = config.testing === "off" ? process.env.TOKEN : process.env.TEST_TOKEN
const manager = new ShardingManager("./index.js", {token})
manager.spawn("auto", 15000, 10000000)
manager.on("shardCreate", (shard) => console.log(`Launching Shard ${shard.id}`))
