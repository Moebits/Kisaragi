exports.run = async (client: any, message: any, args: string[]) => {

    let cmdArgs = args.join(" ").split("& ");
    for (let i = 0; i < cmdArgs.length; i++) {
        let loading = await message.channel.send(`**Running Chain ${i + 1}** ${client.getEmoji("gabCircle")}`);
        await client.runCommand(message, cmdArgs[i].replace(/chain/g, "").split(" "));
        loading.delete(1000);
    }
}