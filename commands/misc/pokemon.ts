import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Pokemon extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Gets information on a pokemon.",
            help:
            `
            \`pokemon\` - Posts info on a pokemon
            `,
            examples:
            `
            \`=>pokemon eevee\`
            `,
            aliases: ["pokedex"],
            random: "none",
            cooldown: 10
        })
    }

    public getInfo = (result: any, image: string) => {
        const discord = this.discord
        const embeds = new Embeds(discord, this.message)
        const stats = result.stats.map((s: any) => `${discord.getEmoji("star")}_${Functions.toProperCase(s.stat.name.replace(/-/g, " "))}:_ \`${s.base_stat}\``)
        const pokemonEmbed = embeds.createEmbed()
        pokemonEmbed
        .setAuthor("pokemon", "https://i.pinimg.com/originals/50/e1/db/50e1db4684e6f697f93590950eb832f6.png", "https://pokeapi.co/")
        .setTitle(`**Pokemon Search** ${discord.getEmoji("vigneXD")}`)
        .setImage(result.sprites[image])
        .setDescription(
            `${discord.getEmoji("star")}_Name:_ **${Functions.toProperCase(result.name)}**\n` +
            `${discord.getEmoji("star")}_Type:_ **${result.types?.map((t: any) => Functions.toProperCase(t.type.name))?.join(", ")}**\n` +
            `${discord.getEmoji("star")}_ID:_ \`${result.id}\`\n` +
            `${discord.getEmoji("star")}_Height:_ **${(result.height / 10.0).toFixed(1)}m**\n` +
            `${discord.getEmoji("star")}_Weight:_ **${(result.weight / 10.0).toFixed(1)}kg**\n` +
            `${discord.getEmoji("star")}_Base Experience:_ **${result.base_experience}**\n` +
            `${discord.getEmoji("star")}_Held Items:_ **${result.held_items?.[0] ? result.held_items.join(", ") : "None"}**\n` +
            `${discord.getEmoji("star")}_Base Experience:_ **${result.base_experience}**\n` +
            stats.join("\n")
        )
        return pokemonEmbed
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const Pokedex = require("pokedex-promise-v2")
        const pokemon = new Pokedex()

        const query = Functions.combineArgs(args, 1).trim()

        if (!query) {
            return this.noQuery(embeds.createEmbed()
            .setAuthor("pokemon", "https://i.pinimg.com/originals/50/e1/db/50e1db4684e6f697f93590950eb832f6.png", "https://pokeapi.co/")
            .setTitle(`**Pokemon Search** ${discord.getEmoji("vigneXD")}`))
        }

        const result = await pokemon.getPokemonByName(query)

        if (!result.hasOwnProperty("name")) {
            return this.invalidQuery(embeds.createEmbed()
            .setAuthor("pokemon", "https://i.pinimg.com/originals/50/e1/db/50e1db4684e6f697f93590950eb832f6.png", "https://pokeapi.co/")
            .setTitle(`**Pokemon Search** ${discord.getEmoji("vigneXD")}`))
        }

        const pokemonArray: MessageEmbed[] = []
        pokemonArray.push(this.getInfo(result, "front_default"))
        pokemonArray.push(this.getInfo(result, "front_shiny"))
        pokemonArray.push(this.getInfo(result, "back_default"))
        pokemonArray.push(this.getInfo(result, "back_shiny"))
        return embeds.createReactionEmbed(pokemonArray, true, true)
    }
}
