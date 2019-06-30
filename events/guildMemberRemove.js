module.exports = (member) => {

    const guild = member.guild;
    if (newUsers[guild.id].has(member.id)) newUsers.delete(member.id);
    
}