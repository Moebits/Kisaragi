import {Message, Role} from "discord.js"
import {Kisaragi} from "./Kisaragi"
import {SQLQuery} from "./SQLQuery"

export class Permissions {
    private readonly sql = new SQLQuery(this.message)
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    // Check Mod
    public checkMod = async (msg: Message, ignore?: boolean): Promise<boolean> => {
        if (msg.author.id === this.discord.user!.id) return false
        const mod = await this.sql.fetchColumn("special roles", "mod role")
        if (!mod.join("")) {
            if (ignore) return true
            msg.reply("In order to use moderator commands, you must first " +
            "configure the server's moderator role using the **mod** command!")
            return true
        } else {
            const modRole = msg.member!.roles.find((r: Role) => r.id === mod.join("").trim())
            if (!modRole) {
                if (ignore) return true
                msg.reply("In order to use moderator commands, you must have " +
                `the mod role which is currently set to <@&${mod.join("").trim()}>!`)
                return true
            }
        }
        return false
    }

    // Check Admin
    public checkAdmin = async (msg: Message, ignore?: boolean): Promise<boolean> => {
        if (msg.author.id === this.discord.user!.id) return false
        const admin = await this.sql.fetchColumn("special roles", "admin role")
        if (!admin.join("")) {
            if (ignore) return true
            msg.reply("In order to use administrator commands, you must first " +
            "configure the server's administrator role using the **mod** command!")
            return true
        } else {
            const adminRole = msg.member!.roles.find((r: Role) => r.id === admin.join("").trim())
            if (!adminRole) {
                if (ignore) return true
                msg.reply("In order to use administrator commands, you must have " +
                `the admin role which is currently set to <@&${admin.join("").trim()}>!`)
                return true
            }
        }
        return false
    }

    // Check Bot Dev
    public checkBotDev = (msg: Message): boolean => {
        if (msg.author.id === this.discord.user!.id) return false
        if (msg.author.id === process.env.OWNER_ID) {
            return false
        } else {
            msg.reply("Only the bot developer can use bot developer commands")
            return true
        }
    }
}
