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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimUnauthenticatedRoute = void 0;
const express_1 = require("express");
const entity_1 = require("../../../entity");
const utilities_1 = require("../../../scripts/utilities");
const manager_1 = require("../../../scripts/manager");
const database_1 = require("../../../scripts/utilities/database");
exports.claimUnauthenticatedRoute = (0, express_1.Router)();
exports.claimUnauthenticatedRoute.get('/Claim/GetAll/Type/:type/Inventory', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const claims = (yield (0, manager_1.getClaimsByType)(type));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: claims.length,
            claims: claims,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.claimUnauthenticatedRoute.get('/Claim/GetAll/Coins/Name/:name', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const claims = yield (0, manager_1.getCoinsByName)(name);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: claims.length,
            claims: claims,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.claimUnauthenticatedRoute.get('/Claim/GetAll/Name/:name/UnclaimedCoins', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    let treasury = Boolean(req.query.treasury);
    let contractId = req.query.contractId;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const unclaims = yield (0, manager_1.getUnclaimedCoinsByName)(name, treasury, contractId);
        /*const assetIds = unclaims.map((unclaim) => unclaim.assetId);
        const assets = (await getAssetsByIdsForCoins(
            assetIds
        )) as Array<AssetEntity>;*/
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: unclaims.length,
            unclaims: unclaims,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.claimUnauthenticatedRoute.patch('/Claim/UpdateCoinClaimList', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = req.body;
    const { createdBy: omitted } = data, updateData = __rest(data, ["createdBy"]);
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.update)(entity_1.ClaimEntity, updateData);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.claimUnauthenticatedRoute.patch('/Claim/UpdateInventory', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { claim } = req.body;
    console.log({ claim });
    const _a = yield (0, utilities_1.getUpdateData)(req.decodedAddress), { createdBy, updatedBy } = _a, updateData = __rest(_a, ["createdBy", "updatedBy"]);
    try {
        yield database_1.dataSource.initialize();
        console.log(Object.assign(Object.assign({}, claim), updateData));
        const result = yield (0, manager_1.updateCoinInventory)(Object.assign(Object.assign({}, claim), updateData));
        yield database_1.dataSource.destroy();
        res.status(204).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
