"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
exports.run = (client, message, args) => __awaiter(this, void 0, void 0, function* () {
    const roleEmbed = client.createEmbed();
    const perm = client.createPermission("MANAGE_ROLES");
    if (message.member.hasPermission(perm)) {
        if ((!args[2]) || (message.mentions.members.size === 0)) {
            return message.channel.send(roleEmbed
                .setDescription("You must type =>role <add or del> [user] [role]"));
        }
        else {
            const member = message.mentions.members.first();
            const roleName = args[2];
            let snowflake = /\d+/;
            let roleID = roleName.substring(roleName.search(snowflake));
            if (roleID.includes(">"))
                roleID = roleID.slice(0, -1);
            let role = message.guild.roles.get(roleID);
            switch (args[0]) {
                case 'add': {
                    try {
                        yield member.addRole(role);
                        yield message.channel.send(roleEmbed
                            .setDescription(`${member.displayName} now has the ${role} role!`));
                    }
                    catch (error) {
                        console.log(error);
                        message.channel.send(roleEmbed
                            .setDescription(`The role **${roleName}** could not be found.`));
                    }
                    break;
                }
                case 'del': {
                    try {
                        yield member.removeRole(role);
                        yield message.channel.send(roleEmbed
                            .setDescription(`${member.displayName} no longer has the ${role} role!`));
                    }
                    catch (error) {
                        console.log(error);
                        message.channel.send(roleEmbed
                            .setDescription(`The role **${roleName}** could not be found.`));
                    }
                    break;
                }
            }
        }
    }
    else {
        roleEmbed
            .setDescription("You do not have the manage roles permission!");
        message.channel.send(roleEmbed);
        return;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1hbmRzL21vZGVyYXRvci9yb2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBTyxNQUFXLEVBQUUsT0FBWSxFQUFFLElBQWMsRUFBRSxFQUFFO0lBRWhFLE1BQU0sU0FBUyxHQUFRLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM1QyxNQUFNLElBQUksR0FBUSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUM7SUFFMUQsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUV0QyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRTtZQUN2RCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVM7aUJBQ2xDLGNBQWMsQ0FBQyxpREFBaUQsQ0FBQyxDQUFDLENBQUM7U0FFdkU7YUFBTTtZQUVILE1BQU0sTUFBTSxHQUFRLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3JELE1BQU0sUUFBUSxHQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNoQyxJQUFJLFNBQVMsR0FBVyxLQUFLLENBQUM7WUFDOUIsSUFBSSxNQUFNLEdBQVcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDcEUsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztnQkFBRSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RCxJQUFJLElBQUksR0FBUSxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFaEQsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBRWYsS0FBSyxLQUFLLENBQUMsQ0FBQztvQkFDUixJQUFJO3dCQUNGLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDM0IsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTOzZCQUNqQyxjQUFjLENBQUMsR0FBRyxNQUFNLENBQUMsV0FBVyxnQkFBZ0IsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO3FCQUN2RTtvQkFBQyxPQUFPLEtBQUssRUFBRTt3QkFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNuQixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTOzZCQUMzQixjQUFjLENBQUMsY0FBYyxRQUFRLHdCQUF3QixDQUFDLENBQUMsQ0FBQztxQkFDcEU7b0JBQ0QsTUFBTTtpQkFDVDtnQkFFRCxLQUFLLEtBQUssQ0FBQyxDQUFDO29CQUNWLElBQUk7d0JBQ0YsTUFBTSxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUM5QixNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVM7NkJBQ2pDLGNBQWMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxXQUFXLHNCQUFzQixJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7cUJBQzdFO29CQUFDLE9BQU8sS0FBSyxFQUFFO3dCQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ25CLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVM7NkJBQzNCLGNBQWMsQ0FBQyxjQUFjLFFBQVEsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO3FCQUNwRTtvQkFDRCxNQUFNO2lCQUNQO2FBQ0Y7U0FDSjtLQUVGO1NBQU07UUFDTCxTQUFTO2FBQ1IsY0FBYyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7UUFDaEUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsT0FBTztLQUNSO0FBQ0gsQ0FBQyxDQUFBLENBQUEifQ==