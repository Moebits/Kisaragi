import {VoiceState} from "discord.js"
import {Audio} from "./../structures/Audio"
import {Kisaragi} from "./../structures/Kisaragi"

export default class VoiceStateUpdate {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (oldState: VoiceState, newState: VoiceState) => {
        const connected = newState.guild.voice?.connection?.channel
        if (connected && !newState.connection?.channel && (oldState.channel?.members.size === 1)) {
            const msg = await this.discord.fetchFirstMessage(newState.guild)
            const audio = new Audio(this.discord, msg!)
            audio.deleteQueue()
            newState.guild.voice?.connection?.channel.leave()
        }
    }
}
