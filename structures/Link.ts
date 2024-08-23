import {Collection, Message} from "discord.js"
import {CommandFunctions} from "./CommandFunctions"
import {Cooldown} from "./Cooldown"
import {Kisaragi} from "./Kisaragi.js"
const linkCool = new Collection() as Collection<string, Collection<string, number>>

export class Link {
    private readonly cmd: CommandFunctions
    private readonly cool: Cooldown
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {
        this.cmd = new CommandFunctions(this.discord, this.message)
        this.cool = new Cooldown(this.discord, this.message)
    }

    public linkRun = async (msg: Message, args: string[]) => {
        const onCooldown = this.cool.cmdCooldown(args[0], 30, linkCool)
        if (onCooldown && (msg.author!.id !== process.env.OWNER_ID)) return msg.reply({embeds: [onCooldown]})
        const loading = await msg.channel.send(`**Fetching Link** ${this.discord.getEmoji("gabCircle")}`) as Message
        await this.cmd.runCommand(msg, args)
        setTimeout(() => loading.delete(), 1000)
    }

    public postLink = async () => {
        const link = this.message.content.match(/(https?:\/\/)(.*?)(?= |$)/)?.[0] ?? ""
        if (!link) return
        if (link.includes("youtube.com")) {
            await this.linkRun(this.message, ["youtube", link])
            return
        }
        if (link.includes("pixiv.net")) {
            await this.linkRun(this.message, ["pixiv", link])
            return
        }
        if (link.includes("danbooru.donmai.us")) {
            await this.linkRun(this.message, ["danbooru", link])
            return
        }
        if (link.includes("gelbooru.com")) {
            await this.linkRun(this.message, ["gelbooru", link])
            return
        }
        if (link.includes("konachan.net")) {
            await this.linkRun(this.message, ["konachan", link])
            return
        }
        if (link.includes("lolibooru.moe")) {
            await this.linkRun(this.message, ["lolibooru", link])
            return
        }
        if (link.includes("yande.re")) {
            await this.linkRun(this.message, ["yandere", link])
            return
        }
        if (link.includes("rule34.xxx")) {
            await this.linkRun(this.message, ["rule34", link])
            return
        }
        if (link.includes("nhentai.net")) {
            await this.linkRun(this.message, ["nhentai", link])
            return
        }

        if (link.includes("deviantart.com")) {
            await this.linkRun(this.message, ["deviantart", link])
            return
        }

        if (link.includes("newgrounds.com")) {
            await this.linkRun(this.message, ["newgrounds", link])
            return
        }

        if (link.includes("crunchyroll.com")) {
            await this.linkRun(this.message, ["crunchyroll", link])
            return
        }

        if (link.includes("kitsu.io/anime")) {
            await this.linkRun(this.message, ["anime", link])
            return
        }

        if (link.includes("kitsu.io/manga")) {
            await this.linkRun(this.message, ["manga", link])
            return
        }

        if (link.includes("azurlane.koumakan.jp")) {
            await this.linkRun(this.message, ["azurlane", link])
            return
        }

        if (link.includes("gdprofiles.com")) {
            await this.linkRun(this.message, ["gd", "user", link])
            return
        }

        if (link.includes("osu.ppy.sh")) {
            await this.linkRun(this.message, ["osu", link])
            return
        }

        if (link.includes("kancolle.fandom.com")) {
            await this.linkRun(this.message, ["kancolle", link])
            return
        }

        if (link.includes("jisho.org")) {
            await this.linkRun(this.message, ["jisho", link])
            return
        }

        if (link.includes("daysoftheyear.com")) {
            await this.linkRun(this.message, ["holiday", link])
            return
        }

        if (link.includes("merriam-webster.com/dictionary")) {
            await this.linkRun(this.message, ["define", link])
            return
        }

        if (link.includes("merriam-webster.com/thesaurus")) {
            await this.linkRun(this.message, ["thesaurus", link])
            return
        }

        if (link.includes("boards.4channel.org")) {
            await this.linkRun(this.message, ["4chan", link])
            return
        }

        if (link.includes("giphy.com")) {
            await this.linkRun(this.message, ["giphy", link])
            return
        }

        if (link.includes("google.com") && link.match(/tbm=isch/)) {
            await this.linkRun(this.message, ["images", link])
            return
        }

        if (link.includes("google.com")) {
            await this.linkRun(this.message, ["google", link])
            return
        }

        if (link.includes("myanimelist.net")) {
            await this.linkRun(this.message, ["mal", link])
            return
        }

        if (link.includes("pinterest.com")) {
            await this.linkRun(this.message, ["pinterest", link])
            return
        }

        if (link.includes("reddit.com")) {
            await this.linkRun(this.message, ["reddit", link])
            return
        }

        if (link.includes("soundcloud.com")) {
            await this.linkRun(this.message, ["soundcloud", link])
            return
        }

        if (link.includes("trello.com")) {
            await this.linkRun(this.message, ["trello", link])
            return
        }

        if (link.includes("twitch.tv")) {
            await this.linkRun(this.message, ["twitch", link])
            return
        }

        if (link.includes("twitter.com")) {
            await this.linkRun(this.message, ["twitter", link])
            return
        }

        if (link.includes("en.wikipedia.org")) {
            await this.linkRun(this.message, ["wikipedia", link])
            return
        }

        if (link.includes("discord.js.org") || link.includes("discord-akairo.github.io")) {
            await this.linkRun(this.message, ["discordjs", link])
            return
        }

        if (link.includes("github.com")) {
            await this.linkRun(this.message, ["github", link])
            return
        }

        if (link.includes("imgur.com")) {
            await this.linkRun(this.message, ["imgur", link])
            return
        }

        if (link.includes("developer.mozilla.org")) {
            await this.linkRun(this.message, ["mdn", link])
            return
        }

        if (link.includes("npmjs.com")) {
            await this.linkRun(this.message, ["npm", link])
            return
        }

        if (link.includes("patreon.com")) {
            await this.linkRun(this.message, ["patreon", link])
            return
        }

        if (link.includes("tenor.com")) {
            await this.linkRun(this.message, ["tenor", link])
            return
        }

        if (link.includes("urbandictionary.com")) {
            await this.linkRun(this.message, ["urban", link])
            return
        }

        if (link.includes("xkcd.com")) {
            await this.linkRun(this.message, ["xkcd", link])
            return
        }
    }
}
