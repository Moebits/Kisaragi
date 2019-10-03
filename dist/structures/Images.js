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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Canvas = __importStar(require("canvas"));
const compressImages = __importStar(require("compress-images"));
const discord_js_1 = require("discord.js");
const fs = __importStar(require("fs"));
const getPixels = __importStar(require("get-pixels"));
const GifEncoder = __importStar(require("gif-encoder"));
const gifFrames = __importStar(require("gif-frames"));
const imageDataURI = __importStar(require("image-data-uri"));
const download = __importStar(require("image-downloader"));
const sizeOf = __importStar(require("image-size"));
const imagemin = __importStar(require("imagemin"));
const imageminGifsicle = __importStar(require("imagemin-gifsicle"));
const Embeds_1 = require("./Embeds");
const Functions_1 = require("./Functions");
class Images {
    // let blacklist = require("../blacklist.json");
    constructor(discord, message) {
        this.discord = discord;
        this.message = message;
        this.embeds = new Embeds_1.Embeds(this.discord, this.message);
        // Compress Gif
        this.compressGif = (input) => __awaiter(this, void 0, void 0, function* () {
            const file = yield imagemin(input, { destination: "../assets/gifs",
                plugins: [imageminGifsicle({ interlaced: true, optimizationLevel: 3, colors: 256 })]
            });
            return file;
        });
        // Encode Gif
        this.encodeGif = (fileNames, path, file) => __awaiter(this, void 0, void 0, function* () {
            const images = [];
            if (fileNames.length > 500) {
                for (let i = 0; i < fileNames.length; i += 15) {
                    images.push(fileNames[i]);
                }
            }
            else if (fileNames.length > 300) {
                for (let i = 0; i < fileNames.length; i += 10) {
                    images.push(fileNames[i]);
                }
            }
            else if (fileNames.length > 150) {
                for (let i = 0; i < fileNames.length; i += 5) {
                    images.push(fileNames[i]);
                }
            }
            else if (fileNames.length > 80) {
                for (let i = 0; i < fileNames.length; i += 3) {
                    images.push(fileNames[i]);
                }
            }
            else if (fileNames.length > 40) {
                for (let i = 0; i < fileNames.length; i += 2) {
                    images.push(fileNames[i]);
                }
            }
            else {
                for (let i = 0; i < fileNames.length; i++) {
                    images.push(fileNames[i]);
                }
            }
            return new Promise((resolve) => {
                const dimensions = sizeOf(`${path}${images[0]}`);
                const gif = new GifEncoder(dimensions.width, dimensions.height);
                gif.pipe(file);
                gif.setQuality(20);
                gif.setDelay(0);
                gif.setRepeat(0);
                gif.writeHeader();
                let counter = 0;
                const addToGif = (frames) => {
                    getPixels(`${path}${frames[counter]}`, function (err, pixels) {
                        gif.addFrame(pixels.data);
                        gif.read();
                        if (counter >= frames.length - 1) {
                            gif.finish();
                        }
                        else {
                            counter++;
                            addToGif(images);
                        }
                    });
                };
                addToGif(images);
                gif.on("end", () => {
                    resolve();
                });
            });
        });
        // Compress Images
        this.compressImages = (src, dest) => {
            return new Promise((resolve) => {
                const imgInput = src;
                const imgOutput = dest;
                compressImages(imgInput, imgOutput, { compress_force: true, statistic: false, autoupdate: true }, false, { jpg: { engine: "mozjpeg", command: ["-quality", "10"] } }, { png: { engine: "pngquant", command: ["--quality=20-50"] } }, { svg: { engine: "svgo", command: "--multipass" } }, { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }, function (error, completed) {
                    if (completed === true) {
                        resolve();
                    }
                });
            });
        };
        // Download Pages
        this.downloadPages = (array, dest) => __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(array.map((url, i) => __awaiter(this, void 0, void 0, function* () {
                const options = {
                    url,
                    dest: `${dest}page${i}.jpg`
                };
                try {
                    const { filename } = yield download.image(options);
                    console.log(filename);
                }
                catch (e) {
                    console.log(e);
                }
            })));
        });
        // nhentai Doujin
        this.getNhentaiDoujin = (doujin, tag) => __awaiter(this, void 0, void 0, function* () {
            const checkArtists = doujin.details.artists ? Functions_1.Functions.checkChar(doujin.details.artists.join(" "), 50, ")") : "None";
            const checkCharacters = doujin.details.characters ? Functions_1.Functions.checkChar(doujin.details.characters.join(" "), 50, ")") : "None";
            const checkTags = doujin.details.tags ? Functions_1.Functions.checkChar(doujin.details.tags.join(" "), 50, ")") : "None";
            const checkParodies = doujin.details.parodies ? Functions_1.Functions.checkChar(doujin.details.parodies.join(" "), 50, ")") : "None";
            const checkGroups = doujin.details.groups ? Functions_1.Functions.checkChar(doujin.details.groups.join(" "), 50, ")") : "None";
            const checkLanguages = doujin.details.languages ? Functions_1.Functions.checkChar(doujin.details.languages.join(" "), 50, ")") : "None";
            const checkCategories = doujin.details.categories ? Functions_1.Functions.checkChar(doujin.details.categories.join(" "), 50, ")") : "None";
            const doujinPages = [];
            /*fs.mkdirSync(`../assets/pages/${tag}/`);
            fs.mkdirSync(`../assets/pagesCompressed/${tag}/`);
            let msg1 = await message.channel.send(`**Downloading images** ${discord.getEmoji("gabCircle")}`);
            await discord.downloadPages(doujin.pages, `../assets/pages/${tag}/`);
            msg1.delete(1000);
            let msg2 = await message.channel.send(`**Compressing images** ${discord.getEmoji("gabCircle")}`);
            await discord.compressImages(`../assets/pages/${tag}/*.jpg`, `../assets/pagesCompressed/${tag}/`);
            msg2.delete(1000);*/
            for (let i = 0; i < doujin.pages.length; i++) {
                const nhentaiEmbed = this.embeds.createEmbed();
                nhentaiEmbed
                    .setAuthor("nhentai", "https://pbs.twimg.com/profile_images/733172726731415552/8P68F-_I_400x400.jpg")
                    .setTitle(`**${doujin.title}** ${this.discord.getEmoji("madokaLewd")}`)
                    .setURL(doujin.link)
                    .setDescription(`${this.discord.getEmoji("star")}_Japanese Title:_ **${doujin.nativeTitle}**\n` +
                    `${this.discord.getEmoji("star")}_ID:_ **${tag}**\n` +
                    `${this.discord.getEmoji("star")}_Artists:_ ${checkArtists}\n` +
                    `${this.discord.getEmoji("star")}_Characters:_ ${checkCharacters}\n` +
                    `${this.discord.getEmoji("star")}_Tags:_ ${checkTags} ${checkParodies}` +
                    `${checkGroups} ${checkLanguages} ${checkCategories}\n`)
                    // .attachFiles([`../assets/pagesCompressed/${tag}/page${i}.jpg`])
                    // .setImage(`attachment://page${i}.jpg`)
                    .setThumbnail(doujin.thumbnails[0])
                    .setImage(doujin.pages[i]);
                yield doujinPages.push(nhentaiEmbed);
            }
            this.embeds.createReactionEmbed(doujinPages, true);
        });
        // Fetch Channel Attachments
        this.fetchChannelAttachments = (channel) => __awaiter(this, void 0, void 0, function* () {
            let beforeID = channel.lastMessageID;
            const attachmentArray = [];
            while (beforeID !== undefined || null) {
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    const messages = yield channel.fetchMessages({ limit: 100, before: beforeID });
                    beforeID = messages.lastKey();
                    const filteredMessages = yield messages.filter((msg) => msg.attachments.firstKey() !== undefined || null);
                    const filteredArray = yield filteredMessages.attachments.map((attachment) => attachment.url);
                    for (let i = 0; i < filteredArray.length; i++) {
                        attachmentArray.push(filteredArray[i]);
                    }
                }), 120000);
            }
            return attachmentArray;
        });
        this.colorStops = [
            "#FF8AD8",
            "#FF8ABB",
            "#F9FF8A",
            "#8AFFB3",
            "#8AE4FF",
            "#FF8AD8"
        ];
        this.createCanvas = (member, rawImage, text, color, uri, iterator) => __awaiter(this, void 0, void 0, function* () {
            const colorStops = this.colorStops;
            const image = (rawImage.constructor === Array) ? rawImage.join("") : rawImage;
            const newText = text.join("").replace(/user/g, `@${member.user.tag}`).replace(/guild/g, member.guild.name)
                .replace(/tag/g, member.user.tag).replace(/name/g, member.displayName).replace(/count/g, member.guild.memberCount);
            function wrapText(context, txt, x, y, maxWidth, lineHeight) {
                const cars = txt.split("\n");
                for (let i = 0; i < cars.length; i++) {
                    let line = "";
                    const words = cars[i].split(" ");
                    for (let n = 0; n < words.length; n++) {
                        const testLine = line + words[n] + " ";
                        const metrics = context.measureText(testLine);
                        const testWidth = metrics.width;
                        if (testWidth > maxWidth) {
                            context.strokeText(line, x, y);
                            context.fillText(line, x, y);
                            line = words[n] + " ";
                            y += lineHeight;
                        }
                        else {
                            line = testLine;
                        }
                    }
                    context.strokeText(line, x, y);
                    context.fillText(line, x, y);
                    y += lineHeight;
                }
            }
            function applyText(cv, txt) {
                const context = cv.getContext("2d");
                let fontSize = 70;
                do {
                    context.font = `${fontSize -= 1}px 07nikumarufont`;
                } while (context.measureText(txt).width > (cv.width * 2.2) - 300);
                return context.font;
            }
            const canvas = Canvas.createCanvas(700, 250);
            const ctx = canvas.getContext("2d");
            let background;
            const random = Math.floor(Math.random() * 1000000);
            if (image.includes("gif")) {
                if (!fs.existsSync(`../assets/images/${random}/`)) {
                    fs.mkdirSync(`../assets/images/${random}/`);
                }
                const files = [];
                const attachmentArray = [];
                const frames = yield gifFrames({ url: image, frames: "all", cumulative: true });
                for (let i = 0; i < frames.length; i++) {
                    const readStream = frames[i].getImage();
                    const writeStream = fs.createWriteStream(`../assets/images/${random}/image${frames[i].frameIndex}.jpg`);
                    yield Functions_1.Functions.awaitPipe(readStream, writeStream);
                    files.push(`../assets/images/${random}/image${frames[i].frameIndex}.jpg`);
                }
                yield Functions_1.Functions.timeout(500);
                let rIterator = 0;
                const msg2 = yield this.message.channel.send(`**Encoding Gif. This might take awhile** ${this.discord.getEmoji("gabCircle")}`);
                for (let i = 0; i < 6; i++) {
                    if (rIterator === this.colorStops.length - 1) {
                        rIterator = 0;
                    }
                    const dataURI = yield this.createCanvas(member, files[i], text, color, true, rIterator);
                    yield imageDataURI.outputFile(dataURI, `../assets/images/${random}/image${i}`);
                    attachmentArray.push(`image${i}.jpeg`);
                    rIterator++;
                }
                const file = fs.createWriteStream(`../assets/images/${random}/animated.gif`);
                yield this.encodeGif(attachmentArray, `../assets/images/${random}/`, file);
                msg2.delete();
                const attachment = new discord_js_1.MessageAttachment(`../assets/images/${random}/animated.gif`);
                return attachment;
            }
            else {
                background = yield Canvas.loadImage(image);
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                ctx.font = applyText(canvas, newText);
                ctx.strokeStyle = "black";
                ctx.lineWidth = 4;
                if (color.join("") === "rainbow") {
                    let rainbowIterator = iterator ? iterator : 0;
                    const gradient = ctx.createLinearGradient(0, 0, canvas.width + 200, 0);
                    for (let i = 0; i < colorStops.length; i++) {
                        let currColor = colorStops[rainbowIterator + i];
                        const position = (1 / colorStops.length) * i;
                        if (currColor === colorStops[colorStops.length]) {
                            currColor = colorStops[0];
                            rainbowIterator = 0;
                        }
                        gradient.addColorStop(position, currColor);
                    }
                    ctx.fillStyle = gradient;
                }
                else {
                    ctx.fillStyle = color.join("");
                }
                wrapText(ctx, newText, canvas.width / 2.8, canvas.height / 4, 450, 55);
                ctx.beginPath();
                ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                const avatar = yield Canvas.loadImage(member.user.displayAvatarURL);
                ctx.drawImage(avatar, 25, 25, 200, 200);
                if (uri) {
                    return canvas.toDataURL("image/jpeg");
                }
                const attachment = new discord_js_1.MessageAttachment(canvas.toBuffer(), `welcome.jpg`);
                return attachment;
            }
        });
    }
}
exports.Images = Images;
//# sourceMappingURL=Images.js.map