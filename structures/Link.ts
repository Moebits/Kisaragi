import {Message} from "discord.js"
import {Kisaragi} from "./Kisaragi.js"
const linkCool = new Set()

export class Link {
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    public linkRun = async (path: string, msg: Message, args: string[]) => {
        if (linkCool.has(msg.guild!.id)) {
            const reply = await msg.reply("This command is under a 30 second cooldown!")
            reply.delete({timeout: 3000})
            return
        }
        linkCool.add(msg.guild!.id)
        setTimeout(() => linkCool.delete(this.message.guild!.id), 30000)
        const loading = await msg.channel.send(`**Loading** ${this.discord.getEmoji("gabCircle")}`)
        const cmd = new (require(path).default)()
        await cmd.run(this.discord, msg, args).catch((err: Error) => msg.channel.send(this.discord.cmdError(msg, err)))
        loading.delete({timeout: 1000})
    }

    public postLink = async () => {
        if (this.message.content.startsWith("https://www.youtube.com/channel/") || this.message.content.startsWith("https://www.youtube.com/c/")) {
            const path = require("../commands/website/youtube.js")
            await this.linkRun(path, this.message, ["youtube", "channel", this.message.content])
            return
        }
        if (this.message.content.startsWith("https://www.youtube.com/watch") || this.message.content.startsWith("https://youtu.be/")) {
            const path = require("../commands/website/youtube.js")
            await this.linkRun(path, this.message, ["youtube", "video", this.message.content])
            return
        }
        if (this.message.content.startsWith("https://www.youtube.com/playlist")) {
            const path = require("../commands/website/youtube.js")
            await this.linkRun(path, this.message, ["youtube", "playlist", this.message.content])
            return
        }
        if (this.message.content.startsWith("https://www.pixiv.net/member_illust.php?mode=medium&illust_id=")) {
            const path = require("../commands/anime/pixiv.js")
            await this.linkRun(path, this.message, ["pixiv", this.message.content])
            return
        }
        if (this.message.content.startsWith("https://danbooru.donmai.us/posts/")) {
            const path = require("../commands/anime/danbooru.js")
            await this.linkRun(path, this.message, ["danbooru", this.message.content])
            return
        }
        if (this.message.content.startsWith("https://gelbooru.com/index.php?page=post&s=view&id=")) {
            const path = require("../commands/anime/gelbooru.js")
            await this.linkRun(path, this.message, ["gelbooru", this.message.content])
            return
        }
        if (this.message.content.startsWith("https://konachan.net/post/show/")) {
            const path = require("../commands/anime/konachan.js")
            await this.linkRun(path, this.message, ["konachan", this.message.content])
            return
        }
        if (this.message.content.startsWith("https://lolibooru.moe/post/show/")) {
            const path = require("../commands/anime/lolibooru.js")
            await this.linkRun(path, this.message, ["lolibooru", this.message.content])
            return
        }
        if (this.message.content.startsWith("https://yande.re/post/show/")) {
            const path = require("../commands/anime/yandere.js")
            await this.linkRun(path, this.message, ["yandere", this.message.content])
            return
        }
        if (this.message.content.startsWith("https://rule34.xxx/index.php?page=post&s=view&id=")) {
            const path = require("../commands/hentai/rule34.js")
            await this.linkRun(path, this.message, ["rule34", this.message.content])
            return
        }
        if (this.message.content.startsWith("https://nhentai.net/g/")) {
            const path = require("../commands/hentai/nhentai.js")
            await this.linkRun(path, this.message, ["nhentai", this.message.content])
            return
        }
    }
}
