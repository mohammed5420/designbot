"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
var connection = mongoose_1.default.connect(process.env.CONNECTION_STRING, function (err) {
    console.log(err);
});
exports.default = connection;
