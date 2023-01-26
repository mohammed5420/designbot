"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var lastShot = new mongoose_1.default.Schema({
    shotID: {
        type: String,
        required: true,
    },
    access: {
        type: Boolean,
        default: true,
    },
});
exports.default = mongoose_1.default.model("lastShot", lastShot);
