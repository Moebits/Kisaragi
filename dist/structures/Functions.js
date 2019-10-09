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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
const discord_js_1 = require("discord.js");
const config = __importStar(require("../config.json"));
class Functions {
    constructor(message) {
        this.message = message;
        // Response Time
        this.responseTime = () => {
            if (this.message) {
                return `${Date.now() - this.message.createdTimestamp} ms`;
            }
        };
        this.message = message;
    }
}
exports.Functions = Functions;
Functions.colors = config.colors;
// Timeout
Functions.timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
// Await Pipe
Functions.awaitPipe = (readStream, writeStream) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        readStream.pipe(writeStream);
        readStream.on("end", () => {
            resolve();
        });
    });
});
// Execute File
Functions.execFile = (file, args) => __awaiter(void 0, void 0, void 0, function* () {
    child_process_1.default.execFile(`../assets/tools/${file}`, args);
    return console.log("finished");
});
// Random Number
Functions.getRandomNum = (min, max) => {
    return Math.random() * (max - min) + min;
};
// Format Date
Functions.formatDate = (inputDate) => {
    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    const date = new Date(inputDate);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    return `${monthNames[monthIndex]} ${day}, ${year}`;
};
// Proper Case
Functions.toProperCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};
// Check Message Characters
Functions.checkChar = (message, num, char) => {
    const splitText = discord_js_1.Util.splitMessage(message, { maxLength: num, char });
    if (splitText[0]) {
        return splitText[0];
    }
    else {
        return splitText;
    }
};
// Remove from Array
Functions.arrayRemove = (arr, val) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            arr.splice(i, 1);
            i--;
        }
    }
};
// Random Color
Functions.randomColor = () => {
    return Number(Functions.colors[Math.floor(Math.random() * Functions.colors.length)]);
};
// Combine args after an index
Functions.combineArgs = (args, num) => {
    let combined = "";
    for (let i = num; i < args.length; i++) {
        combined += args[i] + " ";
    }
    return combined;
};
// Check args
Functions.checkArgs = (args, num) => {
    switch (num) {
        case "single": {
            if (!args[0]) {
                return false;
            }
            else {
                return true;
            }
        }
        case "multi": {
            if (!args[0] || !Functions.combineArgs(args, 1)) {
                return false;
            }
            else {
                return true;
            }
        }
        default: return false;
    }
};
//# sourceMappingURL=Functions.js.map