exports.run = async (client: any, message: any, args: string[]) => { 

    let pingEmbed: any = client.createEmbed(); 
    
    const msg = await message.channel.send(pingEmbed
    .setDescription("Ping?"));
    msg.edit(pingEmbed
    .setDescription(`Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`));
  };