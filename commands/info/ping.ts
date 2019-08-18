exports.run = async (discord: any, message: any, args: string[]) => { 

    let pingEmbed: any = discord.createEmbed(); 
    
    const msg = await message.channel.send(pingEmbed
    .setDescription("Ping?"));
    msg.edit(pingEmbed
    .setDescription(`Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(discord.ping)}ms`));
  };