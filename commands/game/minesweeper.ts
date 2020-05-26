import {Message, MessageEmbed, MessageReaction, TextChannel, User} from "discord.js"
import minesweeper from "discord.js-minesweeper"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Minesweeper extends Command {
    private done = false
    private original = null as any
    private revealed = false
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: `Starts a new game of minesweeper.`,
            help:
            `
            \`minesweeper rows? columns?\` - Starts a new game, defaults to 5x5.
            \`minesweeper spoiler rows? columns?\` - Spoiler tag version. No win/lose feedback.
            `,
            examples:
            `
            \`=>minesweeper\`
            \`=>minesweeper spoiler\`
            `,
            aliases: ["mine"],
            random: "none",
            cooldown: 5
        })
    }

    public checkWinLose = (board: string[][], user: User, row: number, column: number, mineCount: number) => {
        if (this.done) return
        const current = this.replaceEmoji(board[row][column]).toLowerCase()
        if (current.includes("bomb")) {
            this.done = true
            return `<@${user.id}>, Sorry but you lost this game! ${this.discord.getEmoji("CirNo")}`
        }
        let lost = false
        let counter = 0
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                const current = this.replaceEmoji(board[i][j]).toLowerCase()
                if (!current.includes("block") || !current.includes("flag")) {
                    counter++
                } else if (current.includes("bomb")) {
                    lost = true
                }
            }
        }
        if (((board.length * board[0].length - mineCount) === counter) && !lost) {
            this.done = true
            return `<@${user.id}>, Congratulations, you won this game of minesweeper! ${this.discord.getEmoji("tohruThumbsUp")}`
        }
    }

    public createMineEmbed = (board: string[][]) => {
        const discord = this.discord
        const embeds = new Embeds(this.discord, this.message)
        const mineEmbed = embeds.createEmbed()
        mineEmbed
        .setAuthor("minesweeper", "https://cdn.imgbin.com/20/16/25/imgbin-minesweeper-computer-icons-bing-maps-video-game-mines-Fqt5GviK7nxmkGFJS0LA8Evpe.jpg")
        .setTitle(`**Minesweeper** ${discord.getEmoji("KannaXD")}`)
        .setDescription(this.replaceEmoji(this.stringifyBoard(board)))
        return mineEmbed
    }

    public replaceEmoji = (game: string) => {
        const discord = this.discord
        const numMap = {
            ":zero:": discord.getEmoji("0n"),
            ":one:": discord.getEmoji("1n"),
            ":two:": discord.getEmoji("2n"),
            ":three:": discord.getEmoji("3n"),
            ":four:": discord.getEmoji("4n"),
            ":five:": discord.getEmoji("5n"),
            ":six:": discord.getEmoji("6n"),
            ":seven:": discord.getEmoji("7n"),
            ":eight:": discord.getEmoji("8n"),
            ":nine:": discord.getEmoji("9n"),
            ":boom:": discord.getEmoji("mineBomb")
        }
        for (let i = 0; i < Object.keys(numMap).length; i++) {
            const regex = new RegExp(Object.keys(numMap)[i], "g")
            game = game.replace(regex, String(Object.values(numMap)[i]))
        }
        return game
    }

    public stringifyBoard = (board: string[][]) => {
        let description = ""
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                description += board[i][j]
            }
            description += "\n"
        }
        return description
    }

    public revealBoard = (board: string[][], game: string[][]) => {
        const temp = Functions.cloneArray(board)
        for (let i = 0; i < temp.length; i++) {
            for (let j = 0; j < temp[0].length; j++) {
                temp[i][j] = this.replaceEmoji(game[i][j].replace(/\|/g, ""))
            }
        }
        return temp
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (discord.checkMuted(message)) if (!perms.checkNSFW()) return
        if (!(message.channel as TextChannel).permissionsFor(message.guild?.me!)?.has("MANAGE_MESSAGES")) {
            await message.reply(`The bot needs the permission **Manage Messages** in order to use this command. ${this.discord.getEmoji("kannaFacepalm")}`)
            return
        }

        if (args[1] === "spoiler") {
            let rows = 5
            let columns = 5
            const mineCount = Math.floor((rows*columns)/3.5)
            if (args[2]) {
                rows = Number(args[2])
                if (args[3]) columns = Number(args[3])
            }
            if (Number.isNaN(rows) || Number.isNaN(columns)) {
                return this.invalidQuery(embeds.createEmbed()
                .setAuthor("minesweeper", "https://cdn.imgbin.com/20/16/25/imgbin-minesweeper-computer-icons-bing-maps-video-game-mines-Fqt5GviK7nxmkGFJS0LA8Evpe.jpg")
                .setTitle(`**Minesweeper** ${discord.getEmoji("KannaXD")}`), "The row or column count is invalid.")
            }
            const mine = new minesweeper({
                rows,
                columns,
                mines: mineCount,
                returnType: "emoji"
              })
            const game = mine.start() as string
            const mineEmbed = embeds.createEmbed()
            mineEmbed
            .setAuthor("minesweeper", "https://cdn.imgbin.com/20/16/25/imgbin-minesweeper-computer-icons-bing-maps-video-game-mines-Fqt5GviK7nxmkGFJS0LA8Evpe.jpg")
            .setTitle(`**Minesweeper** ${discord.getEmoji("KannaXD")}`)
            .setDescription(this.replaceEmoji(this.replaceEmoji(game)))
            message.channel.send(mineEmbed)
            return
        }

        let rows = 5
        let columns = 5
        const mineCount = Math.floor((rows*columns)/3.5)
        if (args[1]) {
            rows = Number(args[1])
            if (args[2]) columns = Number(args[2])
        }
        if (Number.isNaN(rows) || Number.isNaN(columns)) {
            return this.invalidQuery(embeds.createEmbed()
            .setAuthor("minesweeper", "https://cdn.imgbin.com/20/16/25/imgbin-minesweeper-computer-icons-bing-maps-video-game-mines-Fqt5GviK7nxmkGFJS0LA8Evpe.jpg")
            .setTitle(`**Minesweeper** ${discord.getEmoji("KannaXD")}`), "The row or column count is invalid.")
        }
        const mine = new minesweeper({
            rows,
            columns,
            mines: mineCount,
            returnType: "matrix"
        })
        const game = mine.start() as string[][]
        const board: string[][] = Functions.create2DArray(rows, columns)
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j] = `${discord.getEmoji("mineBlock")}`
            }
        }

        const mineEmbed = this.createMineEmbed(board)
        const msg = await message.channel.send(mineEmbed)
        const reactions = ["arrayReact", "mineFlagReact", "mineReveal"]
        for (let i = 0; i < reactions.length; i++) await msg.react(discord.getEmoji(reactions[i]))

        const arrayCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("arrayReact") && user.bot === false
        const flagCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("mineFlagReact") && user.bot === false
        const revealCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("mineReveal") && user.bot === false
        const array = msg.createReactionCollector(arrayCheck)
        const flag = msg.createReactionCollector(flagCheck)
        const reveal = msg.createReactionCollector(revealCheck)

        array.on("collect", async (reaction: MessageReaction, user: User) => {
            await reaction.users.remove(user).catch(() => null)
            let row = 1
            let column = 1
            const self = this
            async function getRowsColumns(response: Message) {
                row = Number(response.content.match(/\d+/g) ? response.content.match(/\d+/g)?.[0] : NaN)
                column = Number(response.content.match(/\d+/g) ? response.content.match(/\d+/g)?.[1] : NaN)
                if (Number.isNaN(row) || Number.isNaN(column) || row-1 > rows || column-1 > columns) {
                    const rep = await response.reply("The row or column is invalid.")
                    await rep.delete({timeout: 2000})
                } else {
                    row = row - 1
                    column = column -1
                    board[row][column] = game[row][column].replace(/\|/g, "")
                    self.original = Functions.cloneArray(board)
                    const mineEmbed = self.createMineEmbed(board)
                    msg.edit(mineEmbed)
                }
                await response.delete()
            }
            const numReply = await msg.channel.send(`<@${user.id}>, Enter the row number followed by the column number.`)
            await embeds.createPrompt(getRowsColumns)
            await numReply.delete()
            const win = this.checkWinLose(board, user, row, column, mineCount)
            if (win) msg.channel.send(win)
        })

        flag.on("collect", async (reaction: MessageReaction, user: User) => {
            await reaction.users.remove(user).catch(() => null)
            const self = this
            async function getRowsColumns(response: Message) {
                let row = Number(response.content.match(/\d+/g) ? response.content.match(/\d+/g)?.[0] : NaN)
                let column = Number(response.content.match(/\d+/g) ? response.content.match(/\d+/g)?.[1] : NaN)
                if (Number.isNaN(row) || Number.isNaN(column) || row-1 > rows || column-1 > columns) {
                    const rep = await response.reply("The row or column is invalid.")
                    await rep.delete({timeout: 2000})
                } else {
                    row = row - 1
                    column = column - 1
                    board[row][column] = `${discord.getEmoji("mineFlag")}`
                    self.original = Functions.cloneArray(board)
                    const mineEmbed = self.createMineEmbed(board)
                    msg.edit(mineEmbed)
                }
                await response.delete()
            }
            const numReply = await msg.channel.send(`<@${user.id}>, Enter the row number followed by the column number.`)
            await embeds.createPrompt(getRowsColumns)
            await numReply.delete()
        })

        reveal.on("collect", async (reaction: MessageReaction, user: User) => {
            await reaction.users.remove(user).catch(() => null)
            if (!this.done) {
                await msg.channel.send(`<@${user.id}>, You revealed the game before it was done so you lost by default! ${discord.getEmoji("tohruSmug")}`)
                this.done = true
            }
            if (this.original === null) this.original = Functions.cloneArray(board)
            let mineEmbed: MessageEmbed
            const newBoard = this.revealBoard(board, game)
            if (this.revealed) {
                mineEmbed = this.createMineEmbed(this.original)
                this.revealed = false
            } else {
                mineEmbed = this.createMineEmbed(newBoard)
                this.revealed = true
            }
            await msg.edit(mineEmbed)
        })
    }

}
