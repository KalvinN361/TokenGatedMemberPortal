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
exports.assetRouteUA = void 0;
const express_1 = require("express");
const utilities_1 = require("../../../scripts/utilities");
const manager_1 = require("../../../scripts/manager");
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("../../../scripts/utilities/database");
dotenv_1.default.config();
exports.assetRouteUA = (0, express_1.Router)();
exports.assetRouteUA.post('/UAAsset/GetByWalletAddress', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let walletAddress = req.body.walletAddress;
    if (!walletAddress)
        res.status(400).send('No wallet address provided');
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        if (yield (0, utilities_1.checkIfSpooferRole)(walletAddress)) {
            walletAddress = '0x2611B286994571b4D5292ACFF5619da8074b5c54'; //gavin
        }
        const assets = (yield (0, manager_1.getAssetsByWalletAddress)(walletAddress));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json(assets);
    }
    catch (error) {
        next(error.message);
    }
}));
