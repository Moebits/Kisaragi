import chalk from "chalk"
import moment from "moment"
import {Kisaragi} from "./../structures/Kisaragi"

export default class Ready {
    constructor(private readonly discord: Kisaragi) {}

    public run = () => {
      this.discord.user!.setPresence({activity: {type: "STREAMING", name: `=>help | ${this.discord.users.size} users`, url: "https://www.twitch.tv/imtenpi"}})
      const timestamp = `${moment().format("MM DD YYYY hh:mm:ss")} ->`
      const logString = `${timestamp} Logged in as ${this.discord.user!.tag}!`
      const readyString = `${timestamp} Ready in ${this.discord.guilds.size} guilds on ${this.discord.channels.size} channels, for a total of ${this.discord.users.size} users.`
      console.log(chalk`{magentaBright ${logString}}`)
      console.log(chalk`{magentaBright ${readyString}}`)
    }
}
