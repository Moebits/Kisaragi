import {Message} from "discord.js"
import * as SoundCloud from "soundcloud-api-client"
import {Command} from "../../structures/Command"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Soundcloud extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {

        const clientId = "9aB60VZycIERY07OUTVBL5GeErnTA0E4"
        const soundcloud = new SoundCloud({clientId})

        const query = Functions.combineArgs(args, 1)

        const tracks = await soundcloud.get("/tracks", {query})
        console.log(tracks)

    }
}
