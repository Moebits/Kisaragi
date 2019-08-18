module.exports = async (discord: any, message: any) => {

    //Create Reaction Embed
    discord.createReactionEmbed = (embeds: any, collapse?: boolean, startPage?: number) => {
        let page = 0;
        if (startPage) page = startPage;
        for (let i = 0; i < embeds.length; i++) {
            embeds[i].setFooter(`Page ${i + 1}/${embeds.length}`, message.author.displayAvatarURL);
        }
        let reactions: any = [discord.getEmoji("right"), discord.getEmoji("left"), discord.getEmoji("tripleRight"), discord.getEmoji("tripleLeft")];
        let reactionsCollapse: any = [discord.getEmoji("collapse"), discord.getEmoji("expand")]
        message.channel.send(embeds[page]).then(async (msg: any) => {
            for (let i in reactions) await msg.react(reactions[i]);
            await discord.insertInto("collectors", "message", msg.id);
            await discord.updateColumn("collectors", "embeds", embeds, "message", msg.id);
            await discord.updateColumn("collectors", "collapse", collapse, "message", msg.id);
            await discord.updateColumn("collectors", "page", page, "message", msg.id);
            
            const forwardCheck = (reaction, user) => reaction.emoji === discord.getEmoji("right") && user.bot === false;
            const backwardCheck = (reaction, user) => reaction.emoji === discord.getEmoji("left") && user.bot === false;
            const tripleForwardCheck = (reaction, user) => reaction.emoji === discord.getEmoji("tripleRight") && user.bot === false;
            const tripleBackwardCheck = (reaction, user) => reaction.emoji === discord.getEmoji("tripleLeft") && user.bot === false;
            
            const forward = msg.createReactionCollector(forwardCheck);
            const backward = msg.createReactionCollector(backwardCheck);
            const tripleForward = msg.createReactionCollector(tripleForwardCheck);
            const tripleBackward = msg.createReactionCollector(tripleBackwardCheck);

            if (collapse) {
                let description: any = [];
                let thumbnail: any = [];
                for (let i in embeds) {
                    description.push(embeds[i].description);
                    thumbnail.push(embeds[i].thumbnail);
                }
                for (const reaction of reactionsCollapse) await msg.react(reaction);
                const collapseCheck = (reaction, user) => reaction.emoji === discord.getEmoji("collapse") && user.bot === false;
                const expandCheck = (reaction, user) => reaction.emoji === discord.getEmoji("expand") && user.bot === false;
                const collapse = msg.createReactionCollector(collapseCheck);
                const expand = msg.createReactionCollector(expandCheck);

                collapse.on("collect", r => {
                        for (let i = 0; i < embeds.length; i++) {
                            embeds[i].setDescription("");
                            embeds[i].setThumbnail("");
                        }
                        msg.edit(embeds[page]);
                        r.remove(r.users.find((u: any) => u.id !== discord.user.id));     
                });

                expand.on("collect", r => {
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription(description[i]);
                        embeds[i].setThumbnail(thumbnail[i].url);
                    }
                    msg.edit(embeds[page]);
                    r.remove(r.users.find((u: any) => u.id !== discord.user.id));    
                });
            }

            backward.on("collect", async r => {
                if (page === 0) {
                    page = embeds.length - 1; }
                else {
                    page--; }
                    await discord.updateColumn("collectors", "page", page, "message", msg.id);
                    msg.edit(embeds[page]);
                    r.remove(r.users.find((u: any) => u.id !== discord.user.id)); 
            });

            forward.on("collect", async r => {
                if (page === embeds.length - 1) {
                    page = 0; }
                else { 
                    page++; }
                    await discord.updateColumn("collectors", "page", page, "message", msg.id);
                    msg.edit(embeds[page]);
                    r.remove(r.users.find((u: any) => u.id !== discord.user.id));
            });

            tripleBackward.on("collect", async r => {
                if (page === 0) {
                    page = (embeds.length - 1) - Math.floor(embeds.length/5); }
                else {
                    page -= Math.floor(embeds.length/5); }
                    if (page < 0) page *= -1;
                    await discord.updateColumn("collectors", "page", page, "message", msg.id);
                    msg.edit(embeds[page]);
                    r.remove(r.users.find((u: any) => u.id !== discord.user.id));
            });

            tripleForward.on("collect", async r => {
                if (page === embeds.length - 1) {
                    page = 0 + Math.floor(embeds.length/5); }
                else {
                    page += Math.floor(embeds.length/5); }
                    if (page > embeds.length - 1) page -= embeds.length - 1;
                    await discord.updateColumn("collectors", "page", page, "message", msg.id);
                    msg.edit(embeds[page]);
                    r.remove(r.users.find((u: any) => u.id !== discord.user.id));    
            });
        });
    }

    //Re-trigger Existing Reaction Embed
    discord.editReactionCollector = async (msg: any, emoji: string, embeds: any, collapse?: boolean, startPage?: number) => {
        let page = 0;
        if (startPage) page = startPage;
        let description: any = [];
            let thumbnail: any = [];
            for (let i in embeds) {
                description.push(embeds[i].description);
                thumbnail.push(embeds[i].thumbnail);
            }
        switch (emoji) {
            case "right":
                    if (page === embeds.length - 1) {
                        page = 0; }
                    else { 
                        page++; }
                        await discord.updateColumn("collectors", "page", page, "message", msg.id);
                        msg.edit(embeds[page]);
                        break;
            case "left":
                    if (page === 0) {
                        page = embeds.length - 1; }
                    else {
                        page--; }
                        await discord.updateColumn("collectors", "page", page, "message", msg.id);
                        msg.edit(embeds[page]);
                    break;

            case "tripleRight":
                    if (page === embeds.length - 1) {
                        page = 0; }
                    else { 
                        page++; }
                        await discord.updateColumn("collectors", "page", page, "message", msg.id);
                        msg.edit(embeds[page]);
            case "tripleLeft":
                    if (page === 0) {
                        page = (embeds.length - 1) - Math.floor(embeds.length/5); }
                    else {
                        page -= Math.floor(embeds.length/5); }
                        if (page < 0) page *= -1;
                        await discord.updateColumn("collectors", "page", page, "message", msg.id);
                        msg.edit(embeds[page]);
            case "collapse":
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription("");
                        embeds[i].setThumbnail("");
                    }
                    msg.edit(embeds[page]);
                    break;
            case "expand":
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription(description[i]);
                        embeds[i].setThumbnail(thumbnail[i].url);
                    }
                    msg.edit(embeds[page]);
                    break;
        }
                  
        const forwardCheck = (reaction, user) => reaction.emoji === discord.getEmoji("right") && user.bot === false;
        const backwardCheck = (reaction, user) => reaction.emoji === discord.getEmoji("left") && user.bot === false;
        const tripleForwardCheck = (reaction, user) => reaction.emoji === discord.getEmoji("tripleRight") && user.bot === false;
        const tripleBackwardCheck = (reaction, user) => reaction.emoji === discord.getEmoji("tripleLeft") && user.bot === false;
        
        const forward = msg.createReactionCollector(forwardCheck);
        const backward = msg.createReactionCollector(backwardCheck);
        const tripleForward = msg.createReactionCollector(tripleForwardCheck);
        const tripleBackward = msg.createReactionCollector(tripleBackwardCheck);

        if (collapse) {
            const collapseCheck = (reaction, user) => reaction.emoji === discord.getEmoji("collapse") && user.bot === false;
            const expandCheck = (reaction, user) => reaction.emoji === discord.getEmoji("expand") && user.bot === false;
            const collapse = msg.createReactionCollector(collapseCheck);
            const expand = msg.createReactionCollector(expandCheck);

            collapse.on("collect", r => {
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription("");
                        embeds[i].setThumbnail("");
                    }
                    msg.edit(embeds[page]);
                    r.remove(r.users.find((u: any) => u.id !== discord.user.id));     
            });

            expand.on("collect", r => {
                for (let i = 0; i < embeds.length; i++) {
                    embeds[i].setDescription(description[i]);
                    embeds[i].setThumbnail(thumbnail[i].url);
                }
                msg.edit(embeds[page]);
                r.remove(r.users.find((u: any) => u.id !== discord.user.id));    
            });
        }

        backward.on("collect", async r => {
            if (page === 0) {
                page = embeds.length - 1; }
            else {
                page--; }
                await discord.updateColumn("collectors", "page", page, "message", msg.id);
                msg.edit(embeds[page]);
                r.remove(r.users.find((u: any) => u.id !== discord.user.id)); 
        });

        forward.on("collect", async r => {
            if (page === embeds.length - 1) {
                page = 0; }
            else { 
                page++; }
                await discord.updateColumn("collectors", "page", page, "message", msg.id);
                msg.edit(embeds[page]);
                r.remove(r.users.find((u: any) => u.id !== discord.user.id));
        });

        tripleBackward.on("collect", async r => {
            if (page === 0) {
                page = (embeds.length - 1) - Math.floor(embeds.length/5); }
            else {
                page -= Math.floor(embeds.length/5); }
                if (page < 0) page *= -1;
                await discord.updateColumn("collectors", "page", page, "message", msg.id);
                msg.edit(embeds[page]);
                r.remove(r.users.find((u: any) => u.id !== discord.user.id));
        });

        tripleForward.on("collect", async r => {
            if (page === embeds.length - 1) {
                page = 0 + Math.floor(embeds.length/5); }
            else {
                page += Math.floor(embeds.length/5); }
                if (page > embeds.length - 1) page -= embeds.length - 1;
                await discord.updateColumn("collectors", "page", page, "message", msg.id);
                msg.edit(embeds[page]);
                r.remove(r.users.find((u: any) => u.id !== discord.user.id));    
        });
    }

    //Create Prompt
    discord.createPrompt = (func: any) => {
        const filter = m => m.author.id === message.author.id && m.channel === message.channel;
            const collector = message.channel.createMessageCollector(filter, {time: 60000});

            collector.on('collect', m => {
                func(m, collector);
                collector.stop();
            });
    }
}