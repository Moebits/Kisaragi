exports.run = async (client: any, message: any, args: string[]) => {
    client.runCommand = async (msg: any, args: string[]) => {
        args = args.filter(Boolean);
        let path = await client.fetchCommand(args[0], "path");
        let cp = require(`../${path[0]}`);
        await cp.run(client, msg, args).catch((err) => msg.channel.send(client.cmdError(err)));
    }

    let cmdArgs = args.join(" ").split("& ");
    for (let i = 0; i < cmdArgs.length; i++) {
        let loading = await message.channel.send(`**Running Chain ${i + 1}** ${client.getEmoji("gabCircle")}`);
        await client.runCommand(message, cmdArgs[i].replace(/chain/g, "").split(" "));
        loading.delete(1000);
    }
}