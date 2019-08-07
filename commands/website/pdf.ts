exports.run = async (client: any, message: any, args: string[]) => {
const puppeteer = require("puppeteer");
    let browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbo",
          "--disable-dev-shm-usage"
        ],
      });
      console.log(browser)
}