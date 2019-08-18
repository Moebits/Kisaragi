exports.run = async (discord: any, message: any, args: string[]) => {

    let cmdArgs = args.join(" ").split("& ");
    for (let i = 0; i < cmdArgs.length; i++) {
        let loading = await message.channel.send(`**Running Chain ${i + 1}** ${discord.getEmoji("gabCircle")}`);
        await discord.runCommand(message, cmdArgs[i].replace(/chain/g, "").split(" "));
        loading.delete(1000);
    }
}