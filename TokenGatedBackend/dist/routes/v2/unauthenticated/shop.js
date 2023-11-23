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
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopsRoute = void 0;
const express_1 = require("express");
const database_1 = require("../../../scripts/utilities/database");
const entity_1 = require("../../../entity");
const manager_1 = require("../../../scripts/manager");
exports.shopsRoute = (0, express_1.Router)();
exports.shopsRoute.get('/Shops/GetAll', database_1.setDataSource, (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        let shops = (yield (0, manager_1.getShops)());
        res.status(200).json({
            status: 'success',
            code: 200,
            count: shops.length,
            shops: shops,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.shopsRoute.get('/Shops/GetOne/:id', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const listing = (yield (0, manager_1.getOne)(entity_1.ShopEntity, id));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            listing: listing,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.shopsRoute.get('/Shops/GetAll/Type/:type', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.params;
    if (!database_1.dataSource.isInitialized)
        yield database_1.dataSource.initialize();
    try {
        const shops = yield (0, manager_1.getShopsByType)(type);
        res.status(200).json({
            status: 'success',
            code: 200,
            count: shops.length,
            shops: shops,
        });
    }
    catch (error) {
        next(error.message);
    }
    if (database_1.dataSource.isInitialized)
        yield database_1.dataSource.destroy();
    try {
    }
    catch (error) {
        next(error.message);
    }
}));
exports.shopsRoute.get('/Shops/GetAll/WalletAddress/:walletAddress', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const shops = yield (0, manager_1.getShopsByWalletAddress)(walletAddress);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: shops.length,
            shops: shops,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.shopsRoute.get('/Shops/GetAll/WalletAddress/:walletAddress/Type/:type', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress, type } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const shops = yield (0, manager_1.getShopsByWalletAddressAndType)(walletAddress, type);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: shops.length,
            shops: shops,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
