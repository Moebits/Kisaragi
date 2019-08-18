exports.run = async (discord: any, message: any, args: string[]) => {
    console.log("here")
    let prefix = await discord.fetchPrefix();
    console.log(prefix)
    await discord.updatePrefix("g!")
    let prefix2 = await discord.fetchPrefix();
    console.log(prefix2)
    await discord.updatePrefix("=>")
    let prefix4 = await discord.fetchPrefix();
    console.log(prefix4)
}