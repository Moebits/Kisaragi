exports.run = async (client: any, message: any, args: string[]) => {

  const roleEmbed: any = client.createEmbed();
  const perm: any = client.createPermission("MANAGE_ROLES");

  if (message.member.hasPermission(perm)) {

    if ((!args[3]) || (message.mentions.members.size === 0)) {
      return message.channel.send(roleEmbed
        .setDescription("You must type =>role <add or del> [user] [role]"));
        
    } else {

        const member: any = message.mentions.members.first();
        const roleName: string = args[3]
        let snowflake: RegExp = /\d+/;
        let roleID: string = roleName.substring(roleName.search(snowflake));
        if (roleID.includes(">")) roleID = roleID.slice(0, -1);
        let role: any = message.guild.roles.get(roleID);

        switch (args[1]) {

          case 'add': {
              try {
                await member.addRole(role);
                await message.channel.send(roleEmbed
                  .setDescription(`${member.displayName} now has the ${role} role!`));
              } catch (error) {
                console.log(error);
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
            } catch (error) {
              console.log(error);
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
  