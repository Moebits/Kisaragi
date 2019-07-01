const clean = text => {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }

exports.run = (client, message, args) => {

    const evalEmbed = client.createEmbed();

    if (client.checkBotOwner()) {
        try {
            const code = args.join(" ");
            let evaled = eval(code);
       
            if (typeof evaled !== "string")
              evaled = require("util").inspect(evaled);
              evalEmbed
              .setDescription(clean(evaled), {code:"xl"});
       
            message.channel.send(evalEmbed);
          } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
          }
    } else {
        message.channel.send(evalEmbed
            .setDescription("In order to use this command, you must be a bot owner."))
            .catch(error => console.log("Caught", error.message))
            return;
    }
}