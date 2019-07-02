exports.run = async (client, message, args) => {

	const avatarEmbed = client.createEmbed();
    
    if (!message.mentions.users.size) {
		if (message.author.displayAvatarURL.includes("gif" || "jpg")) {
			await message.channel.send(avatarEmbed
				.setDescription(`**${message.author.username}'s Profile Picture**`)
				.setImage(`${message.author.displayAvatarURL}` + "?size=2048"));
		} else {
			await message.channel.send(avatarEmbed
				.setDescription(`**${message.author.username}'s Profile Picture**`)
				.setImage(message.author.displayAvatarURL));
		}
	}
	
	for (var [, user] of message.mentions.users) {
		if (user.displayAvatarURL.includes("gif" || "jpg")) {
			await message.channel.send(avatarEmbed
				.setDescription(`**${user.username}'s Profile Picture**`)
				.setImage(`${user.displayAvatarURL}` + "?size=2048"));
		} else {
			await message.channel.send(avatarEmbed
				.setDescription(`**${user.username}'s Profile Picture**`)
				.setImage(user.displayAvatarURL));
		}	
	}   
};