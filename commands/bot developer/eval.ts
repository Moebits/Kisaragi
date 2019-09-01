const clean = (text: string) => {
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
}

exports.run = (discord: any, message: any, args: string[]) => {
  if (discord.checkBotDev(message)) return;

    const evalEmbed: any = discord.createEmbed();

    try {
        const code: string = discord.combineArgs(args, 1);
        let evaled: string = eval(code);
    
        if (typeof evaled !== "string") {
          evaled = require("util").inspect(evaled);
        }

        evalEmbed
        .setTitle(`**Javascript Code Eval** ${discord.getEmoji("kaosWTF")}`)
        .setDescription(clean(evaled), {code:"xl"});
        message.channel.send(evalEmbed);

      } catch (error) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(error)}\n\`\`\``);
      }
}