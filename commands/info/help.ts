exports.run = async (client: any, message: any, args: string[]) => {
    if (args[1]) {
        let helpDir = require("./help commands.js");
        await helpDir.run(client, message, args);
        return;
    }
    const helpInfo: any = client.createEmbed();
        helpInfo
        .setImage("https://i.imgur.com/Av9RN7x.png")
        .setThumbnail(message.author.avatarURL)
        .setFooter("Page 1 • Info Commands", message.guild.iconURL)
        .setTitle(`Info Commands ${client.getEmoji("gabTired")}`)
        .setDescription("Click on the reactions to scroll to other pages!")
        .addField("=>help", "Shows all of the bot commands.")
        .addField("=>prefix (prefix)", "Changes the prefix of the bot.")
        .addField("=>set (activity) (type)", "Sets the bot's activity. Required -> Bot Owner");
    const helpLevel: any = client.createEmbed();
        helpLevel
        .setDescription("HELPLEVEL Click on the reactions to scroll to other pages!")
    const helpHeart: any = client.createEmbed();
        helpHeart
        .setDescription("HELPHEART Click on the reactions to scroll to other pages!")
    const helpAnime: any = client.createEmbed();
        helpAnime
        .setDescription("Click on the reactions to scroll to other pages!")
    const helpOsu: any = client.createEmbed();
        helpOsu
        .setDescription("Click on the reactions to scroll to other pages!")
    const helpGeometry: any = client.createEmbed();
        helpGeometry
        .setDescription("Click on the reactions to scroll to other pages!")
    const helpJapanese: any = client.createEmbed();
        helpJapanese
        .setDescription("Click on the reactions to scroll to other pages!")
    const helpFun: any = client.createEmbed();
        helpFun
        .setDescription("Click on the reactions to scroll to other pages!")
    const helpUtil: any = client.createEmbed();
        helpUtil
        .setDescription("Click on the reactions to scroll to other pages!")
    const helpHentai: any = client.createEmbed();
        helpHentai
        .setDescription("Click on the reactions to scroll to other pages!")
    const helpMusic: any = client.createEmbed();
        helpMusic
        .setDescription("Click on the reactions to scroll to other pages!")
    const helpRole: any = client.createEmbed();
        helpRole
        .setDescription("Click on the reactions to scroll to other pages!")
    const helpMod: any = client.createEmbed();
        helpMod
        .setDescription("Click on the reactions to scroll to other pages!")
    const helpAdmin: any = client.createEmbed();
        helpAdmin
        .setDescription("Click on the reactions to scroll to other pages!")
    const helpLogging: any = client.createEmbed();
        helpLogging
        .setDescription("Click on the reactions to scroll to other pages!")
    const helpConfig: any = client.createEmbed();
        helpConfig
        .setDescription("Click on the reactions to scroll to other pages!")
    const helpBotOwner: any = client.createEmbed();
        helpBotOwner
        .setDescription("Click on the reactions to scroll to other pages!")

    client.createReactionEmbed([helpInfo, helpLevel, helpHeart, helpAnime, helpOsu, helpGeometry, helpJapanese,
    helpFun, helpUtil, helpHentai, helpMusic, helpRole, helpMod, helpAdmin, helpLogging, helpConfig, helpBotOwner]);
    
}