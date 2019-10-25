import {Collection, Message} from "discord.js"
import {CommandFunctions} from "./CommandFunctions"
import {Cooldown} from "./Cooldown"
import {Kisaragi} from "./Kisaragi.js"
const linkCool = new Collection() as Collection<string, Collection<string, number>>

export class Link {
    private readonly cmd = new CommandFunctions(this.discord, this.message)
    private readonly cool = new Cooldown(this.discord, this.message)
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    public linkRun = async (msg: Message, args: string[]) => {
        const onCooldown = this.cool.cmdCooldown(args[0], 30, linkCool)
        if (onCooldown && (msg.author!.id !== process.env.OWNER_ID)) return msg.reply({embed: onCooldown})
        const loading = await msg.channel.send(`**Fetching Link** ${this.discord.getEmoji("gabCircle")}`) as Message
        await this.cmd.runCommand(msg, args)
        loading.delete({timeout: 1000})
    }

    public postLink = async () => {
        if (this.message.content.includes("youtube.com/channel") || this.message.content.includes("youtube.com/c")) {
            await this.linkRun(this.message, ["youtube", "channel", this.message.content])
            return
        }
        if (this.message.content.includes("youtube.com/watch") || this.message.content.includes("youtu.be")) {
            await this.linkRun(this.message, ["youtube", "video", this.message.content])
            return
        }
        if (this.message.content.includes("youtube.com/playlist")) {
            await this.linkRun(this.message, ["youtube", "playlist", this.message.content])
            return
        }
        if (this.message.content.includes("pixiv.net")) {
            await this.linkRun(this.message, ["pixiv", this.message.content])
            return
        }
        if (this.message.content.includes("danbooru.donmai.us")) {
            await this.linkRun(this.message, ["danbooru", this.message.content])
            return
        }
        if (this.message.content.includes("gelbooru.com")) {
            await this.linkRun(this.message, ["gelbooru", this.message.content])
            return
        }
        if (this.message.content.includes("konachan.net")) {
            await this.linkRun(this.message, ["konachan", this.message.content])
            return
        }
        if (this.message.content.includes("lolibooru.moe")) {
            await this.linkRun(this.message, ["lolibooru", this.message.content])
            return
        }
        if (this.message.content.includes("yande.re")) {
            await this.linkRun(this.message, ["yandere", this.message.content])
            return
        }
        if (this.message.content.includes("rule34.xxx")) {
            await this.linkRun(this.message, ["rule34", this.message.content])
            return
        }
        if (this.message.content.includes("nhentai.net")) {
            await this.linkRun(this.message, ["nhentai", this.message.content])
            return
        }

        if (this.message.content.includes("deviantart.com")) {
            await this.linkRun(this.message, ["deviantart", this.message.content])
            return
        }
    }
}
