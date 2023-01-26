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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var puppeteer_1 = __importDefault(require("puppeteer"));
var node_cron_1 = __importDefault(require("node-cron"));
var Shot_1 = __importDefault(require("./Shot"));
require("./db/db.config");
require("dotenv/config");
//create a discord client to send messages to channels inside bot servers
var client = new discord_js_1.Client({
    intents: ["GuildMessages", "Guilds", "GuildMessageTyping"],
});
client.on("ready", function () { return __awaiter(void 0, void 0, void 0, function () {
    var getInspirationChannels;
    return __generator(this, function (_a) {
        console.log("Bot is ready");
        client.guilds.cache.map(function (guild) { return __awaiter(void 0, void 0, void 0, function () {
            var existedChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        existedChannel = guild.channels.cache.find(function (channel) { return channel.name === "💡-inspirations"; });
                        if (!!existedChannel) return [3 /*break*/, 2];
                        return [4 /*yield*/, guild.channels.create({
                                name: "💡-inspirations",
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        getInspirationChannels = function () { return __awaiter(void 0, void 0, void 0, function () {
            var inspirationChannels;
            return __generator(this, function (_a) {
                inspirationChannels = client.guilds.cache.map(function (guild) {
                    var channel = guild.channels.cache.find(function (channel) { return channel.name === "💡-inspirations" && channel.type === discord_js_1.ChannelType.GuildText; });
                    if (!channel)
                        return;
                    return channel;
                });
                return [2 /*return*/, inspirationChannels];
            });
        }); };
        node_cron_1.default.schedule("* * */1 * *", function () { return __awaiter(void 0, void 0, void 0, function () {
            var browser, page, shotID_1, existedShot, newShot, inspirationChannels, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, puppeteer_1.default.launch({
                                args: ["--no-sandbox", "--disable-setuid-sandbox"],
                            })];
                    case 1:
                        browser = _a.sent();
                        return [4 /*yield*/, browser.newPage()];
                    case 2:
                        page = _a.sent();
                        return [4 /*yield*/, page.goto("https://dribbble.com/shots/popular", {
                                waitUntil: "load",
                                timeout: 0,
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.evaluate(function () {
                                var shot = document.querySelector(".shot-thumbnail-link");
                                return shot === null || shot === void 0 ? void 0 : shot.getAttribute("href");
                            })];
                    case 4:
                        shotID_1 = _a.sent();
                        if (!shotID_1)
                            return [2 /*return*/, browser.close()];
                        return [4 /*yield*/, Shot_1.default.findOne({ shotID: shotID_1 })];
                    case 5:
                        existedShot = _a.sent();
                        if (existedShot)
                            return [2 /*return*/, browser.close()];
                        newShot = new Shot_1.default({
                            shotID: shotID_1,
                        });
                        return [4 /*yield*/, newShot.save()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, getInspirationChannels()];
                    case 7:
                        inspirationChannels = _a.sent();
                        inspirationChannels.map(function (channel) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!channel) return [3 /*break*/, 2];
                                        return [4 /*yield*/, channel.send("https://dribbble.com".concat(shotID_1))];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/, browser.close()];
                    case 8:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
client.login(process.env.BOT_TOKEN);
