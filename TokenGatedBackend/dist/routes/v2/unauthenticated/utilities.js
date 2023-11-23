"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.utilitiesRoute = void 0;
const express_1 = require("express");
const dotenv = __importStar(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
const utilities_1 = require("../../../scripts/utilities");
exports.utilitiesRoute = (0, express_1.Router)();
dotenv.config();
exports.utilitiesRoute.post('/Image/Download', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { imgUrl } = req.body;
}));
exports.utilitiesRoute.post('/Image/HueRotate', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { imgUrl } = req.body;
    const maxDegrees = 360;
    const degrees = 20;
    const tempDir = `${process.cwd()}/temp`;
    if (!fs_1.default.existsSync(tempDir))
        fs_1.default.mkdirSync(tempDir);
    const image = yield (0, utilities_1.downloadImage)(imgUrl);
    const imageBuffer = Buffer.from(image);
    const imageFileName = `${tempDir}/original.png`;
    fs_1.default.writeFileSync(imageFileName, imageBuffer);
    for (let i = 0; i < maxDegrees; i += degrees) {
        yield (0, sharp_1.default)(imageFileName)
            .modulate({ hue: i })
            .png({ quality: 100 })
            .toFile(`${tempDir}/${i / degrees + 1}`);
    }
    res.status(200).json({ status: 'Success', code: 200, message: 'done' });
}));
