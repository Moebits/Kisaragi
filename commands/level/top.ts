exports.run = async (discord: any, message: any, args: string[]) => {
  
  let rawScoreList: string[][] = await discord.fetchColumn("points", "score list");
  let rawLevelList: string[][] = await discord.fetchColumn("points", "level list");
  let rawUserList: string[][] = await discord.fetchColumn("points", "user id list");
  let userList: number[] = rawUserList[0].map((num: string) => Number(num));
  let scoreList: number[] = rawScoreList[0].map((num: string) => Number(num))
  let levelList: number[] = rawLevelList[0].map((num: string) => Number(num));

  let objectArray: any = [];
  for (let i = 0; i < userList.length; i++) {
    let scoreObject: object = { 
      "user": userList[i],
      "points": scoreList[i],
      "level": levelList[i]
    }
    objectArray.push(scoreObject);
  }

  objectArray.sort((a, b) => (a.points > b.points) ? -1 : 1)

  let iterations = Math.ceil(message.guild.memberCount / 10);

  let embedArray: any = [];
  loop1:
  for (let i = 0; i < iterations; i++) {
    const topEmbed: any = discord.createEmbed();
    let description = "";
    for (let j = 0; j < 10; j++) {
      let position = (i*10) + j;
      if (!objectArray[position]) break loop1;
      description += `${discord.getEmoji("star")}_User:_ <@${objectArray[position].user}>\n` +
      `${discord.getEmoji("star")}_Points:_ **${objectArray[position].points}**\n` +
      `${discord.getEmoji("star")}_Level:_ **${objectArray[position].level}**\n`
    }
    topEmbed
    .setTitle(`**${message.guild.name}'s Leaderboard** ${discord.getEmoji("hanaDesires")}`)
    .setThumbnail(message.guild.iconURL)
    .setDescription(description)
    embedArray.push(topEmbed)
  }
  discord.createReactionEmbed(embedArray);
}