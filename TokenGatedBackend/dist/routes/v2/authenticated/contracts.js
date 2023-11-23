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
exports.contractRoute = void 0;
const express_1 = require("express");
const entity_1 = require("../../../entity");
const utilities_1 = require("../../../scripts/utilities");
const manager_1 = require("../../../scripts/manager");
const database_1 = require("../../../scripts/utilities/database");
exports.contractRoute = (0, express_1.Router)();
/* GET all contracts */
exports.contractRoute.get('/Contract/GetAll', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { withAssets } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        let contracts;
        if (withAssets === 'false')
            contracts = (yield (0, manager_1.getAll)(entity_1.ContractEntity));
        else
            contracts = (yield (0, manager_1.getAllWithAssets)());
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: contracts.length,
            assets: contracts,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.contractRoute.get('/Contract/GetAll/Burnable', database_1.setDataSource, (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const contracts = (yield (0, manager_1.getContractBurnable)());
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: contracts.length,
            assets: contracts,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.contractRoute.get('/Contract/GetOne/:contractId', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const contract = (yield (0, manager_1.getOne)(entity_1.ContractEntity, contractId));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            contract: contract,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.contractRoute.get('/Contract/GetOneBySymbol/:symbol', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { symbol } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const contract = (yield (0, manager_1.getOneBySymbol)(symbol));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            contract: contract,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.contractRoute.post('/Contract/Add', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contract } = req.body;
    const createData = __rest(yield (0, utilities_1.getUpdateData)(req.headers['walletaddress']), []);
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.add)(entity_1.ContractEntity, Object.assign(Object.assign({}, contract), createData));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(201).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.contractRoute.patch('/Contract/Update', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contract } = req.body;
    const _a = yield (0, utilities_1.getUpdateData)(req.headers['walletaddress']), { createdBy: omitted } = _a, updateData = __rest(_a, ["createdBy"]);
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.update)(entity_1.ContractEntity, Object.assign(Object.assign({}, contract), updateData));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.contractRoute.patch('/Contract/Archive', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.body;
    const _b = yield (0, utilities_1.getUpdateData)(req.headers['walletaddress']), { createdBy: omitted } = _b, updateData = __rest(_b, ["createdBy"]);
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.archive)(entity_1.ContractEntity, contractId);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.contractRoute.delete('/Contract/Delete', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.remove)(entity_1.ContractEntity, contractId);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
