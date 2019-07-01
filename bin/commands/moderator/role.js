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
            var snowflake = /\d+/;
            var roleID = roleName.substring(roleName.search(snowflake));
            if (roleID.includes(">"))
                roleID = roleID.slice(0, -1);
            var role = message.guild.roles.get(roleID);
            switch (args[0]) {
                case 'add': {
                    try {
                        yield member.addRole(role);
                        yield message.channel.send(roleEmbed
                            .setDescription(`${member.displayName} now has the ${role} role!`));
                    }
                    catch (e) {
                        console.log(e);
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
                    catch (e) {
                        console.log(e);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1hbmRzL21vZGVyYXRvci9yb2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFPLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFFNUMsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUVyRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBRXRDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ3ZELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUztpQkFDbEMsY0FBYyxDQUFDLGlEQUFpRCxDQUFDLENBQUMsQ0FBQztTQUV2RTthQUFNO1lBRUgsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDaEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3hCLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN0QixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUM1RCxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO2dCQUFFLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUUzQyxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFFZixLQUFLLEtBQUssQ0FBQyxDQUFDO29CQUNSLElBQUk7d0JBQ0YsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUMzQixNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVM7NkJBQ2pDLGNBQWMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxXQUFXLGdCQUFnQixJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZFO29CQUFDLE9BQU8sQ0FBQyxFQUFFO3dCQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2YsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUzs2QkFDM0IsY0FBYyxDQUFDLGNBQWMsUUFBUSx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7cUJBQ3BFO29CQUNELE1BQU07aUJBQ1Q7Z0JBRUQsS0FBSyxLQUFLLENBQUMsQ0FBQztvQkFDVixJQUFJO3dCQUNGLE1BQU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDOUIsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTOzZCQUNqQyxjQUFjLENBQUMsR0FBRyxNQUFNLENBQUMsV0FBVyxzQkFBc0IsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO3FCQUM3RTtvQkFBQyxPQUFPLENBQUMsRUFBRTt3QkFDVixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNmLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVM7NkJBQzNCLGNBQWMsQ0FBQyxjQUFjLFFBQVEsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO3FCQUNwRTtvQkFDRCxNQUFNO2lCQUNQO2FBQ0Y7U0FDSjtLQUVGO1NBQU07UUFDTCxTQUFTO2FBQ1IsY0FBYyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7UUFDaEUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsT0FBTztLQUNSO0FBQ0gsQ0FBQyxDQUFBLENBQUEifQ==