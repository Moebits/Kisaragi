import Discord from "discord.js";

const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

module.exports = async (discord: any, event: any) => {
  
    if (!events.hasOwnProperty(event.t)) return;
    const {d: data} = event;
    
	const user = discord.users.get(data.user_id);
    const channel = discord.channels.get(data.channel_id) || await user.createDM();

    if (channel.messages.has(data.message_id)) return;
    
    await discord.insertInto("ignore", "message", data.message_id);

	const message = await channel.fetchMessage(data.message_id);
	const emojiKey = data.emoji.id || data.emoji.name;
    let reaction = message.reactions.get(emojiKey);

    if (!reaction) {
        const emoji = new Discord.Emoji(discord.guilds.get(data.guild_id), data.emoji);
        reaction = new Discord.MessageReaction(message, emoji, 1, data.user_id === discord.user.id);
    }

	discord.emit(events[event.t], reaction, user);
    
}