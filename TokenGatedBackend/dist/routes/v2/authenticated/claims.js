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
exports.claimRoute = void 0;
const express_1 = require("express");
const entity_1 = require("../../../entity");
const utilities_1 = require("../../../scripts/utilities");
const manager_1 = require("../../../scripts/manager");
const database_1 = require("../../../scripts/utilities/database");
exports.claimRoute = (0, express_1.Router)();
/* GET users listing. */
exports.claimRoute.get('/Claim/GetAll', database_1.setDataSource, (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const claims = (yield (0, manager_1.getAll)(entity_1.ClaimEntity));
        res.status(200).json({
            status: 'success',
            code: 200,
            count: claims.length,
            claims: claims,
        });
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
    }
    catch (error) {
        next(error.message);
    }
}));
exports.claimRoute.post('/Claim/GetAllByAssetIds', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { assetIds } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const claims = (yield (0, manager_1.getClaimsByAssetIds)(assetIds));
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
exports.claimRoute.get('/Claim/GetAll/Type/:type', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const claims = yield (0, manager_1.getClaimsByType)(type);
        res.status(200).json({
            status: 'success',
            code: 200,
            count: claims.length,
            claims: claims,
        });
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
    }
    catch (error) {
        next(error.message);
    }
}));
exports.claimRoute.get('/Claim/GetOne/:claimId', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { claimId } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const claim = (yield (0, manager_1.getOne)(entity_1.ClaimEntity, claimId));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            claims: claim,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.claimRoute.post('/Claim/Add', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { claim } = req.body;
    const createData = __rest(yield (0, utilities_1.getUpdateData)(req.decodedAddress), []);
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.add)(entity_1.ClaimEntity, Object.assign(Object.assign({}, claim), createData));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(201).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.claimRoute.patch('/Claim/Update', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { claim } = req.body;
    const _a = yield (0, utilities_1.getUpdateData)(req.decodedAddress), { createdBy: omitted } = _a, updateData = __rest(_a, ["createdBy"]);
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.update)(entity_1.ClaimEntity, Object.assign(Object.assign({}, claim), updateData));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.claimRoute.patch('/Claim/Archive', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { claimId } = req.body;
    const _b = yield (0, utilities_1.getUpdateData)(req.decodedAddress), { createdBy: omitted } = _b, updateData = __rest(_b, ["createdBy"]);
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.archive)(entity_1.ClaimEntity, claimId);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.claimRoute.delete('/Claim/Delete', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { claimId } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.remove)(entity_1.ClaimEntity, claimId);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
