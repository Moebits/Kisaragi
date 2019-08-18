exports.run = async (discord: any, message: any, args: string[]) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
    let inputMonth, inputDay;
    if (args[1]) {
        for (let i = 0; i < monthNames.length; i++) {
            if (monthNames[i].toLowerCase() === args[1].toLowerCase()) {
                inputMonth = i + 1;
            }
        }
        if (!inputMonth) inputMonth = parseInt(args[1][0]);
        if (!args[2]) {
            inputDay = args[1].match(/\/\d+/g)
            if (inputDay[0]) inputDay  = parseInt(inputDay[0].replace(/\//g, ""));
        } else {
            inputDay = parseInt(args[2])
        }
    }
    const axios = require('axios');
    let pg1Regex = /(?<=href="\/days\/).*?(?="(> |\s))/gm;
    let pg2Regex = /(?<=description" content=").*?(?="(\s))/gm
    let imageRegex = /(?<=image" content=").*?(?=(\s))/gm
    let now = new Date(Date.now());
    var month = inputMonth ? inputMonth : now.getUTCMonth() + 1;
    var day = inputDay ? inputDay : now.getUTCDate();
    var year = now.getUTCFullYear();
    let data = await axios.get(`https://www.daysoftheyear.com/days/${year}/${month < 10 ? `0${month}` : month}/${day < 10 ? `0${day}` : day}/`);
    let matchArray = data.data.match(pg1Regex);
    let holidayName = discord.toProperCase(matchArray[0].replace(/-/g, " ").replace(/\//g, ""));
    let date = `${monthNames[month - 1]} ${day}`
    let url = `https://www.daysoftheyear.com/days/${matchArray[0]}`;
    let holidayData = await axios.get(url);
    let rawDescription = holidayData.data.match(pg2Regex)[0];
    let description = rawDescription.replace(/&hellip;/g, "...").replace(/&#8217;/g, "'").replace(/&#8211;/g, "-").trim();
    let image = holidayData.data.match(imageRegex)[0].replace(/"/g, "");

    let holidayEmbed = discord.createEmbed();
    holidayEmbed
    .setAuthor("days of the year", "https://media.daysoftheyear.com/20181228141243/logo.jpg")
    .setTitle(`**Daily Holiday** ${discord.getEmoji("padoruPadoru")}`)
    .setURL(url)
    .setThumbnail(image.trim())
    .setDescription(
        `${discord.getEmoji("star")}_Holiday:_ **${date} - ${holidayName}**\n` +
        `${discord.getEmoji("star")}_Description:_ ${discord.checkChar(description, 2000, ".")}`
        )
    message.channel.send(holidayEmbed)
}