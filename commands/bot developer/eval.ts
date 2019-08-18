const clean = (text: string) => {
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
}

exports.run = (discord: any, message: any, args: string[]) => {

    const evalEmbed: any = discord.createEmbed();
    let ownerID: any = process.env.OWNER_ID;

    if (message.author.id === ownerID) {
        try {
            const code: string = discord.combineArgs(args, 2);
            let evaled: string = eval(code);
       
            if (typeof evaled !== "string") {
              evaled = require("util").inspect(evaled);
            }

            evalEmbed
            .setDescription(clean(evaled), {code:"xl"});
            message.channel.send(evalEmbed);

          } catch (error) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(error)}\n\`\`\``);
          }

    } else {
        message.channel.send(evalEmbed
            .setDescription("In order to use this command, you must be the bot developer."))
            return;
    }
}