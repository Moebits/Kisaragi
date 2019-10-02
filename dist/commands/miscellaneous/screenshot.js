"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const puppeteer_1 = __importDefault(require("puppeteer"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class Screenshot extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const input = (args[1] === "return") ? Functions_1.Functions.combineArgs(args, 2) : Functions_1.Functions.combineArgs(args, 1);
            const website = (input.startsWith("http")) ? input.trim() : `http://${input.trim}`;
            const browser = yield puppeteer_1.default.launch({
                headless: true,
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbo",
                    "--disable-dev-shm-usage"
                ]
            });
            const page = yield browser.newPage();
            yield page.goto(website);
            yield page.screenshot({ path: "../assets/images/screenshot.png", omitBackground: true, clip: {
                    x: 0,
                    y: 0,
                    width: 1280,
                    height: 720
                } });
            yield browser.close();
            if (args[1] === "return")
                return;
            const attachment = new discord_js_1.MessageAttachment("../assets/images/screenshot.png");
            const screenEmbed = embeds.createEmbed();
            screenEmbed
                .setAuthor("google chrome", "https://cdn.pixabay.com/photo/2016/04/13/14/27/google-chrome-1326908_960_720.png")
                .setTitle(`**Website Screenshot** ${discord.getEmoji("kannaXD")}`)
                .attachFiles([attachment])
                .setImage("attachment://screenshot.png");
            message.channel.send(screenEmbed);
        });
    }
}
exports.default = Screenshot;
//# sourceMappingURL=screenshot.js.map