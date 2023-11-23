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
exports.ownerRoute = void 0;
const express_1 = require("express");
const entity_1 = require("../../../entity");
const database_1 = require("../../../scripts/utilities/database");
const utilities_1 = require("../../../scripts/utilities");
const entity_2 = require("../../../entity");
const manager_1 = require("../../../scripts/manager");
exports.ownerRoute = (0, express_1.Router)();
/* GET users listing. */
exports.ownerRoute.get('/Owner/GetAll', database_1.setDataSource, (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const owners = (yield (0, manager_1.getAll)(entity_1.OwnerEntity));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: owners.length,
            assets: owners,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.ownerRoute.get('/Owner/GetOne/WalletAddress/:walletAddress', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const owner = (yield (0, manager_1.getOwnerByWalletAddress)(walletAddress));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            assets: owner,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.ownerRoute.get('/Owner/GetOne/Owner/:ownerId', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { ownerId } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const owner = (yield (0, manager_1.getOne)(entity_1.OwnerEntity, ownerId));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            assets: owner,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.ownerRoute.get('/Owner/GetAll/Email/:email', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const owners = (yield (0, manager_1.getOwnerByEmail)(email));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: owners.length,
            assets: owners,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.ownerRoute.post('/Owner/Add', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { owner } = req.body;
    const createData = __rest(yield (0, utilities_1.getUpdateData)(req.headers['walletaddress']), []);
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.add)(entity_1.OwnerEntity, Object.assign(Object.assign({}, owner), createData));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.ownerRoute.patch('/Owner/Update', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { owner } = req.body;
    const _a = yield (0, utilities_1.getUpdateData)(req.headers['walletaddress']), { createdBy: omitted } = _a, updateData = __rest(_a, ["createdBy"]);
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.update)(entity_1.OwnerEntity, Object.assign(Object.assign({}, owner), updateData));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.ownerRoute.patch('/Owner/Archive', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { ownerId } = req.body;
    const _b = yield (0, utilities_1.getUpdateData)(req.headers['walletaddress']), { createdBy: omitted } = _b, updateData = __rest(_b, ["createdBy"]);
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.archive)(entity_1.OwnerEntity, ownerId);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.ownerRoute.delete('/Owner/Delete', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { ownerId } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.remove)(entity_1.OwnerEntity, ownerId);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.ownerRoute.post('/Owner/UpdateOwnerData', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const ownerData = yield database_1.dataSource
            .getRepository(entity_2.OwnerDataEntity)
            .findOne({ where: { email: req.body.email } });
        // Find the owner data to update
        if (!ownerData) {
            const OData = {
                // Update the owner data fields
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                address1: req.body.address1,
                address2: req.body.address2,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,
                postalCode: req.body.postalCode,
                email: req.body.email,
            };
            yield database_1.dataSource
                .getRepository(entity_1.OwnerEntity)
                .createQueryBuilder('Owners')
                .insert()
                .into(entity_1.OwnerEntity)
                .values({ walletAddress: req.body.walletAddress })
                .orUpdate(['walletAddress'], ['walletAddress'])
                .execute()
                .then((res) => __awaiter(void 0, void 0, void 0, function* () {
                let ownerData = res.generatedMaps[0];
                yield database_1.dataSource
                    .getRepository(entity_2.OwnerDataEntity)
                    .createQueryBuilder('Owners')
                    .insert()
                    .into(entity_2.OwnerDataEntity)
                    .values(Object.assign(Object.assign({}, OData), { ownerId: ownerData.id }))
                    .orUpdate([...Object.keys(OData)], ['email'])
                    .execute();
            }));
            if (database_1.dataSource.isInitialized)
                yield database_1.dataSource.destroy();
            res.status(200).json({
                message: 'Owner data updated successfully',
            });
        }
        else {
            res.status(404).json({ message: 'Owner data not found' });
        }
    }
    catch (error) {
        console.log('An error occurred while updating owner data:', error);
        res.status(500).json({ message: 'Failed to update owner data' });
    }
}));
