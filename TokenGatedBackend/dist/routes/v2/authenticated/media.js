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
exports.mediaRoute = void 0;
const express_1 = require("express");
const entity_1 = require("../../../entity");
const utilities_1 = require("../../../scripts/utilities");
const manager_1 = require("../../../scripts/manager");
const database_1 = require("../../../scripts/utilities/database");
const media_1 = require("../../../scripts/utilities/media");
exports.mediaRoute = (0, express_1.Router)();
/* GET users listing. */
exports.mediaRoute.post('/Media/GetAll', database_1.setDataSource, (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const media = (yield (0, manager_1.getAll)(entity_1.MediaEntity));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: media.length,
            media: media,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.mediaRoute.post('/Media/GetAll/AssetByIds', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { assetIds } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        let mediaArray = [];
        //const asset = (await getOne(AssetEntity, assetId)) as AssetEntity;
        const assets = (yield (0, manager_1.getAssetsByIds)(assetIds));
        for (const asset of assets) {
            const assetMedia = (yield (0, media_1.getMediaForAsset)(asset));
            mediaArray = [...mediaArray, ...assetMedia];
        }
        let unique = [
            ...new Map(mediaArray.map((media) => [media['id'], media])).values(),
        ];
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: unique.length,
            media: unique,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.mediaRoute.post('/Media/GetAll/AssetByIds/Type/:type', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { assetIds } = req.body;
    const { type } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        let mediaArray = [];
        //const asset = (await getOne(AssetEntity, assetId)) as AssetEntity;
        const assets = (yield (0, manager_1.getAssetsByIds)(assetIds));
        for (const asset of assets) {
            const assetMedia = (yield (0, media_1.getMediaForAssetAndType)(asset, type)).filter((m) => m.type === type);
            mediaArray = [...mediaArray, ...assetMedia];
        }
        let unique = [
            ...new Map(mediaArray.map((media) => [media['id'], media])).values(),
        ];
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: unique.length,
            media: unique,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.mediaRoute.get('/Media/GetAll/Category/:categories', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { categories } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const categoryList = categories === null || categories === void 0 ? void 0 : categories.toString().split(',');
        const media = (yield (0, manager_1.getAll)(entity_1.MediaEntity));
        const filteredMedia = media.filter((m) => categoryList.includes(m.category));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: filteredMedia.length,
            media: filteredMedia,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.mediaRoute.get('/Media/GetOne/:id', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const media = yield (0, manager_1.getOne)(entity_1.MediaEntity, id);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            media: media,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.mediaRoute.post('/Media/Add', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { media } = req.body;
    const createData = __rest(yield (0, utilities_1.getUpdateData)(req.headers['walletaddress']), []);
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.add)(entity_1.MediaEntity, Object.assign(Object.assign({}, media), createData));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(201).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.mediaRoute.patch('/Media/Update', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { media } = req.body;
    const _a = yield (0, utilities_1.getUpdateData)(req.headers['walletaddress']), { createdBy: omitted } = _a, updateData = __rest(_a, ["createdBy"]);
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.update)(entity_1.MediaEntity, Object.assign(Object.assign({}, media), updateData));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.mediaRoute.patch('/Media/Archive', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { mediaId } = req.body;
    const _b = yield (0, utilities_1.getUpdateData)(req.headers['walletaddress']), { createdBy: omitted } = _b, updateData = __rest(_b, ["createdBy"]);
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.archive)(entity_1.MediaEntity, mediaId);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.mediaRoute.delete('/Media/Delete', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { mediaId } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.remove)(entity_1.MediaEntity, mediaId);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
