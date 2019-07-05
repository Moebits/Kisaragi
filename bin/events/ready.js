module.exports = (client) => {
    const table = client.scores.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';`).get();
    if (!table['count(*)']) {
        client.scores.prepare(`CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);`).run();
        client.scores.prepare(`CREATE UNIQUE INDEX idx_scores_id ON scores (id);`).run();
        client.scores.pragma("synchronous = 1");
        client.scores.pragma("journal_mode = wal");
    }
    client.getScore = client.scores.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
    client.setScore = client.scores.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
    let chalk = require("chalk");
    let moment = require("moment");
    const timestamp = `${moment().format("MM DD YYYY hh:mm:ss")} ->`;
    var logString = `${timestamp} Logged in as ${client.user.tag}!`;
    var readyString = `${timestamp} Ready in ${client.guilds.size} guilds on ${client.channels.size} channels, for a total of ${client.users.size} users.`;
    console.log(chalk `{magentaBright ${logString}}`);
    console.log(chalk `{magentaBright ${readyString}}`);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhZHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9ldmVudHMvcmVhZHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFO0lBRXhCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDRFQUE0RSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDeEgsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUNwQixNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxrR0FBa0csQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2hJLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG1EQUFtRCxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDakYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0tBQzlDO0lBRUQsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO0lBQzdGLE1BQU0sQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsOEdBQThHLENBQUMsQ0FBQztJQUV4SixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRS9CLE1BQU0sU0FBUyxHQUFHLEdBQUcsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQztJQUVqRSxJQUFJLFNBQVMsR0FBRyxHQUFHLFNBQVMsaUJBQWlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDaEUsSUFBSSxXQUFXLEdBQUcsR0FBRyxTQUFTLGFBQWEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLGNBQWMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLDZCQUE2QixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksU0FBUyxDQUFDO0lBRXZKLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFBLGtCQUFrQixTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFBLGtCQUFrQixXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBRXZELENBQUMsQ0FBQSJ9