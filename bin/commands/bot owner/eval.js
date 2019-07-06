"use strict";
const clean = (text) => {
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
};
exports.run = (client, message, args) => {
    const evalEmbed = client.createEmbed();
    if (client.checkBotOwner()) {
        try {
            const code = args.join(" ");
            let evaled = eval(code);
            if (typeof evaled !== "string") {
                evaled = require("util").inspect(evaled);
            }
            evalEmbed
                .setDescription(clean(evaled), { code: "xl" });
            message.channel.send(evalEmbed);
        }
        catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
    else {
        message.channel.send(evalEmbed
            .setDescription("In order to use this command, you must be a bot owner."));
        return;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1hbmRzL2JvdCBvd25lci9ldmFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxNQUFNLEtBQUssR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFO0lBQzNCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDOUcsQ0FBQyxDQUFBO0FBRUQsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQVcsRUFBRSxPQUFZLEVBQUUsSUFBYyxFQUFFLEVBQUU7SUFFeEQsTUFBTSxTQUFTLEdBQVEsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBRTVDLElBQUksTUFBTSxDQUFDLGFBQWEsRUFBRSxFQUFFO1FBQ3hCLElBQUk7WUFDQSxNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BDLElBQUksTUFBTSxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVoQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtnQkFDOUIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDMUM7WUFFRCxTQUFTO2lCQUNSLGNBQWMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztZQUM1QyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUVqQztRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDbkU7S0FFTjtTQUFNO1FBQ0gsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUzthQUN6QixjQUFjLENBQUMsd0RBQXdELENBQUMsQ0FBQyxDQUFBO1FBQzFFLE9BQU87S0FDZDtBQUNMLENBQUMsQ0FBQSJ9