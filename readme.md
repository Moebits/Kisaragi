# Kisaragi Discord Bot
![Best Girl](https://vignette.wikia.nocookie.net/mudae/images/7/73/Kisaragi_%28AL%294.png/revision/latest?cb=20191205095054)

![GitHub repo size](https://img.shields.io/github/repo-size/tenpi/kisaragi)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/tenpi/kisaragi)
![GitHub last commit](https://img.shields.io/github/last-commit/tenpi/kisaragi)
[![HitCount](http://hits.dwyl.io/tenpi/kisaragi.svg)](http://hits.dwyl.io/tenpi/kisaragi)

This is my first programming project, a discord bot mainly to search anime pictures and websites, play music, and provide some server utilities. Invite the bot [**here**](https://discordapp.com/oauth2/authorize?client_id=593838271650332672&permissions=2113793271&scope=bot)!

This project is still a wip (beta version) so there might be commands that don't work as intended or which throw an exception.

## Help
_Double click on the same reaction to toggle a compact form of the help menu._

`=>help` - Open the help menu which lists all commands.

`=>help command` - Detailed help information, such as arguments, usage, and an example image.

`=>help !category` - Only posts the help menu page for that category.

`=>help dm` - Compact help list that is compatible in dm's.

## Bugs/Feature Requests

Please let me know by submitting an issue or using the `feedback` command on the bot. I appreciate all ideas.

## Self Hosting

The setup for this bot is somewhat complicated, but I will leave this up for those who are interested in running the bot themselves. Just keep self hosted bots private. If you make code improvements please open a pull request!

- The bot runs on Node.js v13.10.0, which you can install here (a more recent version might also work): https://nodejs.org/en/
- You will also need to install git in order to clone this repo: https://git-scm.com/
- The text editor that I use is visual studio code, but anything will work: https://code.visualstudio.com/
- The programming language used is Typescript v3.8.3: https://www.typescriptlang.org/
- The primary database is PostgreSQL (I recommend installing the GUI too): https://www.postgresql.org/
- The secondary database is Redis (caches stuff in-memory): https://redis.io/
- The music effects commands use Sox: http://sox.sourceforge.net/

After installing everything, the first step is to fork this repo and then clone your fork. You can find the URL of the repo by clicking the green button that says "Code" on Github.
```git clone <url>```
In the same directory, you can install all of the dependencies with the command:
```npm install```

Now, you need to create a bot application on Discord. Create a new application at: https://discord.com/developers/applications
Create a bot under the bot tab, you can give it any name and profile picture that you wish. Rename the file named `.env.example` to
`.env` - this file has all of your sensitive credentials, so it should never be shared. Add your token after the variable named `TOKEN`.
For the variable `OWNER_ID`, put your own user ID. This is the person that is considered the bot owner and is the only person that can use bot
developer commands. Filling out the rest of the file is relatively self-explanatory. For example, to use Twitter commands you will need credentials for Twitter's API. You can get this by googling "twitter api" and creating an application in their developer portal - it is the same for the other websites. 

You can instantiate the database by restoring from the sql file that I provided in the self hosting tab. To avoid errors, you need to restore with the option "Do not save owner". The URL of the database should go in the `PG_URL` variable. For the `REDIS_URL`, a new empty Redis database is fine. 

The bot uses a lot of custom emojis, so you need to make sure that it can find all of them. You need to create a bunch of Discord servers (around 5-6) and add the bot to all of them. It's important to note that you must be the owner of the servers, because the bot only checks for emojis in the servers that the bot owner owns. All of the emojis are in the self hosting folder. The URL to add this bot is the following, you need to replace CLIENT_ID with the client ID of your bot:

`https://discord.com/oauth2/authorize?client_id=CLIENT_ID&permissions=2113793271&scope=bot`

In `events/ready.ts`, remove the following line:
```this.discord.postGuildCount()```
Since your version of the bot will not be on any bot lists.

Finally, you can start the bot with the following command:
```npm start```

That's all!