exports.run = async (client, message, args) => {

  const roleEmbed = client.createEmbed();
  const perm = client.createPermission("MANAGE_ROLES");

  if (message.member.hasPermission(perm)) {

    if ((!args[2]) || (message.mentions.members.size === 0)) {
      return message.channel.send(roleEmbed
        .setDescription("You must type =>role <add or del> [user] [role]"));
        
    } else {

        const member = message.mentions.members.first();
        const roleName = args[2]
        let snowflake = /\d+/;
        let roleID = roleName.substring(roleName.search(snowflake));
        if (roleID.includes(">")) roleID = roleID.slice(0, -1);
        let role = message.guild.roles.get(roleID);

        switch (args[0]) {

          case 'add': {
              try {
                await member.addRole(role);
                await message.channel.send(roleEmbed
                  .setDescription(`${member.displayName} now has the ${role} role!`));
              } catch (e) {
                console.log(e);
                message.channel.send(roleEmbed
                  .setDescription(`The role **${roleName}** could not be found.`));
              }
              break;  
          }
      
          case 'del': {
            try {
              await member.removeRole(role);
              await message.channel.send(roleEmbed
                .setDescription(`${member.displayName} no longer has the ${role} role!`));
            } catch (e) {
              console.log(e);
              message.channel.send(roleEmbed
                .setDescription(`The role **${roleName}** could not be found.`));
            }
            break;  
          }
        }
    }

  } else {
    roleEmbed
    .setDescription("You do not have the manage roles permission!");
    message.channel.send(roleEmbed);
    return;
  }
}
  