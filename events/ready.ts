import chalk from "chalk"
import moment from "moment"
import {Kisaragi} from "./../structures/Kisaragi"

export default class Ready {
    constructor(private readonly discord: Kisaragi) {}

    public run = () => {
      this.discord.user!.setPresence({activity: {type: "PLAYING", name: `=>help | ${this.discord.guilds.cache.size} guilds`, url: "https://www.twitch.tv/imtenpi"}, status: "dnd"})
      const timestamp = `${moment().format("MM DD YYYY hh:mm:ss")} ->`
      const logString = `${timestamp} Logged in as ${this.discord.user!.tag}!`
      const readyString = `${timestamp} Ready in ${this.discord.guilds.cache.size} guilds on ${this.discord.channels.cache.size} channels, for a total of ${this.discord.users.cache.size} users.`
      console.log(chalk`{magentaBright ${logString}}`)
      console.log(chalk`{magentaBright ${readyString}}`)
      this.discord.postGuildCount()
    }
}
