import {CollegiateThesaurus} from "mw-dict";

exports.run = async (client: any, message: any, args: string[]) => {
    const thesaurus = new CollegiateThesaurus(process.env.THESAURUS_API_KEY);
    let word = client.combineArgs(args, 1);
    let thesaurusEmbed = client.createEmbed();
    let result;
    try {
        result = await thesaurus.lookup(word.trim());
    } catch (error) {
        thesaurusEmbed
        .setAuthor("merriam webster", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Merriam-Webster_logo.svg/1200px-Merriam-Webster_logo.svg.png")
        .setTitle(`**Word Lookup** ${client.getEmoji("raphi")}`)
        .setDescription(`No synonyms were found. Here are some word suggestions: \n${error.suggestions.join(", ")}`)
        message.channel.send(thesaurusEmbed);
        return;
    }

    let meaningArray: any = [];
    let exampleArray: any = [];
    let synonymArray: any = [];
    let antonymArray: any = [];
    for (let i in result[0].definition) {
        meaningArray.push(result[0].definition[i].meanings[0]);
        if (result[0].definition[i].illustrations) {
            exampleArray.push(result[0].definition[i].illustrations[0]) 
        } else {
            exampleArray.push("");
        }
        synonymArray.push(result[0].definition[i].synonyms.join(", "));
        if (result[0].definition[i].antonyms) {
            exampleArray.push(result[0].definition[i].antonyms.join(", ")) 
        } else {
            antonymArray.push("");
        }
    }

    let synonyms = "";
    for (let i in meaningArray) {
        synonyms += `${client.getEmoji("star")}_Meaning:_ ${meaningArray[i]}\n`;
        if (exampleArray[i]) {
            synonyms += `${client.getEmoji("star")}_Example:_ ${exampleArray[i]}\n`;
        }
        synonyms += `${client.getEmoji("star")}_Synonyms:_ ${synonymArray[i]}\n`;
        if (antonymArray[i]) {
            synonyms += `${client.getEmoji("star")}_Antonyms:_ ${antonymArray[i]}\n`;
        }
    }

    thesaurusEmbed
    .setAuthor("merriam webster", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Merriam-Webster_logo.svg/1200px-Merriam-Webster_logo.svg.png")
    .setTitle(`**Word Lookup** ${client.getEmoji("raphi")}`)
    .setURL(`https://www.merriam-webster.com/thesaurus/${result[0].word.replace(/ /g, "_")}`)
    .setThumbnail(message.author.displayAvatarURL)
    .setDescription(
        `${client.getEmoji("star")}_Word:_ **${result[0].word}**\n` +
        `${client.getEmoji("star")}_Function:_ **${result[0].functional_label}**\n` +
        `${client.getEmoji("star")}_Popularity:_ **${result[0].popularity}**\n` +
        `${client.checkChar(synonyms, 2000, ",")}\n` 
    )
    message.channel.send(thesaurusEmbed);
}