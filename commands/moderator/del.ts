exports.run = async (discord: any, message: any, args: string[]) => {
    if (await discord.checkMod(message)) return;
    const delEmbed: any = discord.createEmbed();
    const num: number = Number(args[1]) + 2;
    let userID = false;
    let search = false;
    let query;
    if (args[2]) {
        if (args[2].match(/\d+/g)) {
            userID = true;
        } else {
            query = discord.combineArgs(args, 2);
            search = true;
        }
    }

    async function bulkDelete(num: number) {
        let msgArray: any = [];
        if (userID) {
            let messages = await message.channel.fetchMessages({limit: num});
            messages = messages.map((m: any) => m);
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].author.id === args[2].match(/\d+/g)!.join("")) {
                    msgArray.push(messages[i].id);
                }
            }
            await message.channel.bulkDelete(msgArray, true);
        } else if (search) {
            let messages = await message.channel.fetchMessages({limit: num});
            messages = messages.map((m: any) => m);
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].embeds[0] ? messages[i].embeds[0].description.toLowerCase().includes(query.trim()) : messages[i].content.toLowerCase().includes(query.trim())) {
                    msgArray.push(messages[i].id);
                }
            }
            console.log(msgArray)
            await message.channel.bulkDelete(msgArray, true)
        } else {
            await message.channel.bulkDelete(num, true)
        }
    }

    if (!num) {
        delEmbed
        .setDescription("Correct usage is =>del (number).");
        message.channel.send(delEmbed);
        return;
    }

    if (num < 2 || num > 1002) {
        delEmbed
        .setDescription("You must type a number between 0 and 1000!");
        message.channel.send(delEmbed);
        return;
    }

    if (num <= 100) {
        await bulkDelete(num)
    } else {
        let iterations = Math.floor(num / 100);
        for (let i = 0; i <= iterations; i++) {
            await bulkDelete(100);
        }
        await bulkDelete(num % 100);
    }

    if (userID) {
        try {
            await message.delete();
        } catch (err) {
            console.log(err)
        }
        delEmbed
        .setDescription(`Deleted the last **${args[1]}** messages by <@${args[2].match(/\d+/g)!.join("")}>!`);
    } else if (search) {
        delEmbed
        .setDescription(`Deleted the last **${args[1]}** messages containing **${query}**!`);
    } else {
        delEmbed
        .setDescription(`Deleted **${args[1]}** messages in this channel!`);
    }
    let msg = await message.channel.send(delEmbed)
    msg.delete(5000);
    return;
}
