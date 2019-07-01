module.exports = (client) => {

    const defaultSettings = {
      "prefix": "=>",
      "modLogChannel": "mod-log",
      "modRole": "moderator",
      "adminRole": "administrator",
      "systemNotice": "true",
      "welcomeChannel": "welcome",
      "welcomeMessage": "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
      "welcomeEnabled": "false"
    };
  
    client.getSettings = (guild) => {
      client.settings.ensure("default", defaultSettings);
      if(!guild) return client.settings.get("default");
      const guildConf = client.settings.get(guild.id) || {};
      return ({...client.settings.get("default"), ...guildConf});
    };
  
    /*
    SINGLE-LINE AWAITMESSAGE
    A simple way to grab a single reply, from the user that initiated
    the command. Useful to get "precisions" on certain things...
    USAGE
    const response = await client.awaitReply(msg, "Favourite Color?");
    msg.reply(`Oh, I really love ${response} too!`);
    */
    client.awaitReply = async (msg, question, limit = 60000) => {
      const filter = m => m.author.id === msg.author.id;
      await msg.channel.send(question);
      try {
        const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
        return collected.first().content;
      } catch (e) {
        return false;
      }
    };
  
    client.loadCommand = (commandName, dir) => {
      try {
        client.logger.log(`Loading Command: ${commandName}`);
        const props = require(`../commands/${dir}/${commandName}`);
        if (props.init) {
          props.init(client);
        }
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.help.name);
        });
        return false;
      } catch (e) {
        return `Unable to load command ${commandName}: ${e}`;
      }
    };
  
    client.unloadCommand = async (commandName) => {
      let command;
      if (client.commands.has(commandName)) {
        command = client.commands.get(commandName);
      } else if (client.aliases.has(commandName)) {
        command = client.commands.get(client.aliases.get(commandName));
      }
      if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
    
      if (command.shutdown) {
        await command.shutdown(client);
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
    };
  
    // `await client.wait(1000);` to "pause" for 1 second.
    client.wait = require("util").promisify(setTimeout);
  
    // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
    process.on("uncaughtException", (err) => {
      const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
      client.logger.error(`Uncaught Exception: ${errorMsg}`);
      console.error(err);
      // Always best practice to let the code crash on uncaught exceptions. 
      // Because you should be catching them anyway.
      process.exit(1);
    });
  
    process.on("unhandledRejection", err => {
      client.logger.error(`Unhandled rejection: ${err}`);
      console.error(err);
    });
  };