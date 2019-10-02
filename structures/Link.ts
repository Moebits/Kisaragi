import {Message} from "discord.js"
import {Kisaragi} from "./Kisaragi.js"
const linkCool = new Set()

export class Link {
    constructor(private readonly discord: Kisaragi) {}

    public linkRun = async (path: string, msg: Message, args: string[]) => {
        if (linkCool.has(msg.guild!.id)) {
            const reply = await msg.reply("This command is under a 30 second cooldown!")
            reply.delete({timeout: 3000})
            return
        }
        linkCool.add(msg.guild!.id)
        setTimeout(() => linkCool.delete(msg.guild!.id), 30000)
        const loading = await msg.channel.send(`**Loading** ${this.discord.getEmoji("gabCircle")}`)
        const cmd = new (require(path).default)()
        await cmd.run(this.discord, msg, args).catch((err: Error) => msg.channel.send(this.discord.cmdError(err)))
        loading.delete({timeout: 1000})
    }

    public postLink = async (msg: Message) => {
        if (msg.content.startsWith("https://www.youtube.com/channel/") || msg.content.startsWith("https://www.youtube.com/c/")) {
            const path = require("../commands/website/youtube.js")
            await this.linkRun(path, msg, ["youtube", "channel", msg.content])
            return
        }
        if (msg.content.startsWith("https://www.youtube.com/watch") || msg.content.startsWith("https://youtu.be/")) {
            const path = require("../commands/website/youtube.js")
            await this.linkRun(path, msg, ["youtube", "video", msg.content])
            return
        }
        if (msg.content.startsWith("https://www.youtube.com/playlist")) {
            const path = require("../commands/website/youtube.js")
            await this.linkRun(path, msg, ["youtube", "playlist", msg.content])
            return
        }
        if (msg.content.startsWith("https://www.pixiv.net/member_illust.php?mode=medium&illust_id=")) {
            const path = require("../commands/anime/pixiv.js")
            await this.linkRun(path, msg, ["pixiv", msg.content])
            return
        }
        if (msg.content.startsWith("https://danbooru.donmai.us/posts/")) {
            const path = require("../commands/anime/danbooru.js")
            await this.linkRun(path, msg, ["danbooru", msg.content])
            return
        }
        if (msg.content.startsWith("https://gelbooru.com/index.php?page=post&s=view&id=")) {
            const path = require("../commands/anime/gelbooru.js")
            await this.linkRun(path, msg, ["gelbooru", msg.content])
            return
        }
        if (msg.content.startsWith("https://konachan.net/post/show/")) {
            const path = require("../commands/anime/konachan.js")
            await this.linkRun(path, msg, ["konachan", msg.content])
            return
        }
        if (msg.content.startsWith("https://lolibooru.moe/post/show/")) {
            const path = require("../commands/anime/lolibooru.js")
            await this.linkRun(path, msg, ["lolibooru", msg.content])
            return
        }
        if (msg.content.startsWith("https://yande.re/post/show/")) {
            const path = require("../commands/anime/yandere.js")
            await this.linkRun(path, msg, ["yandere", msg.content])
            return
        }
        if (msg.content.startsWith("https://rule34.xxx/index.php?page=post&s=view&id=")) {
            const path = require("../commands/hentai/rule34.js")
            await this.linkRun(path, msg, ["rule34", msg.content])
            return
        }
        if (msg.content.startsWith("https://nhentai.net/g/")) {
            const path = require("../commands/hentai/nhentai.js")
            await this.linkRun(path, msg, ["nhentai", msg.content])
            return
        }
    }
}
