exports.run = async (client: any, message: any, args: string[]) => {
    const kaomoji = require('kaomojilib')
    let lib: any = [];
    let keys = Object.keys(kaomoji.library);
    for(let i = 0, n = keys.length; i < n; i++) {
        let key  = keys[i];
        lib[i] = kaomoji.library[key];
    }
    if (!args[1]) {
        let random = Math.floor(Math.random() * lib.length);
        message.channel.send(lib[random].icon);
        return;
    }
    let query = client.combineArgs(args, 1);
    for (let i in lib) {
        for (let j in lib[i].keywords) {
            if (query.toLowerCase().trim() === lib[i].keywords[j].toLowerCase()) {
                message.channel.send(lib[i].icon);
                return;
            }
        }
    }
    message.channel.send("No kaomoji were found.");
}