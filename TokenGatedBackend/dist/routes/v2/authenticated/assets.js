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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetRoute = void 0;
const express_1 = require("express");
const entity_1 = require("../../../entity");
const utilities_1 = require("../../../scripts/utilities");
const fs = __importStar(require("fs"));
const manager_1 = require("../../../scripts/manager");
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("../../../scripts/utilities/database");
dotenv_1.default.config();
exports.assetRoute = (0, express_1.Router)();
/* GET all assets. */
exports.assetRoute.get('/Asset/GetAll/', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { withAttributes } = req.query;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        let assets = [];
        if (typeof withAttributes === 'undefined')
            assets = (yield (0, manager_1.getAll)(entity_1.AssetEntity));
        else if (withAttributes === 'true')
            assets = (yield (0, manager_1.getAllWithData)());
        else
            assets = [];
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: assets.length,
            assets: assets,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.assetRoute.get('/Asset/GetAll/:ids', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.params;
    const assetList = ids === null || ids === void 0 ? void 0 : ids.toString().split(',');
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const assets = (yield (0, manager_1.getAssetsByIds)(assetList));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: assets.length,
            assets: assets,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.assetRoute.get('/Asset/GetAll/Contract/:contractIds', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractIds } = req.params;
    const contractList = contractIds === null || contractIds === void 0 ? void 0 : contractIds.toString().split(',');
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const assets = (yield (0, manager_1.getAssetsByContracts)(contractList));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: assets.length,
            assets: assets,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.assetRoute.get('/Asset/GetCount/Contract/:contractId', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const count = yield database_1.dataSource
            .createQueryBuilder(entity_1.AssetEntity, 'a')
            .where('a.archived = (:archived) AND a.contractId = (:contractId)', {
            archived: false,
            contractId: contractId,
        })
            .getCount();
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: count,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.assetRoute.get('/Asset/GetAll/WalletAddress/:walletAddress', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { includeBurnables } = req.query;
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
        let assets = [];
        if (typeof includeBurnables === 'undefined' ||
            includeBurnables === 'false') {
            assets = (yield (0, manager_1.getAssetsByWalletNoBurnables)(walletAddress));
        }
        else {
            assets = (yield (0, manager_1.getAssetsByWalletAddress)(walletAddress));
        }
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: assets.length,
            assets: assets,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.assetRoute.get('/Asset/GetAll/WalletAddress/:walletAddress/Burnables', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let walletAddress = (req.decodedAddress ||
        req.params.walletAddress);
    if (!walletAddress)
        res.status(400).send('No wallet address provided');
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        if (yield (0, utilities_1.checkIfSpooferRole)(walletAddress)) {
            walletAddress = '0x2611B286994571b4D5292ACFF5619da8074b5c54'; //gavin
        }
        const assets = yield (0, manager_1.getAssetsByWalletWithBurnables)(walletAddress);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: assets.length,
            assets: assets,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.assetRoute.get('/Asset/GetAll/WalletAddress/:walletAddress/Contracts/:contractIds', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractIds } = req.params;
    const contractList = contractIds === null || contractIds === void 0 ? void 0 : contractIds.toString().split(',');
    let walletAddress = (req.decodedAddress ||
        req.params.walletAddress);
    if (!walletAddress)
        res.status(400).send('No wallet address provided');
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        if (yield (0, utilities_1.checkIfSpooferRole)(walletAddress)) {
            walletAddress = '0x2611B286994571b4D5292ACFF5619da8074b5c54'; //gavin
        }
        const assets = (yield (0, manager_1.getAssetsByWalletAndContract)(walletAddress, contractList));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: assets.length,
            assets: assets,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.assetRoute.get('/Asset/GetAll/Contract/:contractId/Sale', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const assets = yield (0, manager_1.getAssetsByStatusAndContract)('For Sale', contractId);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: assets.length,
            assets: assets,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.assetRoute.get('/Asset/GetOne/:assetId', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { assetId } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const asset = (yield (0, manager_1.getOne)(entity_1.AssetEntity, assetId));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            asset: asset,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.assetRoute.get('/Asset/GetOne/Contract/:contractId/TokenId/:tokenId', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, tokenId } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const asset = yield (0, manager_1.getAssetOneByContractAndTokenId)(contractId, tokenId);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            asset: asset,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.assetRoute.post('/Asset/Add', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { asset } = req.body;
    const createData = __rest(yield (0, utilities_1.getUpdateData)(req.headers['walletaddress' || req.body.walletAddress]), []);
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = (yield (0, manager_1.add)(entity_1.AssetEntity, Object.assign(Object.assign({}, asset), createData)))[0];
        let newAssetId = result.id;
        if (asset.attributes) {
            const attributes = asset.attributes;
            for (const attr of attributes) {
                attr.assetId = newAssetId;
            }
            yield (0, manager_1.add)(entity_1.AttributeEntity, attributes);
        }
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(201).json({
            status: 'success',
            code: 201,
            asset: result,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.assetRoute.patch('/Asset/Update', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { asset } = req.body;
    const _a = yield (0, utilities_1.getUpdateData)(req.headers['walletaddress']), { createdBy: omitted } = _a, updateData = __rest(_a, ["createdBy"]);
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const { attributes: omitted } = asset, rest = __rest(asset, ["attributes"]);
        const result = yield (0, manager_1.update)(entity_1.AssetEntity, Object.assign(Object.assign({}, rest), updateData));
        if (asset.attributes) {
            for (let a of asset.attributes) {
                yield (0, manager_1.update)(entity_1.AttributeEntity, Object.assign(Object.assign({}, a), updateData));
            }
        }
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json({
            status: 'success',
            code: 204,
            result: result,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.assetRoute.patch('/Asset/Update/:id/Owner/:walletAddress', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, walletAddress } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const owner = (yield (0, manager_1.getOwnerByWalletAddress)(walletAddress));
        const asset = (yield (0, manager_1.getOne)(entity_1.AssetEntity, id));
        const { attributes } = asset, restOnly = __rest(asset, ["attributes"]);
        restOnly.ownerId = owner.id;
        restOnly.updatedDate = new Date();
        const result = yield (0, manager_1.updateAssets)(restOnly);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json({
            status: 'success',
            code: 204,
            result: result,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.assetRoute.patch('/Asset/ResizeImageSmall/Contract/:contractId/Token/:tokenId/Bucket/:bucketName', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, tokenId, bucketName } = req.params;
    let assets = [];
    const tempPath = `${process.cwd()}/temp`;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        if (!fs.existsSync(tempPath))
            fs.mkdirSync(tempPath);
        assets = (yield (0, manager_1.getAssetsByContract)(contractId));
        if (assets.length) {
            let asset = assets.find((a) => a.tokenId === tokenId);
            //for (const asset of assets) {
            yield (0, utilities_1.delay)(300);
            yield (0, utilities_1.resizeAssetImageSmall)(asset, bucketName);
            //}
        }
        //fs.rmdirSync(tempPath);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json({});
    }
    catch (error) {
        next(error.message);
    }
}));
exports.assetRoute.post('/Asset/UpgradeBill3DFrame/:assetId', database_1.setDataSource, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { assetId } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        yield (0, manager_1.upgradeBillGlasses)(assetId);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json({ message: 'success' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.assetRoute.patch('/Asset/Archive', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { assetId } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.archive)(entity_1.AssetEntity, assetId);
        const attributes = (yield (0, manager_1.getAllByAssetId)(entity_1.AttributeEntity, assetId));
        for (const attr of attributes) {
            yield (0, manager_1.archive)(entity_1.AttributeEntity, attr.id);
        }
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json({ result });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.assetRoute.delete('/Asset/Delete', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { assetId } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.remove)(entity_1.AssetEntity, assetId);
        const attributes = (yield (0, manager_1.getAllByAssetId)(entity_1.AttributeEntity, assetId, true));
        for (const attr of attributes) {
            yield (0, manager_1.remove)(entity_1.AttributeEntity, attr.id);
        }
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.assetRoute.post('/Asset/UpdateAllAttributes/HyperMint/Contract/:contractId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const contract = (yield (0, utilities_1.HMgetContractInfo)(contractId));
        const count = contract.tokenCount;
        const metadata = yield (0, utilities_1.HMgetTokenHostedMetadata)(contractId, '1');
        console.log(count, metadata);
        for (let i = 2; i <= count; i++) {
            const tokenId = i.toString();
            yield (0, utilities_1.HMsetTokenHostedMetadata)(contractId, tokenId, metadata);
        }
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json({
            status: 'success',
            code: 204,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
