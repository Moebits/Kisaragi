"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const unloadCommand = (commandName) => __awaiter(this, void 0, void 0, function* () {
    let command;
    if (client.commands.has(commandName)) {
        command = client.commands.get(commandName);
    }
    else if (client.aliases.has(commandName)) {
        command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command)
        return `The command \`${commandName}\` could not be found.`;
    if (command.shutdown) {
        yield command.shutdown(client);
    }
    const mod = require.cache[require.resolve(`../commands/$${commandName}`)];
    delete require.cache[require.resolve(`../commands/${commandName}.js`)];
    for (let i = 0; i < mod.parent.children.length; i++) {
        if (mod.parent.children[i] === mod) {
            mod.parent.children.splice(i, 1);
            break;
        }
    }
    return false;
});
exports.run = (client, message, args) => __awaiter(this, void 0, void 0, function* () {
    const rebootEmbed = client.createEmbed();
    yield message.channel.send(rebootEmbed
        .setDescription("Bot is shutting down."));
    yield Promise.all(client.commands.map((cmd) => client.unloadCommand(cmd)));
    process.exit(0);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVib290LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbWFuZHMvYm90IG93bmVyL3JlYm9vdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxNQUFNLGFBQWEsR0FBUSxDQUFPLFdBQW1CLEVBQUUsRUFBRTtJQUN2RCxJQUFJLE9BQVksQ0FBQztJQUNqQixJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1FBQ3BDLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUM1QztTQUFNLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUU7UUFDMUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7S0FDaEU7SUFDRCxJQUFJLENBQUMsT0FBTztRQUFFLE9BQU8saUJBQWlCLFdBQVcsd0JBQXdCLENBQUM7SUFFMUUsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO1FBQ3BCLE1BQU0sT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNoQztJQUVELE1BQU0sR0FBRyxHQUFRLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQy9FLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGVBQWUsV0FBVyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3ZFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDbkQsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDbEMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNqQyxNQUFNO1NBQ1A7S0FDRjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyxDQUFBLENBQUM7QUFFRixPQUFPLENBQUMsR0FBRyxHQUFHLENBQU8sTUFBVyxFQUFFLE9BQVksRUFBRSxJQUFjLEVBQUUsRUFBRTtJQUU5RCxNQUFNLFdBQVcsR0FBUSxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFOUMsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXO1NBQ3JDLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7SUFFMUMsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUUsQ0FDakQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FDMUIsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixDQUFDLENBQUEsQ0FBQyJ9