import {VoiceState} from "discord.js"
import {Audio} from "./../structures/Audio"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"

export default class VoiceStateUpdate {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (oldState: VoiceState, newState: VoiceState) => {
        const msg = await this.discord.fetchFirstMessage(newState.guild)
        const sql = new SQLQuery(msg!)
        const leaveVoiceChannel = async () => {
            const connected = newState.guild.voice?.connection?.channel
            const listening = newState.channel?.members.filter((m) => {
                if (m.user.bot) {
                    return false
                } else if (m.voice.deaf) {
                    return false
                } else {
                    return true
                }
            })
            if (connected && !newState.connection?.channel && !listening?.size) {
                const msg = await this.discord.fetchFirstMessage(newState.guild)
                const audio = new Audio(this.discord, msg!)
                audio.deleteQueue()
                await sql.updateColumn("config", "voice", "off")
                newState.guild.voice?.connection?.channel.leave()
            }
        }
        leaveVoiceChannel()

        const linkedChannel = async () => {
            const linked = await sql.fetchColumn("special channels", "linked")
            if (!linked || oldState.channelID === newState.channelID) return
            for (let i = 0; i < linked.length; i++) {
                const curr = JSON.parse(linked[i])
                if (!curr.state || curr.state === "off") continue
                const chan = newState.guild.channels.cache.get(curr.text)
                if (!chan) continue
                if (newState.channelID === curr.voice) {
                    await chan.createOverwrite(newState.member!.id, {VIEW_CHANNEL: true, SEND_MESSAGES: true}, "Linked channel").catch(() => null)
                } else if (oldState.channelID === curr.voice) {
                    const overwrite = chan.permissionOverwrites.find((o) => o.id === oldState.member?.id)
                    await overwrite?.delete().catch(() => null)
                }
            }
        }
        linkedChannel()
    }
}
