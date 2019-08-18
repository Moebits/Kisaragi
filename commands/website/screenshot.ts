exports.run = async (discord: any, message: any, args: string[]) => {

  let input = "";
  if (args[1] === "return") {
    input = discord.combineArgs(args, 2);
  } else {
    input = discord.combineArgs(args, 1);
  }
  let website = "";
  if (input.startsWith("http")) {
    website = input.trim();
  } else {
    website = `http://${input.trim}`;
  }

  const puppeteer = require("puppeteer");
  const {Attachment} = require("discord.js");
    let browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbo",
          "--disable-dev-shm-usage"
        ],
      });
    const page = await browser.newPage();
    await page.goto(website);
    await page.screenshot({path: '../assets/images/screenshot.png', omitBackground: true, clip: {
      x: 0,
      y: 0,
      width: 1280,
      height: 720
    }});
    await browser.close();
    if (args[1] === "return") return;
    
    let attachment = await new Attachment("../assets/images/screenshot.png")
    let screenEmbed = discord.createEmbed();
    screenEmbed
    .setAuthor("google chrome", "https://cdn.pixabay.com/photo/2016/04/13/14/27/google-chrome-1326908_960_720.png")
    .setTitle(`**Website Screenshot** ${discord.getEmoji("kannaXD")}`)
    .attachFiles([attachment.file])
    .setImage("attachment://screenshot.png")
    message.channel.send(screenEmbed);
}