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
exports.unauthenticatedOwnerRoute = void 0;
const express_1 = require("express");
const entity_1 = require("../../../entity");
const database_1 = require("../../../scripts/utilities/database");
const manager_1 = require("../../../scripts/manager");
exports.unauthenticatedOwnerRoute = (0, express_1.Router)();
exports.unauthenticatedOwnerRoute.post('/Owner/GetByOwnerIdClaimedPrizes', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { ownerId } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const owner = (yield (0, manager_1.getOne)(entity_1.OwnerEntity, ownerId));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json(owner);
    }
    catch (error) {
        next(error.message);
    }
}));
