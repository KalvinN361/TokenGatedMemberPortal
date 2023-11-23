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
exports.companyRoute = void 0;
const express_1 = require("express");
const database_1 = require("../../../scripts/utilities/database");
const entity_1 = require("../../../entity");
const manager_1 = require("../../../scripts/manager");
const manager_2 = require("../../../scripts/manager");
exports.companyRoute = (0, express_1.Router)();
exports.companyRoute.get('/Company/GetAll', database_1.setPVDataSource, (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const companies = (yield (0, manager_1.getAll)(entity_1.CompanyEntity));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: companies.length,
            companies: companies,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.companyRoute.get('/Company/GetOne/:domain', database_1.setPVDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { domain } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const company = (yield (0, manager_2.getCompanyData)(domain));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            company: company,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
