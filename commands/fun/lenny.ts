exports.run = async (discord: any, message: any, args: string[]) => {
    const lenny = require("lenny");
    
    if (args[1] === "face") {
        message.channel.send("( ͡° ͜ʖ ͡°)")
    } else if (args[1] === "shrug") {
        message.channel.send("¯\\_(ツ)_/¯")
    } else if (args[1] === "tableflip") {
        message.channel.send("(╯°□°）╯︵ ┻━┻");
    } else if (args[1] === "unflip") {
        message.channel.send("┬─┬ ノ( ゜-゜ノ)")
    } else {
        message.channel.send(lenny());
    }
}