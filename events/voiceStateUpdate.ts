import {VoiceState} from "discord.js"
import {Kisaragi} from "./../structures/Kisaragi"

export default class VoiceStateUpdate {
    constructor(private readonly discord: Kisaragi) {}

    public run = (oldState: VoiceState, newState: VoiceState) => {
        const connected = newState.guild.voice?.connection?.channel
        if (connected && !newState.connection?.channel && (oldState.channel?.members.size === 1)) {
            newState.guild.voice?.connection?.channel.leave()
        }
    }
}
