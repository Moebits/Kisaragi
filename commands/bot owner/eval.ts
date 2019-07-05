const clean = (text: string) => {
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
}

exports.run = (client: any, message: any, args: string[]) => {

    const evalEmbed: any = client.createEmbed();

    if (client.checkBotOwner()) {
        try {
            const code: string = args.join(" ");
            let evaled: string = eval(code);
       
            if (typeof evaled !== "string") {
              evaled = require("util").inspect(evaled);
            }

            evalEmbed
            .setDescription(clean(evaled), {code:"xl"});
            message.channel.send(evalEmbed);

          } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
          }

    } else {
        message.channel.send(evalEmbed
            .setDescription("In order to use this command, you must be a bot owner."))
            return;
    }
}