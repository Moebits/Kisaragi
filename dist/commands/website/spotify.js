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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Spotify = __importStar(require("node-spotify-api"));
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const Command_1 = require("../../structures/Command");
const Functions_1 = require("../../structures/Functions");
const Embeds_1 = require("./../../structures/Embeds");
class SpotifyCommand extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const spotify = new Spotify({
                id: process.env.SPOTIFY_CLIENT_ID,
                secret: process.env.SPOTIFY_CLIENT_SECRET
            });
            if (args[1] === "artist") {
                const query = Functions_1.Functions.combineArgs(args, 2);
                const response = yield spotify.search({ type: "artist", query: query.trim() });
                const artist = response.artists.items[0];
                const spotifyEmbed = embeds.createEmbed();
                spotifyEmbed
                    .setAuthor("spotify", "https://www.freepnglogos.com/uploads/spotify-logo-png/image-gallery-spotify-logo-21.png")
                    .setTitle(`**Spotify Artist** ${discord.getEmoji("aquaUp")}`)
                    .setURL(artist.external_urls.spotify)
                    .setImage(artist.images[0].url)
                    .setDescription(`${discord.getEmoji("star")}_Artist:_ **${artist.name}**\n` +
                    `${discord.getEmoji("star")}_Genres:_ **${artist.genres.join(", ")}**\n` +
                    `${discord.getEmoji("star")}_Followers:_ **${artist.followers.total}**\n` +
                    `${discord.getEmoji("star")}_Popularity:_ **${artist.popularity}**\n`);
                message.channel.send(spotifyEmbed);
                return;
            }
            const query = Functions_1.Functions.combineArgs(args, 1);
            const response = yield spotify.search({ type: "track", query: query.trim() });
            const spotifyArray = [];
            for (let i = 0; i < response.tracks.items.length; i++) {
                const track = response.tracks.items[i];
                const artists = track.artists.map((a) => a.name);
                const artistResponse = yield spotify.search({ type: "artist", query: artists[0] });
                const image = artistResponse.artists.items[0].images[0].url;
                const spotifyEmbed = embeds.createEmbed();
                spotifyEmbed
                    .setAuthor("spotify", "https://www.freepnglogos.com/uploads/spotify-logo-png/image-gallery-spotify-logo-21.png")
                    .setTitle(`**Spotify Search** ${discord.getEmoji("aquaUp")}`)
                    .setImage(track.album.images[0].url)
                    .setThumbnail(image)
                    .setURL(track.external_urls.spotify)
                    .setDescription(`${discord.getEmoji("star")}_Track:_ **${track.name}**\n` +
                    `${discord.getEmoji("star")}_Artists:_ **${artists.join(", ")}**\n` +
                    `${discord.getEmoji("star")}_Album:_ **${track.album.name}**\n` +
                    `${discord.getEmoji("star")}_Tracks:_ **${track.album.total_tracks}**\n` +
                    `${discord.getEmoji("star")}_Release Date:_ **${Functions_1.Functions.formatDate(track.album.release_date)}**\n` +
                    `${discord.getEmoji("star")}_Duration:_ **${pretty_ms_1.default(track.duration_ms, { secondsDecimalDigits: 0 })}**\n` +
                    `${discord.getEmoji("star")}_Popularity:_ **${track.popularity}**\n`);
                spotifyArray.push(spotifyEmbed);
            }
            embeds.createReactionEmbed(spotifyArray);
        });
    }
}
exports.default = SpotifyCommand;
//# sourceMappingURL=spotify.js.map