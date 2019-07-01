exports.run = async (client, message, args) => { 

    var pingEmbed = client.createEmbed(); 
    
    const msg = await message.channel.send(pingEmbed
    .setDescription("Ping?"));
    msg.edit(pingEmbed
    .setDescription(`Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`));
  };