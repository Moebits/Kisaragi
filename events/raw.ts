import Discord from "discord.js";

const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

module.exports = async (client: any, event: any) => {
  
    if (!events.hasOwnProperty(event.t)) return;
    const {d: data} = event;
    
	const user = client.users.get(data.user_id);
    const channel = client.channels.get(data.channel_id) || await user.createDM();

    if (channel.messages.has(data.message_id)) return;
    
    await client.insertInto("ignore", "message", data.message_id);

	const message = await channel.fetchMessage(data.message_id);
	const emojiKey = data.emoji.id || data.emoji.name;
    let reaction = message.reactions.get(emojiKey);

    if (!reaction) {
        const emoji = new Discord.Emoji(client.guilds.get(data.guild_id), data.emoji);
        reaction = new Discord.MessageReaction(message, emoji, 1, data.user_id === client.user.id);
    }

	client.emit(events[event.t], reaction, user);
    
}