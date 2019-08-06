exports.run = async (client: any, message: any, args: string[]) => {

    const delEmbed: any = client.createEmbed();
    const perm: any = client.createPermission("MANAGE_MESSAGES");
    const num: number = Number(args[1]) + 2;

    if (message.member.hasPermission(perm)) {
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
                await message.channel.bulkDelete(num, true)
            } else {
                let iterations = Math.floor(num / 100);
                for (let i = 0; i <= iterations; i++) {
                    await message.channel.bulkDelete(100, true);
                }
                await message.channel.bulkDelete((num % 100), true);
            }

            delEmbed
            .setDescription(`Deleted ${args[1]} messages in this channel!`);
            let msg = await message.channel.send(delEmbed)
            msg.delete(5000);
            return;

    } else {
        delEmbed
        .setDescription("You do not have the manage messages permission!");
        message.channel.send(delEmbed);
        return;
    }
}
