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
exports.token1155Route = void 0;
const express_1 = require("express");
const entity_1 = require("../../../entity");
const utilities_1 = require("../../../scripts/utilities");
const manager_1 = require("../../../scripts/manager");
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("../../../scripts/utilities/database");
const manager_2 = require("../../../scripts/manager");
dotenv_1.default.config();
exports.token1155Route = (0, express_1.Router)();
/* GET all assets. */
exports.token1155Route.get('/Token1155/GetAll', database_1.setDataSource, (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        let tokens = (yield (0, manager_1.getAll)(entity_1.Token1155Entity));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: tokens.length,
            tokens: tokens,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.token1155Route.get('/Token1155/GetOne/Token/:id', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const token = (yield (0, manager_2.getOneById)(id));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            token: token,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.token1155Route.get('/Token1155/GetAll/Contract/:contractId/Token/:tokenId', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, tokenId } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        let tokens = (yield (0, manager_2.getTokens1155ByContractAndToken)(contractId, tokenId));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: tokens.length,
            tokens: tokens,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.token1155Route.get('/Token1155/GetAll/WalletAddress/:walletAddress', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { tokenId } = req.params;
    let walletAddress = (req.decodedAddress ||
        req.params.walletAddress);
    if (!walletAddress)
        res.status(400).json({
            status: 'failed',
            code: '400',
            message: 'No wallet address provided',
        });
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        if (yield (0, utilities_1.checkIfSpooferRole)(walletAddress)) {
            walletAddress = '0x2611B286994571b4D5292ACFF5619da8074b5c54'; //gavin
        }
        let tokens = (yield (0, manager_2.getTokens1155ByWalletAddress)(walletAddress));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: tokens.length,
            tokens: tokens,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
