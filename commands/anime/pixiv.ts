import {Message, SlashCommandBuilder, SlashCommandStringOption} from "discord.js"
import {Command} from "../../structures/Command"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"
import {PixivApi} from "./../../structures/PixivApi"

export default class Pixiv extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Searches for or downloads anime images on pixiv.",
            help:
            `
            _Note: Put the folder mapping in brackets in the format [folderName:tagName, folderName2:tagName2, etc.]._
            \`pixiv\` - Gets a pixiv image with some defaults.
            \`pixiv link/id\` - Gets the pixiv or ugoira image from the link.
            \`pixiv tag\` - Gets a pixiv image with the tag (translated to japanese).
            \`pixiv en tag\` - Gets a pixiv image with the tag (not translated).
            \`pixiv popular\` - Gets a pixiv image from the daily rankings.
            \`pixiv download/dl query [folderMap]?\` - Downloads images on pixiv and uploads the zip file. Folder map will organize certain tags into sub folders.
            \`pixiv r18 tag\` - Gets an R-18 pixiv image from the tag (translated to japanese).
            \`pixiv r18 en tag\` - Gets an R-18 pixiv image from the tag (not translated).
            \`pixiv r18 popular\` - Gets a random image from the R-18 daily rankings.
            \`pixiv r18 download/dl query [folderMap]?\` - Downloads R-18 images and uploads the zip file.
            \`=>pixiv r18 sagiri izumi\`
            \`=>pixiv r18 megumin\`
            \`=>pixiv r18 popular\`
            `,
            examples:
            `
            \`=>pixiv\`
            \`=>pixiv azur lane\`
            \`=>pixiv download black tights\`
            \`=>pixiv download gabriel dropout [gabriel:gabriel, satania:satania, raphiel:raphiel, vignette:vignette]\`
            `,
            aliases: ["p"],
            random: "none",
            cooldown: 60,
            slashEnabled: true
        })
        const tag3Option = new SlashCommandStringOption()
            .setName("tags3")
            .setDescription("Can be tags or optional folder map for the download subcommand.")

        const tag2Option = new SlashCommandStringOption()
            .setName("tags2")
            .setDescription("Can be tags or en/popular for subcommands.")

        const tagOption = new SlashCommandStringOption()
            .setName("tags")
            .setDescription("Can be a link, tags to search, or en/popular/download/r18 for subcommands.")

        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(tagOption)
            .addStringOption(tag2Option)
            .addStringOption(tag3Option)
            .toJSON()
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const pixivApi = new PixivApi(discord, message)
        const perms = new Permission(discord, message)

        const loading = message.channel.lastMessage
        loading?.delete()

        const tags = Functions.combineArgs(args, 1)

        if (tags.match(/\d\d\d+/g)) {
            await pixivApi.getPixivImageID(String(tags.match(/\d+/g)))
            return
        }

        if (args[1]?.toLowerCase() === "r18") {
            if (!perms.checkNSFW()) return
            if (args[2] === "en") {
                const r18Tags = Functions.combineArgs(args, 3)
                await pixivApi.getPixivImage(r18Tags, true, true)
                return
            } else if (args[2] === "popular") {
                await pixivApi.getPopularPixivR18Image()
                return
            } else if (args[2] === "download" || args[2] === "dl") {
                const r18Input = Functions.combineArgs(args, 3)
                const {tags, folderMap} = this.getFolderMap(r18Input)
                await pixivApi.downloadPixivImages(tags, true, folderMap)
                return
            } else {
                const r18Tags = Functions.combineArgs(args, 2)
                await pixivApi.getPixivImage(r18Tags, true)
                return
            }
        }

        if (args[1] === "en") {
            const enTags = Functions.combineArgs(args, 2)
            await pixivApi.getPixivImage(enTags, false, true)
            return
        } else if (args[1] === "download" || args[1] === "dl") {
            const input = Functions.combineArgs(args, 2)
            const {tags, folderMap} = this.getFolderMap(input)
            await pixivApi.downloadPixivImages(tags, false, folderMap)
            return
        } else if (args[1] === "popular") {
            await pixivApi.getPopularPixivImage()
            return
        }

        await pixivApi.getPixivImage(tags)
    }

    public getFolderMap = (tags: string) => {
        let folderMap = undefined as any
        if (tags.includes("[") && tags.includes("]")) {
            const folderArgs = tags.match(/(?<=\[)(.*?)(?=\])/)?.[0]?.split(",")
            tags = tags.replace(/(\[)(.*?)(\])/, "")
            folderMap = []
            const length = folderArgs?.length ?? 0
            for (let i = 0; i < length; i++) {
                const obj = {} as any
                const fArgs = folderArgs![i].split(":")
                obj.folder = fArgs[0]
                obj.tag = fArgs[1]
                folderMap.push(obj)
            }
            return {tags, folderMap}
        } else {
            return {tags, folderMap}
        }
    }
}
