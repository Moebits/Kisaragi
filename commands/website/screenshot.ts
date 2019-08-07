exports.run = async (client: any, message: any, args: string[]) => {
let input = client.combineArgs(args, 1);
let website;
if (input.startsWith("https")) {
  website = input.trim();
} else {
  website = `https://www.${input.trim}`;
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
    await page.screenshot({path: '../assets/images/screenshot.png'});
    await browser.close();
    
    let attachment = new Attachment("../assets/images/screenshot.png")
    let screenEmbed = client.createEmbed();
    screenEmbed
    .setAuthor("google chrome", "https://cdn.pixabay.com/photo/2016/04/13/14/27/google-chrome-1326908_960_720.png")
    .setTitle(`**Website Screenshot** ${client.getEmoji("kannaXD")}`)
    .attachFiles([attachment.file])
    .setImage("attachment://screenshot.png")
    message.channel.send(screenEmbed);
}