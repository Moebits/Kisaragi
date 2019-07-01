exports.run = (client, message, newPrefix) => {
    newPrefix = config.prefix;
    const prefixEmbed = client.createEmbed();
    prefixEmbed
        .setDescription("The prefix has been changed to " + newPrefix + "\n" + "If you ever forget the prefix just tag me!");
    message.channel.send(prefixEmbed)
        .catch(error => console.log("Caught", error.message));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbWFuZHMvaW5mby9wcmVmaXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUU7SUFFekMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFFMUIsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3pDLFdBQVc7U0FDVixjQUFjLENBQUMsaUNBQWlDLEdBQUcsU0FBUyxHQUFHLElBQUksR0FBRyw0Q0FBNEMsQ0FBQyxDQUFBO0lBQ3BILE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztTQUNoQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUUxRCxDQUFDLENBQUEifQ==