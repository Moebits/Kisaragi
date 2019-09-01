exports.run = async (discord: any, message: any, args: string[]) => {
    if (discord.checkBotDev(message)) return;
    let query = {text: discord.combineArgs(args, 1), rowMode: "array"};
    let sqlEmbed = discord.createEmbed();
    let result;
    try {
        result = await discord.runQuery(query, true, true);
        console.log(result)
    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``)
    }
    sqlEmbed
    .setTitle(`**SQL Query** ${discord.getEmoji("karenAnger")}`)
    .setDescription(`Successfully ran the query **${query.text}**\n` +
    "\n" +
    `**${result ? (result[0][0] ? result[0].length : result.length) : 0}** rows were selected!\n` +
    "\n" +
    `\`\`\`${discord.checkChar(JSON.stringify(result), 2000, ",")}\`\`\``);
    message.channel.send(sqlEmbed);
    
}