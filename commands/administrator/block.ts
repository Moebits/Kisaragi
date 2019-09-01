exports.run = async (discord: any, message: any, args: string[]) => {
    if (await discord.checkAdmin(message)) return;
    let input = discord.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        blockPrompt(message);
        return;
    }
    let words = await discord.fetchColumn("blocks", "blocked words");
    let match = await discord.fetchColumn("blocks", "block match");
    let toggle = await discord.fetchColumn("blocks", "block toggle");
    let wordList = "";
    if (words[0]) {
        for (let i = 0; i < words[0].length; i++) {
            wordList += `**${i + 1} - ${words[0][i]}**\n`
        }
    } else {
        wordList = "None"
    }
    let blockEmbed = discord.createEmbed();
    blockEmbed
    .setTitle(`**Blocked Words** ${discord.getEmoji("gabuChrist")}`)
    .setThumbnail(message.guild.iconURL)
    .setDescription(
    "Add or remove blocked words.\n" +
    "\n" +
    "**Exact** = Only matches the exact word.\n" + 
    "**Partial** = Also matches if the word is partially in another word.\n" +
    "\n" +
    "__Word List__\n" +
    wordList + "\n" +
    "\n" +
    "__Current Settings__" +
    `${discord.getEmoji("star")}_Filtering is **${toggle[0]}**._\n` +
    `${discord.getEmoji("star")}_Matching algorithm set to **${match[0]}**._\n` +
    "\n" +
    "__Edit Settings__" +
    "\n" +
    `${discord.getEmoji("star")}_**Type any words**, separated by a space, to add blocked words._\n` +
    `${discord.getEmoji("star")}_Type **enable** or **disable** to enable/disable filtering._\n` +
    `${discord.getEmoji("star")}_Type **exact** or **partial** to set the matching algorithm._\n` +
    `${discord.getEmoji("star")}_Type **delete (word number)** to delete a word._\n` +
    `${discord.getEmoji("star")}_Type **reset** to delete all words._\n` +
    `${discord.getEmoji("star")}_Type **cancel** to exit._\n`
    )
    message.channel.send(blockEmbed);

    async function blockPrompt(msg: any) {
        let responseEmbed = discord.createEmbed();
        let words = await discord.fetchColumn("blocks", "blocked words");
        let setOn, setOff, setExact, setPartial, setWord;
        if (msg.content.toLowerCase() === "cancel") {
            responseEmbed
            .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
            msg.channel.send(responseEmbed);
            return;
        } 
        if (msg.content.toLowerCase() === "reset") {
            await discord.updateColumn("blocks", "blocked words", null);
            responseEmbed
            .setDescription(`${discord.getEmoji("star")}All blocked words were deleted!`)
            msg.channel.send(responseEmbed);
            return;
        }
        if (msg.content.toLowerCase().includes("delete")) {
            let num = Number(msg.content.replace(/delete/gi, "").replace(/\s+/g, ""));
            if (num) {
                if (words[0]) {
                    words[0][num - 1] = "";
                    words[0] = words[0].filter(Boolean);      
                    await discord.updateColumn("blocks", "blocked words", words[0]);
                    responseEmbed
                    .setDescription(`${discord.getEmoji("star")}Setting ${num} was deleted!`)
                    msg.channel.send(responseEmbed);
                    return;
                }
            } else {
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Setting not found!`)
                msg.channel.send(responseEmbed);
                return;
            }
        }
        
        let newMsg = msg.content.replace(/enable/gi, "").replace(/disable/gi, "").replace(/exact/gi, "").replace(/partial/gi, "");
        if (msg.content.match(/enable/gi)) setOn = true;
        if (msg.content.match(/disable/gi)) setOff = true;
        if (msg.content.match(/exact/gi)) setExact = true;
        if (msg.content.match(/partial/gi)) setPartial = true;
        if (newMsg) setWord = true;

        let wordArray = newMsg.split(" ");

        if (setOn && setOff) {
            responseEmbed
                .setDescription(`${discord.getEmoji("star")}You cannot disable/enable at the same time.`)
                msg.channel.send(responseEmbed);
                return;
        }

        if (setExact && setPartial) {
            responseEmbed
                .setDescription(`${discord.getEmoji("star")}You can only choose one matching algorithm.`)
                msg.channel.send(responseEmbed);
                return;
        }

        let description = "";

        if (words[0]) {
            for (let i = 0; i < words[0].length; i++) {
                for (let j = 0; j < wordArray.length; j++) {   
                    if (words[0][i] === wordArray[j]) {
                        description += `${discord.getEmoji("star")}**${wordArray[j]}** is already blocked!`
                        wordArray[j] = "";
                        wordArray = wordArray.filter(Boolean);
                    }
                }
            }
        }

        if (setWord) {
            setOn = true;
            await discord.updateColumn("blocks", "blocked words", wordArray);
            description += `${discord.getEmoji("star")}Added **${wordArray.join(", ")}**!\n`
        }
        if (setExact) {
            await discord.updateColumn("blocks", "block match", "exact");
            description += `${discord.getEmoji("star")}Matching algorithm set to **exact**!\n`
        }
        if (setPartial) {
            await discord.updateColumn("blocks", "block match", "partial");
            description += `${discord.getEmoji("star")}Matching algorithm set to **partial**!\n`
        }
        if (setOn) {
            await discord.updateColumn("blocks", "block toggle", "on");
            description += `${discord.getEmoji("star")}Filtering is **enabled**!\n`
        }
        if (setOff) {
            await discord.updateColumn("blocks", "block toggle", "off");
            description += `${discord.getEmoji("star")}Filtering is **disabled**!\n`
        }
        responseEmbed
        .setDescription(description)
        msg.channel.send(responseEmbed);
        return;
    }

    discord.createPrompt(blockPrompt);
}