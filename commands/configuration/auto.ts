exports.run = async (client: any, message: any, args: string[]) => {
    let input = client.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        autoPrompt(message);
        return;
    }
    
    let command = await client.fetchColumn("auto", "command");
    let channel = await client.fetchColumn("auto", "channel");
    let frequency = await client.fetchColumn("auto", "frequency");
    let settings = "";
    if (command[0] !== null) {
        for (let i = 0; i < command[0].length; i++) {
            settings += `${i} **=>**\n` +
            `${client.getEmoji("star")}_Command:_ **${command[0][i]}**\n`+
            `${client.getEmoji("star")}_Channel:_ **${channel[0][i]}**\n`+
            `${client.getEmoji("star")}_Frequency:_ **${frequency[0][i]}**\n`
        }
    } else {
        settings = "None";
    }
    let autoEmbed = client.createEmbed();
    autoEmbed
    .setTitle(`**Auto Commands** ${client.getEmoji("think")}`)
    .setThumbnail(message.guild.iconURL)
    .setDescription(
        "Configure settings for auto commands. You can set up a maximum of 10 auto commands.\n" +
        "\n" +
        "**Frequency** = How often the command will run, in hours.\n" +
        "\n" +
        "__Current Settings:__\n" +
        `${settings}\n` +
        "\n" +
        "__Edit Settings:__\n" +
        `${client.getEmoji("star")}_Type **any command** to set the command._\n` +
        `${client.getEmoji("star")}_**Mention any channel** to set the channel._\n` +
        `${client.getEmoji("star")}_Type **any number** to set the frequency._\n` +
        `${client.getEmoji("star")}_Make sure that you **set all at once**._\n` +
        `${client.getEmoji("star")}_Type **delete (setting number)** to delete a setting._\n` +
        `${client.getEmoji("star")}_Type **reset** to delete all settings._\n` +
        `${client.getEmoji("star")}_Type **cancel** to exit._\n` 
    )

    message.channel.send(autoEmbed)

    async function autoPrompt(msg: any) {
        let responseEmbed = client.createEmbed();
        responseEmbed.setDescription(`**Auto Commands** ${client.getEmoji("think")}`)
        let setCmd, setChannel, setFreq;
        let cmd = await client.fetchColumn("auto", "command");
        let chan = await client.fetchColumn("auto", "channel");
        let freq = await client.fetchColumn("auto", "frequency");
        if (!cmd) cmd = [[0]];
        if (!chan) chan = [[0]];
        if (!freq) freq = [[0]];
        if (msg.content.toLowerCase().startsWith("delete")) {
            let newMsg = Number(msg.content.replace(/delete/g, "").trim());
            if (newMsg) {
                    cmd[0][newMsg] = 0;
                    chan[0][newMsg] = 0;
                    freq[0][newMsg] = 0;
                    let arrCmd = cmd.filter(Boolean);
                    let arrChan = chan.filter(Boolean);
                    let arrFreq = freq.filter(Boolean);
                    await client.updateColumn("auto", "command", arrCmd[0]);
                    await client.updateColumn("auto", "channel", arrChan[0]);
                    await client.updateColumn("auto", "frequency", arrFreq[0]);   
                    return msg.channel.send(responseEmbed.setDescription(`Command ${newMsg} was deleted!`));
            } else {
                return msg.channel.send(responseEmbed.setDescription("Command not found!"));
            }
        }
        if (msg.content.toLowerCase() === "cancel") {
            responseEmbed
            .setDescription(`${client.getEmoji("star")}Canceled the prompt!`)
            msg.channel.send(responseEmbed);
            return;
        } 
        if (msg.content.toLowerCase() === "reset") {
            await client.updateColumn("auto", "command", null);
            await client.updateColumn("auto", "channel", null);
            await client.updateColumn("auto", "frequency", null);
            responseEmbed
            .setDescription(`${client.getEmoji("star")}Auto settings were wiped!`)
            msg.channel.send(responseEmbed);
            return;
        }

        let newFreq = msg.content.replace(/\D+/gi, "").replace(/(?=<#)\d+(?=>)/g, "").replace(/\s+/g, "");
        let newCmd = msg.content.match(/\D+/gi);
        let newChan = msg.content.match(/<#\d+>/g);
        if (newCmd) setCmd = true;
        if (newChan) setChannel = true;
        if (newFreq) setFreq = true;

        if (setCmd && setChannel && setFreq) {
            console.log(cmd)
            console.log(chan)
            console.log(freq)
            console.log(newCmd)
            console.log(newChan)
            console.log(newFreq)
            if (cmd[0].length === 10) {
                return msg.channel.send(responseEmbed.setDescription("You can only set 10 auto commands!"));
            } else {
                cmd[0].push(newCmd[0]);
                chan[0].push(newChan[0]);
                freq[0].push(newFreq[0]);
                let arrCmd = cmd.filter(Boolean);
                let arrChan = chan.filter(Boolean);
                let arrFreq = freq.filter(Boolean);
                await client.updateColumn("auto", "command", arrCmd[0]);
                await client.updateColumn("auto", "channel", arrChan[0]);
                await client.updateColumn("auto", "frequency", arrFreq[0]);
                responseEmbed
                .setDescription(
                    `${client.getEmoji("star")}Command set to ${newCmd[0]}!\n` +
                    `${client.getEmoji("star")}Channel set to ${newChan[0]}!\n` +
                    `${client.getEmoji("star")}Frequency set to ${newFreq[0]}!\n`
                )
                return msg.channel.send(responseEmbed);
            }

        } else {
            return msg.channel.send(responseEmbed.setDescription("You must set all options at once."));
        }
    }

    client.createPrompt(autoPrompt)
}