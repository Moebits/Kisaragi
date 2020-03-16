# Kisaragi Discord Bot
![Best Girl](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOYUG9u3l8feN4qP9O7yuGfFxCBVGJSaLC_zstsh3vwknFIoqf)
![Twitter Follow](https://img.shields.io/twitter/follow/tenpimusic?label=Follow&style=social)
![GitHub repo size](https://img.shields.io/github/repo-size/tenpi/kisaragi)
![GitHub](https://img.shields.io/github/license/tenpi/kisaragi)
![GitHub package.json version](https://img.shields.io/github/package-json/v/tenpi/kisaragi)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/tenpi/kisaragi)
![GitHub last commit](https://img.shields.io/github/last-commit/tenpi/kisaragi)
[![HitCount](http://hits.dwyl.io/tenpi/kisaragi.svg)](http://hits.dwyl.io/tenpi/kisaragi)

This project is still in alpha, I am actively working on the bot and a lot of the commands do not work.

###Self-hosting
Clone the repository.

Create a new [**Discord Bot Application**](https://discordapp.com/developers/applications/). Take note of your token under the bot tab. Under the oath2 tab, set the scopes to "bot", bot permissions to "administrator", then use the url it generates to invite the bot to your server.
Download [**Node.js**](https://nodejs.org/en/) (I use 13.10.0, but anything above 12.0.0 should work).
Download [**PostgreSQL**](https://www.postgresql.org/) (download the graphical interface PgAdmin as well for ease of use). Restore the database from the pg.dump file. 
Download [**Redis**](https://redis.io/). This is used to cache common queries (like server prefix) and also for temporary storage.

Fill out the .env.example file with all of the credentials, your bot token and database credentials are required. The rest are mainly api keys for the respective website/service. For instance, the `osu` command won't work without an `OSU_API_KEY` defined. For Google, enable the Youtube Data API v3 and Custom Search API. Rename it to .env (don't share it anywhere, this is sensitive data). 

Two commands use a custom google search engine - (google) `images` and `pinterest`. Create a search engine [**here**](https://cse.google.com/cse/all) and set "image search" to on. For the google images search, set "search the entire web" to on. For the pinterest search, set the restricted site to "www.pinterest.com". Add it to the .env file. 

Emojis - All of the emojis are in assets/self hosting/emojis, more or less. You will need to create multiple servers in order to add them all.

Run `npm install` to install all of the dependencies. Run `npm start` to start the bot.
If you are self hosting the bot, only run it privately (don't post it on any discord bot lists for example). If you need additional help, you can open an issue here or contact me on my [**server**](https://discord.gg/77yGmWM)